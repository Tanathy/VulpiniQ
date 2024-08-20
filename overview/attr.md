# attr()
## Q(selector).attr(name, [value])
Sets or retrieves the value of an attribute for the selected elements. When provided with two arguments, attr sets the attribute; with one argument, it retrieves the attribute’s value.
```
Q('img').attr('alt', 'A descriptive text');
```
The attr method allows you to manipulate HTML attributes of selected elements. When setting an attribute, you can specify its name and value, which is useful for updating properties like href, src, or alt dynamically. Retrieving an attribute’s value can be handy for reading properties and making decisions based on them. This method provides a simple interface for both reading and writing attributes, making it a versatile tool in DOM manipulation.

However, frequent use of attr to update attributes can lead to performance concerns if dealing with a large number of elements. Additionally, manipulating certain attributes (like style or class) might be more efficiently done with dedicated methods rather than attr.

## Examples:
### Setting an attribute:

Updates the alt attribute of img elements.
```
Q('img').attr('alt', 'A descriptive text');
```
This example sets the alt attribute for all img elements on the page, improving accessibility by providing descriptive text for images.

### Retrieving an attribute value:

Gets the value of the href attribute from a link.
```
const linkHref = Q('a').attr('href');
console.log(linkHref);
```
Here, the href value of the first a element is retrieved and logged to the console, useful for extracting and using attribute values programmatically.

### Setting multiple attributes:
Sets multiple attributes at once using an object.
```
Q('input').attr({
    type: 'text',
    placeholder: 'Enter text here'
});
```
In this case, multiple attributes (type and placeholder) are set on input elements simultaneously. This approach simplifies setting multiple attributes and keeps the code concise.

### Conditionally updating attributes:
Updates an attribute based on certain conditions.
```
Q('img').each(function() {
    if (!Q(this).attr('alt')) {
        Q(this).attr('alt', 'Default alt text');
    }
});
```
This example checks if the alt attribute is missing and assigns a default value if needed. It demonstrates how to use attr in conjunction with conditions to ensure elements have the necessary attributes.