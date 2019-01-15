import { Coordinate } from '../utils/coordinate';
import { arrayReplace, pathFromCoordinateArray } from '../utils/helpers';

import { MapElement } from './map-element';

export class MapRegion extends MapElement {
  open = false;

  path = '';

  set coordinates(newCoordinates: Coordinate[]) {
    this._coordinates = newCoordinates;
    this.path = pathFromCoordinateArray(newCoordinates);
  }

  get coordinates() {
    return this._coordinates;
  }

  /**
   * Renders the `MapRegion`.
   */
  render() {
    if (!this.enabled) {
      return undefined;
    }

    const regionClass = {
      'rl-map-element': true,
      'rl-map-element__region': true,
      'rl-map-element__region--activated': this.active,
    };

    return (
      <path
        id={this.id}
        class={regionClass}
        d={this.path}
        tabindex="0"
        aria-label={this.name}
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
    const coords = this._coordinates;

    if (coords.length === 0) {
      return (<g/>);
    }

    const points = coords.filter((_, idx) => (
      coords.length === 1 || (this.open && idx === coords.length - 1 ? false : true)
    )).map((i, index) => {
      const controls = [(<circle cx={i.x} cy={i.y} r={8 / this.scale} index={index * 2} class="rl-map-element__control" />)];

      if (!this.open) {
        // Midpoint
        const mid = (index === coords.length - 1) ? Coordinate.midpoint(i, coords[0]) :
          Coordinate.midpoint(i, coords[index + 1]);

        controls.push((<circle cx={mid.x} cy={mid.y} r={8 / this.scale} index={index * 2 + 1} class="rl-map-element__midpoint" />));
      }

      return controls;
    });

    const path = (<path class="rl-map-element__outline" d={pathFromCoordinateArray(coords, this.open)} />);

    return (<g>{path}{points}</g>);
  }

  /**
   * Add a new point to the array of points that represent this `MapRegion`.
   * @param c The `Coordinate` representing the point to add
   * @param index The index where the point should be added.  If not specified,
   * adds the point at the end
   */
  addPoint(c: Coordinate, index?: number) {
    const coords = this._coordinates;

    this.coordinates = index !== undefined ?
      [...coords.slice(0, index), c, ...coords.slice(index)] :
      [ ...coords, c ];
  }

  /**
   * Remove a point from the array of points that represent this `MapRegion`.
   * If no index is specified, the last point is removed.
   * @param index The index of the point to remove
   */
  removePoint(index?: number) {
    if (index !== undefined) {
      this.coordinates.splice(index, 1);
    } else {
      this.coordinates.splice(this._coordinates.length - 1, 1);
    }
  }

  /**
   * Move this `MapRegion` by a specified offset.
   * @param delta The amount to move by
   */
  move(delta: Coordinate) {
    super.move(delta);
    this.path = pathFromCoordinateArray(this.coordinates);
  }

  /**
   * Move a single point of this `MapRegion` by a specified amount.
   * @param delta The amount to move by
   * @param index The index of the point to move
   */
  movePoint(delta: Coordinate, index: number) {
    const c = this.coordinates;
    this.coordinates = arrayReplace(c, index, c[index].translate(delta));
  }
}
