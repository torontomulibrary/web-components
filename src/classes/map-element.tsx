import { iMapElementOptions } from '../interface';

/**
 * The base class for the different kinds of items that can be drawn on a
 * Map.
 */
export class MapElement {
  _active = false;
  /**
   * Indicates whether this `MapElement` is currently selected by the user. When
   * active, the `MapElement` is styled differently.  Defaults to `false`.
   */
  set active(isActive: boolean) { this._active = isActive; }
  get active() { return this._active; }

  _clickable = true;
  /**
   * Indicates whether this `MapElement` receives mouse and touch events.
   * Defaults to `true`.
   */
  set clickable(isActive: boolean) { this._clickable = isActive; }
  get clickable() { return this._clickable; }

  /**
   * The internal identifier for this `MapElement`.
   */
  _id = -1;
  set id(newId: number) { this._id = newId; }
  get id() { return this._id; }

  _name = '';
  /**
   * The name of this `MapElement`.
   */
  set name(newName: string) { this._name = newName; }
  get name() { return this._name; }

  _scale = 1;
  /**
   * The scale of this `MapElement`.
   */
  set scale(newScale: number) { this._scale = newScale; }
  get scale() { return this._scale; }

  _visible = true;
  /**
   * Indicates if this `MapElement` is currently visible. Defaults to `true`.
   */
  set visible(isVisible: boolean) { this._visible = isVisible; }
  get visible() { return this._visible; }

  _zIndex = 1;
  /**
   * The z-index used to draw this `MapElement`.  Defaults to 1.
   */
  set zIndex(isVisible: number) { this._zIndex = isVisible; }
  get zIndex() { return this._zIndex; }

  /**
   * Create a new `MapElement`.
   * @param id A value to set as the ID of the `MapElement`.
   */
  constructor(opts?: iMapElementOptions) {
    if (opts) {
      this.name = (opts.name !== undefined) ? opts.name : '';
      this.zIndex = (opts.zIndex !== undefined) ? opts.zIndex : 1;
    }
  }
}
