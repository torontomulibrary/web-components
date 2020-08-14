import { Coordinate } from './utils/coordinate';
import { MapMarker } from './classes/map-marker';
import { MapPolygon } from './classes/map-polygon';
import { MarkerIcon } from './classes/marker-icon';
import { MarkerSymbol } from './classes/marker-symbol';
// import { RLMap } from './components/map/map';

export * from './utils/coordinate';
export * from './components/map-editor/map-editor-interface';

/**
 * Base type for any object that has a name and description.  Also includes
 * alt-text for an additional accessibility-oriented description.
 */
export type DescribedObject = {
  /**
   * Additional text describing the object in a way that is appropriate for
   * accessibility purposes.
   */
  altText: string;

  /**
   * A description of the object.
   */
  description: string;

  /**
   * An identifier for the object.
   */
  id: number;

  /**
   * The name of the object.
   */
  name: string;
}

/**
 * A map of elements using a numerical index.
 * 
 * @template T The type of objects stored in this map.
 */
export type NumberMap<T> = { [keys: number]: T }

export type MapElement = MapPolygon | MapMarker;

/**
 * Allowed values for polygon stroke position.
 */
export type StrokePosition = 'CENTER' | 'INSIDE' | 'OUTSIDE';


export interface Size {
  height: number;
  width: number;
}

export interface iMapElementOptions {
  name?: string;
  visible?: boolean;
  zIndex?: number
}

export interface iMapMarkerOptions extends iMapElementOptions {
  anchor?: Coordinate;
  alt?: boolean;
  available?: boolean;
  icon?: MarkerIcon | MarkerSymbol;
  label?: string;
  opacity?: number;
  position: Coordinate;
}

export interface iMapPolygonOptions extends iMapElementOptions {
  points: string;
}

export interface SVGEl {
  elem: string;
  prefix: string;
  local: string;
  attrs: {
    [key: string]: string | { [key: string]: string },
    id: string,
    style: string | { [key: string]: string },
  };
  content?: Array<{ text: string }>;
  type: string;
}
