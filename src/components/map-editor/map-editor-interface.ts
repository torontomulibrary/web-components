import { Coordinate, DescribedObject, NumberMap } from '../../interface';

export interface MapElementDetailType extends DescribedObject {
  category: number;
  icon: string;
  cataloguePattern: string;
  priority: string;
}

export interface MapElementDetailTypeMap extends NumberMap<MapElementDetailType> {}

export interface MapElementDetail extends DescribedObject {
  elementId: number;
  detailTypeId: number;
  // category: number;
  code: string;
  callStart: string;
  callEnd: string;
  type: MapElementDetailType;
}

export interface MapElementDetailMap extends NumberMap<MapElementDetail> {}

export interface MapElementData extends DescribedObject {
  details?: MapElementDetailMap;
  clickable?: boolean;
  floorId: number;
  icon?: string;
  points: string;
  enabled: boolean;
  available?: boolean;
  category?: number;
  symbol?: string;
}

export interface MapElementDataMap extends NumberMap<MapElementData> {}

export interface ParsedMapElement {
  available: boolean;
  active: boolean;
  coordinates: Coordinate[];
  enabled: boolean;
  icons?: string;
  iconImages?: HTMLImageElement[];
  id: number;
  name: string;
  path: string;
  category?: number;
}
