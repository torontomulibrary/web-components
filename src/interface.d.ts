import { Coordinate } from './utils/coordinate';
import { MapMarker } from './classes/map-marker';
import { MapPolygon } from './classes/map-polygon';
import { MarkerIcon } from './classes/marker-icon';
import { MarkerSymbol } from './classes/marker-symbol';
import { RLMap } from './components/map/map';

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

/**
 * Allowed values for predefined map Symbols.
 */
export enum MarkerSymbolPaths {
  computer = 'M 8 36 c -2 0 -4 -2 -4 -4 v -20 c 0 -2 2 -4 4 -4 h 32 c 2 0 4 2 4 4 v 20 c 0 2 -2 4 -4 4 h 8 v 4 h -48 v -4 z M 8 12 h 32 v 20 h -32 z',
}

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
  available?: boolean;
  icon?: MarkerIcon | MarkerSymbol;
  label?: string;
  opacity?: number;
  position: Coordinate;
}

export interface iMapPolygonOptions extends iMapElementOptions {
  points: string;
}
