# qLib Utility tool

## Introduction

qLib is a utility library designed to simplify common tasks in web development. It provides methods for DOM manipulation, event handling, AJAX requests, and more. The library is designed to be lightweight, modular, and easy to use.

## Overview
* Selector Engine: Simplified selection and manipulation of DOM elements.
* Utilities: Various helper functions including unique ID generation, UUID generation, and more.
* Animation: Methods for handling common animations like fade in/out.
* AJAX: Fetch and WebSocket utilities for making network requests.
* String Manipulation: Utilities for string operations.
* JSON Manipulation: Functions for parsing and compressing JSON data.
* Timers: Functions for managing timed tasks.
* Storage: Helpers for interacting with local storage and cookies.
* Form Builder: Methods to create form elements easily.
* Task Manager: Handling asynchronous tasks with callbacks for completion and failure.
* Event Manager: Simplified event handling for common browser events.
## Core API
### Constructor
` Q(selector, attributes, directProps)`
The main entry point of the library. It creates a new instance of Q which can be used for manipulating DOM elements or creating new ones.

**Parameters**:
**selector**: Can be an HTMLElement, Node, or a string. If a string is provided, it can be an HTML string or a CSS selector.
**attributes ** (optional): An object where keys are attribute names and values are attribute values.
**directProps ** (optional): An array of properties to set directly on the created elements.
`const div = new Q('<div id="myDiv"></div>', { class: 'myClass' }, ['hidden']);`

### Prototype Methods
#### .each(callback)
Iterates over each element in the Q instance and executes the provided callback.
`Q('div').each((index, el) => console.log(index, el));`
#### .text(content)
Gets or sets the text content of the elements.
`Q('#myDiv').text('Hello, World!');`
#### .html(content, outer)
Gets or sets the HTML content of the elements. If outer is true, it gets or sets the outer HTML.
`Q('#myDiv').html('<span>New content</span>');`
#### .addClass(classes), .removeClass(classes), .toggleClass(className)
Manipulates the class list of the elements.
`Q('#myDiv').addClass('active');`
#### .val(value)
Gets or sets the value of form elements.
`Q('#myInput').val('New Value');`
#### .data(key, value), .removeData(key)
Gets, sets, or removes data attributes.
`Q('#myDiv').data('custom', 'value');`
#### .css(property, value)
Gets or sets CSS properties.
`Q('#myDiv').css('background-color', 'blue');`
#### .attr(attribute, value), .removeAttr(attribute)
Gets, sets, or removes attributes.
`Q('#myDiv').attr('data-id', '123');`
#### .append(...nodes), .prepend(...nodes)
Appends or prepends nodes to the elements.
`Q('#myDiv').append('<span>Appended</span>');`
#### .remove(), .empty(), .clone()
Removes, empties, or clones the elements.
`Q('#myDiv').remove();`
#### .parent(), .children(), .find(selector), .closest(selector)
Navigates the DOM tree relative to the current elements.
`Q('#myDiv').parent().addClass('parent-class');`
#### .first(), .last(), .eq(index)
Selects the first, last, or nth element.
`Q('div').first().addClass('first');`
#### .index(index)
Gets the index of the first element or reorders the elements in the DOM.
`Q('div').index(2);`

### Static Methods
#### Q.ID(length)
Generates a unique ID of the specified length.
`const uniqueId = Q.ID(10);`
#### Q.UUID4()
Generates a UUID version 4.
`const uuid = Q.UUID4();`
### Animation
#### .show(), .hide(), .fadeIn(duration, callback), .fadeOut(duration, callback), .fadeToggle(duration, callback), .fadeTo(opacity, duration, callback)
Methods for showing, hiding, and animating elements.
`Q('#myDiv').fadeIn(400);`
### Fetch and WebSocket
#### Q.fetch(url, callback, options)
Performs an HTTP request.
`Q.fetch('https://api.example.com/data', (error, data) => {
    if (error) console.error(error);
    else console.log(data);
});`
#### Q.socket(url, onMessage, onStatus, options)
Creates a WebSocket connection.
`const socket = Q.socket('ws://example.com/socket', 
    (message) => console.log('Message:', message),
    (status) => console.log('Status:', status)
);`
### String Manipulation
#### Q.String(string)
Constructor for string operations.
`const myString = Q.String('hello');
console.log(myString.capitalize());`
### JSON Manipulation
#### Q.JSON(json)
Constructor for JSON operations.
`const myJson = new Q.JSON({ key: 'value' });
console.log(myJson.deflate(3));`
Timer
Q.Timer(callback, id, options)
Creates a repeating timer.

Example:
javascript
Copy code
const timerId = Q.Timer(() => console.log('Tick'), 'myTimer', { tick: 10, delay: 1000 });
Q.Timer.stop(id), Q.Timer.stopAll()
Stops a timer or all timers.

Storage
Q.Store(key, value)
Gets or sets local storage items.

Example:
javascript
Copy code
Q.Store('myKey', 'myValue');
console.log(Q.Store('myKey'));
Q.Cookie(key, value, options)
Gets or sets cookies.

Example:
javascript
Copy code
Q.Cookie('myCookie', 'cookieValue', { days: 7 });
console.log(Q.Cookie('myCookie'));
Form Builder
Q.Form()
Provides methods to create form elements.

Example:
javascript
Copy code
const form = Q.Form();
const checkbox = form.CheckBox(true, 'Check me');
document.body.appendChild(checkbox.node);
Task Manager
Q.Task(id, ...functions)
Creates and manages tasks.

Example:
javascript
Copy code
const task = Q.Task('task1', async () => console.log('Running task'));
task.Run().Done(() => console.log('Task completed'));
Event Manager
Q.Ready(callback), Q.Resize(callback), Q.Leaving(callback)
Handles document readiness, window resize, and page unload events.

Example:
javascript
Copy code
Q.Ready(() => console.log('Document is ready'));
Q.Resize((width, height) => console.log(`Window size: ${width}x${height}`));