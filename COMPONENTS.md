# VulpiniQ Components Documentation

This document provides a complete reference for all VulpiniQ components, automatically generated from the component metadata.

**Generated:** 2025-07-06 22:10:24
**Total Components:** 75

## Table of Contents

- [DOM](#dom)
- [Effects](#effects)
- [Events](#events)
- [Forms](#forms)
- [Iteration](#iteration)
- [Traversal](#traversal)
- [animation](#animation)
- [async](#async)
- [attributes](#attributes)
- [dimensions](#dimensions)
- [events](#events)
- [iteration](#iteration)
- [manipulation](#manipulation)
- [properties](#properties)
- [style](#style)
- [traversal](#traversal)

## DOM

### addClass

**Method:** `addClass(classes)`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Adds one or more CSS classes to selected elements.

**Detailed Description:**
This method adds the specified CSS class or classes to all elements in the current selection. It accepts a space-separated string of class names and applies them to each element using the native classList.add() method. The method supports method chaining by returning the Q instance.

**Examples:**
```javascript
Q('.element').addClass('active');
Q('#myDiv').addClass('highlight selected');
Q('button').addClass('btn btn-primary');
```

**Performance Notes:**
Efficient implementation using native DOM methods, minimal overhead with direct classList manipulation

**Optimizations:**
Uses native classList.add() with apply() for efficient multiple class addition

---

### append

**Method:** `append(...contents)`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Appends content to the end of selected elements.

**Detailed Description:**
This method appends one or more content items to the end of all selected elements. It supports various content types including strings, HTML elements, Q objects, SVG elements, arrays, and NodeLists. The method intelligently handles SVG elements by creating them in the correct namespace when needed. Multiple content items can be passed as arguments and will be appended in order.

**Examples:**
```javascript
Q('.container').append('<p>New paragraph</p>');
Q('#list').append(newElement, anotherElement);
Q('svg').append('<circle cx="50" cy="50" r="20"/>');
```

**Performance Notes:**
Efficient content appending with appropriate methods for each content type, SVG namespace awareness

**Optimizations:**
Uses insertAdjacentHTML for strings, handles SVG namespace correctly, supports multiple content types

**Known Issues:**
None known

---

### attr

**Method:** `attr(attribute, value) or attr(attributes)`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Gets or sets HTML attributes on selected elements.

**Detailed Description:**
This method provides comprehensive attribute manipulation for elements. When called with just an attribute name, it returns the attribute value of the first element. When called with attribute and value, it sets the attribute on all selected elements. It also supports setting multiple attributes by passing an object with key-value pairs. Uses native getAttribute and setAttribute methods for optimal performance.

**Examples:**
```javascript
Q('.element').attr('data-id', '123');
var id = Q('#myDiv').attr('id');
Q('img').attr({ src: 'image.jpg', alt: 'Description' });
```

**Performance Notes:**
Efficient attribute manipulation with native DOM methods, minimal overhead

**Optimizations:**
Uses native setAttribute/getAttribute methods, supports batch attribute setting with objects

**Known Issues:**
None known

---

### before

**Method:** `before(...contents)`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Inserts content before selected elements.

**Detailed Description:**
This method inserts one or more content items before each selected element as siblings. It supports various content types including strings, HTML elements, Q objects, arrays, and NodeLists. The method uses insertAdjacentHTML for string content and insertBefore for element nodes. Content is inserted into the parent of each target element, positioned immediately before the target.

**Examples:**
```javascript
Q('.element').before('<h1>Title</h1>');
Q('#target').before(newElement);
Q('div').before('<span>Before</span>', anotherElement);
```

**Performance Notes:**
Efficient content insertion with appropriate methods for each content type

**Optimizations:**
Uses insertAdjacentHTML for strings, insertBefore for elements, supports multiple content types

**Known Issues:**
Skips elements without parent nodes

---

### css

**Method:** `css(property, value) or css(properties)`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Gets or sets CSS properties on selected elements.

**Detailed Description:**
This method provides a flexible way to manipulate CSS styles on elements. It can get computed styles when called with just a property name, set a single style property when called with property and value, or set multiple properties when called with an object. When getting a value, it returns the computed style of the first element. When setting values, it applies them to all elements in the selection.

**Examples:**
```javascript
Q('.element').css('color', 'red');
Q('#myDiv').css({ color: 'blue', fontSize: '16px' });
var color = Q('.element').css('color');
```

**Performance Notes:**
Efficient style manipulation with minimal DOM queries, uses getComputedStyle for accurate value retrieval

**Optimizations:**
Caches nodes reference, uses direct style property assignment for performance

---

### find

**Method:** `find(selector)`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Finds descendant elements within the first selected element.

**Detailed Description:**
This method searches for descendant elements within the first element of the current selection using a CSS selector. It returns a new Q instance containing the found elements, or null if no elements are found. The search is limited to descendants of the first element in the current selection, making it useful for scoped element queries.

**Examples:**
```javascript
Q('.container').find('.item');
Q('#sidebar').find('a[href]');
Q('form').find('input[type="text"]');
```

**Performance Notes:**
Efficient descendant search with native DOM query methods

**Optimizations:**
Uses native querySelectorAll for efficient CSS selector matching

**Known Issues:**
Only searches within the first element of the selection

---

### html

**Method:** `html(content)`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Gets or sets the HTML content of selected elements.

**Detailed Description:**
This method provides comprehensive HTML content manipulation. When called without arguments, it returns the innerHTML of the first element. When called with content, it replaces the innerHTML of all selected elements. It supports various content types including strings, Q objects, HTML elements, nodes, arrays, and NodeLists. The method intelligently handles different content types and properly appends them to the target elements.

**Examples:**
```javascript
Q('.element').html('<p>New content</p>');
var content = Q('#myDiv').html();
Q('.container').html([elem1, elem2, elem3]);
```

**Performance Notes:**
Optimized for various content types with appropriate DOM manipulation methods for each case

**Optimizations:**
Uses insertAdjacentHTML for string content, supports multiple content types efficiently

**Known Issues:**
None known

---

### prepend

**Method:** `prepend(...contents)`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Prepends content to the beginning of selected elements.

**Detailed Description:**
This method prepends one or more content items to the beginning of all selected elements. It supports various content types including strings, HTML elements, Q objects, arrays, and NodeLists. The method uses insertAdjacentHTML for string content and insertBefore for element nodes. Content is inserted at the beginning of each element, before any existing children.

**Examples:**
```javascript
Q('.container').prepend('<h1>Title</h1>');
Q('#list').prepend(newElement);
Q('div').prepend('<span>First</span>', secondElement);
```

**Performance Notes:**
Efficient content prepending with appropriate methods for each content type

**Optimizations:**
Uses insertAdjacentHTML for strings, insertBefore for elements, supports multiple content types

**Known Issues:**
None known

---

### remove

**Method:** `remove()`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Removes selected elements from the DOM.

**Detailed Description:**
This method removes all selected elements from the DOM tree using the native remove() method. The elements are completely removed from their parent nodes and can no longer be accessed or manipulated. This is a destructive operation that cannot be undone. The method supports method chaining by returning the Q instance, though the removed elements are no longer part of the selection.

**Examples:**
```javascript
Q('.unwanted').remove();
Q('#temporaryElement').remove();
Q('.items').filter('.selected').remove();
```

**Performance Notes:**
Efficient element removal with native DOM method, minimal overhead

**Optimizations:**
Uses native remove() method for efficient DOM removal

**Known Issues:**
Destructive operation that cannot be undone

---

### removeClass

**Method:** `removeClass(classes)`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Removes one or more CSS classes from selected elements.

**Detailed Description:**
This method removes the specified CSS class or classes from all elements in the current selection. It accepts a space-separated string of class names and removes them from each element using the native classList.remove() method. The method supports method chaining by returning the Q instance.

**Examples:**
```javascript
Q('.element').removeClass('active');
Q('#myDiv').removeClass('highlight selected');
Q('button').removeClass('btn btn-primary');
```

**Performance Notes:**
Efficient implementation using native DOM methods, minimal overhead with direct classList manipulation

**Optimizations:**
Uses native classList.remove() with apply() for efficient multiple class removal

---

### text

**Method:** `text(content)`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Gets or sets the text content of selected elements.

**Detailed Description:**
This method provides simple text content manipulation for elements. When called without arguments, it returns the textContent of the first element. When called with content, it sets the textContent of all selected elements, automatically escaping any HTML content for security. This is safer than using innerHTML when working with user-generated content.

**Examples:**
```javascript
Q('.element').text('New text content');
var text = Q('#myDiv').text();
Q('.message').text('User: ' + userName);
```

**Performance Notes:**
Efficient text manipulation with native DOM property, automatic HTML escaping for security

**Optimizations:**
Uses native textContent property for optimal performance

**Known Issues:**
None known

---

## Effects

### fadeIn

**Method:** `fadeIn(duration, callback)`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Fades in hidden elements with smooth opacity transition.

**Detailed Description:**
This method performs a fade-in animation on selected elements by transitioning their opacity from 0 to 1 over a specified duration. The method first makes the element visible by removing the display style, then applies a CSS transition to smoothly animate the opacity. A callback function can be provided to execute when the animation completes. The default duration is 400ms if not specified.

**Examples:**
```javascript
Q('.hidden').fadeIn();
Q('#modal').fadeIn(600);
Q('.element').fadeIn(500, function() { console.log('Faded in!'); });
```

**Performance Notes:**
Efficient fade animation using CSS transitions, cleanup of transition styles after completion

**Optimizations:**
Uses CSS transitions for smooth animation, forces reflow with offsetHeight for proper timing

**Known Issues:**
None known

---

### fadeOut

**Method:** `fadeOut(duration, callback)`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Fades out visible elements with smooth opacity transition.

**Detailed Description:**
This method performs a fade-out animation on selected elements by transitioning their opacity from the current value to 0 over a specified duration. After the animation completes, the element's display is set to 'none' to completely hide it. A callback function can be provided to execute when the animation completes. The method uses CSS transitions for smooth animation performance.

**Examples:**
```javascript
Q('.visible').fadeOut(400);
Q('#modal').fadeOut(600);
Q('.element').fadeOut(500, function() { console.log('Faded out!'); });
```

**Performance Notes:**
Efficient fade animation using CSS transitions, cleanup of transition styles after completion

**Optimizations:**
Uses CSS transitions for smooth animation, sets display none after completion

**Known Issues:**
None known

---

### fadeTo

**Method:** `fadeTo(opacity, duration, callback)`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Animates elements to a specific opacity level.

**Detailed Description:**
This method animates selected elements to a specific opacity value over a specified duration. Unlike fadeIn and fadeOut, this method allows you to set any opacity value between 0 and 1. The animation uses CSS transitions for smooth performance. A callback function can be provided to execute when the animation completes. The method forces a reflow to ensure proper animation timing.

**Examples:**
```javascript
Q('.element').fadeTo(0.5, 400);
Q('#image').fadeTo(0.3, 600, function() { console.log('Faded!'); });
Q('.overlay').fadeTo(0.8, 300);
```

**Performance Notes:**
Efficient opacity animation using CSS transitions, cleanup of transition styles after completion

**Optimizations:**
Uses CSS transitions for smooth animation, forces reflow with offsetHeight for proper timing

**Known Issues:**
None known

---

### fadeToggle

**Method:** `fadeToggle(duration, callback)`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Toggles element visibility with fade animation.

**Detailed Description:**
This method toggles the visibility of selected elements using fade animations. It checks the current opacity of each element and applies either a fadeIn or fadeOut effect accordingly. If the element's opacity is 0, it will fade in; otherwise, it will fade out. The method relies on the existing fadeIn and fadeOut implementations for the actual animation logic.

**Dependencies:**
- fadeIn
- fadeOut

**Examples:**
```javascript
Q('.element').fadeToggle();
Q('#modal').fadeToggle(600);
Q('.panel').fadeToggle(400, function() { console.log('Toggled!'); });
```

**Performance Notes:**
Efficient toggle logic using existing fade methods, minimal overhead with computed style check

**Optimizations:**
Uses existing fadeIn/fadeOut methods, checks computed styles for current state

**Known Issues:**
Relies on computed style opacity check which may not always reflect intended state

---

### hide

**Method:** `hide(duration, callback)`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Hides visible elements with optional fade-out animation.

**Detailed Description:**
This method hides visible elements by setting their display style to 'none'. When a duration is specified, it performs a fade-out animation by transitioning the opacity from 1 to 0 over the specified time period, then sets display to none. An optional callback function can be provided that will be executed when the animation completes. For instant hiding without animation, use a duration of 0.

**Examples:**
```javascript
Q('.visible').hide();
Q('#modal').hide(500);
Q('.element').hide(300, function() { console.log('Hidden!'); });
```

**Performance Notes:**
Efficient visibility control with optional smooth animations using CSS transitions

**Optimizations:**
Uses CSS transitions for smooth animations, proper event cleanup, closure pattern for node reference

**Known Issues:**
None known

---

### show

**Method:** `show(duration, callback)`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Shows hidden elements with optional fade-in animation.

**Detailed Description:**
This method shows hidden elements by removing the display style property. When a duration is specified, it performs a fade-in animation by transitioning the opacity from 0 to 1 over the specified time period. An optional callback function can be provided that will be executed when the animation completes. For instant showing without animation, use a duration of 0.

**Examples:**
```javascript
Q('.hidden').show();
Q('#modal').show(500);
Q('.element').show(300, function() { console.log('Shown!'); });
```

**Performance Notes:**
Efficient visibility control with optional smooth animations using CSS transitions

**Optimizations:**
Uses CSS transitions for smooth animations, cleanup of transition styles after completion

**Known Issues:**
None known

---

### toggle

**Method:** `toggle()`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Toggles element visibility without animation.

**Detailed Description:**
This method toggles the visibility of selected elements by switching their display style property between 'none' and an empty string. If an element is currently hidden (display: none), it will be shown, and vice versa. This is an instant toggle without any animation effects. The method directly manipulates the display CSS property for immediate visibility changes.

**Examples:**
```javascript
Q('.element').toggle();
Q('#menu').toggle();
Q('.panel').toggle();
```

**Performance Notes:**
Instant visibility toggle with minimal overhead, direct style property manipulation

**Optimizations:**
Simple and fast display property manipulation

**Known Issues:**
Only checks inline style display property, not computed styles

---

## Events

### Done

**Method:** `Q.Done(callback)`

| Property | Value |
|----------|-------|
| **Type** | Static |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Executes callbacks when the window load event is triggered.

**Detailed Description:**
This script provides a mechanism to queue and execute callback functions when the window load event is triggered. It maintains a queue of functions that are executed in order when the page is fully loaded. If called after the load event has already fired, the callback is executed immediately.

**Examples:**
```javascript
Q.Done(() => console.log('Page loaded'));
Q.Done(function() { document.body.style.backgroundColor = 'lightblue'; });
Q.Done(() => { Q('#myElement').addClass('loaded'); });
```

**Performance Notes:**
Lightweight implementation with minimal overhead, callbacks are executed synchronously on load event

**Optimizations:**
Uses closure to maintain private callback queue, efficient array shifting for execution

---

### Leaving

**Method:** `Q.Leaving(callback)`

| Property | Value |
|----------|-------|
| **Type** | Static |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Executes callbacks when the user is about to leave the page.

**Detailed Description:**
This script provides a mechanism to queue and execute callback functions when the beforeunload event is triggered. It maintains a queue of functions that are executed in order when the user attempts to leave the page. The callbacks receive the beforeunload event as a parameter, allowing them to potentially prevent the page from closing or perform cleanup operations.

**Examples:**
```javascript
Q.Leaving((e) => console.log('User is leaving'));
Q.Leaving(function(event) { return 'Are you sure you want to leave?'; });
Q.Leaving((e) => { localStorage.setItem('lastVisit', Date.now()); });
```

**Performance Notes:**
Lightweight implementation with minimal overhead, callbacks receive event object for maximum flexibility

**Optimizations:**
Uses closure to maintain private callback queue and event reference, efficient array shifting

---

### Ready

**Method:** `Q.Ready(callback)`

| Property | Value |
|----------|-------|
| **Type** | Static |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Executes callbacks when the DOM is ready or immediately if already loaded.

**Detailed Description:**
This script provides a mechanism to queue and execute callback functions when the DOM is fully loaded and parsed. It checks the document's readyState and either queues callbacks for the DOMContentLoaded event or executes them immediately if the DOM is already ready. This is similar to jQuery's $(document).ready() function.

**Examples:**
```javascript
Q.Ready(() => console.log('DOM is ready'));
Q.Ready(function() { Q('#myElement').addClass('ready'); });
Q.Ready(() => { document.body.style.display = 'block'; });
```

**Performance Notes:**
Lightweight implementation with immediate execution if DOM is already ready, uses once option for event listener

**Optimizations:**
Uses closure to maintain private callback queue, checks readyState to avoid unnecessary event listeners

---

### Resize

**Method:** `Q.Resize(callback)`

| Property | Value |
|----------|-------|
| **Type** | Static |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Executes callbacks when the window is resized, passing current dimensions.

**Detailed Description:**
This script provides a mechanism to register callback functions that are executed whenever the window is resized. Each callback receives the current window's innerWidth and innerHeight as parameters, making it easy to respond to viewport changes. All registered callbacks are executed synchronously when the resize event occurs.

**Examples:**
```javascript
Q.Resize((width, height) => console.log('Window size: ' + width + 'x' + height));
Q.Resize(function(w, h) { if (w < 768) document.body.classList.add('mobile'); });
Q.Resize((width, height) => { Q('#viewport-info').text(width + 'x' + height); });
```

**Performance Notes:**
Lightweight implementation with minimal overhead, callbacks receive current dimensions directly from innerWidth/innerHeight

**Optimizations:**
Uses closure to maintain private callback array, efficient for loop for callback execution

---

### blur

**Method:** `blur()`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Removes focus from selected elements.

**Detailed Description:**
This method programmatically removes focus from all selected elements by calling the native blur() method. This is particularly useful for form elements like input fields, textareas, and buttons. When an element loses focus, it will trigger any associated blur event handlers and remove visual focus indicators like outline or highlighting.

**Examples:**
```javascript
Q('input').blur();
Q('#activeField').blur();
Q('textarea').blur();
```

**Performance Notes:**
Efficient focus removal with native DOM method, minimal overhead

**Optimizations:**
Uses native blur() method for authentic focus removal

**Known Issues:**
None known

---

### click

**Method:** `click()`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Programmatically triggers click events on selected elements.

**Detailed Description:**
This method programmatically triggers click events on all selected elements. It uses the native click() method to simulate user click interactions, which will fire any attached click event handlers and trigger default browser behaviors for clickable elements like buttons, links, and form inputs.

**Examples:**
```javascript
Q('.button').click();
Q('#submitBtn').click();
Q('a[href]').click();
```

**Performance Notes:**
Efficient event triggering with native DOM method, minimal overhead

**Optimizations:**
Uses native click() method for authentic event triggering

**Known Issues:**
None known

---

### focus

**Method:** `focus()`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Sets focus to selected elements.

**Detailed Description:**
This method programmatically sets focus to all selected elements by calling the native focus() method. This is particularly useful for form elements like input fields, textareas, and buttons. When an element receives focus, it will trigger any associated focus event handlers and display visual focus indicators like outline or highlighting. Note that only focusable elements can receive focus.

**Examples:**
```javascript
Q('input').focus();
Q('#username').focus();
Q('textarea').focus();
```

**Performance Notes:**
Efficient focus setting with native DOM method, minimal overhead

**Optimizations:**
Uses native focus() method for authentic focus behavior

**Known Issues:**
Only focusable elements can receive focus

---

### off

**Method:** `off(events, handler, options)`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Removes event handlers from selected elements.

**Detailed Description:**
This method removes event listeners from all elements in the current selection. It supports removing multiple events by providing a space-separated string of event names. The method accepts the same handler function and options that were used when the event was originally attached. It uses the native removeEventListener method for proper cleanup of event handlers.

**Examples:**
```javascript
Q('.button').off('click', handleClick);
Q('#myDiv').off('mouseenter mouseleave', handleHover);
Q('.input').off('input', handleInput, { passive: true });
```

**Performance Notes:**
Efficient event removal with native DOM methods, minimal overhead

**Optimizations:**
Uses native removeEventListener with configurable options, supports multiple events efficiently

**Known Issues:**
Requires exact same handler reference and options used when adding the event

---

### on

**Method:** `on(events, handler, options)`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Attaches event handlers to selected elements.

**Detailed Description:**
This method attaches event listeners to all elements in the current selection. It supports multiple events by providing a space-separated string of event names. The method accepts optional configuration options for event handling behavior including capture, once, and passive flags. It uses the native addEventListener method for optimal performance and compatibility.

**Examples:**
```javascript
Q('.button').on('click', function() { console.log('clicked'); });
Q('#myDiv').on('mouseenter mouseleave', handleHover);
Q('.input').on('input', handleInput, { passive: true });
```

**Performance Notes:**
Efficient event binding with native DOM methods, minimal overhead with direct addEventListener usage

**Optimizations:**
Uses native addEventListener with configurable options, supports multiple events efficiently

**Known Issues:**
None known

---

## Forms

### val

**Method:** `val(input)`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Gets or sets the value of form elements.

**Detailed Description:**
This method provides a convenient way to get or set the value of form elements like input fields, textareas, and select elements. When called without arguments, it returns the value of the first element in the selection. When called with a value, it sets the value property of all selected elements. This is particularly useful for form manipulation and data binding operations.

**Examples:**
```javascript
Q('#username').val('john_doe');
var username = Q('#username').val();
Q('input[type="text"]').val('');
```

**Performance Notes:**
Efficient form value manipulation with native DOM properties

**Optimizations:**
Uses native value property for direct form element manipulation

**Known Issues:**
None known

---

## Iteration

### each

**Method:** `each(callback)`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Iterates over selected elements, executing a callback for each.

**Detailed Description:**
This method iterates over all elements in the current selection, executing the provided callback function for each element. The callback receives two parameters: the index of the current element and the element itself. The callback is executed with the current element as the 'this' context, allowing direct manipulation of each element. The method supports method chaining by returning the Q instance.

**Examples:**
```javascript
Q('.items').each(function(index, element) { console.log(index, this); });
Q('div').each((i, el) => el.textContent = 'Item ' + i);
Q('.boxes').each(function() { this.style.color = 'red'; });
```

**Performance Notes:**
Lightweight iteration with minimal overhead, direct callback execution

**Optimizations:**
Efficient iteration with direct element access, proper context binding

**Known Issues:**
None known

---

## Traversal

### children

**Method:** `children(selector)`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Gets child elements of selected elements, optionally filtered by selector.

**Detailed Description:**
This method returns a new Q instance containing all direct child elements of the selected elements. An optional CSS selector can be provided to filter the children to only those that match the selector. The method collects children from all elements in the current selection and returns them as a flat array. Only direct children are included, not deeper descendants.

**Examples:**
```javascript
Q('.container').children();
Q('#parent').children('.item');
Q('ul').children('li.active');
```

**Performance Notes:**
Efficient child element collection with optional CSS selector filtering

**Optimizations:**
Uses native children property and matches() for efficient filtering

**Known Issues:**
None known

---

### next

**Method:** `next(selector)`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Gets the next sibling elements, optionally filtered by selector.

**Detailed Description:**
This method returns a new Q instance containing the next sibling elements of each element in the current selection. An optional CSS selector can be provided to filter the results to only those siblings that match the selector. The method uses nextElementSibling to skip text nodes and only return element nodes. If no next sibling exists or matches the selector, it won't be included in the result.

**Examples:**
```javascript
Q('.item').next();
Q('#current').next('.target');
Q('li').next('li.active');
```

**Performance Notes:**
Efficient sibling traversal with native DOM properties

**Optimizations:**
Uses nextElementSibling for efficient sibling traversal, optional selector filtering

**Known Issues:**
None known

---

### parent

**Method:** `parent()`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Gets the parent element of the first selected element.

**Detailed Description:**
This method returns a new Q instance containing the parent element of the first element in the current selection. If the first element has no parent (such as the document element), it returns a Q instance containing null. This is useful for traversing up the DOM tree to access parent containers or wrapper elements.

**Examples:**
```javascript
Q('.child').parent();
Q('#element').parent().addClass('parent-class');
var parentDiv = Q('span').parent();
```

**Performance Notes:**
Efficient parent traversal with native DOM property access

**Optimizations:**
Uses native parentNode property for efficient traversal

**Known Issues:**
Only returns parent of the first element in selection

---

### prev

**Method:** `prev(selector)`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Gets the previous sibling elements, optionally filtered by selector.

**Detailed Description:**
This method returns a new Q instance containing the previous sibling elements of each element in the current selection. An optional CSS selector can be provided to filter the results to only those siblings that match the selector. The method uses previousElementSibling to skip text nodes and only return element nodes. If no previous sibling exists or matches the selector, it won't be included in the result.

**Examples:**
```javascript
Q('.item').prev();
Q('#current').prev('.target');
Q('li').prev('li.completed');
```

**Performance Notes:**
Efficient sibling traversal with native DOM properties

**Optimizations:**
Uses previousElementSibling for efficient sibling traversal, optional selector filtering

**Known Issues:**
None known

---

### siblings

**Method:** `siblings(selector)`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Gets all sibling elements, optionally filtered by selector.

**Detailed Description:**
This method returns a new Q instance containing all sibling elements of each element in the current selection, excluding the elements themselves. An optional CSS selector can be provided to filter the results to only those siblings that match the selector. The method finds all children of each element's parent, then excludes the element itself from the results.

**Examples:**
```javascript
Q('.item').siblings();
Q('#current').siblings('.other');
Q('li').siblings('li.inactive');
```

**Performance Notes:**
Efficient sibling collection through parent element traversal

**Optimizations:**
Uses parent.children for efficient sibling collection, optional selector filtering

**Known Issues:**
May include duplicate siblings if multiple elements have the same parent

---

## animation

### animate

**Method:** `animate(duration, properties, callback)`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Animates CSS properties over a specified duration using CSS transitions. Supports callback function execution after animation completion.

**Detailed Description:**
This method creates CSS transition animations on selected elements. It accepts a duration in milliseconds, an object containing CSS properties to animate, and an optional callback function to execute when the animation completes. The method uses CSS transitions for smooth performance and automatically cleans up transition properties after animation.

**Examples:**
```javascript
Q('.box').animate(1000, {opacity: 0.5, left: '100px'});
Q('#item').animate(500, {width: '200px'}, function() { console.log('done'); });
```

**Performance Notes:**
O(n*p) where n is number of elements and p is number of properties

**Optimizations:**
Use transitionend event for callback, preserve existing transitions

**Known Issues:**
Uses setTimeout instead of transitionend event, overwrites existing transition property

---

### removeTransition

**Method:** `removeTransition()`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Removes all CSS transition properties from the selected elements.

**Detailed Description:**
This method removes all CSS transition properties from the selected elements by setting the transition style property to an empty string. This effectively disables any ongoing or future CSS transitions on the elements, allowing for immediate style changes without animation effects.

**Examples:**
```javascript
Q('.animated').removeTransition();
Q('.element').removeTransition();
```

**Performance Notes:**
O(n) where n is the number of elements

**Optimizations:**
Add selective transition property removal

**Known Issues:**
Removes all transition properties at once, no selective removal

---

## async

### wait

**Method:** `wait(delay)`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Returns a Promise that resolves after the specified delay in milliseconds, allowing for chained async operations.

**Detailed Description:**
This method returns a Promise that resolves after the specified delay in milliseconds. It allows for chaining async operations and provides a way to introduce delays in method chains. The Promise resolves with the Q object itself, allowing for continued chaining of operations.

**Examples:**
```javascript
await Q('.element').wait(1000)
Q('.item').show().wait(500).then(el => el.fadeOut())
```

**Performance Notes:**
O(1) - uses setTimeout internally

**Optimizations:**
Add cancellation token support, Add frame-based waiting

**Known Issues:**
Simple delay only, No cancellation support

---

## attributes

### data

**Method:** `data(key, value)`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Gets or sets data attributes using the dataset API. Returns the value when getting, or the Q object when setting.

**Detailed Description:**
This method provides access to HTML5 data attributes through the native dataset API. When called with just a key, it returns the data attribute value from the first element. When called with key and value, it sets the data attribute on all selected elements. The method automatically handles the conversion between kebab-case HTML attributes and camelCase JavaScript properties.

**Examples:**
```javascript
Q('.item').data('id', '123');
const id = Q('.item').data('id');
```

**Performance Notes:**
O(1) for getting, O(n) for setting where n is number of elements

**Optimizations:**
Use standard undefined check, add batch getting capability

**Known Issues:**
Uses internal Q undefined constants, only gets from first element

---

### hasClass

**Method:** `hasClass(className)`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Checks if the first element in the set has the specified CSS class name.

**Detailed Description:**
This method checks whether the first element in the current selection contains the specified CSS class name. It uses the native classList.contains() method for efficient class checking. Returns true if the class is found, false otherwise. If no elements are selected, it returns false.

**Examples:**
```javascript
Q('.item').hasClass('active');
if (Q('#button').hasClass('disabled')) { return; }
```

**Performance Notes:**
O(1)

**Optimizations:**
Add support for checking all elements, add multiple class support

**Known Issues:**
Only checks first element, returns false for non-existent elements

---

### id

**Method:** `id(ident)`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Gets or sets the ID attribute of the first element in the set. Returns the ID value when getting, or the Q object when setting.

**Detailed Description:**
This method provides access to the ID attribute of the first element in the selection. When called without arguments, it returns the current ID value. When called with an identifier string, it sets the ID attribute of the first element. Note that HTML IDs should be unique within a document, so this method only operates on the first element to maintain this constraint.

**Examples:**
```javascript
const id = Q('.item').id();
Q('.item').id('new-id');
```

**Performance Notes:**
O(1)

**Optimizations:**
Add ID format validation, add support for setting multiple elements

**Known Issues:**
Only works with first element, no validation for valid ID format

---

### removeAttr

**Method:** `removeAttr(attribute)`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Removes the specified attribute from all elements in the set.

**Detailed Description:**
This method removes the specified HTML attribute from all elements in the current selection. It uses the native removeAttribute() method to completely remove the attribute and its value from each element. This is useful for cleaning up temporary attributes or removing attributes that are no longer needed.

**Examples:**
```javascript
Q('.item').removeAttr('data-temp');
Q('input').removeAttr('disabled');
```

**Performance Notes:**
O(n) where n is the number of elements

**Optimizations:**
Add multiple attribute support, add existence check

**Known Issues:**
No validation for attribute existence, does not handle multiple attributes

---

### removeData

**Method:** `removeData(key)`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Removes data attributes from all elements in the set using the dataset API.

**Detailed Description:**
This method removes the specified data attribute from all elements in the current selection using the native dataset API. It automatically handles the conversion between camelCase JavaScript property names and kebab-case HTML attribute names. When a data attribute is removed, it is completely eliminated from the element's dataset.

**Examples:**
```javascript
Q('.item').removeData('id');
Q('.element').removeData('temp');
```

**Performance Notes:**
O(n) where n is the number of elements

**Optimizations:**
Add existence check, use setAttribute with null value

**Known Issues:**
No validation for key existence, uses delete operator which can be slow

---

### toggleClass

**Method:** `toggleClass(className)`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Toggles the specified CSS class on all elements in the set. Adds the class if not present, removes it if present.

**Detailed Description:**
This method toggles the specified CSS class on all elements in the current selection. If the class is present on an element, it will be removed; if the class is not present, it will be added. This uses the native classList.toggle() method for efficient class manipulation and provides a convenient way to switch element states.

**Examples:**
```javascript
Q('.item').toggleClass('active');
Q('.menu').toggleClass('open');
```

**Performance Notes:**
O(n) where n is the number of elements

**Optimizations:**
Add support for multiple classes, add force parameter

**Known Issues:**
Only supports single class, no force parameter support

---

## dimensions

### height

**Method:** `height(value)`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Gets the height of the first element or sets the height of all elements. Returns offsetHeight when getting, Q object when setting.

**Detailed Description:**
This method provides dual functionality for element heights. When called without arguments, it returns the offsetHeight of the first element in pixels. When called with a value, it sets the CSS height property of all selected elements. The value can be any valid CSS height value including pixels, percentages, or other units.

**Examples:**
```javascript
const height = Q('.box').height();
Q('.item').height('200px');
```

**Performance Notes:**
O(1) for getting, O(n) for setting where n is number of elements

**Optimizations:**
Add unit handling, add option to get all heights

**Known Issues:**
Gets from first element only, does not handle unit conversion

---

### offset

**Method:** `offset()`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Returns the current coordinates of the first element relative to the document, including scroll position.

**Detailed Description:**
This method returns an object containing the top and left coordinates of the first element relative to the document. It uses getBoundingClientRect() and accounts for the document's scroll position to provide absolute positioning coordinates. The returned object contains 'top' and 'left' properties representing pixel values from the document's top-left corner.

**Examples:**
```javascript
const pos = Q('.element').offset();
const {top, left} = Q('#box').offset();
```

**Performance Notes:**
O(1)

**Optimizations:**
Add support for all elements, add browser compatibility checks

**Known Issues:**
Only works with first element, may not work correctly in all browsers

---

### position

**Method:** `position()`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Returns the position of the first element relative to its offset parent (position:relative parent).

**Detailed Description:**
This method returns an object containing the top and left coordinates of the first element relative to its offset parent. It uses the native offsetTop and offsetLeft properties to provide positioning coordinates relative to the nearest positioned ancestor element. The returned object contains 'top' and 'left' properties representing pixel values.

**Examples:**
```javascript
const pos = Q('.element').position();
const {top, left} = Q('#box').position();
```

**Performance Notes:**
O(1)

**Optimizations:**
Add support for all elements, include margin calculations

**Known Issues:**
Only works with first element, does not account for margins

---

### scrollHeight

**Method:** `scrollHeight()`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Returns the total scrollable height of the first element, including content not visible due to scrolling.

**Detailed Description:**
This method returns the total scrollable height of the first element in the selection, including any content that is not currently visible due to scrolling. It uses the native scrollHeight property which represents the entire height of the element's content, including overflow content not visible in the viewport.

**Examples:**
```javascript
const totalHeight = Q('.container').scrollHeight();
if (Q('#content').scrollHeight() > 500) { console.log('Long content'); }
```

**Performance Notes:**
O(1)

**Optimizations:**
Add support for all elements, add error handling

**Known Issues:**
Only works with first element, no error handling for non-element nodes

---

### scrollLeft

**Method:** `scrollLeft(value)`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Gets or sets the horizontal scroll position of elements. Supports increment mode for relative scrolling with boundary checking.

**Detailed Description:**
This method allows getting or setting the horizontal scroll position of selected elements. When called without arguments, it returns the scrollLeft value of the first element. When called with a value, it sets the scrollLeft property of all selected elements. The increment parameter allows for relative scrolling with boundary checking to prevent scrolling beyond the maximum scroll width.

**Examples:**
```javascript
const scrollPos = Q('.container').scrollLeft()
Q('.container').scrollLeft(100)
Q('.container').scrollLeft(50, true)
```

**Performance Notes:**
O(1) for getting, O(n) for setting where n is number of elements

**Optimizations:**
Separate methods for get/set/increment, Add smooth scrolling option

**Known Issues:**
Gets from first element only, Complex parameter handling

---

### scrollTop

**Method:** `scrollTop(value)`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Gets or sets the vertical scroll position of elements. Supports increment mode for relative scrolling with boundary checking.

**Detailed Description:**
This method allows getting or setting the vertical scroll position of selected elements. When called without arguments, it returns the scrollTop value of the first element. When called with a value, it sets the scrollTop property of all selected elements. The increment parameter allows for relative scrolling with boundary checking to prevent scrolling beyond the maximum scroll height.

**Examples:**
```javascript
const scrollPos = Q('.container').scrollTop()
Q('.container').scrollTop(200)
Q('.container').scrollTop(50, true)
```

**Performance Notes:**
O(1) for getting, O(n) for setting where n is number of elements

**Optimizations:**
Separate methods for get/set/increment, Add smooth scrolling option

**Known Issues:**
Gets from first element only, Complex parameter handling

---

### scrollWidth

**Method:** `scrollWidth()`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Returns the total scrollable width of the first element, including content not visible due to scrolling.

**Detailed Description:**
This method returns the scrollWidth property of the first element in the selection. The scrollWidth represents the total width of the element's content, including content that is not visible due to scrolling. This is useful for determining if an element has horizontal scrollable content.

**Examples:**
```javascript
const totalWidth = Q('.container').scrollWidth()
if (Q('#content').scrollWidth() > 1000) { ... }
```

**Performance Notes:**
O(1)

**Optimizations:**
Add support for all elements, Add error handling

**Known Issues:**
Only works with first element, No error handling for non-element nodes

---

### size

**Method:** `size()`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Returns an object containing the width and height of the first element including padding and border.

**Detailed Description:**
This method returns an object containing the width and height properties of the first element in the selection. The dimensions include padding and border (offsetWidth and offsetHeight). This is useful for getting both dimensions at once when you need complete size information.

**Examples:**
```javascript
const {width, height} = Q('.box').size()
const dimensions = Q('#element').size()
```

**Performance Notes:**
O(1)

**Optimizations:**
Add support for all elements, Add separate width/height methods

**Known Issues:**
Only works with first element, Returns object instead of allowing individual dimension access

---

### width

**Method:** `width(value)`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Gets the width of the first element or sets the width of all elements. Returns offsetWidth when getting, Q object when setting.

**Detailed Description:**
This method allows getting or setting the width of elements. When called without arguments, it returns the offsetWidth of the first element in the selection. When called with a value, it sets the width CSS property of all selected elements. The method supports both numeric values and string values with units.

**Examples:**
```javascript
const width = Q('.box').width()
Q('.item').width('200px')
```

**Performance Notes:**
O(1) for getting, O(n) for setting where n is number of elements

**Optimizations:**
Add unit handling, Add option to get all widths

**Known Issues:**
Gets from first element only, Does not handle unit conversion

---

## events

### bind

**Method:** `bind(event, handler)`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Binds event handlers using event delegation. Events are delegated from document level and trigger when target is within selected elements.

**Detailed Description:**
This method provides event delegation functionality by creating a global event delegation system. Events are bound at the document level and filtered to trigger only when the event target is contained within the selected elements. This approach is efficient for dynamic content and reduces memory usage compared to individual event listeners.

**Examples:**
```javascript
Q('.container').bind('click', function(e) { console.log('clicked'); });
Q('.form').bind('submit', handleSubmit);
```

**Performance Notes:**
O(1) for binding, O(n) for event triggering where n is number of bound elements

**Optimizations:**
Add unbind functionality, use WeakMap for event tracking

**Known Issues:**
Creates global event delegation system, may cause memory leaks if not properly cleaned

---

### trigger

**Method:** `trigger(eventType)`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Triggers a specified event on all elements in the set by dispatching a new Event object.

**Detailed Description:**
This method triggers a specified event on all selected elements by creating and dispatching a new Event object. It allows programmatic triggering of events like click, change, input, etc. The event is dispatched on each element in the collection, which will cause any attached event listeners to be executed.

**Examples:**
```javascript
Q('.button').trigger('click')
Q('input').trigger('change')
```

**Performance Notes:**
O(n) where n is the number of elements

**Optimizations:**
Add CustomEvent support, Allow event data passing

**Known Issues:**
Only supports basic Event constructor, No support for custom event data

---

## iteration

### walk

**Method:** `walk(callback)`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Iterates over all elements in the set, calling the callback function for each. Optionally wraps elements in Q objects.

**Detailed Description:**
This method iterates over all elements in the current selection, calling the provided callback function for each element. The callback receives the element (either as DOM element or wrapped in Q object) and the index as parameters. The useQObject parameter determines whether elements are passed as raw DOM elements or wrapped in Q objects.

**Examples:**
```javascript
Q('.items').walk((el, i) => console.log(el, i))
Q('.items').walk((qEl, i) => qEl.addClass('processed'), true)
```

**Performance Notes:**
O(n) where n is number of elements, O(n*m) if useQObject is true

**Optimizations:**
Separate methods for different iteration types, Cache Q objects

**Known Issues:**
useQObject parameter is confusing, Creates new Q objects unnecessarily

---

## manipulation

### after

**Method:** `after(...contents)`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Inserts content after each element in the current set. Content can be HTML strings, DOM elements, Q objects, arrays, or NodeLists.

**Detailed Description:**
This method inserts the specified content after each element in the current selection. It supports various content types including HTML strings, DOM elements, Q objects, arrays, and NodeLists. The content is inserted as siblings after each target element.

**Examples:**
```javascript
Q('.item').after('<p>New content</p>');
Q('#header').after(document.createElement('div'));
Q('.element').after(Q('.another-element'));
```

**Performance Notes:**
O(n*m) where n is number of elements and m is number of content items

**Optimizations:**
Pre-process content type checking, use document fragments for multiple elements

**Known Issues:**
Does not handle all edge cases with nested structures, performance can degrade with large content arrays

---

### clone

**Method:** `clone()`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Creates a deep clone of the first element in the set and returns it as a new Q object.

**Detailed Description:**
This method creates a deep clone of the first element in the current selection, including all child elements and their attributes. The cloned element is returned as a new Q object, allowing for further manipulation. Note that event handlers are not cloned and must be reattached to the cloned element if needed.

**Examples:**
```javascript
Q('.template').clone();
const cloned = Q('#original').clone();
```

**Performance Notes:**
O(n) where n is the size of the DOM subtree being cloned

**Optimizations:**
Add option to clone all elements, add event handler preservation

**Known Issues:**
Only clones the first element, does not preserve event handlers

---

### detach

**Method:** `detach()`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Removes elements from the DOM while preserving them in memory. The detached elements remain in the Q object for potential re-insertion.

**Detailed Description:**
This method removes all selected elements from their parent nodes while keeping them in memory within the Q object. Unlike remove(), detach() preserves the elements so they can be reinserted into the DOM later. This is useful for temporarily removing elements without losing their structure, content, or event handlers.

**Examples:**
```javascript
const detached = Q('.temporary').detach();
Q('.item').detach().appendTo('.container');
```

**Performance Notes:**
O(n) where n is the number of elements

**Optimizations:**
Return new Q object with detached nodes, add reattachment tracking

**Known Issues:**
Modifies original nodes array, may cause memory leaks if references are kept

---

### empty

**Method:** `empty()`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Removes all child elements and content from the selected elements by setting innerHTML to empty string.

**Detailed Description:**
This method removes all child elements and text content from the selected elements by setting their innerHTML property to an empty string. This effectively clears the content while keeping the elements themselves in the DOM. Note that this approach may not properly clean up event handlers attached to child elements.

**Examples:**
```javascript
Q('.container').empty();
Q('div').empty();
```

**Performance Notes:**
O(n) where n is the number of elements

**Optimizations:**
Use removeChild in loop, add event handler cleanup

**Known Issues:**
Does not properly clean up event handlers, uses innerHTML which can be slow

---

### replaceWith

**Method:** `replaceWith(content)`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Replaces each element in the set with the provided content.

**Detailed Description:**
This method replaces each element in the current selection with the specified content. The content can be HTML strings, DOM elements, or Q objects. Each selected element is removed from the DOM and replaced with the new content at the same position in the document structure.

**Examples:**
```javascript
Q('.old-element').replaceWith('<div class="new-element">New content</div>');
Q('#target').replaceWith(newElement);
```

**Performance Notes:**
O(n) where n is the number of elements

**Optimizations:**
Add event handler preservation option

**Known Issues:**
May lose event handlers attached to replaced elements

---

### unwrap

**Method:** `unwrap()`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Removes the parent element of each element in the set, moving the element up one level in the DOM hierarchy.

**Detailed Description:**
This method removes the parent element of each selected element, effectively moving the elements up one level in the DOM hierarchy. The parent element is replaced with its child nodes. This is useful for removing wrapper elements while preserving their contents. The method includes a safety check to prevent unwrapping from the document body.

**Examples:**
```javascript
Q('.inner').unwrap()
Q('span').unwrap()
```

**Performance Notes:**
O(n) where n is the number of elements

**Optimizations:**
Add safety checks, Make parent exclusion configurable

**Known Issues:**
Does not check if parent has other important children, Hardcoded body check

---

### wrap

**Method:** `wrap(wrapper)`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Wraps each element in the set with the specified wrapper element. Supports HTML strings and DOM elements as wrappers.

**Detailed Description:**
This method wraps each selected element with the specified wrapper element. The wrapper can be provided as an HTML string or as a DOM element. When using an HTML string, it's parsed and the first element is used as the wrapper. Each element gets its own wrapper instance, so the wrapper is cloned for each element.

**Examples:**
```javascript
Q('.item').wrap('<div class="wrapper"></div>')
Q('.content').wrap(document.createElement('section'))
```

**Performance Notes:**
O(n) where n is the number of elements

**Optimizations:**
Reuse wrapper elements where possible, Improve variable naming

**Known Issues:**
Creates new wrapper for each element, Variable naming inconsistency

---

### wrapAll

**Method:** `wrapAll(wrapper)`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Wraps all elements in the set together with a single wrapper element. All elements are moved into the same wrapper.

**Detailed Description:**
This method wraps all selected elements together with a single wrapper element. Unlike the wrap method which creates a separate wrapper for each element, wrapAll groups all elements inside one wrapper. The wrapper can be provided as an HTML string or as a DOM element. All selected elements are moved into the wrapper, which is inserted at the position of the first element.

**Examples:**
```javascript
Q('.items').wrapAll('<div class="container"></div>')
Q('li').wrapAll(document.createElement('ul'))
```

**Performance Notes:**
O(n) where n is the number of elements

**Optimizations:**
Simplify string parsing, Add parent validation

**Known Issues:**
Uses complex inline function for string parsing, Assumes elements have same parent

---

## properties

### prop

**Method:** `prop(property, value)`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Gets or sets a property on DOM elements. Returns the property value when getting, or the Q object when setting.

**Detailed Description:**
This method provides access to DOM element properties (not attributes). When called with just a property name, it returns the property value from the first element. When called with property and value, it sets the property on all selected elements. This is particularly useful for form elements where properties like 'checked', 'selected', or 'disabled' need to be manipulated.

**Examples:**
```javascript
Q('input').prop('checked', true);
const isChecked = Q('input').prop('checked');
```

**Performance Notes:**
O(1) for getting, O(n) for setting where n is number of elements

**Optimizations:**
Add property validation, add batch getting capability

**Known Issues:**
Gets from first element only, no type checking for property values

---

### removeProp

**Method:** `removeProp(property)`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Removes a property from all elements in the set by setting it to undefined.

**Detailed Description:**
This method removes the specified property from all elements in the current selection by setting the property value to undefined. This is particularly useful for cleaning up custom properties that were previously set on DOM elements. Note that this removes the property from the element object, not HTML attributes.

**Examples:**
```javascript
Q('input').removeProp('customProp');
Q('.element').removeProp('tempData');
```

**Performance Notes:**
O(n) where n is the number of elements

**Optimizations:**
Add existence check, use undefined assignment instead

**Known Issues:**
No validation for property existence, delete operator can be slow

---

## style

### zIndex

**Method:** `zIndex(value)`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Gets or sets the z-index CSS property of elements. Returns the computed or inline z-index when getting, or the Q object when setting.

**Detailed Description:**
This method allows getting or setting the z-index CSS property of elements. When called without arguments, it returns the z-index value of the first element, checking first the inline style and then the computed style. When called with a value, it sets the z-index property of all selected elements.

**Examples:**
```javascript
const zIndex = Q('.overlay').zIndex()
Q('.modal').zIndex(1000)
```

**Performance Notes:**
O(1) for getting, O(n) for setting where n is number of elements

**Optimizations:**
Consistent return values, Add number parsing, Improve variable naming

**Known Issues:**
Gets from first element only, Inconsistent return value handling, Variable naming inconsistency

---

## traversal

### closest

**Method:** `closest(selector)`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Traverses up the DOM tree from the first element to find the closest ancestor that matches the given selector.

**Detailed Description:**
This method traverses up the DOM tree from the first element in the current selection to find the closest ancestor element that matches the specified CSS selector. It uses the native matches() method for selector matching and returns a new Q object containing the matching ancestor element. If no matching ancestor is found, it returns null.

**Examples:**
```javascript
Q('.item').closest('.container');
Q('button').closest('form');
```

**Performance Notes:**
O(h) where h is the height of the DOM tree

**Optimizations:**
Add support for multiple elements, return consistent Q object

**Known Issues:**
Only works with first element, returns null instead of empty Q object

---

### eq

**Method:** `eq(index)`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Returns a new Q object containing the element at the specified index, or null if the index is out of bounds.

**Detailed Description:**
This method returns a new Q object containing only the element at the specified index position from the current selection. If the index is out of bounds, it returns null. The index is zero-based, so the first element is at index 0. This is useful for selecting a specific element from a collection.

**Examples:**
```javascript
Q('li').eq(0);
Q('.items').eq(2);
```

**Performance Notes:**
O(1)

**Optimizations:**
Return empty Q object for consistency, add negative index support

**Known Issues:**
Returns null instead of empty Q object, does not support negative indexing

---

### first

**Method:** `first()`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Returns a new Q object containing only the first element from the current set.

**Detailed Description:**
This method creates a new Q object containing only the first element from the current selection. If the current selection is empty, it will return a Q object with undefined as the first element. This is useful for narrowing down a selection to work with just the first matched element.

**Examples:**
```javascript
Q('li').first();
Q('.items').first();
```

**Performance Notes:**
O(1)

**Optimizations:**
Add existence check, return empty Q object if no elements

**Known Issues:**
May return Q object with undefined if no elements, does not check if element exists

---

### index

**Method:** `index(position)`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Gets the index of the first element among siblings, or moves all elements to the specified index position within their parent.

**Detailed Description:**
This method provides dual functionality for element positioning. When called without arguments, it returns the zero-based index position of the first element among its siblings within the parent container. When called with a numeric position, it moves all selected elements to that index position within their respective parent containers, effectively reordering the DOM structure.

**Examples:**
```javascript
const position = Q('.item').index();
Q('.item').index(2);
```

**Performance Notes:**
O(1) for getting, O(n*m) for setting where n is elements and m is siblings

**Optimizations:**
Add batch movement optimization, add parent existence checks

**Known Issues:**
Moving elements may cause layout shifts, does not handle elements without parents

---

### inside

**Method:** `inside(selector)`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Checks if the first element is contained within an ancestor that matches the given selector.

**Detailed Description:**
This method determines whether the first element in the selection is contained within an ancestor element that matches the specified CSS selector. It uses the native closest() method to traverse up the DOM tree and returns true if a matching ancestor is found, false otherwise. This is useful for checking element containment relationships.

**Examples:**
```javascript
Q('.item').inside('.container');
if (Q('button').inside('form')) { return; }
```

**Performance Notes:**
O(h) where h is the height of the DOM tree

**Optimizations:**
Add support for checking all elements, add custom traversal logic

**Known Issues:**
Only checks first element, relies on native closest method

---

### is

**Method:** `is(selector)`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Checks if the first element matches the given selector, function, or element. Supports pseudo-selectors like :visible, :hidden, etc.

**Detailed Description:**
This method tests whether the first element in the selection matches the specified criteria. It supports CSS selectors, custom pseudo-selectors (:visible, :hidden, :hover, :focus, :checked), function tests, and direct element comparisons. The method provides a comprehensive way to check element states and properties for conditional logic.

**Examples:**
```javascript
Q('.item').is('.active');
Q('#input').is(':checked');
Q('.element').is(function() { return this.offsetWidth > 100; });
```

**Performance Notes:**
O(1) for most checks, O(h) for complex selectors

**Optimizations:**
Add more pseudo-selectors, add support for multiple elements

**Known Issues:**
Only checks first element, limited pseudo-selector support

---

### isExists

**Method:** `isExists()`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Checks if the first element exists in the DOM. Also provides Q.isExists(selector) to check if any element matching selector exists.

**Detailed Description:**
This method determines whether the first element in the selection currently exists in the DOM tree. It uses document.body.contains() to check if the element is attached to the document. The method also provides a static version Q.isExists(selector) that can check for the existence of elements by selector without creating a Q instance first.

**Examples:**
```javascript
Q('.item').isExists();
Q.isExists('.modal');
```

**Performance Notes:**
O(h) where h is the height of the DOM tree

**Optimizations:**
Use document.contains instead, add support for checking all elements

**Known Issues:**
Only checks first element for instance method, uses document.body.contains which may not work for detached elements

---

### last

**Method:** `last()`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Returns a new Q object containing only the last element from the current set.

**Detailed Description:**
This method creates a new Q object containing only the last element from the current selection. It accesses the final element in the nodes array and returns it wrapped in a new Q instance. If the current selection is empty, it may return a Q object with undefined as the element.

**Examples:**
```javascript
Q('li').last();
Q('.items').last();
```

**Performance Notes:**
O(1)

**Optimizations:**
Add existence check, return empty Q object if no elements

**Known Issues:**
May return Q object with undefined if no elements, does not check if elements exist

---

### map

**Method:** `map(callback)`

| Property | Value |
|----------|-------|
| **Type** | Prototype |
| **Version** | 1.0.0 |
| **Author** | Vulpini |
| **Date** | 2025-07-06 |

**Description:**
Creates a new array with results of calling the callback on each element. Each element is wrapped in a Q object before passing to callback.

**Detailed Description:**
This method creates a new array by calling the provided callback function for each element in the selection. Each element is wrapped in a Q object before being passed to the callback, allowing for method chaining within the callback. The callback's return values are collected into a new array which is returned by the method.

**Examples:**
```javascript
const texts = Q('.items').map(el => el.text());
const heights = Q('.boxes').map(el => el.height());
```

**Performance Notes:**
O(n) where n is the number of elements

**Optimizations:**
Add index parameter, allow direct element access option

**Known Issues:**
Creates new Q objects for each element which may be inefficient, does not provide index parameter to callback

---

## About VulpiniQ

VulpiniQ is a lightweight, modern JavaScript library inspired by jQuery but built for contemporary web development.
For more information, see the [README.md](README.md) file.

---
*This documentation was automatically generated on 2025-07-06 at 22:10:24*