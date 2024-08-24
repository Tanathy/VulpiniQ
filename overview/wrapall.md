# wrapAll()
## Q(selector).wrapAll(wrapper)
Wraps all selected elements together inside a single wrapper element, effectively grouping them under a new parent element in the DOM.
```
Q('.items').wrapAll('<div class="wrapper"></div>');
```
The wrapAll() method is used to enclose all matched elements within a single wrapper element. This is particularly useful when you need to group multiple elements under one parent, for example, to apply a common style, manage layout, or create a new structural grouping. The method takes a single argument: the wrapper, which can be a string representing an HTML tag or an existing DOM element.

A potential drawback of using wrapAll() is that it modifies the existing DOM structure, which might affect CSS or JavaScript behavior that relies on the original hierarchy. Additionally, if not used carefully, it could result in unexpected layout changes.

## Examples:
### Wrap multiple items inside a div element:

Groups all .items elements within a new div with the class wrapper.
```
Q('.items').wrapAll('<div class="wrapper"></div>');
```
This example creates a new div with the class wrapper and wraps all .items elements inside it, effectively grouping them under this new parent element.

### Wrap elements in an existing DOM element:

Uses an existing section element to wrap all p elements.
```
const existingSection = document.querySelector('.my-section');
Q('p').wrapAll(existingSection);
```
Here, all p elements are wrapped inside the existing .my-section element, integrating them into a predefined structure.

### Wrap elements with a generated div:

Creates a wrapper div and wraps all .cards elements inside it.
```
Q('.cards').wrapAll('<div></div>');
```
This example wraps all .cards elements inside a newly generated div element, without adding any specific classes or attributes.

### Dynamic wrapper creation based on condition:

Wraps elements only if they meet a specific condition, such as being visible.
```
Q('.visible-items').each(function() {
  if (Q(this).is(':visible')) {
    Q(this).wrapAll('<div class="visible-wrapper"></div>');
  }
});
```
This code snippet wraps only the visible .visible-items elements within a new div element with the class visible-wrapper.