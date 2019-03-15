import { Coordinate } from '../utils/coordinate';
import { arrayReplace, pathFromCoordinateArray } from '../utils/helpers';

import { MapElement } from './map-element';

export class MapPolygon extends MapElement {
  _open = false;
  /**
   * If set to true, the `MapPolygon` is not automatically closed.
   */
  set open(open: boolean) { this._open = open; }
  get open() { return this._open; }

  /**
   * A string in SVG Path notation used to draw the polygon based on the array
   * of points.
   */
  _path = '';

  _points: Coordinate[] = [];
  /**
   * An array of `Coordinate`s that is used to draw the Polygon
   */
  set points(newPoint: Coordinate[]) {
    this._points = newPoint;
    this._path = pathFromCoordinateArray(newPoint);
  }

  get points() { return this._points; }

  /**
   * Renders the `MapRegion`.
   */
  render() {
    if (this._visible === false) {
      return undefined;
    }

    const regionClass = {
      'rl-map-polygon': true,
      'rl-map-polygon--activated': this._active,
    };

    return (
      <path
        id={this._id}
        class={regionClass}
        d={this._path}
        tabindex="0"
        aria-label={this._name}
        role="button"
      />
    );
  }

  /**
   * Generates the DOM necessary to display the control points for this
   * `MapElement`.  There are control points at the median and endpoint of each
   * edge.  This allows any point of the `MapElement` to be moved as well as new
   * point created on each line.
   */
  renderControls() {
    const pts = this._points;

    // If there are no points, or element is not visible, don't render controls.
    if (this._visible === false || pts.length === 0) {
      return undefined;
    }

    // Draw controls for every point except the last one, unless the
    const points = pts.filter((_, idx) => (
      pts.length === 1 || (this._open && idx === pts.length - 1 ? false : true)
    )).map((i, index) => {
      const controls = [(
        <circle
          cx={i.x}
          cy={i.y}
          r={8 / this._scale}
          index={index * 2}
          class="rl-map-control"
        />
      )];

      if (!this._open) {
        // Midpoint
        const mid = (index === pts.length - 1) ?
          Coordinate.midpoint(i, pts[0]) :
          Coordinate.midpoint(i, pts[index + 1]);

        controls.push((
          <circle
            cx={mid.x}
            cy={mid.y}
            r={8 / this._scale}
            index={index * 2 + 1}
            class="rl-map-midpoint"
          />
        ));
      }

      return controls;
    });

    // Render an additional line to 'connect the dots' of the control points.
    const path = (
      <path
        class="rl-map-outline"
        d={pathFromCoordinateArray(pts, this._open)}
      />
    );

    return (<g>{path}{points}</g>);
  }

  /**
   * Add a new point to the array of points that represent this `MapRegion`.
   * @param c The `Coordinate` representing the point to add
   * @param index The index where the point should be added.  If not specified,
   * adds the point at the end
   */
  addPoint(c: Coordinate, index?: number) {
    const pts = this._points;

    this._points = index !== undefined ?
      [ ...pts.slice(0, index), c, ...pts.slice(index) ] :
      [ ...pts, c ];
  }

  /**
   * Move this `MapRegion` by a specified offset.
   * @param delta The amount to move by
   */
  move(delta: Coordinate) {
    this._points.forEach(c => c.translate(delta));
    this._path = pathFromCoordinateArray(this._points);
  }

  /**
   * Move a single point of this `MapRegion` by a specified amount.
   * @param delta The amount to move by
   * @param index The index of the point to move
   */
  movePoint(delta: Coordinate, index: number) {
    const p = this._points;
    this._points = arrayReplace(p, index, p[index].translate(delta));
  }

  /**
   * Remove a point from the array of points that represent this `MapRegion`.
   * If no index is specified, the last point is removed.
   * @param index The index of the point to remove
   */
  removePoint(index?: number) {
    if (index !== undefined) {
      this._points.splice(index, 1);
    } else {
      this._points.splice(this._points.length - 1, 1);
    }
    this._path = pathFromCoordinateArray(this._points);
  }
}
