import { h } from '@stencil/core';

import { Coordinate } from '../utils/coordinate';
import { pathFromCoordinateArray } from '../utils/helpers';

import { MapElement } from './map-element';

/**
 * A type of `MapElement`.  A polygon is a shape drawn onto a `Map` based on a
 * path consisting of three or more `Coordinates`.
 */
export class MapPolygon extends MapElement {
  _open = false;
  /**
   * If set to true, this `MapPolygon` is not automatically closed.
   */
  set open(open: boolean) {
    this._open = open;
    this._path = pathFromCoordinateArray(this._points, open);
  }
  get open() { return this._open; }

  /**
   * A string in SVG Path notation used to draw this `MapPolygon`.
   */
  _path = '';

  _points: Coordinate[] = [];
  /**
   * An array of `Coordinate`s that correspond to the points of this `MapPolygon`.
   */
  set points(newPoint: Coordinate[]) {
    this._points = newPoint;
    this._path = pathFromCoordinateArray(newPoint, this._open);
  }
  get points() { return this._points; }

  /**
   * Add a new point to the array of points that represent this `MapRegion`.
   * @param c The `Coordinate` representing the point to add
   * @param index The index where the point should be added.  If not specified,
   * adds the point at the end
   */
  addPoint(c: Coordinate, index?: number) {
    const pts = this._points;

    this.points = index !== undefined ?
      [ ...pts.slice(0, index), c, ...pts.slice(index) ] :
      [ ...pts, c ];
  }

  /**
   * Move this `MapRegion` by a specified offset.
   * @param delta The amount to move by
   */
  move(delta: Coordinate) {
    const p = this.points;
    p.forEach(c => c.translate(delta));
    this.points = [ ...p ];
  }

  /**
   * Move a single point of this `MapRegion` by a specified amount.
   * @param delta The amount to move by
   * @param index The index of the point to move
   */
  movePoint(delta: Coordinate, index: number) {
    const p = this.points;
    p[index].translate(delta);
    this.points = [ ...p ];
    // this.points = arrayReplace(p, index, p[index].translate(delta));
  }

  /**
   * Remove a point from the array of points that represent this `MapRegion`.
   * If no index is specified, the last point is removed.
   * @param index The index of the point to remove
   */
  removePoint(index?: number) {
    const p = this._points;
    if (index !== undefined) {
      p.splice(index, 1);
    } else {
      p.splice(p.length - 1, 1);
    }
    this.points = [ ...p ];
  }

  /**
   * Renders the `MapPolygon`.
   */
  render() {
    if (this._visible === false) {
      return undefined;
    }

    const classname = {
      'rl-svg__polygon': true,
      'rl-svg__polygon--activated': this._active && !this._open,
      'rl-svg__polygon--open': this._open,
    };

    return (
      <g id={`${this._id}`} class={classname}>
        <path
          d={this._path}
          tabIndex={0}
          aria-label={this._name}
          role="button"
        />
      </g>
    );
  }

  /**
   * Generates the DOM necessary to display the control points for this
   * `MapElement`.  There are control points at the median and endpoint of each
   * edge.  This allows any point of the `MapElement` to be moved as well as new
   * point created on each line.
   */
  renderControls() {
    // if (!this._active && !this._open) {
    //   return undefined;
    // }

    const pts = this._points;

    // If there are no points, or element is not visible, don't render controls.
    if (this._visible === false || pts.length === 0) {
      return undefined;
    }

    // Create a control for each point.  Don't create a control for the last
    // point of an open path though.
    const points = pts.filter((_, idx) => (
      pts.length === 1 || (this._open && idx === pts.length - 1 ? false : true)
    )).map((i, index) => {
      const controls = [(
        <circle
          cx={i.x}
          cy={i.y}
          r={8 / this._scale}
          data-index={index * 2}
          class="rl-svg__control"
        />
      )];

      // Create a midpoint control.  This allows an edge segment to be split.
      if (!this._open) {
        const mid = (index === pts.length - 1) ?
          Coordinate.midpoint(i, pts[0]) :
          Coordinate.midpoint(i, pts[index + 1]);

        controls.push((
          <circle
            cx={mid.x}
            cy={mid.y}
            r={8 / this._scale}
            data-index={index * 2 + 1}
            class="rl-svg__midpoint"
          />
        ));
      }

      return controls;
    });

    // Render an additional line to 'connect the dots' of the control points.
    const path = (
      <path
        class="rl-svg__polygon-outline"
        d={pathFromCoordinateArray(pts, this._open)}
      />
    );

    return [path, points];
  }
}
