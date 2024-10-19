// Name: Fetch
// Method: Plugin
// Desc: Fetches data from a URL and returns it to a callback function. Supports retries, timeouts, and custom response validation.
// Type: Plugin
// Example: Q.fetch('https://api.example.com/data', (error, data) => console.log(error, data));
// Variables: url, callback, options, controller, signal, attempt, fetchWithRetry, timeoutId, response, data, error
Q.Fetch = function (url, callback, options = {}) {
    const { 
        method = 'GET',
        headers = {},
        body,
        contentType = 'application/json',
        responseType = 'json',
        credentials = 'same-origin',
        retries = 3,
        retryDelay = 1000, 
        timeout = 0, 
        validateResponse = (data) => data
    } = options;

    headers['Content-Type'] = headers['Content-Type'] || contentType;
    
    const controller = new AbortController();
    const { signal } = controller;

    
    const fetchWithRetry = (attempt) => {
        
        const timeoutId = timeout ? setTimeout(() => controller.abort(), timeout) : null;

        fetch(url, { method, headers, body, credentials, signal })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                switch (responseType) {
                    case 'json': return response.json();
                    case 'text': return response.text();
                    case 'blob': return response.blob();
                    case 'arrayBuffer': return response.arrayBuffer();
                    default: throw new Error('Unsupported response type');
                }
            })
            .then(data => {
                if (timeoutId) clearTimeout(timeoutId);
                return validateResponse(data);
            })
            .then(data => callback(null, data))
            .catch(error => {
                if (timeoutId) clearTimeout(timeoutId);

                if (error.name === 'AbortError') {
                    callback(new Error('Fetch request was aborted'), null);
                } else if (attempt < retries) {
                    console.warn(`Retrying fetch (${attempt + 1}/${retries}):`, error);
                    setTimeout(() => fetchWithRetry(attempt + 1), retryDelay);
                } else {
                    callback(error, null);
                }
            });
    };

    fetchWithRetry(0);

    
    return {
        abort: () => controller.abort()
    };
};
