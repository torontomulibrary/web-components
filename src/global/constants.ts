export const EDITOR_CONTROL_SIZE = 100;

export const SVG_NS = 'http://www.w3.org/2000/svg';

// The possible states the map can use.
export const MAP_STATES = {
  NORMAL:           0,
  GESTURE_DOWN:     1,
  DRAGGING:         2,
  ZOOMING:          3,
  ADD_REGION_INIT:  10,
  ADD_REGION_FIRST: 11,
  ADD_REGION:       12,
  ADDPOINT:         13,
  DRAG_ELEMENT:     14,
};

// The distance the user must drag before the map will start to pan.
export const EDITOR_HYSTERESIS = 8;

// Default maximum scale (zoom) factor.
export const MAP_DEFAULT_MAX_SCALE = 3;

// Default minimum scale (zoom) factor.
export const MAP_DEFAULT_MIN_SCALE = 1;
