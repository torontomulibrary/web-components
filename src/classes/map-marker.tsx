import { iMapMarkerOptions } from '../interface';
import { Coordinate } from '../utils/coordinate';

import { MapElement } from './map-element';
import { MarkerIcon } from './marker-icon';
import { MarkerSymbol } from './marker-symbol';

const CONTROL_SIZE = 50;

export class MapMarker extends MapElement {
  _anchor: Coordinate = new Coordinate(0, 0);
  set anchor(newAnchor: Coordinate) { this._anchor = newAnchor; }
  get anchor() { return this._anchor; }

  _available = false;
  set available(isAvailable: boolean) { this._available = isAvailable; }
  get available() { return this._available; }

  _icon?: MarkerIcon | MarkerSymbol;
  set icon(newIcon: undefined | MarkerIcon | MarkerSymbol) { this._icon = newIcon; }
  get icon() { return this._icon; }

  _label = '';
  set label(newLabel: string) { this._label = newLabel; }
  get label() { return this._label; }

  _opacity = 1;
  set opacity(newOpacity: number) { this._opacity = Math.max(0, Math.min(1, newOpacity)); }
  get opacity() { return this._opacity; }

  _position: Coordinate = new Coordinate(0, 0);
  set position(newPosition: Coordinate) { this._position = newPosition; }
  get position() { return this._position; }

  constructor(opts?: iMapMarkerOptions) {
    super(opts);

    if (opts) {
      this.anchor = opts.anchor ? opts.anchor : new Coordinate(0, 0);
      this.available = opts.available ? opts.available : false;
      this.icon = opts.icon ? opts.icon : undefined;
      this.label = opts.label ? opts.label : '';
      this.opacity = opts.opacity ? opts.opacity : 1;
      this.position = opts.position ? opts.position : new Coordinate(0, 0);
    }
  }

  render() {
    if (!this.visible) {
      return undefined;
    }

    const rectClass = {
      'rl-map-rect': true,
      'rl-map-rect--activated': this.active,
    };

    const contents: JSX.Element[] = [];
    // let totalWidth = 0;

    if (this._icon === undefined) {
      contents.push((<rect class={rectClass} rx="12" ry="12" width={CONTROL_SIZE} height={CONTROL_SIZE}/>));
    } else {
      this._icon.size = { width: CONTROL_SIZE, height: CONTROL_SIZE };
      contents.push(this._icon.render());

      contents.push((
        <rect
          class={rectClass}
          width={CONTROL_SIZE}
          height={CONTROL_SIZE}
          rx="12"
          ry="12"
        />
      ));
    }

    const gTrans = `translate(${this.position.toPathString()})`;

    const gClass = {
      'rl-map-marker': true,
      'rl-map-marker--clickable': this._clickable,
      'rl-map-marker--available': this._available,
    };

    return (
      <g id={this._id} class={gClass} tabindex={this._clickable ? '0' : undefined} transform={gTrans}>
        {contents}
      </g>
    );
  }

  /**
   * Moves this marker by a given amount.
   * @param delta The amount to move by
   */
  move(delta: Coordinate) {
    this._position.translate(delta);
  }
}
