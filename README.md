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
| Average Color | Static | Image Processing | Calculates the average color of an image from a given source\. |
| CMYK to RGB Converter | Static | Color Conversion | Converts CMYK \(Cyan, Magenta, Yellow, Key/Black\) color values to RGB \(Red, Green, Blue\) format\. |
| Color Brightness | Static | Color Manipulation | Adjusts the brightness of a color by a specified percentage\. |
| Container | Constructor | Constructor | Core container and layout manager for VulpiniQ UI components\. |
| Container\.Frame | Prototype | Layout | Flexible frame splitter for horizontal or vertical layouts\. |
| Container\.Tab | Prototype | UI Component | Tabbed navigation component for organizing content\. |
| Container\.Table | Prototype | UI Component | Dynamic data table with sorting, filtering, and pagination\. |
| Container\.Window | Prototype | UI Component | Movable, resizable window component with taskbar integration\. |
| Debounce | Static | Performance Optimization | Delays the execution of a function until after a specified wait period has elapsed since the last invocation\. |
| Done | Static | Event Handling | Executes a function once the window's load event is fired, indicating all resources are loaded\. |
| Form | Constructor | Constructor | Form is a simple library for creating forms and windows in the browser\. It provides a set of methods for creating form elements, windows, and other UI components\. |
| Form\.Button | Component | Component | Button component for Form plugin |
| Form\.CheckBox | Component | Component | CheckBox component for Form plugin |
| Form\.ColorPicker | Component | Component | Photoshop\-like Color Picker component for Form plugin\. Renders a canvas with an outer detail \(24–color\) ring, a full–rainbow middle ring, and an inner triangle for selecting saturation and brightness by mixing the selected hue with white and black\. |
| Form\.Dropdown | Component | Component | A customizable dropdown list component for selecting options from a list\. |
| Form\.ProgressBar | Component | Component | Progress bar component with min, max, val methods |
| Form\.Radio | Component | Component | Radio component using only HTML elements with val, selected, disable, select methods |
| Form\.Slider | Component | Component | Slider input component implemented with divs \(no native <input>\) |
| Form\.Switch | Component | Component | Switch component for Form plugin |
| Form\.Tags | Component | Component | Tags component for Form plugin |
| Form\.TextArea | Component | Component | TextArea component for Form plugin |
| Form\.TextBox | Component | Component | TextBox component for Form plugin |
| Form\.Uploader | Component | Component | File upload component with drag and drop functionality |
| Graph | Constructor | Constructor | Core graph plotting and visualization provider for VulpiniQ\. |
| Graph\.Line | Constructor | Constructor | Line graph plotting and visualization for VulpiniQ\. |
| HSL to RGB Converter | Static | Color Conversion | Converts HSL \(Hue, Saturation, Lightness\) color values to RGB \(Red, Green, Blue\) format\. |
| ID Generator | Static | Utility | Generates a random hexadecimal identifier with customizable length and prefix\. |
| Image | Constructor | Constructor | Canvas\-based image manipulation and processing utility\. |
| Image\.AutoAdjust | Prototype | Image Effect | Automatically adjusts tone, contrast, brightness, or color\. Chainable\. If the selection is empty, no action is taken and the chain continues\. |
| Image\.Blur | Prototype | Image Effect | Applies a blur effect to the image using various kernels\. |
| Image\.Brightness | Prototype | Image Effect | Adjusts the brightness of the image\. |
| Image\.CRT | Prototype | Image Effect | Applies a CRT \(cathode ray tube\) simulation effect to the image\. Chainable\. If the selection is empty, no action is taken and the chain continues\. |
| Image\.ComicEffect | Prototype | Image Effect | Applies a comic\-style color quantization and optional edge detection\. Chainable\. If the selection is empty, no action is taken and the chain continues\. |
| Image\.Contrast | Prototype | Image Effect | Adjusts the contrast of the image\. Chainable\. If the selection is empty, no action is taken and the chain continues\. |
| Image\.Crop | Prototype | Image Effect | Crops the image to a specified rectangle\. |
| Image\.Flip | Prototype | Image Effect | Flips the image horizontally, vertically, or both\. |
| Image\.Glitch | Prototype | Image Effect | Applies a glitch effect to the image using various algorithms\. |
| Image\.Glow | Prototype | Image Effect | Adds a glow effect to bright areas of the image\. |
| Image\.GodRay | Prototype | Image Effect | Adds volumetric light rays \(god rays\) to the image\. |
| Image\.Grayscale | Prototype | Image Effect | Converts the image to grayscale using various algorithms\. |
| Image\.HDR | Prototype | Image Effect | Applies a high dynamic range \(HDR\) effect to the image\. |
| Image\.Hue | Prototype | Image Effect | Shifts the hue of the image by a specified angle\. |
| Image\.LensFlare | Prototype | Image Effect | Adds a lens flare effect to the image using various presets\. |
| Image\.RGBSubpixel | Prototype | Image Effect | Simulates RGB subpixel rendering on the image\. |
| Image\.Sharpen | Prototype | Image Effect | Sharpens the image using an unsharp mask technique\. |
| Image\.Zoom | Prototype | Image Effect | Zooms the image in or out around a center point\. |
| Image\.ZoomBlur | Prototype | Image Effect | Applies a zoom blur effect to the image\. |
| Is Dark Color | Static | Color Analysis | Determines if a color is considered dark based on its luminance value\. |
| LAB to RGB Converter | Static | Color Conversion | Converts LAB \(Lightness, a\*, b\*\) color values to RGB \(Red, Green, Blue\) format\. |
| Leaving | Static | Event Handling | Attaches a function to the window's beforeunload event, allowing actions before the page is closed or refreshed\. |
| Media | Constructor | Constructor | Core media functionality provider for VulpiniQ\. If used as a constructor, returns a new Media instance\. If called without new, returns a Media instance\. No effect on empty selection\. |
| Media\.Selector | Component | Component | Region selection tool for images and videos\. Chainable\. If the selection is empty, no action is taken and the chain continues\. |
| Media\.Timeline | Component | Component | Interactive timeline component for media annotation and navigation\. Chainable\. If the selection is empty, no action is taken and the chain continues\. |
| Media\.Video | Component | Component | Video player with advanced controls and timeline support\. Chainable\. If the selection is empty, no action is taken and the chain continues\. |
| RGB to CMYK Converter | Static | Color Conversion | Converts RGB \(Red, Green, Blue\) color values to CMYK \(Cyan, Magenta, Yellow, Key/Black\) format\. |
| RGB to HSL Converter | Static | Color Conversion | Converts RGB \(Red, Green, Blue\) color values to HSL \(Hue, Saturation, Lightness\) format\. |
| RGB to LAB Converter | Static | Color Conversion | Converts RGB \(Red, Green, Blue\) color values to LAB \(Lightness, a\*, b\*\) color space format\. |
| Ready | Static | Event Handling | Executes a function when the document is fully loaded, ensuring all elements are accessible\. |
| Resize | Static | Event Handling | Attaches a function to the window's resize event, executing it with the new innerWidth and innerHeight\. |
| addClass | Prototype | Class Manipulation | Adds one or more classes to each node, ignoring duplicates\. |
| after | Prototype | DOM Manipulation | Inserts content after each element in the current set of matched elements\. |
| animate | Prototype | Animation | Animates each node using specified CSS properties over a given duration, with an optional callback when complete\. |
| append | Prototype | DOM Manipulation | Appends child nodes, HTML, or multiple elements to each node\. |
| attr | Prototype | Attribute Manipulation | Gets or sets attributes on the nodes, supporting multiple attributes at once\. |
| before | Prototype | DOM Manipulation | Inserts content before each element in the current set of matched elements\. |
| bind | Prototype | Event Handling | Adds an event listener to each node, allowing for event delegation to improve performance\. |
| blur | Prototype | Form Manipulation | Removes focus from the first node in the selection, effectively blurring it\. |
| children | Prototype | Traversal | Gets the direct child elements of each node, optionally filtered by a selector\. |
| click | Prototype | Event Handling | Simulates a click event on each node in the selection\. |
| clone | Prototype | DOM Manipulation | Creates a deep copy of the first node in the selection, including its child nodes\. |
| closest | Prototype | Traversal | Finds the nearest ancestor node of the first node that matches a given selector\. |
| css | Prototype | CSS Manipulation | Gets or sets one or more CSS properties for the nodes\. |
| data | Prototype | Data Manipulation | Retrieves or sets data\-\* attributes on the selected nodes\. Provides an easy way to store and access custom data associated with the elements\. |
| detach | Method | Method | Removes the elements from the DOM but keeps them in memory for later reattachment\. |
| each | Prototype | Iteration | Iterates over all nodes in the Q object and executes a callback on each node, providing access to the index and element\. Chainable\. Does nothing for empty selection\. |
| empty | Prototype | Content Manipulation | Empties the innerHTML of each node\. |
| eq | Prototype | Traversal | Returns a specific node by index\. |
| fadeIn | Prototype | Animation | Fades in all nodes over a specified duration\. |
| fadeOut | Prototype | Animation | Fades out all nodes over a specified duration and then sets display to none\. |
| fadeTo | Prototype | Display | Fades each node to a specific opacity\. |
| fadeToggle | Prototype | Display | Toggles the fade state of each node\. |
| find | Prototype | Traversal | Finds descendants of each node that match the selector\. |
| first | Prototype | Traversal | Returns the first node\. |
| focus | Prototype | Form Manipulation | Focuses on the first node\. |
| hasClass | Prototype | Class Manipulation | Checks if the first node has a specific class\. |
| height | Prototype | Dimensions | Gets or sets the height of the first node, or sets the height for all nodes\. Returns undefined for empty selection\. |
| hide | Prototype | Display | Hides each node, optionally with a fade\-out effect over a specified duration\. |
| html | Prototype | Content Manipulation | Gets or sets the innerHTML of the nodes\. This method allows for easy manipulation of the content inside the selected elements\. |
| id | Prototype | Attributes | Gets or sets the id attribute of the first node\. |
| index | Prototype | Traversal | Returns the index of the first node, or moves the node to a specific index within its parent\. |
| inside | Prototype | Traversal | Checks if the first node is inside another node, determined by a specific selector\. |
| is | Prototype | Utilities | Checks if the first node matches a specific selector or condition, allowing for dynamic queries and element comparisons\. |
| isExists | Prototype | Utilities | Checks if the first node exists in the DOM\. |
| last | Prototype | Traversal | Returns the last node\. |
| map | Prototype | Array | Maps each node to a new array\. |
| next | Prototype | Traversal | Gets the next sibling element of each node, optionally filtered by a selector\. |
| off | Prototype | Event Handling | Removes an event listener from each node\. |
| offset | Prototype | Position | Gets the position of the first node relative to the document\. Returns undefined for empty selection\. |
| on | Prototype | Event Handling | Adds an event listener to each node\. |
| parent | Prototype | Traversal | Gets the parent element of each node, optionally filtered by a selector\. |
| position | Prototype | Position | Gets the position of the first node relative to its offset parent\. Returns undefined for empty selection\. |
| prepend | Prototype | DOM Manipulation | Inserts content at the beginning of each node\. |
| prev | Prototype | Traversal | Gets the previous sibling element of each node, optionally filtered by a selector\. |
| prop | Prototype | Property Manipulation | Gets or sets a property on the nodes\. |
| remove | Prototype | DOM Manipulation | Removes all nodes from the DOM\. |
| removeAttr | Prototype | Attribute Manipulation | Removes an attribute from each node\. |
| removeClass | Prototype | Class Manipulation | Removes the specified class from each node\. |
| removeData | Prototype | Data Manipulation | Removes a data\-\* attribute from each node\. |
| removeProp | Prototype | Property Manipulation | Removes a property from each node\. |
| removeTransition | Prototype | Display | Removes the transition from each node\. |
| replaceWith | Ext | DOM Manipulation | Replaces the selected element\(s\) with the given new content \(Q instance or DOM node\)\. |
| scrollHeight | Prototype | Dimensions | Returns the scroll height of the first node\. Returns undefined for empty selection\. |
| scrollLeft | Prototype | Scroll Manipulation | Gets or sets the horizontal scroll position of the first node, with an option to increment\. Returns undefined for empty selection\. |
| scrollTop | Prototype | Scroll Manipulation | Gets or sets the vertical scroll position of the first node, with an option to increment\. Returns undefined for empty selection\. |
| scrollWidth | Prototype | Dimensions | Returns the scroll width of the first node\. Returns undefined for empty selection\. |
| show | Prototype | Display | Shows each node, optionally with a fade\-in effect over a specified duration\. |
| siblings | Prototype | Traversal | Gets all sibling elements of each node, optionally filtered by a selector\. |
| size | Prototype | Dimensions | Returns the width and height of the first node\. |
| text | Prototype | Content Manipulation | Gets or sets the text content of the nodes\. Returns null for empty selection\. Chainable as setter\. |
| toggle | Prototype | Display | Toggles the display of each node\. Chainable\. Does nothing for empty selection\. |
| toggleClass | Prototype | Class Manipulation | Toggles a class on each node\. Chainable\. Does nothing for empty selection\. |
| trigger | Prototype | Event Handling | Triggers a specific event on each node\. Chainable\. Does nothing for empty selection\. |
| unwrap | Prototype | DOM Manipulation | Removes the parent wrapper of each node\. Chainable\. Does nothing for empty selection\. |
| val | Prototype | Form Manipulation | Gets or sets the value of form elements in the nodes\. Returns null for empty selection\. Chainable as setter\. |
| wait | Prototype | Utility | Returns a promise that resolves with the Q object after a given time\. Enables async chainable actions\. |
| walk | Prototype | Iteration | Walks through all nodes in the Q object and executes a callback on each node, passing the current node as a Q object or raw element based on the boolean parameter\. Chainable\. Does nothing for empty selection\. |
| width | Prototype | Dimensions | Gets or sets the width of the first node, or sets the width for all nodes\. Returns undefined for empty selection\. |
| wrap | Prototype | DOM Manipulation | Wraps each node with the specified wrapper element\. |
| wrapAll | Prototype | DOM Manipulation | Wraps all nodes together in a single wrapper element\. |
| zIndex | Prototype | Display | Gets or sets the z\-index of the first node, or sets the z\-index for all nodes\. Returns undefined for empty selection\. |
