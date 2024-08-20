# qLib Utility tool

Currently this version is heavily under development. Use at your own risk.

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

##### Available chainable methods in the Q object for node manipulation

|**Method**|**Type**|**Example**|**Description**|
| --- | --- | --- | --- |
|**[text()](overview/text.md)**|Content Manipulation|`Q(selector).text(string);`|Gets or sets the text content of the nodes.|
|**[html()](overview/html.md)**|Content Manipulation|`Q(selector).html(string);`|Gets or sets the innerHTML or outerHTML of the nodes.|
|**[hasClass()](overview/hasclass.md)**|Class Manipulation|`Q(selector).hasClass(className);`|Checks if the first node has a specific class.|
|**[addClass()](overview/addclass.md)**|Class Manipulation|`Q(selector).addClass(\'class1 class2\');`|Adds one or more classes to each node.|
|**[removeClass()](overview/removeclass.md)**|Class Manipulation|`Q(selector).removeClass(\'class1 class2\');`|Removes one or more classes from each node.|
|**[toggleClass()](overview/toggleclass.md)**|Class Manipulation|`Q(selector).toggleClass(className);`|Toggles a class on each node.|
|**[val()](overview/val.md)**|Form Manipulation|`Q(selector).val(value);`|Gets or sets the value of form elements in the nodes.|
|**[data()](overview/data.md)**|Data Manipulation|`Q(selector).data(key, value);`|Gets or sets data-* attributes on the nodes.|
|**[removeData()](overview/removedata.md)**|Data Manipulation|`Q(selector).removeData(key);`|Removes a data-* attribute from each node.|
|**[css()](overview/css.md)**|Style Manipulation|`Q(selector).css(property, value);`|Gets or sets CSS styles on the nodes. Can handle multiple styles if provided as an object.|
|**[attr()](overview/attr.md)**|Attribute Manipulation|`Q(selector).attr(attribute, value);`|Gets or sets an attribute on the nodes.|
|**[prop()](overview/prop.md)**|Property Manipulation|`Q(selector).prop(property, value);`|Gets or sets a property on the nodes.|
|**[removeProp()](overview/removeprop.md)**|Property Manipulation|`Q(selector).removeProp(property);`|Removes a property from each node.|
|**[trigger()](overview/trigger.md)**|Event Handling|`Q(selector).trigger(\'click\');`|Triggers a specific event on each node.|
|**[removeAttr()](overview/removeattr.md)**|Attribute Manipulation|`Q(selector).removeAttr(attribute);`|Removes an attribute from each node.|
|**[append()](overview/append.md)**|DOM Manipulation|`Q(selector).append(\'<div>Appended</div>\');`|Appends child nodes or HTML to each node.|
|**[prepend()](overview/prepend.md)**|DOM Manipulation|`Q(selector).prepend(\'<div>Prepended</div>\');`|Prepends child nodes or HTML to each node.|
|**[wrap()](overview/wrap.md)**|DOM Manipulation|`Q(selector).wrap(\'<div class="wrapper"></div>\');`|Wraps each node with the specified wrapper element.|
|**[wrapAll()](overview/wrapall.md)**|DOM Manipulation|`Q(selector).wrapAll(\'<div class="wrapper"></div>\');`|Wraps all nodes together in a single wrapper element.|
|**[unwrap()](overview/unwrap.md)**|DOM Manipulation|`Q(selector).unwrap();`|Removes the parent wrapper of each node.|
|**[remove()](overview/remove.md)**|DOM Manipulation|`Q(selector).remove();`|Removes each node from the DOM.|
|**[scrollWidth()](overview/scrollwidth.md)**|Dimensions|`Q(selector).scrollWidth();`|Returns the scroll width of the first node.|
|**[scrollHeight()](overview/scrollheight.md)**|Dimensions|`Q(selector).scrollHeight();`|Returns the scroll height of the first node.|
|**[scrollTop()](overview/scrolltop.md)**|Dimensions|`Q(selector).scrollTop(value, increment);`|Gets or sets the vertical scroll position of the first node, with an option to increment.|
|**[scrollLeft()](overview/scrollleft.md)**|Scroll Manipulation|`Q(selector).scrollLeft(value, increment);`|Gets or sets the horizontal scroll position of the first node, with an option to increment.|
|**[width()](overview/width.md)**|Dimensions|`Q(selector).width(value);`|Gets or sets the width of the first node.|
|**[height()](overview/height.md)**|Dimensions|`Q(selector).height(value);`|Gets or sets the height of the first node.|
|**[offset()](overview/offset.md)**|Dimensions|`Q(selector).offset();`|Returns the top and left offset of the first node relative to the document.|
|**[isExists()](overview/isexists.md)**|Utilities|`Q(selector).isExists();`|Checks if the first node exists in the DOM.|
|**[position()](overview/position.md)**|Dimension/Position|`Q(selector).position();`|Returns the top and left position of the first node relative to its offset parent.|
|**[toggle()](overview/toggle.md)**|Utilities|`Q(selector).toggle();`|Toggles the display of each node.|
|**[is()](overview/is.md)**|Utilities|`Q(selector).is(\':visible\');`|Checks if the first node matches a specific selector.|
|**[empty()](overview/empty.md)**|Content Manipulation|`Q(selector).empty();`|Empties the innerHTML of each node.|