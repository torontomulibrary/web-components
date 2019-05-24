import { MapMarker } from '../classes/map-marker';
import { MapPolygon } from '../classes/map-polygon';
import { MarkerIcon } from '../classes/marker-icon';
import { MarkerSymbol, MarkerSymbolPaths } from '../classes/marker-symbol';
import {
  MapElementData,
  MapElementDataMap,
  Size,
} from '../interface';
import { Coordinate } from '../utils/coordinate';
import { decodeCoordinates } from '../utils/helpers';

export const CONTROL_SIZE = 100;

export const HYSTERESIS = 8;

// Default maximum scale (zoom) factor.
export const DEFAULT_MAX_SCALE = 3;

// Default minimum scale (zoom) factor.
export const DEFAULT_MIN_SCALE = 1;

// The different states the Map/MapEditor can be in.
export const STATES = {
  NORMAL:           0,
  GESTURE_DOWN:     1,
  DRAGGING:         2,
  ZOOMING:          3,
  ADD_REGION_INIT:  10,
  ADD_REGION_FIRST: 11,
  ADD_REGION:       12,
  ADD_POINT:        20,
  DRAG_ELEMENT:     30,
};

export const SVG_NS = 'http://www.w3.org/2000/svg';

export function computeLimits(iSize: Size, sSize: Size, scale: number) {
  return new DOMRect(
    Math.min(0, sSize.width - iSize.width * scale),    // left / x
    Math.min(0, sSize.height - iSize.height * scale),  // top / y
    Math.abs(iSize.width * scale - sSize.width),       // width
    Math.abs(iSize.height * scale - sSize.height)      // height
  );
}

/**
 * Gets the ID of a given Element within the Map SVG.  This makes use of the
 * known DOM structure of the SVG.
 * @param el The Element to use to find the ID.
 */
export function getTargetId(el: EventTarget | null): number | undefined {
  if (el instanceof SVGImageElement || el instanceof SVGRectElement ||
      el instanceof SVGPathElement || el instanceof SVGTextElement) {
    // The image (symbol), bounding rectangle, text or path were clicked.
    // In these cases, the parent (group) tag holds the ID.
    el = el.parentElement;
  }

  if (el instanceof SVGGElement) {
    return Number(el.id);
  }

  return undefined;
}

/**
 * Processes an array of `MapElement`s, turning them into an array of
 * `ParsedMapElement` objects.  These parsed map elements are then rendered onto
 * a map.
 * @param elements An array of `MapElement`s to process
 * @param scale The scale applied to the `ParsedElement`
 */
export function parseElements(elements: MapElementDataMap, scale = 1): (MapMarker | MapPolygon)[] {
  return Object.values(elements).map((el: MapElementData) => {
    const decoded = decodeCoordinates(el.points, true);

    let icon;
    if (typeof el.icon === 'string') {
      icon = new MarkerIcon();
      icon.url = el.icon;
    } else if (el.symbol !== undefined && el.symbol in MarkerSymbolPaths) {
      icon = new MarkerSymbol();
      icon.path = el.symbol;
    }

    let newEl: MapPolygon | MapMarker;

    if (decoded.points instanceof Coordinate) {
      newEl = new MapMarker();
      newEl.icon = icon;
      newEl.position = decoded.points;
      newEl.label = (typeof el.icon !== 'string' && typeof el.symbol !== 'string') ? el.name : '';
      newEl.available = el.available || false;
    } else {
      newEl = new MapPolygon();
      newEl.points = decoded.points;
    }

    newEl.id = el.id;
    newEl.name = el.name;
    newEl.visible = el.enabled;
    newEl.scale = scale;
    newEl.clickable = el.clickable !== undefined ? el.clickable : true;
    return newEl;
  });
}
