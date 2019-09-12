# [0.6.0](https://github.com/ryersonlibrary/web-components/compare/v0.5.0...v0.6.0) (2019-09-12)


### Bug Fixes

* 🐛 activeElementId now changes selected element on map ([caddc1a](https://github.com/ryersonlibrary/web-components/commit/caddc1a))
* 🐛 add missing dependency for svg-floorplan ([a0982cb](https://github.com/ryersonlibrary/web-components/commit/a0982cb))
* 🐛 map-editor properly deprecated ([4617607](https://github.com/ryersonlibrary/web-components/commit/4617607))
* 🐛 remove some prohibited styles ([a2f7bdb](https://github.com/ryersonlibrary/web-components/commit/a2f7bdb))
* 🐛 revert map demo changes ([9d0e3dc](https://github.com/ryersonlibrary/web-components/commit/9d0e3dc))


### Features

* 🎸 add PanZoom component ([c5f305b](https://github.com/ryersonlibrary/web-components/commit/c5f305b))
* 🎸 add svg-floorplan component ([6ad3e99](https://github.com/ryersonlibrary/web-components/commit/6ad3e99))


### BREAKING CHANGES

* 🧨 removed public methods `clearActiveElement` and `setActiveElement`.
Instead, provide the ID of the element to select with the property
`activeElementId`.



# [0.5.0](https://github.com/ryersonlibrary/web-components/compare/v0.4.4...v0.5.0) (2019-06-03)


### Bug Fixes

* 🐛 change marker-symbol class name for alt colour ([e0d2734](https://github.com/ryersonlibrary/web-components/commit/e0d2734))
* 🐛 Changes needed for stencil-one ([b9ed31b](https://github.com/ryersonlibrary/web-components/commit/b9ed31b))
* 🐛 update to stencil 1.0.0 and other package updates ([d301923](https://github.com/ryersonlibrary/web-components/commit/d301923))


### BREAKING CHANGES

* Changed `rl-svg__symbol--alt` to `rl-svg__symbol-${symbolName}-alt`



## [0.4.4](https://github.com/ryersonlibrary/web-components/compare/v0.4.3...v0.4.4) (2019-05-24)


### Bug Fixes

* 🐛 DetailDialog initial category/type ([f9132c6](https://github.com/ryersonlibrary/web-components/commit/f9132c6))
* 🐛 linting issue with `select-menu` resolved ([abee7e7](https://github.com/ryersonlibrary/web-components/commit/abee7e7))
* 🐛 linting issues ([d44f064](https://github.com/ryersonlibrary/web-components/commit/d44f064))
* 🐛 satisfy build warning for initial negative number ([3da1239](https://github.com/ryersonlibrary/web-components/commit/3da1239))
* 🐛 simplify `map` and `map-editor` SVG structure ([743ef42](https://github.com/ryersonlibrary/web-components/commit/743ef42))
* 🐛 update demo for `map` and `map-editor` for changes ([5099fc4](https://github.com/ryersonlibrary/web-components/commit/5099fc4))


### BREAKING CHANGES

* Map and MapEditor CSS names have changed and follow a new BEM pattern.



## [0.4.3](https://github.com/ryersonlibrary/web-components/compare/v0.4.2...v0.4.3) (2019-05-10)


### Bug Fixes

* 🐛 changed case to use label of element ([8cc359b](https://github.com/ryersonlibrary/web-components/commit/8cc359b))
* 🐛 fix additional styles for the map editor ([089ddb9](https://github.com/ryersonlibrary/web-components/commit/089ddb9))
* 🐛 fix polygon styles in MapEditor ([b96c907](https://github.com/ryersonlibrary/web-components/commit/b96c907))
* 🐛 getDetails now properly uses and returns Promise ([da43f34](https://github.com/ryersonlibrary/web-components/commit/da43f34))
* 🐛 increase size of map marker ([2f6ca8a](https://github.com/ryersonlibrary/web-components/commit/2f6ca8a))
* 🐛 MapMarker hidden until 'created' when user clicks ([fa33d29](https://github.com/ryersonlibrary/web-components/commit/fa33d29))


### Features

* 🎸 MapMarker shows name as label ([20da53c](https://github.com/ryersonlibrary/web-components/commit/20da53c))



## [0.4.2](https://github.com/ryersonlibrary/web-components/compare/v0.4.1...v0.4.2) (2019-05-08)


### Features

* 🎸 Map image fades in when changing ([f1eef8e](https://github.com/ryersonlibrary/web-components/commit/f1eef8e))


### BREAKING CHANGES

* mapRendered event removed, use componentDidUpdate



## [0.4.1](https://github.com/ryersonlibrary/web-components/compare/v0.2.0...v0.4.1) (2019-04-17)


### Bug Fixes

* 🐛 add missing component documentation ([c9b54d7](https://github.com/ryersonlibrary/web-components/commit/c9b54d7))
* 🐛 correct image path names in map and map-editor ([ccb6e30](https://github.com/ryersonlibrary/web-components/commit/ccb6e30))
* 🐛 fix bug in pathFromCoordinateArray ([b356ab8](https://github.com/ryersonlibrary/web-components/commit/b356ab8))
* 🐛 fix script name in test files ([7b1ec1d](https://github.com/ryersonlibrary/web-components/commit/7b1ec1d))
* 🐛 fix typo in map demo and improve example elements ([5397a20](https://github.com/ryersonlibrary/web-components/commit/5397a20))
* 🐛 linting issues ([415e110](https://github.com/ryersonlibrary/web-components/commit/415e110))
* 🐛 properly get id of clicked marker icons ([5e6303d](https://github.com/ryersonlibrary/web-components/commit/5e6303d)), closes [#1](https://github.com/ryersonlibrary/web-components/issues/1)
* 🐛 regenerate auto generated files ([e98233f](https://github.com/ryersonlibrary/web-components/commit/e98233f))


### Features

* 🎸 add detail-dialog component ([4e1375f](https://github.com/ryersonlibrary/web-components/commit/4e1375f))
* 🎸 add double-click handler for map editor ([45cb3a5](https://github.com/ryersonlibrary/web-components/commit/45cb3a5))
* 🎸 add select-menu component ([53fa99f](https://github.com/ryersonlibrary/web-components/commit/53fa99f))
* 🎸 add text-field component ([f7eb6f0](https://github.com/ryersonlibrary/web-components/commit/f7eb6f0))
* 🎸 overhaul of map element system ([222c73f](https://github.com/ryersonlibrary/web-components/commit/222c73f))


### BREAKING CHANGES

* Renamed MapPoint and MapRegion.  Definition of MapElement changed to
MapElementData and MapElementMap changed to MapElementDataMap.



# [0.4.0](https://github.com/ryersonlibrary/web-components/compare/v0.2.0...v0.4.0) (2019-04-16)


### Bug Fixes

* 🐛 correct image path names in map and map-editor ([ccb6e30](https://github.com/ryersonlibrary/web-components/commit/ccb6e30))
* 🐛 fix script name in test files ([7b1ec1d](https://github.com/ryersonlibrary/web-components/commit/7b1ec1d))
* 🐛 properly get id of clicked marker icons ([5e6303d](https://github.com/ryersonlibrary/web-components/commit/5e6303d)), closes [#1](https://github.com/ryersonlibrary/web-components/issues/1)


### Features

* 🎸 add detail-dialog component ([4e1375f](https://github.com/ryersonlibrary/web-components/commit/4e1375f))
* 🎸 add double-click handler for map editor ([45cb3a5](https://github.com/ryersonlibrary/web-components/commit/45cb3a5))
* 🎸 add select-menu component ([53fa99f](https://github.com/ryersonlibrary/web-components/commit/53fa99f))
* 🎸 add text-field component ([f7eb6f0](https://github.com/ryersonlibrary/web-components/commit/f7eb6f0))
* 🎸 overhaul of map element system ([222c73f](https://github.com/ryersonlibrary/web-components/commit/222c73f))


### BREAKING CHANGES

* Renamed MapPoint and MapRegion.  Definition of MapElement changed to
MapElementData and MapElementMap changed to MapElementDataMap.



## [0.3.1](https://github.com/ryersonlibrary/web-components/compare/v0.2.0...v0.3.1) (2019-04-16)


### Bug Fixes

* 🐛 correct image path names in map and map-editor ([ccb6e30](https://github.com/ryersonlibrary/web-components/commit/ccb6e30))
* 🐛 fix script name in test files ([7b1ec1d](https://github.com/ryersonlibrary/web-components/commit/7b1ec1d))
* 🐛 properly get id of clicked marker icons ([5e6303d](https://github.com/ryersonlibrary/web-components/commit/5e6303d)), closes [#1](https://github.com/ryersonlibrary/web-components/issues/1)


### Features

* 🎸 add detail-dialog component ([4e1375f](https://github.com/ryersonlibrary/web-components/commit/4e1375f))
* 🎸 add double-click handler for map editor ([45cb3a5](https://github.com/ryersonlibrary/web-components/commit/45cb3a5))
* 🎸 add select-menu component ([53fa99f](https://github.com/ryersonlibrary/web-components/commit/53fa99f))
* 🎸 add text-field component ([f7eb6f0](https://github.com/ryersonlibrary/web-components/commit/f7eb6f0))
* 🎸 overhaul of map element system ([222c73f](https://github.com/ryersonlibrary/web-components/commit/222c73f))


### BREAKING CHANGES

* Renamed MapPoint and MapRegion.  Definition of MapElement changed to
MapElementData and MapElementMap changed to MapElementDataMap.



# [0.3.0](https://github.com/ryersonlibrary/web-components/compare/v0.2.0...v0.3.0) (2019-03-15)


### Bug Fixes

* 🐛 fix script name in test files ([7b1ec1d](https://github.com/ryersonlibrary/web-components/commit/7b1ec1d))


### Features

* 🎸 add detail-dialog component ([4e1375f](https://github.com/ryersonlibrary/web-components/commit/4e1375f))
* 🎸 add double-click handler for map editor ([45cb3a5](https://github.com/ryersonlibrary/web-components/commit/45cb3a5))
* 🎸 add select-menu component ([53fa99f](https://github.com/ryersonlibrary/web-components/commit/53fa99f))
* 🎸 add text-field component ([f7eb6f0](https://github.com/ryersonlibrary/web-components/commit/f7eb6f0))
* 🎸 overhaul of map element system ([222c73f](https://github.com/ryersonlibrary/web-components/commit/222c73f))


### BREAKING CHANGES

* Renamed MapPoint and MapRegion.  Definition of MapElement changed to
MapElementData and MapElementMap changed to MapElementDataMap.



# [0.2.0](https://github.com/ryersonlibrary/web-components/compare/v0.1.1-1...v0.2.0) (2019-01-18)


### Bug Fixes

* **app:** Change package.json to point to correct type definintion. ([ff67ffc](https://github.com/ryersonlibrary/web-components/commit/ff67ffc))
* **map:** Force resize calculation on load. ([3539ad5](https://github.com/ryersonlibrary/web-components/commit/3539ad5))
* **map-editor:** Remove old `iconImg` property from MapElementDetailType ([71e2720](https://github.com/ryersonlibrary/web-components/commit/71e2720))



