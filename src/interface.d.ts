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