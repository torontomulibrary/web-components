# rl-detail-dialog



<!-- Auto Generated Below -->


## Properties

| Property                  | Attribute      | Description | Type                                                             | Default           |
| ------------------------- | -------------- | ----------- | ---------------------------------------------------------------- | ----------------- |
| `categories` _(required)_ | --             |             | `{ name: string; id: number; items: MapElementDetailType[]; }[]` | `undefined`       |
| `details`                 | --             |             | `MapElementDetailMap \| undefined`                               | `undefined`       |
| `dialogActions`           | --             |             | `string[]`                                                       | `['No', 'Yes']`   |
| `dialogTitle`             | `dialog-title` |             | `string`                                                         | `'Detail Dialog'` |
| `elementId`               | `element-id`   |             | `number`                                                         | `-1`              |


## Events

| Event       | Description | Type                |
| ----------- | ----------- | ------------------- |
| `addDetail` |             | `CustomEvent<void>` |


## Methods

### `getDetails() => any[]`



#### Returns

Type: `any[]`



### `open() => void`



#### Returns

Type: `void`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
