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
* **Extensibility:** VulpiniQ’s modular design makes it easier to extend or customize without affecting the core library, offering a flexible foundation for any project.

## Available chainable methods in the Q object for node manipulation
| **Name** | **Method** | **Type** | **Description** |
|----------|------------|----------|-----------------|
| AvgColor | Utility | Image Processing | Calculates the average color of an image by creating a canvas element, drawing the image on it, and analyzing the pixel data to determine the average color\. <br> This technique is useful for generating color palettes, creating visual effects, or enhancing user interface elements based on the predominant colors in an image\. |
| ColorBrightness | Utility | Color | Adjusts the brightness of a given color by a specified percentage, making the color lighter or darker\. <br> This function can be used to dynamically change colors for various UI elements, providing visual feedback or creating color schemes with different shades\. <br> It supports both hexadecimal and RGB/RGBA color formats, making it flexible for different use cases in web design or graphics\. |
| Container | Plugin | Plugin | Useful to create containers for your elements, like tabs, accordions, etc\. |
| Container\.Tab | Component | Component | Tab component for Container plugin |
| Cookie | Plugin | Plugin | Provides methods to store and retrieve data from the browser cookies\. |
| Debounce | Utility | Event Handling | Debounces a function to ensure it is only called after a specified delay since the last invocation, effectively preventing multiple calls in rapid succession\. <br> This technique is particularly useful in scenarios like resizing windows, scrolling, or typing events, where multiple triggers can lead to performance issues or unintended behavior\. <br> By controlling the rate at which a function can fire, developers can optimize performance and enhance user experience\. |
| Done | Static | Event Handling | Registers one or more callback functions to be executed once the window has completely loaded\. |
| Fetch | Plugin | Plugin | Fetches data from a URL and returns it to a callback function\. Supports retries, timeouts, and custom response validation\. |
| Form | Plugin | Plugin | Form is a simple library for creating forms and windows in the browser\. It provides a set of methods for creating form elements, windows, and other UI components\. |
| Form\.Button | Component | Component | Button component for Form plugin |
| Form\.CheckBox | Component | Component | CheckBox component for Form plugin |
| Form\.Tag | Component | Component | Tag component for Form plugin |
| Form\.TextArea | Component | Component | TextArea component for Form plugin |
| Form\.TextBox | Component | Component | TextBox component for Form plugin |
| HSL2RGB | Utility | Color | Converts HSL \(Hue, Saturation, Lightness\) color values to RGB \(Red, Green, Blue\) format\. <br> This function is essential for applications that require color transformations, allowing developers to switch between different color representations easily\. <br> Understanding color models is key in design, and this utility helps bridge the gap between HSL, which is often more intuitive for humans, and RGB, which is commonly used in digital displays\. |
| ID | Utility | Utility | It's useful for creating unique identifiers for users, sessions, or any items requiring distinct identification\. <br> The ID is generated using random hexadecimal digits \(0\-9 and a\-f\) and can be customized with a prefix for better context or categorization\. |
| Icons | Plugin | Plugin | Additional icons for the VulpiniQ library\. |
| Image | Plugin | Component | Useful to manipulate images\. |
| Image\.Blur | Plugin | Component | Apply standard blur to images\. |
| Image\.Brightness | Plugin | Component | Adjust image brightness\. |
| Image\.CRT | Plugin | Component | Apply CRT \(old TV\) and VHS effects to an image\. |
| Image\.ComicEffect | Plugin | Component | Apply a comic book style effect to an image\. |
| Image\.Contrast | Plugin | Component | Adjust image contrast\. |
| Image\.Crop | Plugin | Component | Crop image to specified dimensions\. |
| Image\.Emboss | Plugin | Component | Apply embossing effect to images\. |
| Image\.Flip | Plugin | Component | Flip image horizontally or vertically\. |
| Image\.GaussianBlur | Plugin | Component | Apply high\-quality Gaussian blur to images\. |
| Image\.Glow | Plugin | Component | Apply a glow effect to an image\. |
| Image\.Grayscale | Plugin | Component | Convert image to grayscale\. |
| Image\.HDR | Plugin | Component | Apply an HDR\-like effect to an image\. |
| Image\.Halftone | Plugin | Component | Apply a halftone effect to an image\. |
| Image\.Hue | Plugin | Component | Adjust image hue\. |
| Image\.LensFlareAnamorphic | Plugin | Component | Apply horizontal anamorphic lens flare effect to bright spots in an image\. |
| Image\.Noise | Plugin | Component | Apply random noise to an image\. |
| Image\.NoiseSmooth | Plugin | Component | Apply smoothing effect with noise to an image\. |
| Image\.Pixelize | Plugin | Component | Apply a pixelation effect to an image\. |
| Image\.RGBSubpixel | Plugin | Component | Apply RGB subpixel emulation effect to an image\. |
| Image\.Resize | Plugin | Component | Image resizing operations\. |
| Image\.Rotate | Plugin | Component | Rotate image by specified degrees\. |
| Image\.Sharpen | Plugin | Component | Apply smart sharpening to images\. |
| Image\.Vivid | Plugin | Component | Adjust image vividness/saturation\. |
| Image\.Zoom | Plugin | Component | Zoom in or out of an image\. |
| ImageViewer | Plugin | Plugin | A simple image viewer plugin |
| JSON | Plugin | Plugin | Provides methods to parse, deflate, inflate, merge, sort, and flatten JSON objects\. |
| Leaving | Static | Event Handling | Registers callbacks to be executed when the window is about to be unloaded\. |
| NodeBlock | Plugin | Plugin | A plugin for creating UML blocks and connections\. |
| RGB2HSL | Utility | Color | Converts RGB color values to HSL format, providing a different way to represent colors that can be more intuitive for artists and designers\. <br> HSL stands for Hue, Saturation, and Lightness, making it easier to manipulate colors based on human perception\. <br> This conversion is essential for applications requiring color manipulation, such as image editing or web design, where understanding color relationships is crucial\. |
| Ready | Static | Event Handling | Registers callbacks to be executed once the DOM is fully loaded and parsed\. |
| Resize | Static | Event Handling | Registers callbacks to be executed whenever the window is resized, providing the updated width and height\. |
| Socket | Plugin | Plugin | Provides a WebSocket implementation with automatic reconnection and status callbacks\. |
| String | Plugin | Plugin | Provides methods to manipulate strings\. |
| Thread | Plugin | Plugin | Thread is a utility for managing Web Workers in a thread pool\. It allows developers to execute functions in parallel, offloading heavy tasks to separate threads and improving performance\. <br> Thread provides a simple interface for creating, managing, and controlling worker threads, enabling developers to execute multiple tasks concurrently without blocking the main thread\. <br> By distributing workloads across multiple threads, developers can optimize performance and enhance user experience\. |
| Timer | Plugin | Plugin | Provides a timer implementation with automatic stop and interrupt\. Useful for running tasks at intervals or for a specific duration\. |
| addClass | Prototype | Class Manipulation | Adds one or more classes to each node, ignoring duplicates\. |
| animate | Prototype | Animation | Animates each node using specified CSS properties over a given duration, with an optional callback when complete\. |
| append | Prototype | DOM Manipulation | Appends child nodes, HTML, or multiple elements to each node\. |
| attr | Prototype | Attribute Manipulation | Gets or sets attributes on the nodes, supporting multiple attributes at once\. |
| bind | Prototype | Event Handling | Adds an event listener to each node, allowing for event delegation to improve performance\. |
| blur | Prototype | Form Manipulation | Removes focus from the first node in the selection, effectively blurring it\. |
| click | Prototype | Event Handling | Simulates a click event on each node in the selection\. |
| clone | Prototype | DOM Manipulation | Creates a deep copy of the first node in the selection, including its child nodes\. |
| closest | Prototype | Traversal | Finds the nearest ancestor node of the first node that matches a given selector\. |
| css | Prototype | Style Manipulation | Retrieves or sets CSS styles on the selected nodes\. Supports setting multiple styles if provided as an object\. |
| data | Prototype | Data Manipulation | Retrieves or sets data\-\* attributes on the selected nodes\. Provides an easy way to store and access custom data associated with the elements\. |
| each | Prototype | Iteration | Iterates over all nodes in the Q object and executes a callback on each node, providing access to the index and element\. |
| empty | Prototype | Content Manipulation | Empties the innerHTML of each node\. |
| eq | Prototype | Traversal | Returns a specific node by index\. |
| fadeIn | Prototype | Display | Fades in each node\. |
| fadeOut | Prototype | Display | Fades out each node\. |
| fadeTo | Prototype | Display | Fades each node to a specific opacity\. |
| fadeToggle | Prototype | Display | Toggles the fade state of each node\. |
| find | Prototype | Traversal | Finds child nodes of the first node that match a specific selector\. |
| first | Prototype | Traversal | Returns the first node\. |
| focus | Prototype | Form Manipulation | Focuses on the first node\. |
| hasClass | Prototype | Class Manipulation | Checks if the first node has a specific class\. |
| height | Prototype | Dimensions | Gets or sets the height of the first node\. |
| hide | Prototype | Display | Hides each node, optionally with a fade\-out effect over a specified duration\. |
| html | Prototype | Content Manipulation | Gets or sets the innerHTML of the nodes\. This method allows for easy manipulation of the content inside the selected elements\. |
| id | Prototype | Attributes | Gets or sets the id attribute of the first node\. |
| index | Prototype | Traversal | Returns the index of the first node, or moves the node to a specific index within its parent\. |
| inside | Prototype | Traversal | Checks if the first node is inside another node, determined by a specific selector\. |
| is | Prototype | Utilities | Checks if the first node matches a specific selector or condition, allowing for dynamic queries and element comparisons\. |
| isDarkColor | Utility | Color | Determines if a color is dark or light based on the HSP \(Hue, Saturation, Perceived brightness\) model\. <br> This utility helps in designing user interfaces by ensuring adequate contrast between text and background colors, enhancing readability and accessibility\. <br> Users can adjust the margin and threshold parameters to fine\-tune sensitivity according to their design needs\. |
| isExists | Prototype | Utilities | Checks if the first node exists in the DOM\. |
| last | Prototype | Traversal | Returns the last node\. |
| map | Prototype | Array | Maps each node to a new array\. |
| off | Prototype | Event Handling | Removes an event listener from each node\. |
| offset | Prototype | Dimensions | Returns the top and left offset of the first node relative to the document\. |
| on | Prototype | Event Handling | Adds an event listener to each node\. |
| parent | Prototype | Traversal | Returns the parent node of the first node\. |
| position | Prototype | Dimension/Position | Returns the top and left position of the first node relative to its offset parent\. |
| prepend | Prototype | DOM Manipulation | Prepends child nodes or HTML to each node\. |
| prop | Prototype | Property Manipulation | Gets or sets a property on the nodes\. |
| remove | Prototype | DOM Manipulation | Removes each node from the DOM\. |
| removeAttr | Prototype | Attribute Manipulation | Removes an attribute from each node\. |
| removeClass | Prototype | Class Manipulation | Removes one or more classes from each node\. |
| removeData | Prototype | Data Manipulation | Removes a data\-\* attribute from each node\. |
| removeProp | Prototype | Property Manipulation | Removes a property from each node\. |
| removeTransition | Prototype | Display | Removes the transition from each node\. |
| scrollHeight | Prototype | Scroll Manipulation | Returns the scroll height of the first node\. |
| scrollLeft | Prototype | Scroll Manipulation | Gets or sets the horizontal scroll position of the first node, with an option to increment\. |
| scrollTop | Prototype | Scroll Manipulation | Gets or sets the vertical scroll position of the first node, with an option to increment\. |
| scrollWidth | Prototype | Dimensions | Returns the scroll width of the first node\. |
| show | Prototype | Display | Shows each node, optionally with a fade\-in effect over a specified duration\. |
| size | Prototype | Dimensions | Returns the width and height of the first node\. |
| text | Prototype | Content Manipulation | Gets or sets the text content of the nodes\. |
| toggle | Prototype | Utilities | Toggles the display of each node\. |
| toggleClass | Prototype | Class Manipulation | Toggles a class on each node\. |
| trigger | Prototype | Event Handling | Triggers a specific event on each node\. |
| unwrap | Prototype | DOM Manipulation | Removes the parent wrapper of each node\. |
| val | Prototype | Form Manipulation | Gets or sets the value of form elements in the nodes\. |
| wait | Prototype | Utility | Returns a promise that resolves after a given time\. Useful for delaying actions\. |
| walk | Prototype | Iteration | Walks through all nodes in the Q object and executes a callback on each node, passing the current node as a Q object or raw element based on the boolean parameter\. |
| width | Prototype | Dimensions | Gets or sets the width of the first node\. |
| wrap | Prototype | DOM Manipulation | Wraps each node with the specified wrapper element\. |
| wrapAll | Prototype | DOM Manipulation | Wraps all nodes together in a single wrapper element\. |
| zIndex | Prototype | Display | Gets or sets the z\-index of the first node\. |
