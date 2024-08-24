# zIndex()
## Q(selector).zIndex(value)
Sets or retrieves the z-index CSS property of the selected elements. This method allows you to control the stacking order of elements on the page, which determines which elements appear in front of or behind others.

```
Q('.modal').zIndex(1000);
```
The zIndex method is used to manipulate the stacking order of elements. When you pass a value, it sets the z-index of the selected elements to that value. If no value is provided, it retrieves the current z-index of the first matched element. This method is particularly useful when dealing with overlapping elements, such as modals, dropdowns, or tooltips, ensuring that the right elements appear on top of others.

One possible drawback is that excessive or improper use of z-index can lead to complex stacking contexts, making it difficult to manage the visual layering of elements. Overusing high z-index values can also result in unexpected behavior, especially in complex layouts.

## Examples:
### Setting the z-index of a modal:

Ensures the .modal element appears above other elements by setting its z-index.
```
Q('.modal').zIndex(1050);
```
In this example, the modal is given a z-index of 1050, making sure it stacks above other elements on the page.

### Retrieving the z-index of an element:

Logs the current z-index of the .tooltip element.
```
var z = Q('.tooltip').zIndex();
console.log(z);
```
This snippet retrieves the current z-index of the .tooltip element, useful for debugging or conditionally adjusting stacking order.

### Adjusting z-index dynamically:

Increases the z-index of .popup by 10 when clicked.
```
Q('.popup').on('click', function() {
  var currentZ = Q(this).zIndex();
  Q(this).zIndex(currentZ + 10);
});
```
Here, the z-index of the .popup element increases by 10 each time it is clicked, allowing dynamic control over the stacking order.

### Setting z-index based on condition:

Sets the z-index to 999 only if the element is visible.
```
Q('.alert').each(function() {
  if (Q(this).is(':visible')) {
    Q(this).zIndex(999);
  }
});
```
In this example, the z-index is set to 999 only for visible .alert elements, which is useful for ensuring that only currently visible alerts are brought to the front.