# rl-map



<!-- Auto Generated Below -->


## Properties

| Property                | Attribute   | Description                                                 | Type                  | Default             |
| ----------------------- | ----------- | ----------------------------------------------------------- | --------------------- | ------------------- |
| `elements` _(required)_ | --          | An array of the elements that will be displayed on the Map. | `MapElementDataMap`   | `undefined`         |
| `mapImage`              | `map-image` | The image displayed on the Map.                             | `string \| undefined` | `undefined`         |
| `maxScale`              | `max-scale` | The maximum scale factor.                                   | `number`              | `DEFAULT_MAX_SCALE` |
| `minScale`              | `min-scale` | The minimum scale factor.                                   | `number`              | `DEFAULT_MIN_SCALE` |


## Events

| Event               | Description                                                                                                     | Type                          |
| ------------------- | --------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| `elementDeselected` | An event fired when the user deselects the selected `MapElement`.                                               | `CustomEvent<any>`            |
| `elementSelected`   | An event fired when the user selects a `MapElement`. The clicked element will be passed as the event parameter. | `CustomEvent<MapElementData>` |


## Methods

### `clearActiveElement() => Promise<void>`

Clears the currently active element.

#### Returns

Type: `Promise<void>`



### `setActiveElement(id: number) => Promise<void>`

Sets the element with the specified ID to active.

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
