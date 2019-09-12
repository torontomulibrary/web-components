import { Component, Element, Host, Prop, State, h } from '@stencil/core';

import { Coordinate } from '../../utils/coordinate';

function getPoints(event: TouchEvent | MouseEvent): Coordinate[] {
  if (event instanceof TouchEvent) {
    return Array.from(event.touches).map(t => Coordinate.fromEvent(t));
  } else {
    return [ Coordinate.fromEvent(event) ];
  }
}

/**
 * A component that provides pan and zoom functionality for the content within
 * it.
 */
@Component({
  tag: 'rl-pan-zoom',
  styleUrl: 'pan-zoom.scss',
  shadow: true,
})
export class PanZoom {
  /**
   * Bounds used to define how far the content can be moved.
   */
  private _limits = { x: 0, y: 0, width: 1, height: 1 } as DOMRect;

  /**
   * The initial scale of the content.  Any further scaling is done relative
   * to this value.  This is needed so content can be scaled to fit the size
   * of the `PanZoom` component.
   */
  private _initScale = 1;

  /**
   * The initial size of the content to be moved.
   */
  private _initSize?: { height: number, width: number};

  /**
   * The element used to perform the transform.
   */
  private _tEl?: HTMLElement;

  @Element() root!: HTMLRlPanZoomElement;

  /**
   * The offset from the origin to move the object.
   */
  @State() _d = new Coordinate(0, 0);

  /**
   * The scale factor applied to the object.
   */
  @State() _scale = 1;

  /**
   * The number of active pointer events.
   */
  @State() _active = 0;

  /**
   * All the old pointer event locations.
   */
  @State() _lastPoints: Coordinate[] = [];

  /**
   * If true, the content of the `PanZoom` will be scaled so that it fills
   * the parent container initially.
   */
  @Prop() scaled = false;

  /**
   * If true, the content of the `PanZoom` will be able to move beyond the
   * bounds of the parent container.
   */
  @Prop() unbound = false;

  /**
   * The smallest scale factor allowed when scaling the content.
   */
  @Prop() minScale = 0.5;

  /**
   * The largest factor allowed when scaling the content.  Calculated as a
   * factor of the original size.  So a value of `3` would limit the scale to
   * three times the original size.
   */
  @Prop() maxScale = 3;

  /**
   * Lifecycle event called when the component has been loaded and added to
   * the DOM tree.
   */
  componentDidLoad() {
    this.root.addEventListener('mousedown', this.onPointerDown);
    this.root.addEventListener('touchstart', this.onPointerDown,
        { passive: true });
    this.root.addEventListener('wheel', this.onWheel);

    if (this.scaled) {
      this._setInitialScale();
    }

    if (!this.unbound) {
      this._computeLimits();
    }
  }

  /**
   * Handle when the mouse or a touch goes outside the bounds of the `PanZoom`
   * component.
   */
  onPointerLeave = (event: MouseEvent | TouchEvent): void => {
    this._active--;
    this._lastPoints.pop();

    if (this._active > 0) {
      this._lastPoints = getPoints(event);
      return;
    }

    this.root.removeEventListener('mousemove', this.onPointerMove);
    this.root.removeEventListener('mouseup', this.onPointerUp);
    this.root.removeEventListener('touchmove', this.onPointerMove);
    this.root.removeEventListener('touchend', this.onPointerUp);
    this.root.removeEventListener('mouseleave', this.onPointerLeave);
    this.root.removeEventListener('touchcancel', this.onPointerLeave);
  }

  /**
   * Handle when a mouse button is pressed or a touch event starts.
   */
  onPointerDown = (event: MouseEvent | TouchEvent): void => {
    if (event instanceof MouseEvent && event.button !== 0) {
      return;
    }

    this._lastPoints = getPoints(event);
    this._active++;

    if (this._active === 1) {
      this.root.addEventListener('mousemove', this.onPointerMove);
      this.root.addEventListener('mouseup', this.onPointerUp);
      this.root.addEventListener('touchmove', this.onPointerMove, { passive: true });
      this.root.addEventListener('touchend', this.onPointerUp);
      this.root.addEventListener('mouseleave', this.onPointerLeave);
      this.root.addEventListener('touchcancel', this.onPointerLeave);
    }
  }

