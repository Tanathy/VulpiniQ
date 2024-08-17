# Plugin Registration
The Q supports extending its functionality through plugins. Plugins can be registered to either the Q class prototype or any other specified type.

## How to Register a Plugin
Use the Q.register method to register a plugin. The method takes the following parameters:

type: The type of prototype to extend ('Q' by default). You can specify other types if you have extended Q with custom types.
name: The name of the plugin method to be added.
pluginFunction: The function that implements the plugin functionality.

### Registering a Plugin on the Q Prototype
```
Q.register('myPlugin', function (param) {
    console.log('Plugin called with', param);
});

const q6 = Q('.my-class');
q6.myPlugin('test'); // Logs: Plugin called with test
```


### Registering a Plugin on a Custom Type
Suppose you have a custom type MyType:
```
// Define a new type
Q.MyType = class {};

// Register a plugin on `MyType`
Q.register('MyType', 'customMethod', function (value) {
    console.log('Custom method with', value);
});

// Use the plugin
const myInstance = Q.MyType();
myInstance.customMethod('example'); // Logs: Custom method with example
```

### Plugin Registration Error Handling
Unknown Plugin Type: If the specified type is not recognized, an error message is logged.
Plugin Already Exists: If a plugin with the same name already exists on the specified prototype, an error message is logged.