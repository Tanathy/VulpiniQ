





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
        exponentialBackoff = false,
        timeout = 0,
        validateResponse = (data) => data,
        query = null,
        signal: externalSignal = null
    } = options;
    
    if (query && typeof query === 'object') {
        const urlObject = new URL(url, location.origin);
        Object.entries(query).forEach(([key, value]) => urlObject.searchParams.append(key, value));
        url = urlObject.toString();
    }
    
    let requestBody = body;
    if (body && typeof body === 'object' && contentType === 'application/json' && !(body instanceof FormData)) {
        try { requestBody = JSON.stringify(body); } catch (error) { callback(new Error('Failed to serialize request body'), null); return; }
    }
    headers['Content-Type'] = headers['Content-Type'] || contentType;
    const controller = new AbortController();
    const { signal } = controller;
    if (externalSignal) {
        externalSignal.addEventListener('abort', () => controller.abort(), { once: true });
    }
    const doFetch = (attempt) => {
        let timeoutId = null;
        if (timeout) { timeoutId = setTimeout(() => controller.abort(), timeout); }
        fetch(url, { method, headers, body: requestBody, credentials, signal })
            .then(response => {
                if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
                switch (responseType) {
                    case 'json': return response.json();
                    case 'text': return response.text();
                    case 'blob': return response.blob();
                    case 'arrayBuffer': return response.arrayBuffer();
                    default: throw new Error('Unsupported response type');
                }
            })
            .then(result => {
                if (timeoutId) clearTimeout(timeoutId);
                return validateResponse(result);
            })
            .then(validatedData => callback(null, validatedData))
            .catch(error => {
                if (timeoutId) clearTimeout(timeoutId);
                if (error.name === 'AbortError') {
                    callback(new Error('Fetch request was aborted'), null);
                } else if (attempt < retries) {
                    const delay = exponentialBackoff ? retryDelay * (2 ** attempt) : retryDelay;
                    setTimeout(() => doFetch(attempt + 1), delay);
                } else {
                    callback(error, null);
                }
            });
    };
    doFetch(0);
    return { abort: () => controller.abort() };
};
