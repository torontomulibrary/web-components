import { Coordinate } from '../utils/coordinate';
import { movePoints } from '../utils/helpers';

export class MapElement {
  /**
   * A flag indicating if this `MapElement` is currently active.  The active
   * element is styled differently to make it stand out.
   */
  active = false;

  /**
   * A flag indicating if this `MapElement` is currently enabled.  An element
   * that is not enabled is not rendered on the Map.
   */
  enabled = false;

  /**
   * The identifier for this `MapElement`.
   */
  id = -1;

  /**
   * The name of this `MapElement`.
   */
  name = 'New Element';

  /**
   * The array of `Coordinate`s that are used to draw this `MapElement`.
   */
  _coordinates: Coordinate[] = [];

  icons: {src: string, width?: number, height?: number}[] = [];

  scale = 1;

  /**
   * Create a new `MapElement`.
   * @param id A value to set as the ID of the `MapElement`.
   */
  constructor(id?: number) {
    if (id !== undefined) {
      this.id = id;
    }
  }

  /**
   * Move this `MapElement` by a specified amount.
   * @param delta The amount to move
   */
  move(delta: Coordinate) {
    this._coordinates = movePoints(this._coordinates, delta);
  }
}
