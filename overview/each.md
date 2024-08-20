# each()
## Q(selector).each(callback)
Iterates over each element in the selection, executing a callback function for each element. This method is useful for applying operations to multiple elements in a set, such as modifying properties, attaching event handlers, or processing data.
```
Q('li').each(function(index, element) {
  // Callback code here
});
```
The each method is designed to loop through all elements that match the given selector and apply a specified function to each one. This allows for bulk operations on elements without needing to write repetitive code. It is particularly useful for tasks such as updating multiple elements with similar attributes, iterating through lists to apply styles, or handling event bindings in a streamlined manner.

One potential drawback is that the each method may become inefficient with a very large set of elements due to its iterative nature. Additionally, if the callback function is complex or involves significant computation, it might impact performance.

## Examples:
### Applying a style to each li element:

Iterates over each li element and sets its text color to red.
```
Q('li').each(function() {
  Q(this).css('color', 'red');
});
```
In this example, the each method applies a red color to the text of every li element. This is useful for styling multiple elements uniformly.

### Adding a class to each element with a specific class:

Adds the class highlight to each element that has the class item.
```
Q('.item').each(function() {
  Q(this).addClass('highlight');
});
```
This snippet selects all elements with the item class and adds the highlight class to them. This can be useful for modifying multiple elements based on a shared class.

### Handling events for each element in a set:

Attaches a click event handler to each button element.
```
Q('button').each(function() {
  Q(this).on('click', function() {
    alert('Button clicked!');
  });
});
```
Here, a click event handler is added to each button element, showing an alert when any button is clicked. This is efficient for setting up event listeners on multiple elements.

### Iterating with index and element:
Logs the index and content of each div element.
```
Q('div').each(function(index, element) {
  console.log('Index:', index, 'Content:', Q(element).text());
});
```
In this example, the each method logs the index and text content of each div element. This can be useful for debugging or when you need to process elements based on their position in the selection.