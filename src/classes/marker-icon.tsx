import { Coordinate } from '../utils/coordinate';

interface Size {
  height: number;
  width: number;
}

/**
 * An image displayed as the icon of a `MapMarker`.
 */
export class MarkerIcon {
  _anchor: Coordinate = new Coordinate(0, 0);
  /**
   * The position of the icon relative to the marker.
   */
  set anchor(c: Coordinate) { this._anchor = c; }
  get anchor() { return this._anchor; }

  _originalSize = { width: 1, height: 1 };
  /**
   * The natural size of the image without any scaling.
   */
  set originalSize(s: Size) { this._originalSize = s; }
  get originalSize() { return this._originalSize; }

  _size: Size = { width: 1, height: 1 };
  /**
   * The size of the image after scaling.
   */
  set size(s: Size) { this._size = s; }
  get size() { return this._size; }

  _scale = 1;
  /**
   * The factor by which to scale the image.
   */
  set scale(s: number) { this._scale = s; }
  get scale() { return this._scale; }

  _url = '';
  /**
   * The URL of the image.
   */
  set url(url: string) { this._url = url; }
  get url() { return this._url; }

  /**
   * Renders the DOM necessary to display the icon.
   */
  render() {
    const t = `translate(${this._anchor.toPathString()}) scale(${this._scale})`;

    return (
      <image
        class="rl-svg__icon"
        // Don't set width.  Some icons are not square and leaving width
        // unset will set the width automatically while keeping aspect.
        height={this.size.height}
        transform={t}
        xlinkHref={this._url}
      />
    );
  }
}
