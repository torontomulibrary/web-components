# rl-svg-floorplan



<!-- Auto Generated Below -->


## Properties

| Property     | Attribute     | Description                                                  | Type                                   | Default       |
| ------------ | ------------- | ------------------------------------------------------------ | -------------------------------------- | ------------- |
| `activeId`   | `active-id`   | The ID of the active (selected) element.                     | `string`                               | `''`          |
| `height`     | `height`      | The height for the SVG element.                              | `string`                               | `'2400'`      |
| `svg`        | --            | The contents of the SVG, as a `FunctionalComponent`.         | `FunctionalComponent<{}> \| undefined` | `undefined`   |
| `useViewbox` | `use-viewbox` | Setting to true adds a viewbox attribute to the SVG element. | `boolean`                              | `false`       |
| `vbHeight`   | `vb-height`   | The width of the SVG viewbox.                                | `string`                               | `this.height` |
| `vbWidth`    | `vb-width`    | The height of the SVG viewbox.                               | `string`                               | `this.width`  |
| `width`      | `width`       | The width for the SVG element.                               | `string`                               | `'4800'`      |


## Events

| Event              | Description                                                                                                              | Type                  |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------ | --------------------- |
| `rlElementCleared` | Event fired when the SVG is clicked but no specific element is targeted, that is, the active element is cleared.         | `CustomEvent<void>`   |
| `rlElementClicked` | Event fired when an element in the SVG is clicked (if it is clickable). Details will be the `id` of the clicked element. | `CustomEvent<string>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
