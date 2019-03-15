import { Coordinate } from '../utils/coordinate';

interface Size {
  height: number;
  width: number;
}

export class MarkerIcon {
  _anchor: Coordinate = new Coordinate(0, 0);

  set anchor(c: Coordinate) {
    this._anchor = c;
  }

  get anchor() {
    return this._anchor;
  }

  _originalSize = { width: 1, height: 1 };
  set originalSize(s: Size) {
    this._originalSize = s;
  }

  get originalSize() {
    return this._originalSize;
  }

  _size: Size = { width: 1, height: 1 };
  set size(s: Size) {
    this._size = s;
  }

  get size() {
    return this._size;
  }

  _scale = 1;
  set scale(s: number) {
    this._scale = s;
  }

  get scale() {
    return this._scale;
  }

  _url = '';
  set url(url: string) {
    this._url = url;
  }

  get url() {
    return this._url;
  }

  /**
   * Renders the DOM necessary to display this symbol.
   */
  render() {
    const t = `translate(${this._anchor.toPathString()}) scale(${this._scale})`;

    return (
      <image
        class="rl-map-element__icon"
        // Don't set width.  Some icons are not square and leaving width
        // unset will set the width automatically while keeping aspect.
        height={this.size.height}
        transform={t}
        xlinkHref={this._url}
      />
    );
  }
}
