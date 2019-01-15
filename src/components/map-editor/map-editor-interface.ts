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
  code: string;
  callStart: string;
  callEnd: string;
  type: MapElementDetailType;
}

export interface MapElementDetailMap extends NumberMap<MapElementDetail> {}

export interface MapElement extends DescribedObject {
  details?: MapElementDetailMap;
  floorId: number;
  icons: string[];
  points: string;
  enabled: boolean;
}

export interface MapElementMap extends NumberMap<MapElement> {}

export interface ParsedMapElement {
  active: boolean;
  coordinates: Coordinate[];
  enabled: boolean;
  icons?: string[];
  iconImages?: HTMLImageElement[];
  id: number;
  name: string;
  path: string;
}
