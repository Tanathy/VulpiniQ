# The Q
I created Q because I kept running into the same issue: repetitive methods that took up too much space in my projects, especially when working on something smaller where size and performance really matter. jQuery, while awesome, was just too heavy for most of what I was doing, and I got tired of rewriting basic functions to keep my code lean.

So, instead of constantly reinventing the wheel, I started (reinventing an other wheel) my own utility library. Q is heavily inspired by jQuery but without the bulk—just the necessary, chainable functions which actually need. Sure, it’ll evolve as I add more static methods, but I’m committed to keeping it minimal, focusing on speed and performance, and letting go of old browser compatibility altogether.

The main goal with Q is to create something that’s as easy to pick up as jQuery, but with a more modern twist. I want Q to sit comfortably between front-end and back-end and lightweight and flexible enough to handle small projects, but still capable of playing a role in more complex SPAs without dragging in heavy libraries like React, Vue, Angular, or Svelte. The idea is to have a tool that does what you need without the bloat, and maybe, just maybe, it’ll turn into something wild like "C#JS" down the line with more complex front-end methods to simulate Windows.Forms and even containers.

## Core Features
### DOM Manipulation
Q provides a straightforward API for interacting with the DOM, covering all the basics like selecting elements, traversing the DOM tree, and modifying content, attributes, and styles.

### Event Handling
Event handling in Q is intuitive and easy to use, allowing you to attach, remove, and trigger events with minimal code.

### Animations and Effects
Q includes essential animation utilities such as fade in/out and slide up/down effects, optimized for performance to ensure smooth operation even on resource-constrained devices.

### Utilities
Q also offers utility functions that cover common development needs, such as generating unique IDs and debouncing functions, making coding faster and more efficient.

## Benefits of Using Q
### Lightweight and Fast
Q’s minimal size leads to quicker load times and improved performance, making it ideal for mobile applications and high-traffic websites.

### Modern and Modular
Embracing modern JavaScript standards, Q is compatible with the latest browser APIs and is designed to be extendable without adding unnecessary bloat.

### Simple and Intuitive API
Q’s API is easy to understand and use, making it accessible for both beginners and experienced developers.

### Extendable and Customizable
Q is built to be easily extendable, allowing you to create custom plugins that integrate seamlessly with the core library.

## Comparison with jQuery
While Q is inspired by jQuery, it distinguishes itself in several key areas:

* **Size and Performance:** Q is much smaller and more focused, resulting in faster load times and reduced memory usage compared to jQuery.
* **Feature Set:** Q provides only the essential features, avoiding the unnecessary overhead that can come with jQuery’s more extensive feature set.
* **Modern Approach:** Q leverages newer browser APIs and avoids legacy code, making it more aligned with contemporary web development practices.
* **Extensibility: ** Q’s modular design makes it easier to extend or customize without affecting the core library, offering a flexible foundation for any project.

##### Available chainable methods in the Q object for node manipulation

