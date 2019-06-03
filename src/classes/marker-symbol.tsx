import { h } from '@stencil/core';

import { Coordinate } from '../utils/coordinate';

/**
 * Predefined map Symbols.
 */
export enum MarkerSymbolPaths {
  computer = 'M 8 36 c -2 0 -4 -2 -4 -4 v -20 c 0 -2 2 -4 4 -4 h 32 c 2 0 4 2 4 4 v 20 c 0 2 -2 4 -4 4 h 8 v 4 h -48 v -4 z M 8 12 h 32 v 20 h -32 z',
}

interface Size {
  height: number;
  width: number;
}

/**
 * A styled vector path displayed as the icon of a `MapMarker`.
 */
export class MarkerSymbol {
  _alt = false;
  /**
   * A flag indicating if this symbol should use an alternate style.
   */
  set alt(a: boolean) { this._alt = a; }
  get alt() { return this._alt; }

  _anchor: Coordinate = new Coordinate(0, 0);
  /**
   * The position of the symbol relative to the marker.
   */
  set anchor(c: Coordinate) { this._anchor = c; }
  get anchor() { return this._anchor; }

  _path: MarkerSymbolPaths | string = '';
  /**
   * The symbol's path specified using a built-in string or a custom path
   * expressed using SVG path notation.
   */
  set path(p: MarkerSymbolPaths | string) {
    // If supplied path is a string matching the name of a key of MarkerSymbolPaths,
    // set the path to that, otherwise just p. No check if string is valid SVG
    // path.
    if (p in MarkerSymbolPaths) {
      this._pathName = p;
      this._path = MarkerSymbolPaths[p];
    } else {
      this._pathName = 'custom';
      this._path = p;
    }
  }

  get path() { return this._path; }

  /**
   * The name of the path.  This is appended to the class added to the path and
   * allows for custom styling based on each type of path.
   */
  _pathName = '';

  _rotation = 0;
  /**
   * The angle by which to rotate the symbol, expressed clockwise in degrees.
   */
  set rotation(r: number) { this._rotation = r % 360; } // Clamp to [0,360]
  get rotation() { return this._rotation; }

  _size: Size = { width: 1, height: 1 };
  /**
   * The size of the symbol
   */
  set size(s: Size) { this._size = s; }
  get size() { return this._size; }

  /**
   * Renders the DOM necessary to display this symbol.
   */
  render() {
    const sx = this._size.width / 48;
    const sy = this._size.height / 48;
    const tr = this._anchor.toPathString();
    const ro = this._rotation;
    const t =
      `translate(${tr}) rotate(${ro}) scale(${sx}, ${sy})`;

    const pathClass = {
      'rl-svg__symbol': true,
    };

    pathClass[`rl-svg__symbol--${this._pathName}`] = true;
    pathClass[`rl-svg__symbol--${this._pathName}-alt`] = this._alt;

    return (
      <path
        class={pathClass}
        transform={t}
        d={this._path}
      >
      </path>
    );
  }
}
