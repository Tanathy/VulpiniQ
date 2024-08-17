# qLib Utility Library - `Q` Function

## Overview

The `Q` function is a utility for simplifying the selection and creation of DOM elements. It allows you to select existing elements, create new elements, and apply attributes or properties to them in a streamlined manner.

## Function Signature

```
Q(selector, attributes, directProps);
```

### Parameters

* **`selector`**: A string or an `HTMLElement`/`Node`.
    * **String**: Represents a CSS selector or HTML string.
    * **HTMLElement/Node**: Directly represents a single DOM element or node.
* **`attributes`** (optional): An object where keys are attribute names and values are attribute values.
    * **Example**: `{ class: 'my-class', id: 'my-id' }`
* **`directProps`** (optional): An array of properties to set directly on the created or selected elements.
    * **Example**: `['disabled', 'checked']`

## Behavior

* **If `selector` is an `HTMLElement` or `Node`**: The instance will contain a single node in `this.nodes`.
* **If `selector` is a string**:
    * **If the string contains HTML (i.e., includes `<`)**:
        * A new DOM element is created based on the HTML string.
        * Attributes and properties (if provided) are applied to the newly created element(s).
    * **If the string is a CSS selector**:
        * Elements matching the selector are selected from the document.

## Result

The result is an instance of `Q` with the `nodes` property containing an array of selected or created elements.

## Examples

### Example 1: Selecting Existing Elements

```
const q1 = Q('.my-class');
console.log(q1.nodes); // Array of elements with class 'my-class'
```

### Example 2: Creating New Elements

```
const q2 = Q('<div class="my-class">Hello World</div>');
console.log(q2.nodes); // Array containing one <div> element
```

### Example 3: Creating Elements with Attributes and Properties

```
const q3 = Q(
    '<button>Click Me</button>',
    { id: 'my-button', type: 'button' },
    ['disabled']
);
console.log(q3.nodes); // Array containing one <button> element with id 'my-button' and disabled property
```

### Example 4: Using a CSS Selector with Attributes

```
const q4 = new Q('.my-class', { title: 'My Title' });
q4.nodes.forEach(el => console.log(el.getAttribute('title'))); // 'My Title'
```

### Example 5: Combining Selector with Direct Properties

```
const q5 = new Q('.my-class', null, ['hidden']);
q5.nodes.forEach(el => console.log(el.hidden)); // true
```

## Notes

* If you pass a selector that matches multiple elements, `this.nodes` will be an array of all matched elements.
* If you pass a string containing HTML, ensure it is a valid HTML snippet. The HTML is parsed and the resulting nodes are added to the document fragment.
* Attributes can be added to elements using the `attributes` object. If you need to set boolean properties (like `checked`, `disabled`), use the `directProps` array.