# Ryerson Librrary Web Components

A collection of web components built using StencilJS used throughout various
Ryerson Library web applications.

## Usasge

### With NPM in another project
* Run `npm install @ryersonlibrary/web-components --save`
* Add the script tag `<script src='node_modules/@ryersonlibrary/web-components/dist/rl-wc.js'></script>`
* Add the web components in the page like any other element.

### With NPM in a StencilJS App
* Run `npm install @ryersonlibrary/web-components --save`
* Add the line `import '@ryersonlibrary/web-components';` in the application
* Include the desired web component like any other element.

## Components

Below is a list of components currently in the collection with a brief description.

### `rl-map`

A component used to create an interactive Map using SVG.  A map consists of a
background image and one or more `Elements`.  Each Element is either a region
or a single point.  Points can be either text labels or icons.

A map automatically supports zooming in and out and panning the map.

To use a map component, simply add the code:

```javascript
<rl-map map-image="path/to/background.png">
</rl-map>
```

### `rl-map-editor`

A component used to create an interactive Map using SVG.  The map editor is
similar to the basic map with the additional functionality needed to edit
the regions and points on the map.

The map editor component is used like the map:

```javascript
<rl-map-editor map-image="path/to/background.png">
</rl-map-editor>
```