  /**
   * Handle when a touch or mouse moves.
   */
  onPointerMove = (event: MouseEvent | TouchEvent): void => {
    if (this._tEl === undefined) {
      return;
    }

    const points = getPoints(event);
    const avgPoint = points.reduce(Coordinate.midpoint);
    const avgLastPoint = this._lastPoints.reduce(Coordinate.midpoint);
    const bounds = this._tEl.getBoundingClientRect();

    this._d.translate(Coordinate.difference(avgPoint, avgLastPoint));

    if (!this.unbound) {
      this._d.limit(this._limits);
    }

    this._lastPoints = points;

    /**
     * Multiple points only exist with touches and should be used to scale the
     * content.
     */
    if (points.length > 1) {
      const scaleDiff = Coordinate.squareDistance(points[0], points[1]) /
          Coordinate.squareDistance(this._lastPoints[0], this._lastPoints[1]);

      if (this._scale * scaleDiff < 0.5 || this._scale * scaleDiff > 3) {
        return;
      }

      this._scale *= scaleDiff;
      this._d.translate(Coordinate.difference(
        Coordinate.fromRectTopLeft(bounds),
        avgPoint
      )).scale(scaleDiff - 1);

      if (!this.unbound) {
        this._d.limit(this._limits);
      }
    }
  }

  /**
   * Handle when a touch ends or a mouse button is released to end the pan.
   */
  onPointerUp = (event: MouseEvent | TouchEvent): void => {
    this._active--;
    this._lastPoints.pop();

    if (this._active > 0) {
      this._lastPoints = getPoints(event);
      return;
    }

    this.root.removeEventListener('mousemove', this.onPointerMove);
    this.root.removeEventListener('mouseup', this.onPointerUp);
    this.root.removeEventListener('touchmove', this.onPointerMove);
    this.root.removeEventListener('touchend', this.onPointerUp);
    this.root.removeEventListener('mouseleave', this.onPointerLeave);
    this.root.removeEventListener('touchcancel', this.onPointerLeave);
  }

  /**
   * Handle a `WheelEvent` to scale the contents.
   */
  onWheel = (event: WheelEvent): void => {
    if (this._tEl === undefined) {
      return;
    }

    const bounds = this._tEl.getBoundingClientRect();
    let delta = -event.deltaY;

    if (event.deltaMode === 1) {
      delta *= 15;
    }

    delta = Math.max(Math.min(delta, 60), -60);

    const scaleDiff = (delta / 300) + 1;

    if (this._scale * scaleDiff < this._initScale * this.minScale ||
        this._scale * scaleDiff > this._initScale * this.maxScale) {
      return;
    }

    this._scale *= scaleDiff;
    this._d.translate(Coordinate.difference(
      Coordinate.fromRectTopLeft(bounds), Coordinate.fromEvent(event)
      ).scale(scaleDiff - 1));

    if (!this.unbound) {
      this._computeLimits();
      this._d.limit(this._limits);
    }
  }

  /**
   * Computes the limits used to constrain how far the content can move.
   */
  private _computeLimits() {
    const content = this.root.querySelector('[slot=pz-content]');

    if (content !== null) {
      if (this._initSize === undefined) {
        const contentBounds = content.getBoundingClientRect();
        this._initSize = {
          height: contentBounds.height,
          width: contentBounds.width,
        };
      }

      const parentBounds = this.root.getBoundingClientRect();

      const contentW = this._initSize.width * this._scale;
      const contentH = this._initSize.height * this._scale;

      this._limits = new DOMRect(
        Math.min(0, parentBounds.width - contentW),   // left / x
        Math.min(0, parentBounds.height - contentH),  // top / y
        Math.abs(contentW - parentBounds.width),      // width
        Math.abs(contentH - parentBounds.height)      // height
      );
    }
  }

  /**
   * Compute the initial scale used to resize the content to best fit within
   * the bounds of the `PanZoom` component.
   */
  private _setInitialScale() {
    const content = this.root.querySelector('[slot=pz-content]');

    if (content !== null) {
      const contentBounds = content.getBoundingClientRect();
      const parentBounds = this.root.getBoundingClientRect();

      this._initScale = this._scale = Math.max(
        parentBounds.width / contentBounds.width,
        parentBounds.height / contentBounds.height
      );
    }
  }

  /**
   * Lifecycle method called when the component needs to redraw.
   */
  render() {
    const style = {
      'transform':
        `translate3d(${this._d.x}px, ${this._d.y}px, 0px) scale(${this._scale})`,
    };

    return (
      <Host class="rl-pan-zoom">
        <div
          class="rl-pan-zoom__transform"
          style={style}
          ref={el => this._tEl = el}
        >
          <slot name="pz-content"></slot>
        </div>
      </Host>
    );
  }
}
