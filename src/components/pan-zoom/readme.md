# rl-pan-zoom



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute   | Description                                                                                                                                                                   | Type      | Default |
| ---------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ------- |
| `maxScale` | `max-scale` | The largest factor allowed when scaling the content.  Calculated as a factor of the original size.  So a value of `3` would limit the scale to three times the original size. | `number`  | `3`     |
| `minScale` | `min-scale` | The smallest scale factor allowed when scaling the content.                                                                                                                   | `number`  | `0.5`   |
| `scaled`   | `scaled`    | If true, the content of the `PanZoom` will be scaled so that it fills the parent container initially.                                                                         | `boolean` | `false` |
| `unbound`  | `unbound`   | If true, the content of the `PanZoom` will be able to move beyond the bounds of the parent container.                                                                         | `boolean` | `false` |


## Methods

### `resize() => Promise<void>`

Force a recalculation of the size of the content.

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
