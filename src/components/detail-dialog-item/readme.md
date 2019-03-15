# rl-detail-dialog-item



<!-- Auto Generated Below -->


## Properties

| Property                       | Attribute | Description                                                    | Type                                                                        | Default     |
| ------------------------------ | --------- | -------------------------------------------------------------- | --------------------------------------------------------------------------- | ----------- |
| `categoryOptions` _(required)_ | --        | An array of all the different categories that can be selected. | `{ name: string; id: number; items: MapElementDetailType[]; }[]`            | `undefined` |
| `categorySelection`            | --        | The currently selected Category.                               | `undefined \| { name: string; id: number; items: MapElementDetailType[]; }` | `undefined` |
| `detail`                       | --        |                                                                | `MapElementDetail \| undefined`                                             | `undefined` |
| `typeOptions`                  | --        | An array of all the different detail types that are available. | `MapElementDetailType[]`                                                    | `[]`        |
| `typeSelection`                | --        |                                                                | `MapElementDetailType \| undefined`                                         | `undefined` |


## Methods

### `getDetail() => MapElementDetail`



#### Returns

Type: `MapElementDetail`



### `toRemove() => boolean`



#### Returns

Type: `boolean`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
