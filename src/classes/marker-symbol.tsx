// import { MarkerSymbolPaths } from '../interface';
import { Coordinate } from '../utils/coordinate';

enum MarkerSymbolPaths {
  computer = 'M 8 36 c -2 0 -4 -2 -4 -4 v -20 c 0 -2 2 -4 4 -4 h 32 c 2 0 4 2 4 4 v 20 c 0 2 -2 4 -4 4 h 8 v 4 h -48 v -4 z M 8 12 h 32 v 20 h -32 z',
}

interface Size {
  height: number;
  width: number;
}

export class MarkerSymbol {
  _anchor: Coordinate = new Coordinate(0, 0);

  set anchor(c: Coordinate) {
    this._anchor = c;
  }

  get anchor() {
    return this._anchor;
  }

  _path: MarkerSymbolPaths | string = '';
  _pathName = '';
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

  get path() {
    return this._path;
  }

  _rotation = 0;
  set rotation(r: number) {
    // Clamp down the rotation to 0 <= r <= 360
    this._rotation = r % 360;
  }

  get rotation() {
    return this._rotation;
  }

  _size: Size = { width: 1, height: 1 };
  set size(s: Size) {
    this._size = s;
  }

  get size() {
    return this._size;
  }

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
      'rl-map-symbol': true,
    };

    pathClass[`rl-map-symbol--${this._pathName}`] = true;

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
