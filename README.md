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

For a complete list of all available components and methods, see [COMPONENTS.md](COMPONENTS.md).