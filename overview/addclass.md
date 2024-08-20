# addClass()
## Q(selector).addClass(classes)
Adds one or more CSS classes to the selected elements. This method allows you to dynamically change the styling of elements by applying new classes.
```
Q('.box').addClass('highlight active');
```
The addClass method is useful for applying one or more classes to selected elements in your document. It modifies the classList of each element, allowing you to control their appearance or behavior based on CSS class rules. This method supports chaining, so you can quickly apply multiple styles in a single line of code. It’s particularly beneficial for adding visual effects, managing dynamic styles, or toggling classes for interactive elements.

However, using addClass on a large number of elements or with a very large list of classes might impact performance, especially if executed frequently. Also, it’s important to ensure that the classes being added do not conflict with existing styles.

## Examples:
### Adding a single class to elements:

This example shows how to add a single class to all elements with the class box.
```
Q('.box').addClass('highlight');
```
This will apply the highlight class to all elements with the class box, changing their appearance according to the CSS rules defined for highlight.

### Adding multiple classes to elements:

In this example, multiple classes are added at once.
```
Q('.box').addClass('highlight active');
```
Here, both highlight and active classes are applied to each box element. This can be useful for combining multiple styles or behaviors.

### Adding a class to a newly created element:

You can also use addClass to style elements created on the fly.
```
const newDiv = document.createElement('div');
Q(newDiv).addClass('new-style');
document.body.appendChild(newDiv);
```
```
const newDiv = Q('<div>').addClass('new-style');
Q('body').append(newDiv);
```