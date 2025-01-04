# VulpiniQ

This library is getting robust. Actually it's on development phase, use it carefully.

I created VulpiniQ because I kept running into the same issue: repetitive methods that took up too much space in my projects, especially when working on something smaller where size and performance really matter. jQuery, while awesome, was just too heavy for most of what I was doing, and I got tired of rewriting basic functions to keep my code lean.

So, instead of constantly reinventing the wheel, I started (reinventing an other wheel) my own utility library. VulpiniQ is heavily inspired by jQuery but without the bulk—just the necessary, chainable functions which actually need. Sure, it’ll evolve as I add more static methods, but I’m committed to keeping it minimal, focusing on speed and performance, and letting go of old browser compatibility altogether.

The main goal with VulpiniQ is to create something that’s as easy to pick up as jQuery, but with a more modern twist. I want VulpiniQ to sit comfortably between front-end and back-end and lightweight and flexible enough to handle small projects, but still capable of playing a role in more complex SPAs without dragging in heavy libraries like React, Vue, Angular, or Svelte. The idea is to have a tool that does what you need without the bloat, and maybe, just maybe, it’ll turn into something wild like "C#JS" down the line with more complex front-end methods to simulate Windows.Forms and even containers.

## Core Features
### DOM Manipulation
Q provides a straightforward API for interacting with the DOM, covering all the basics like selecting elements, traversing the DOM tree, and modifying content, attributes, and styles.

### Event Handling
Event handling in VulpiniQ is intuitive and easy to use, allowing you to attach, remove, and trigger events with minimal code.

### Animations and Effects
Q includes essential animation utilities such as fade in/out and slide up/down effects, optimized for performance to ensure smooth operation even on resource-constrained devices.

### Utilities
Q also offers utility functions that cover common development needs, such as generating unique IDs and debouncing functions, making coding faster and more efficient.

## Benefits of Using Q
### Lightweight and Fast
Q’s minimal size leads to quicker load times and improved performance, making it ideal for mobile applications and high-traffic websites.

### Modern and Modular
Embracing modern JavaScript standards, VulpiniQ is compatible with the latest browser APIs and is designed to be extendable without adding unnecessary bloat.

### Simple and Intuitive API
Q’s API is easy to understand and use, making it accessible for both beginners and experienced developers.

### Extendable and Customizable
Q is built to be easily extendable, allowing you to create custom plugins that integrate seamlessly with the core library.

## Comparison with jQuery
While VulpiniQ is inspired by jQuery, it distinguishes itself in several key areas:

* **Size and Performance:** VulpiniQ is much smaller and more focused, resulting in faster load times and reduced memory usage compared to jQuery.
* **Feature Set:** VulpiniQ provides only the essential features, avoiding the unnecessary overhead that can come with jQuery’s more extensive feature set.
* **Modern Approach:** VulpiniQ leverages newer browser APIs and avoids legacy code, making it more aligned with contemporary web development practices.
* **Extensibility: ** VulpiniQ’s modular design makes it easier to extend or customize without affecting the core library, offering a flexible foundation for any project.

##### Available chainable methods in the Q object for node manipulation

