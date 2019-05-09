import { MapMarker } from '../classes/map-marker';
import { MapPolygon } from '../classes/map-polygon';
import { MarkerIcon } from '../classes/marker-icon';
import { MarkerSymbol, MarkerSymbolPaths } from '../classes/marker-symbol';
import {
  MapElementData,
  MapElementDataMap,
  ParsedMapElement,
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
  if (el instanceof SVGImageElement || el instanceof SVGRectElement) {
    // There are two cases where the element is a child of the elemen
    el = el.parentElement;
  }

  if (el instanceof SVGPathElement || el instanceof SVGGElement) {
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
      newEl.label = (el.icon !== 'string' && el.symbol === undefined) ? el.name : '';
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

/**
 * Creates an array of JSX.Element nodes to be rendered based on an array of
 * `ParsedMapElements`.
 * @param els The array of `ParsedMapElements` to render
 */
export function renderElements(els: ParsedMapElement[]) {
  const elements = els.filter((el => el.enabled));
  if (elements.length === 0) {
    return undefined;
  }

  const parsed = elements.map(el => {
    if (el.coordinates.length === 1) {
      const rectClass = {
        'rl-map-element__rect': true,
        'rl-map-element__rect--activated': el.active,
      };
      const gTrans = 'translate(' + (el.coordinates[0].x - CONTROL_SIZE / 2) +
          ' ' + (el.coordinates[0].y - CONTROL_SIZE / 2) + ')';

      if (el.iconImages && el.iconImages.length !== 0) {
        return el.iconImages.map(icon => {
          let iconAspect = icon.height / icon.width;

          if (isNaN(iconAspect)) {
            iconAspect = 1;
          }

          return (
            <g id={el.id} class="rl-map-element__point" tabindex="0" transform={gTrans}>
              <image
                class="rl-map-element__icon"
                // Don't set width.  Some icons are not square and leaving width
                // unset will set the width automatically while keeping aspect.
                height={CONTROL_SIZE}
                xlinkHref={icon.src}
              />
              <rect
                class={rectClass}
                width={CONTROL_SIZE / iconAspect}
                height={CONTROL_SIZE}
                rx="12"
                ry="12"
              />
            </g>
          );
        });
      } else {
        // We have a text node.
        return (
          <g id={el.id} class="rl-map-element__point" tabindex="0" transform={gTrans}>
            <rect rx="12" ry="12" width={CONTROL_SIZE} height={CONTROL_SIZE}/>
          </g>
          // <text id={el.id} class="rl-map-element__text" transform={gTrans}>
          // </text>
        );
      }
    } else {
      const regionClass = {
        'rl-map-element__region': true,
        'rl-map-element__region--activated': el.active,
        'rl-map-element__region--available': el.available,
      };

      return (
        <path class={regionClass} id={el.id} d={el.path} tabindex="0"/>
      );
    }
  });

  return parsed;
}
