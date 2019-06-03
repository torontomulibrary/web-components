# rl-map-editor



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute   | Description                                                 | Type                  | Default             |
| ---------- | ----------- | ----------------------------------------------------------- | --------------------- | ------------------- |
| `elements` | --          | An array of the elements that will be displayed on the Map. | `MapElementDataMap`   | `{}`                |
| `mapImage` | `map-image` | The image displayed on the Map.                             | `string \| undefined` | `undefined`         |
| `maxScale` | `max-scale` | The maximum scale factor.                                   | `number`              | `DEFAULT_MAX_SCALE` |
| `minScale` | `min-scale` | The minimum scale factor.                                   | `number`              | `DEFAULT_MIN_SCALE` |


## Events

| Event                  | Description                                                                                                                           | Type                          |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| `elementCreated`       | An event fired when a new `MapElement` is created. The event details contains the `MapElement` that was created.                      | `CustomEvent<MapElementData>` |
| `elementDeleted`       | An event fired when one of the `MapElements` on this map is deleted.                                                                  | `CustomEvent<MapElementData>` |
| `elementDeselected`    | An event fired when the user deselects a `MapElement`.                                                                                | `CustomEvent<any>`            |
| `elementDoubleClicked` | An event fired when one of the `MapElement`s on the map is double clicked.                                                            | `CustomEvent<MapElementData>` |
| `elementSelected`      | An event fired when the user selects a MapElement. The clicked element will be passed as the event parameter.                         | `CustomEvent<MapElementData>` |
| `elementUpdated`       | An event fired when a `MapElement` is updated (moved or changes shape). The event details contains the `MapElement` that was updated. | `CustomEvent<MapElementData>` |


## Methods

### `addPoint() => Promise<void>`

Add a new `MapPoint` element to the map.  Calling this method starts the
process.  The user must then click somewhere on the map to add the point.

#### Returns

Type: `Promise<void>`



### `addRegion() => Promise<void>`

Add a new `MapRegion` to the map. Calling this method starts the process.
The user must then click numerous times on the map to add points.  Only
when clicking again on the original point is the region added.

#### Returns

Type: `Promise<void>`



### `cancelAction() => Promise<void>`

Cancels the current action and returns the map to its default state, ready
for futher action.

#### Returns

Type: `Promise<void>`



### `deleteRegion() => Promise<void>`

Removes the currently active element.  If no element is selected when
this method is called, it has no effect.

#### Returns

Type: `Promise<void>`



### `setActiveElement(id: number) => Promise<void>`

Sets the element with the specified ID to active.

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
