# rl-map-editor



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute   | Description                                                 | Type                        | Default             |
| ---------- | ----------- | ----------------------------------------------------------- | --------------------------- | ------------------- |
| `elements` | --          | An array of the elements that will be displayed on the Map. | `MapElement[] \| undefined` | `undefined`         |
| `mapImage` | `map-image` | The image being displayed as the base of the map.           | `string \| undefined`       | `undefined`         |
| `maxScale` | `max-scale` | The maximum scale factor.                                   | `number`                    | `DEFAULT_MAX_SCALE` |
| `minScale` | `min-scale` | The minimum scale factor.                                   | `number`                    | `DEFAULT_MIN_SCALE` |


## Events

| Event               | Description                                                                                                                         | Type                      |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `elementCreated`    | An event fired when a new `MapElement` is created. The event details contains the `MapElement` that was created.                    | `CustomEvent<MapElement>` |
| `elementDeleted`    | An event fired when one of the `MapElements` on this map is deleted.                                                                | `CustomEvent<MapElement>` |
| `elementDeselected` | An event fired when the user deselects a `MapElement`.                                                                              | `CustomEvent<undefined>`  |
| `elementSelected`   | An even fired when the user selects a `MapElement`. The clicked element's `id` will be passed in the event details.                 | `CustomEvent<MapElement>` |
| `elementUpdated`    | An event fired when a `MapElement` is updated (moved or changes shape). The event details contains the `MapElement` that was moved. | `CustomEvent<MapElement>` |


## Methods

### `addPoint() => void`

Add a new `MapPoint` element to the map.  Calling this method starts the
process.  The user must then click somewhere on the map to add the point.

#### Returns

Type: `void`



### `addRegion() => void`

Add a new `MapRegion` to the map. Calling this method starts the process.
The user must then click numerous times on the map to add points.  Only
when clicking again on the original point is the region added.

#### Returns

Type: `void`



### `cancelAction() => void`

Cancels the current action and returns the map to its default state, ready
for futher action.

#### Returns

Type: `void`



### `deleteRegion() => void`

Removes the currently active element.  If no element is selected when
this method is called, it has no effect.

#### Returns

Type: `void`



### `setActiveElement(id: number) => void`

Sets the element with the specified ID to active.

#### Parameters

| Name | Type     | Description                             |
| ---- | -------- | --------------------------------------- |
| `id` | `number` | The ID of the element to set as active. |

#### Returns

Type: `void`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
