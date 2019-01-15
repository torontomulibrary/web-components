import { Coordinate } from '../utils/coordinate';

import { MapElement } from './map-element';

const CONTROL_SIZE = 100;

export class MapPoint extends MapElement {
  origin: Coordinate = new Coordinate(0, 0);

  set coordinates(newCoordinates: Coordinate[]) {
    this._coordinates = newCoordinates;
    this.origin = newCoordinates[0];
  }

  get coordinates() {
    return [ this.origin ];
  }

  render() {
    if (!this.enabled) {
      return undefined;
    }

    const rectClass = {
      'rl-map-element': true,
      'rl-map-element__rect': true,
      'rl-map-element__rect--activated': this.active,
    };

    let contents: JSX.Element[] = [];
    let totalWidth = 0;

    if (this.icons && this.icons.length) {

      contents = this.icons.map(icon => {
        const x = totalWidth;
        const scale = CONTROL_SIZE / (icon.width ? icon.width : 1);
        totalWidth += icon.width ? (icon.width * scale) : CONTROL_SIZE;


        return ([
          <image
            class="rl-map-element__icon"
            // Don't set width.  Some icons are not square and leaving width
            // unset will set the width automatically while keeping aspect.
            height={CONTROL_SIZE}
            x={x}
            xlinkHref={icon.src}
          />,
        ]);
      });

      let aspect = CONTROL_SIZE / totalWidth;
      aspect = isNaN(aspect) ? 1 : aspect;

      contents.push((
        <rect
          class={rectClass}
          width={CONTROL_SIZE / aspect}
          height={CONTROL_SIZE}
          rx="12"
          ry="12"
        />
      ));
    } else {
      totalWidth = CONTROL_SIZE;
      contents.push((<rect class={rectClass} rx="12" ry="12" width={CONTROL_SIZE} height={CONTROL_SIZE}/>));
    }

    const gTrans = 'translate(' + (this.origin.x - totalWidth / 2) +
    ' ' + (this.origin.y - CONTROL_SIZE / 2) + ')';

    return (
      <g id={this.id} class="rl-map-element__point" tabindex="0" transform={gTrans}>
        {contents}
      </g>
    );
  }

  /**
   * An empty function that exists just to satisfy Typescript typings.
   */
  removePoint() {
    // No-op
  }

  /**
   * Adds a new point to this `MapElement`.  Since `MapPoint`s represent a
   * single point on a map, calling this function will simply set the current
   * position of the Point.
   * @param c The `Coordinate` that will get added
   * @param index Unused.
   */
  addPoint(c: Coordinate, index?: number) {
    this.origin = c;
    index = index;
  }

  /**
   * Renders any elements needed to control the editing (moving) of this point.
   */
  renderControls() {
    return undefined;
  }

  /**
   * Moves a point by a given amount.  Since a `MapPoint` only has one point,
   * this function simply moves the origin by the specified amount.
   * @param delta The amount to move the point by
   * @param index Unused
   */
  movePoint(delta: Coordinate, index: number) {
    this.origin.translate(delta);
    index = index;
  }
}