|**Name**|**Method**|**Type**|**Example**|**Description**|
|
| AvgColor | Utility | Image Processing | Q.AvgColor('image.jpg or canvas', sampleSize, callback); // Returns the average color of the image or canvas | Calculates the average color of an image by creating a canvas element, drawing the image on it, and analyzing the pixel data to determine the average color. <br> This technique is useful for generating color palettes, creating visual effects, or enhancing user interface elements based on the predominant colors in an image. |
| ColorBrightness | Utility | Color | Q.ColorBrightness('#000000', 50); // #7f7f7f (black +50%) <br> Q.ColorBrightness('rgb(255, 0, 0)', -30); // rgb(178, 0, 0) (red -30%) <br> Q.ColorBrightness('rgba(0, 0, 255, 0.5)', 20); // rgba(51, 51, 255, 0.5) (blue +20%) | Adjusts the brightness of a given color by a specified percentage, making the color lighter or darker. <br> This function can be used to dynamically change colors for various UI elements, providing visual feedback or creating color schemes with different shades. <br> It supports both hexadecimal and RGB/RGBA color formats, making it flexible for different use cases in web design or graphics. |
| Container | Plugin | Plugin | var containers = Q.Container(); | Useful to create tabbed containers. |
| Cookie | Plugin | Plugin | Q.Cookie('key', 'value to store'); Q.Cookie('key'); // returns 'value to store' | Provides methods to store and retrieve data from the browser cookies. |
| Debounce | Utility | Event Handling | Q.Debounce('myFunction', 500, myFunction); // Calls myFunction after 500ms of inactivity <br> Q.Debounce('resizeEvent', 300, handleResize); // Debounces resize handling function | Debounces a function to ensure it is only called after a specified delay since the last invocation, effectively preventing multiple calls in rapid succession. <br> This technique is particularly useful in scenarios like resizing windows, scrolling, or typing events, where multiple triggers can lead to performance issues or unintended behavior. <br> By controlling the rate at which a function can fire, developers can optimize performance and enhance user experience. |
| Done | Static | Event Handling | Q.Done(() => { console.log('Window has fully loaded'); }); // Registers a callback to log a message once the window is loaded <br> Q.Done(() => { alert('Page is ready!'); }); // Adds another callback to show an alert when the window has fully loaded | Registers one or more callback functions to be executed once the window has completely loaded, ensuring that all resources are available. <br> Useful for executing scripts that depend on the DOM, images, or other resources being fully loaded. <br> This function allows for multiple callbacks to be registered, which will all be executed in the order they were added when the load event occurs. |
| Fetch | Plugin | Plugin | Q.fetch('https://api.example.com/data', (error, data) => console.log(error, data)); | Fetches data from a URL and returns it to a callback function. Supports retries, timeouts, and custom response validation. |
| Form | Plugin | Plugin | var containers = Q.Form() | Form is a simple library for creating forms and windows in the browser. It provides a set of methods for creating form elements, windows, and other UI components. |
| HSL2RGB | Utility | Color | Q.HSL2RGB(0, 0, 1); // [255, 255, 255] <br> Q.HSL2RGB(0, 1, 0.5); // [255, 0, 0] <br> Q.HSL2RGB(0.33, 1, 0.5); // [0, 255, 0] | Converts HSL (Hue, Saturation, Lightness) color values to RGB (Red, Green, Blue) format. <br> This function is essential for applications that require color transformations, allowing developers to switch between different color representations easily. <br> Understanding color models is key in design, and this utility helps bridge the gap between HSL, which is often more intuitive for humans, and RGB, which is commonly used in digital displays. |
| ID | Utility | Utility | Q.ID(8, 'user-'); // user-1a2b3c4d <br> Q.ID(); // 1a2b3c4d <br> Q.ID(12, 'session-'); // session-1a2b3c4d5e6f | It's useful for creating unique identifiers for users, sessions, or any items requiring distinct identification. <br> The ID is generated using random hexadecimal digits (0-9 and a-f) and can be customized with a prefix for better context or categorization. |
| Icons | Plugin | Plugin | Q.Icons(); | Additional icons for the VulpiniQ library. |
| Image | Plugin | Plugin | var image = Q.Image(); | Useful to manipulate images. |
| ImageViewer | Plugin | Plugin | Q.ImageViewer().selector('.image').open(['image1.jpg', 'image2.jpg']); | A simple image viewer plugin |
| JSON | Plugin | Plugin | var json = Q.JSON({ key: 'value' }); json.Parse({ modify: true, recursive: true }, (key, value) => value + ' modified'); | Provides methods to parse, deflate, and inflate, modify JSON objects. |
| Leaving | Static | Event Handling | Q.Leaving((event) => { console.log('Window is about to be unloaded'); }); // Logs a message when the window is about to unload <br> Q.Leaving((event) => { event.returnValue = 'Are you sure you want to leave?'; }); // Prompts the user with a confirmation message before leaving | Registers callbacks to be executed when the window is about to be unloaded, providing a chance to run cleanup tasks or warn the user about unsaved changes. <br> This can be useful for saving state, logging actions, or preventing accidental navigation away from the page. <br> Multiple callbacks can be registered, and they will be executed in the order they were added whenever the beforeunload event is triggered. |
| NodeBlock | Plugin | Plugin | var uml = Q.NodeBlock('#canvas', 800, 600); // Create a new UML canvas | A plugin for creating UML blocks and connections. |
| RGB2HSL | Utility | Color | Q.RGB2HSL(255, 255, 255); // [0, 0, 1] <br> Q.RGB2HSL(0, 0, 0); // [0, 0, 0] <br> Q.RGB2HSL(255, 0, 0); // [0, 1, 0.5] | Converts RGB color values to HSL format, providing a different way to represent colors that can be more intuitive for artists and designers. <br> HSL stands for Hue, Saturation, and Lightness, making it easier to manipulate colors based on human perception. <br> This conversion is essential for applications requiring color manipulation, such as image editing or web design, where understanding color relationships is crucial. |
| Ready | Static | Event Handling | Q.Ready(() => { console.log('DOM is ready'); }); // Executes a callback when the DOM is fully loaded <br> Q.Ready(() => { document.body.style.backgroundColor = 'lightblue'; }); // Changes the background color once the DOM is ready | Registers callbacks to be executed once the DOM is fully loaded and parsed, ensuring your scripts can safely interact with the document's structure. <br> Ideal for initializing features, manipulating elements, or setting up event listeners without waiting for the entire page (images, styles) to load. <br> Multiple callbacks can be added, and they will be executed in sequence when the DOMContentLoaded event fires, or immediately if the DOM is already ready. |
| Resize | Static | Event Handling | Q.Resize((width, height) => { console.log(`Width: ${width}, Height: ${height}`); }); // Logs the new dimensions every time the window is resized <br> Q.Resize((width, height) => { document.body.style.fontSize = `${width / 100}px`; }); // Adjusts font size based on the window's width | Registers callbacks to be executed whenever the window is resized, providing the updated width and height. <br> This is useful for dynamic layouts, responsive design adjustments, or recalculating dimensions based on the window size. <br> Each registered callback will receive the current window width and height, and multiple callbacks can be added to handle different aspects of resizing. |
| Socket | Plugin | Plugin | var socket = Q.Socket('ws://localhost:8080', console.log, console.log); | Provides a WebSocket implementation with automatic reconnection and status callbacks. |
| Storage | Plugin | Plugin | Q.Storage('key', 'value to store'); Q.Storage('key'); // returns 'value to store' | Provides methods to store and retrieve data from the local storage. |
| String | Plugin | Plugin | Q.String('hello').capitalize(); // returns 'Hello' | Provides methods to manipulate strings. |
| Style | Plugin | Plugin | Q.style(':root { --color: red; } body { background-color: var(--color); }'); | Provides methods to apply global styles to the document. It's useful for applying CSS variables from JavaScript. Q.style will be removed after the styles are applied on the document ready event. |
| Task | Plugin | Plugin | var task = Q.Task('task1', () => console.log('Task 1'), () => console.log('Task 2')); task.Run(); | Provides methods to run tasks asynchronously and handle their completion or failure. Basically a Promise wrapper, but with more control. |
| Timer | Plugin | Plugin | Q.Timer(() => console.log('Tick'), 'timer1', { tick: 5, delay: 1000, interrupt: true }); | Provides a timer implementation with automatic stop and interrupt. Useful for running tasks at intervals or for a specific duration. |
| addClass | Prototype | Class Manipulation | Q(selector).addClass("class1"); // Adds a single class <br> Q(selector).addClass("class1 class2"); // Adds multiple classes | Adds one or more classes to each node, ignoring duplicates. |
| animate | Prototype | Animation | Q(selector).animate(500, { opacity: 0 }, () => { console.log('Fade out complete'); }); // Fades out over 500ms <br> Q(selector).animate(1000, { left: "100px", top: "50px" }); // Moves to new position in 1 second <br> Q(selector).animate(700, { opacity: 1, backgroundColor: "#ff0000" }, () => { alert('Animation finished!'); }); // Changes opacity and background color | Animates each node using specified CSS properties over a given duration, with an optional callback when complete. |
| append | Prototype | DOM Manipulation | Q(selector).append("<p>New paragraph</p>"); // Adds a paragraph as HTML <br> Q(selector).append(document.createElement("div")); // Adds a div element <br> Q(selector).append(Q(otherSelector)); // Appends a Q object <br> Q(selector).append([document.createElement("span"), document.createElement("img")]); // Appends multiple elements <br> Q(selector).append(document.querySelectorAll(".items")); // Appends a NodeList of elements | Appends child nodes, HTML, or multiple elements to each node. |
| attr | Prototype | Attribute Manipulation | Q(selector).attr("id", "newId"); // Sets the "id" attribute to "newId" <br> Q(selector).attr({ "src": "image.jpg", "alt": "An image" }); // Sets multiple attributes <br> Q(selector).attr("href"); // Gets the "href" attribute value | Gets or sets attributes on the nodes, supporting multiple attributes at once. |
| bind | Prototype | Event Handling | Q(selector).bind("click", () => console.log("Clicked")); // Logs "Clicked" when any matching node is clicked <br> Q(".btn").bind("mouseover", (e) => { console.log(`Hovered over: ${e.target.tagName}`); }); // Logs the tag name of the hovered element <br> Q("ul").bind("click", (e) => { console.log(`Item clicked: ${e.target.textContent}`); }); // Logs the text of the clicked list item | Adds an event listener to each node, allowing for event delegation to improve performance. |
| blur | Prototype | Form Manipulation | Q(selector).blur(); // Removes focus from the first matched input field <br> Q(".active").blur(); // Blurs the first active element <br> Q("textarea").blur(); // Blurs the first textarea in the selection | Removes focus from the first node in the selection, effectively blurring it. |
| children | Prototype | Traversal | Q(selector).children(); // Returns all child nodes of the first matched element <br> Q("#parent").children(); // Gets all children of the element with id 'parent' <br> Q("ul").children(); // Retrieves all child nodes of the first unordered list | Retrieves the direct child nodes of the first node in the selection. |
| click | Prototype | Event Handling | Q(selector).click(); // Triggers a click event on all matched elements <br> Q(".button").click(); // Simulates clicks on all elements with the class 'button' <br> Q("a").click(); // Automatically clicks the first anchor element in the selection | Simulates a click event on each node in the selection. |
| clone | Prototype | DOM Manipulation | Q(selector).clone(); // Clones the first matched element <br> const newElement = Q(".item").clone(); // Clones the first element with the class 'item' and stores it in newElement <br> const clonedDiv = Q("#myDiv").clone(); // Clones the element with the ID 'myDiv' | Creates a deep copy of the first node in the selection, including its child nodes. |
| closest | Prototype | Traversal | Q(selector).closest(".parent"); // Returns the closest parent with class 'parent' <br> const closestSection = Q(".child").closest("section"); // Finds the closest section ancestor of the first element with the class 'child' <br> const closestForm = Q("#inputField").closest("form"); // Gets the nearest form ancestor of the element with ID 'inputField' | Finds the nearest ancestor node of the first node that matches a given selector. |
| css | Prototype | Style Manipulation | Q(selector).css('color', 'red'); // Sets the text color of the first selected element to red <br> const backgroundColor = Q(selector).css('background-color'); // Gets the background color of the first selected element <br> Q(selector).css({ margin: '10px', padding: '5px' }); // Sets multiple styles on each selected element | Retrieves or sets CSS styles on the selected nodes. Supports setting multiple styles if provided as an object. |
| data | Prototype | Data Manipulation | Q(selector).data('userId', 123); // Sets the data-userId attribute to 123 on each selected element <br> const userId = Q(selector).data('userId'); // Retrieves the value of the data-userId attribute from the first selected element <br> const isActive = Q(selector).data('isActive'); // Retrieves the value of the data-isActive attribute, returns null if not set | Retrieves or sets data-* attributes on the selected nodes. Provides an easy way to store and access custom data associated with the elements. |
| each | Prototype | Iteration | Q(selector).each((index, element) => console.log(index, element)); // Logs the index and element for each node in the selection <br> Q(selector).each((index, element) => element.style.color = 'red'); // Changes the text color to red for each selected element | Iterates over all nodes in the Q object and executes a callback on each node, providing access to the index and element. |
| empty | Prototype | Content Manipulation | Q(selector).empty(); | Empties the innerHTML of each node. |
| eq | Prototype | Traversal | Q(selector).eq(1); | Returns a specific node by index. |
| fadeIn | Prototype | Display | Q(selector).fadeIn(duration, callback); | Fades in each node. |
| fadeOut | Prototype | Display | Q(selector).fadeOut(duration, callback); | Fades out each node. |
| fadeTo | Prototype | Display | Q(selector).fadeTo(opacity, duration, callback); | Fades each node to a specific opacity. |
| fadeToggle | Prototype | Display | Q(selector).fadeToggle(duration, callback); | Toggles the fade state of each node. |
| find | Prototype | Traversal | Q(selector).find(".child"); | Finds child nodes of the first node that match a specific selector. |
| first | Prototype | Traversal | Q(selector).first(); | Returns the first node. |
| focus | Prototype | Form Manipulation | Q(selector).focus(); | Focuses on the first node. |
| hasClass | Prototype | Class Manipulation | Q(selector).hasClass(className); | Checks if the first node has a specific class. |
| height | Prototype | Dimensions | Q(selector).height(value); | Gets or sets the height of the first node. |
| hide | Prototype | Display | Q(selector).hide(duration, callback); | Hides each node, optionally with a fade-out effect over a specified duration. |
| html | Prototype | Content Manipulation | const currentHtml = Q(selector).html(); // Retrieves the innerHTML of the first selected element <br> Q(selector).html('<div>New Content</div>'); // Sets the innerHTML of each selected element to '<div>New Content</div>' <br> Q(selector).html(['<span>First</span>', '<span>Second</span>']); // Sets the innerHTML with an array of strings <br> const newNode = Q('<p>Paragraph</p>'); Q(selector).html(newNode); // Sets the innerHTML with a Q object containing a new node <br> Q(selector).html(document.createElement('div')); // Sets the innerHTML with a new HTMLElement <br> const nodeList = document.querySelectorAll('.child'); Q(selector).html(nodeList); // Sets the innerHTML with a NodeList of child elements <br> Q(selector).html([]); // Sets the innerHTML to an empty string <br> Q(selector).html(null); // Sets the innerHTML to an empty string | Gets or sets the innerHTML of the nodes. This method allows for easy manipulation of the content inside the selected elements. |
| id | Prototype | Attributes | const currentId = Q(selector).id(); // Retrieves the current id of the first selected element <br> Q(selector).id('new-id'); // Sets the id of the first selected element to 'new-id' | Gets or sets the id attribute of the first node. This provides a simple way to retrieve or modify the unique identifier of an element. |
| index | Prototype | Traversal | const idx = Q(selector).index(); // Retrieves the index of the first selected node among its siblings <br> Q(selector).index(2); // Moves the first selected node to the index position 2 within its parent | Returns the index of the first node, or moves the node to a specific index within its parent. |
| inside | Prototype | Traversal | Q(selector).inside(".parent"); // Returns true if the first selected element is within a parent matching the selector <br> const isChild = Q(selector).inside("#container"); // Checks if the first node is inside the element with ID "container" | Checks if the first node is inside another node, determined by a specific selector. |
| is | Prototype | Utilities | Q(selector).is(":visible"); // Checks if the element is currently visible <br> Q(selector).is(":checked"); // Checks if a checkbox or radio button is checked <br> Q(selector).is(anotherElement); // Compares the first node with another DOM element <br> Q(selector).is(":hover"); // Checks if the element is currently being hovered over | Checks if the first node matches a specific selector or condition, allowing for dynamic queries and element comparisons. |
| isDarkColor | Utility | Color | Q.isDarkColor('#000000'); // true <br> Q.isDarkColor('#ffffff'); // false <br> Q.isDarkColor('#4c4c4c', 30, 90); // true | Determines if a color is dark or light based on the HSP (Hue, Saturation, Perceived brightness) model. <br> This utility helps in designing user interfaces by ensuring adequate contrast between text and background colors, enhancing readability and accessibility. <br> Users can adjust the margin and threshold parameters to fine-tune sensitivity according to their design needs. |
| isExists | Prototype | Utilities | Q(selector).isExists(); or Q.isExists('.ok') | Checks if the first node exists in the DOM. |
| last | Prototype | Traversal | Q(selector).last(); | Returns the last node. |
| map | Prototype | Array | Q(selector).map(el => el.innerHTML); | Maps each node to a new array. |
| off | Prototype | Event Handling | Q(selector).off("click", handler); | Removes an event listener from each node. |
| offset | Prototype | Dimensions | Q(selector).offset(); | Returns the top and left offset of the first node relative to the document. |
| on | Prototype | Event Handling | Q(selector).on("click", () => console.log("Clicked")); | Adds an event listener to each node. |
| parent | Prototype | Traversal | Q(selector).parent(); | Returns the parent node of the first node. |
| position | Prototype | Dimension/Position | Q(selector).position(); | Returns the top and left position of the first node relative to its offset parent. |
| prepend | Prototype | DOM Manipulation | Q(selector).prepend("<div>Prepended</div>"); | Prepends child nodes or HTML to each node. |
| prop | Prototype | Property Manipulation | Q(selector).prop(property, value); | Gets or sets a property on the nodes. |
| remove | Prototype | DOM Manipulation | Q(selector).remove(); | Removes each node from the DOM. |
| removeAttr | Prototype | Attribute Manipulation | Q(selector).removeAttr(attribute); | Removes an attribute from each node. |
| removeClass | Prototype | Class Manipulation | Q(selector).removeClass("class1 class2"); | Removes one or more classes from each node. |
| removeData | Prototype | Data Manipulation | Q(selector).removeData(key); | Removes a data-* attribute from each node. |
| removeProp | Prototype | Property Manipulation | Q(selector).removeProp(property); | Removes a property from each node. |
| removeTransition | Prototype | Display | Q(selector).removeTransition(); | Removes the transition from each node. |
| scrollHeight | Prototype | Scroll Manipulation | Q(selector).scrollHeight(); | Returns the scroll height of the first node. |
| scrollLeft | Prototype | Scroll Manipulation | Q(selector).scrollLeft(value, increment); | Gets or sets the horizontal scroll position of the first node, with an option to increment. |
| scrollTop | Prototype | Scroll Manipulation | Q(selector).scrollTop(value, increment); | Gets or sets the vertical scroll position of the first node, with an option to increment. |
| scrollWidth | Prototype | Dimensions | Q(selector).scrollWidth(); | Returns the scroll width of the first node. |
| show | Prototype | Display | Q(selector).show(duration, callback); | Shows each node, optionally with a fade-in effect over a specified duration. |
| size | Prototype | Dimensions | Q(selector).size(); | Returns the width and height of the first node. |
| text | Prototype | Content Manipulation | Q(selector).text(string); | Gets or sets the text content of the nodes. |
| toggle | Prototype | Utilities | Q(selector).toggle(); | Toggles the display of each node. |
| toggleClass | Prototype | Class Manipulation | Q(selector).toggleClass(className); | Toggles a class on each node. |
| trigger | Prototype | Event Handling | Q(selector).trigger("click"); | Triggers a specific event on each node. |
| unwrap | Prototype | DOM Manipulation | Q(selector).unwrap(); | Removes the parent wrapper of each node. |
| val | Prototype | Form Manipulation | Q(selector).val(value); | Gets or sets the value of form elements in the nodes. |
| wait | Prototype | Utility | Q('.text').wait(1000).text('Hello, World!'); | Returns a promise that resolves after a given time. Useful for delaying actions. |
| walk | Prototype | Iteration | Q(selector).walk((node) => console.log(node), true); // Passes Q object | Walks through all nodes in the Q object and executes a callback on each node, passing the current node as a Q object or raw element based on the boolean parameter. |
| width | Prototype | Dimensions | Q(selector).width(value); | Gets or sets the width of the first node. |
| wrap | Prototype | DOM Manipulation | Q(selector).wrap("<div class='wrapper'></div>"); | Wraps each node with the specified wrapper element. |
| wrapAll | Prototype | DOM Manipulation | Q(selector).wrapAll("<div class='wrapper'></div>"); | Wraps all nodes together in a single wrapper element. |
| zIndex | Prototype | Display | Q(selector).zIndex(value); | Gets or sets the z-index of the first node. || --- | --- | --- | --- |
