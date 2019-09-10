import { JSX, h } from '@stencil/core';

import { iMapMarkerOptions } from '../interface';
import { Coordinate } from '../utils/coordinate';

import { MapElement } from './map-element';
import { MarkerIcon } from './marker-icon';
import { MarkerSymbol } from './marker-symbol';

const CONTROL_SIZE = 72;

/**
 * A type of `MapElement`.  A marker is an image or text rendered at a specific
 * point on a Map.
 */
export class MapMarker extends MapElement {
  _anchor: Coordinate = new Coordinate(0, 0);
  /**
   * An offset relative to the `position` of the marker.
   */
  set anchor(newAnchor: Coordinate) { this._anchor = newAnchor; }
  get anchor() { return this._anchor; }

  _available = false;
  /**
   * A flag indicating if the this `MapMarker` represents an active or inactive
   * point.  When the marker is available, it gets a matching `--available` CSS
   * class added.
   */
  set available(isAvailable: boolean) { this._available = isAvailable; }
  get available() { return this._available; }

  _icon?: MarkerIcon | MarkerSymbol;
  /**
   * The icon that will be drawn for this `MapMarker`.
   */
  set icon(newIcon: undefined | MarkerIcon | MarkerSymbol) { this._icon = newIcon; }
  get icon() { return this._icon; }

  _label = '';
  /**
   * A line of text dispayed on the map either on its own as a simple text
   * label or along side the `icon`.
   */
  set label(newLabel: string) { this._label = newLabel; }
  get label() { return this._label; }

  _opacity = 1;
  /**
   * The opacity of the marker, 1 being fully opaque and 0 being fully
   * transparent.
   */
  set opacity(newOpacity: number) { this._opacity = Math.max(0, Math.min(1, newOpacity)); }
  get opacity() { return this._opacity; }

  _position: Coordinate = new Coordinate(0, 0);
  /**
   * The overall position of the marker on the `Map`.
   */
  set position(newPosition: Coordinate) { this._position = newPosition; }
  get position() { return this._position; }

  constructor(opts?: iMapMarkerOptions) {
    super(opts);

    if (opts) {
      this.anchor = opts.anchor ? opts.anchor : new Coordinate(0, 0);
      this.available = opts.available ? opts.available : false;
      this.icon = opts.icon ? opts.icon : undefined;
      this.label = (opts.label !== undefined) ? opts.label : '';
      this.opacity = (opts.opacity !== undefined) ? opts.opacity : 1;
      this.position = opts.position;
    }
  }

  /**
   * Moves this marker by a given amount.
   * @param delta The amount to move by
   */
  move(delta: Coordinate) {
    this._position.translate(delta);
  }

  render() {
    if (!this.visible || this._id === -1 &&
        this._position.equals(new Coordinate(0, 0))) {
      return undefined;
    }

    const rectClass = {
      'rl-svg__rect': true,
      'rl-svg__rect--activated': this.active,
    };

    const contents: JSX.Element[] = [];
    const rect = (
      <rect
        class={rectClass}
        rx="12"
        ry="12"
        height={CONTROL_SIZE}
        width={CONTROL_SIZE}
      />
    );

    if (this._icon === undefined) {
      if (this._label !== '') {
        contents.push((<text y={CONTROL_SIZE - 11} x={CONTROL_SIZE / 2}>{this._label}</text>));
      }
    } else {
      this._icon.size = { width: CONTROL_SIZE, height: CONTROL_SIZE };
      if (this._icon instanceof MarkerSymbol) {
        this._icon.alt = this._available;
      }
      contents.push(this._icon.render());
    }

    contents.push(rect);

    const gTrans = `translate(${this.position.toPathString()})`;

    const gClass = {
      'rl-svg__marker': true,
      'rl-svg__marker--clickable': this._clickable,
    };

    return (
      <g id={`${this._id}`} class={gClass} tabIndex={this._clickable ? 0 : undefined} transform={gTrans}>
        {contents}
      </g>
    );
  }
}
