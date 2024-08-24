# wrap()
## Q(selector).wrap(wrapper)
Wraps each selected element individually with the specified wrapper element, effectively enclosing each node in its own new parent element.
```
Q('.items').wrap('<div class="wrapper"></div>');
```
The wrap() method is used to enclose each matched element with a specified wrapper element. Unlike wrapAll(), which groups all selected elements under a single wrapper, wrap() individually wraps each element. This method is useful when you need to apply a consistent structure around multiple elements, such as wrapping each item in a list or grid with a container element. The wrapper can be a string representing an HTML tag or an existing DOM element.

A potential drawback is that this method alters the DOM structure by adding additional layers around each element, which might impact layout or styling. Additionally, wrapping each element individually may lead to more complex HTML structures, which could be less efficient for certain use cases.

## Examples:
### Wrap each .item element with a div element:

Each .item is individually wrapped inside a new div with the class wrapper.
```
Q('.item').wrap('<div class="wrapper"></div>');
```
This example wraps every .item element with a new div that has the class wrapper, effectively isolating each element within its own container.

### Wrap each p element inside an existing section:

Uses an existing section element to wrap each p element.
```
const existingSection = document.querySelector('.my-section');
Q('p').wrap(existingSection);
```
In this example, each p element is wrapped inside the existing .my-section element, with the section element becoming the new parent for each paragraph.

### Wrap each card element with a generated span:

Creates a span wrapper and applies it around each .card element.
```
Q('.card').wrap('<span></span>');
```
Here, every .card element is individually wrapped with a newly created span element, adding a new inline-level container around each card.

### Dynamic wrapping based on element state:

Wrap elements only if they meet a specific condition, such as having a particular class.
```
Q('.highlight').each(function() {
  if (Q(this).hasClass('active')) {
    Q(this).wrap('<div class="active-wrapper"></div>');
  }
});
```
This example wraps only the .highlight elements that also have the active class with a div that has the class active-wrapper.