|**Method**|**Type**|**Example**|**Description**|
| --- | --- | --- | --- |
|**[each()](overview/each.md)**|Iteration|`Q(selector).each((index, element) => console.log(index, element));`|Iterates over all nodes in the Q object and executes a callback on each node.|
|**[text()](overview/text.md)**|Content Manipulation|`Q(selector).text(string);`|Gets or sets the text content of the nodes.|
|**[html()](overview/html.md)**|Content Manipulation|`Q(selector).html(string);`|Gets or sets the innerHTML of the nodes.|
|**[hasClass()](overview/hasclass.md)**|Class Manipulation|`Q(selector).hasClass(className);`|Checks if the first node has a specific class.|
|**[addClass()](overview/addclass.md)**|Class Manipulation|`Q(selector).addClass("class1 class2");`|Adds one or more classes to each node.|
|**[removeClass()](overview/removeclass.md)**|Class Manipulation|`Q(selector).removeClass("class1 class2");`|Removes one or more classes from each node.|
|**[toggleClass()](overview/toggleclass.md)**|Class Manipulation|`Q(selector).toggleClass(className);`|Toggles a class on each node.|
|**[val()](overview/val.md)**|Form Manipulation|`Q(selector).val(value);`|Gets or sets the value of form elements in the nodes.|
|**[data()](overview/data.md)**|Data Manipulation|`Q(selector).data(key, value);`|Gets or sets data-* attributes on the nodes.|
|**[removeData()](overview/removedata.md)**|Data Manipulation|`Q(selector).removeData(key);`|Removes a data-* attribute from each node.|
|**[css()](overview/css.md)**|Style Manipulation|`Q(selector).css(property, value);`|Gets or sets CSS styles on the nodes. Can handle multiple styles if provided as an object.|
|**[attr()](overview/attr.md)**|Attribute Manipulation|`Q(selector).attr(attribute, value);`|Gets or sets attributes on the nodes. Can handle multiple attributes if provided as an object.|
|**[prop()](overview/prop.md)**|Property Manipulation|`Q(selector).prop(property, value);`|Gets or sets a property on the nodes.|
|**[removeProp()](overview/removeprop.md)**|Property Manipulation|`Q(selector).removeProp(property);`|Removes a property from each node.|
|**[trigger()](overview/trigger.md)**|Event Handling|`Q(selector).trigger("click");`|Triggers a specific event on each node.|
|**[removeAttr()](overview/removeattr.md)**|Attribute Manipulation|`Q(selector).removeAttr(attribute);`|Removes an attribute from each node.|
|**[append()](overview/append.md)**|DOM Manipulation|`Q(selector).append("<div>Appended</div>");`|Appends child nodes or HTML to each node.|
|**[prepend()](overview/prepend.md)**|DOM Manipulation|`Q(selector).prepend("<div>Prepended</div>");`|Prepends child nodes or HTML to each node.|
|**[wrap()](overview/wrap.md)**|DOM Manipulation|`Q(selector).wrap("<div class="wrapper"></div>");`|Wraps each node with the specified wrapper element.|
|**[wrapAll()](overview/wrapall.md)**|DOM Manipulation|`Q(selector).wrapAll("<div class="wrapper"></div>");`|Wraps all nodes together in a single wrapper element.|
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
|**[size()](overview/size.md)**|Dimensions|`Q(selector).size();`|Returns the width and height of the first node.|
|**[toggle()](overview/toggle.md)**|Utilities|`Q(selector).toggle();`|Toggles the display of each node.|
|**[is()](overview/is.md)**|Utilities|`Q(selector).is(":visible");`|Checks if the first node matches a specific selector.|
|**[empty()](overview/empty.md)**|Content Manipulation|`Q(selector).empty();`|Empties the innerHTML of each node.|
|**[clone()](overview/clone.md)**|DOM Manipulation|`Q(selector).clone();`|Clones the first node.|
|**[parent()](overview/parent.md)**|Traversal|`Q(selector).parent();`|Returns the parent node of the first node.|
|**[children()](overview/children.md)**|Traversal|`Q(selector).children();`|Returns the children of the first node.|
|**[find()](overview/find.md)**|Traversal|`Q(selector).find(".child");`|Finds child nodes of the first node that match a specific selector.|
|**[closest()](overview/closest.md)**|Traversal|`Q(selector).closest(".ancestor");`|Returns the closest ancestor of the first node that matches a specific selector.|
|**[first()](overview/first.md)**|Traversal|`Q(selector).first();`|Returns the first node.|
|**[last()](overview/last.md)**|Traversal|`Q(selector).last();`|Returns the last node.|
|**[eq()](overview/eq.md)**|Traversal|`Q(selector).eq(1);`|Returns a specific node by index.|
|**[index()](overview/index.md)**|Traversal/DOM Manipulation|`Q(selector).index(index);`|Returns the index of the first node, or the index of a specific node.|
|**[show()](overview/show.md)**|Display|`Q(selector).show();`|Shows each node.|
|**[hide()](overview/hide.md)**|Display|`Q(selector).hide();`|Hides each node.|
|**[fadeIn()](overview/fadein.md)**|Display|`Q(selector).fadeIn(duration, callback);`|Fades in each node.|
|**[zIndex()](overview/zindex.md)**|Display|`Q(selector).zIndex(value);`|Gets or sets the z-index of the first node.|
|**[fadeOut()](overview/fadeout.md)**|Display|`Q(selector).fadeOut(duration, callback);`|Fades out each node.|
|**[fadeToggle()](overview/fadetoggle.md)**|Display|`Q(selector).fadeToggle(duration, callback);`|Toggles the fade state of each node.|
|**[fadeTo()](overview/fadeto.md)**|Display|`Q(selector).fadeTo(opacity, duration, callback);`|Fades each node to a specific opacity.|
|**[animate()](overview/animate.md)**|Display|`Q(selector).animate(duration, { opacity: 0, left: "50px" }, callback);`|Animates each node with specific CSS properties.|
|**[removeTransition()](overview/removetransition.md)**|Display|`Q(selector).removeTransition();`|Removes the transition from each node.|
|**[on()](overview/on.md)**|Event Handling|`Q(selector).on("click", () => console.log("Clicked"));`|Adds an event listener to each node.|
|**[off()](overview/off.md)**|Event Handling|`Q(selector).off("click", handler);`|Removes an event listener from each node.|
|**[click()](overview/click.md)**|Event Handling|`Q(selector).click();`|Triggers a click event on each node.|
|**[focus()](overview/focus.md)**|Form Manipulation|`Q(selector).focus();`|Focuses on the first node.|
|**[blur()](overview/blur.md)**|Form Manipulation|`Q(selector).blur();`|Blurs the first node.|
