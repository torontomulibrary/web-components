import {
  Component,
  Element,
  Event,
  EventEmitter,
  Listen,
  Method,
  Prop,
  State,
  Watch,
} from '@stencil/core';

import { MapMarker } from '../../classes/map-marker';
import { MapPolygon } from '../../classes/map-polygon';
import {
  MapElementDataMap,
} from '../../interface';
import { Coordinate } from '../../utils/coordinate';
import { coordinateFromEvent } from '../../utils/helpers';
import {
  DEFAULT_MAX_SCALE,
  DEFAULT_MIN_SCALE,
  HYSTERESIS,
  STATES,
  computeLimits,
  getTargetId,
  parseElements,
} from '../../utils/map-base';

@Component({
  tag: 'rl-map',
  styleUrl: 'map.scss',
})

export class RLMap {
  /**
   * The array of MapElements currently being displayed.  Created from the
   * `elements` Prop with additional internal information added.
   */
  private processedElements: (MapMarker | MapPolygon)[] = [];

  // The element being targeted by user interaction.
  private targetElement: MapMarker | MapPolygon | undefined;

  // The full size of the image being displayed by the map.
  private imgSize!: DOMRect;

  // The original scale factor used to size the SVG so it fits.
  private initialScale = 1;

  // The position of the most recent user interaction (mouse/touch-move).
  private last!: Coordinate;

  // The bounds used to restrict how far the SVG can be dragged.
  private limits!: DOMRect;

  // Timer reference used to debounce multiple resize events.
  private resizeDebounce: any;

  // The initial position of a user interaction (mousedown/touchstart).
  private start!: Coordinate;

  // The current state of the Map.
  private state = STATES.NORMAL;

  // The current size of the SVG element used to display the map.
  private svgSize!: DOMRect;

  // Reference to the root node (`rl-map`).
  @Element() root!: HTMLElement;

  /**
   * The currently active element.
   */
  @State() activeElement: MapMarker | MapPolygon | undefined;

  /**
   * The factor by which the Map contents are changed to fit within the SVG.
   */
  @State() svgScale = 1;

  /**
   * The x,y translation applied to move the map contents within the bounds of
   * the SVG.
   */
  @State() svgTransform = new Coordinate(0, 0);

  /**
   * An image that will be displayed on the Map.
   */
  @Prop() mapImage?: string;
  @Watch('mapImage')
   /**
    * Handles when the map Image is loaded/updated.
    */
  onMapImageChanged() {
    if (this.mapImage === undefined) {
      return;
    }

    const img = new Image();
    img.src = this.mapImage;
    img.onload = () => {
      if (this.imgSize &&
        this.imgSize.width === img.width &&
        this.imgSize.height === img.height) {
          return;
      }

      this.imgSize = new DOMRect(0, 0, img.width, img.height);
      this.computeSvgSize();
      this.computeScale();
      this.computeLimits();
    };
  }

  /**
   *  The maximum scale factor.
   */
  @Prop() maxScale: number = DEFAULT_MAX_SCALE;

  /**
   * The minimum scale factor.
   */
  @Prop() minScale: number = DEFAULT_MIN_SCALE;

  /**
   * An event fired when the user selects a MapElement. The clicked element
   * will be passed as the event parameter.
   */
  @Event() elementSelected!: EventEmitter;

  /**
   * An event fired when the user deselects the selected MapElement. The clicked
   * element will be passed as the event parameter.
   */
  @Event() elementDeselected!: EventEmitter;

  /**
   * An event fired when the map floorplan is updated.
   */
  @Event() mapRendered!: EventEmitter;

  /**
   * An array of the elements that will be displayed on the Map.
   */
  @Prop({ mutable: true }) elements!: MapElementDataMap;
  /**
   * Handle when the list of specified elements changes.
   */
  @Watch('elements')
  onElementsChanged() {
    this.processedElements = parseElements(this.elements);
  }

  componentDidLoad() {
    this.onMapImageChanged();
    this.onElementsChanged();
    this.onResize();

  }

  componentDidUpdate() {
    this.mapRendered.emit();
  }

  /**
   * Handles when the user triggers a touch/down event to start interaction with
   * the map.
   * @param e The triggering event.
   */
  @Listen('mousedown')
  @Listen('touchstart')
  onGestureDown(e: Event) {
    this.start = this.last = coordinateFromEvent(e, this.root);

    if (this.state === STATES.NORMAL) {
      this.state = STATES.GESTURE_DOWN;
    }

    // Get the ID of the event target, if it is the correct type.
    const id = getTargetId(e.target);
    if (id !== undefined) {
      this.targetElement = this.processedElements.find(i => i.id === id);
    }
  }

  /**
   * Handles when the user triggers a movement event.
   * @param e The triggering event.
   */
  @Listen('mousemove')
  @Listen('touchmove')
  onGestureMove(e: Event) {
    if (this.state === STATES.NORMAL) {
      return;
    }

    // Convert the coordinate to SVG coordinate space.
    const point = coordinateFromEvent(e, this.root);

    switch (this.state) {
      case STATES.GESTURE_DOWN:
        const dist = Coordinate.squareDistance(this.start, point);
        if (dist > HYSTERESIS) {
          this.state = STATES.DRAGGING;
        }
        break;
      case STATES.DRAGGING:
        const delta = Coordinate.difference(point, this.last);
        this.svgTransform = Coordinate.sum(this.svgTransform, delta).limit(this.limits).round();
        break;
      default:
    }

    this.last = point;
  }

  /**
   * Handles when the user ends their interaction with the Map.
   * @param e The triggering event.
   */
  @Listen('mouseup')
  @Listen('touchend')
  onGestureUp(e: Event) {
    const point = coordinateFromEvent(e, this.root);

    if (this.state === STATES.DRAGGING) {
      const delta = Coordinate.difference(point, this.last);
      this.svgTransform = Coordinate.sum(this.svgTransform, delta).limit(this.limits).round();
      this.state = STATES.NORMAL;
    } else if (this.state === STATES.GESTURE_DOWN) {
      if (this.targetElement) {
        if (this.targetElement !== this.activeElement && this.targetElement.clickable) {
          this._setActiveElement(this.targetElement);
          this.targetElement = undefined;
        }
      } else {
        if (this.activeElement) {
          this.elementDeselected.emit(this.activeElement);
          this._clearActiveElement();
        }
      }
      this.state = STATES.NORMAL;
    }
  }

  /**
   * Handles when the user leaves the bounds of the Map entirely.
   * @param e The triggering event.
   */
  @Listen('mouseleave')
  onMouseLeave(e: Event) {
    if (this.state === STATES.DRAGGING ||
        this.state === STATES.GESTURE_DOWN) {
      this.state = STATES.NORMAL;
      const point = coordinateFromEvent(e, this.root);

      if (this.state === STATES.DRAGGING) {
        const delta = Coordinate.difference(point, this.last);
        this.svgTransform = Coordinate.sum(this.svgTransform, delta).limit(this.limits).round();
        this.state = STATES.NORMAL;
      }
    }
  }

  /**
   * Handles when the user performs a resize action.
   */
  @Listen('window:resize')
  onResize() {
    clearTimeout(this.resizeDebounce);
    this.resizeDebounce = setTimeout(_ => {
      // Use a 150ms delay to debounce multiple resize calls and effectively
      // perform the resize action only when the user is 'done' resizing.
      this.computeSvgSize();
      this.computeScale();
      this.computeLimits();
      this.svgTransform = this.svgTransform.clone().limit(this.limits);
    }, 150);
  }

  /**
   * Handles when the user performs a mouse wheen event.  The Map will be zoomed
   * in or out depending on the direction of the wheel.
   *
   * @param e The triggering event.
   */
  @Listen('wheel')
  onWheel(e: WheelEvent) {
    const oldPos = this.toSvgSpace(new Coordinate(e.clientX, e.clientY));

    if (e.deltaY < 0) {
      if (this.svgScale * 1.05263157895 < this.initialScale * this.maxScale) {
        this.svgScale *= 1.05263157895;
      }
    } else {
      if (this.svgScale * 0.95 > this.initialScale * this.minScale) {
        this.svgScale *= 0.95;
      }
    }

    this.computeLimits();
    const newPos = this.toSvgSpace(new Coordinate(e.clientX, e.clientY));
    const delta = Coordinate.difference(newPos, oldPos).scale(this.svgScale);
    this.svgTransform.translate(delta).limit(this.limits).round();
  }

  @Listen('keydown')
  onEnter(e: KeyboardEvent) {
    if (e.key === 'enter' && e.target && e.target instanceof SVGElement &&
      (e.target.classList.contains('rl-map-polygon') ||
      e.target.classList.contains('rl-map-marker'))) {
      const id = Number(e.target.id);
      const el = this.processedElements.find(i => i.id === id);
      this._setActiveElement(el);
    }
  }

  /**
   * Clears the currently active element.
   */
  @Method()
  clearActiveElement() {
    this._clearActiveElement();
  }

  /**
   * Sets the element with the specified ID to active.
   *
   * @param id The ID of the element to set as active.
   */
  @Method()
  setActiveElement(id: number) {
    if (this.processedElements.length > 0) {
      this._setActiveElement(this.processedElements.find(i => i.id === id), false);
    }
  }

  /**
   * Clears the currently active element.
   */
  private _clearActiveElement() {
    if (this.activeElement) {
      this.activeElement.active = false;
    }
    this.activeElement = undefined;
  }

  /**
   * Updates the limits used to restrict the how far the SVG transform can be
   * moved keeping the map from being panning beyond the edge of the image.
   */
  private computeLimits() {
    this.limits = computeLimits(this.imgSize, this.svgSize, this.svgScale);
  }

  /**
   * Computes the scale factor needed to resize the full map image to be as
   * large as possible, and cropping it vertically/horizontally so no empty
   * space exists if the container has different aspect from the image. This is
   * like CSS `background-size: cover` or SVG `aspectRatio xMidYMid slice`.
   */
  private computeScale() {
    const img = this.imgSize;
    const svg = this.svgSize;

    // if (img === undefined || svg === undefined) {
    //   this.svgScale = this.initialScale = 1;
    // } else {
    this.svgScale = this.initialScale =
        Math.max(svg.width / img.width, svg.height / img.height);
    // }
  }

  /**
   * Determines the current size of the SVG element serving as the container
   * for the entire map.
   */
  private computeSvgSize() {
    const root = this.root.querySelector('svg');
    const svg = root && root.getBoundingClientRect();

    if (svg !== null) {
      this.svgSize = new DOMRect(0, 0, svg.width, svg.height);
    }
  }

  /**
   * Sets the currently active element of the Map.
   *
   * @param el The Element that will be set as the active element.
   */
  private _setActiveElement(el?: MapMarker | MapPolygon, shouldEmit = true) {
    if (!el || (this.activeElement && el.id === this.activeElement.id)) {
      return;
    }

    this.clearActiveElement();
    this.activeElement = el;
    this.activeElement.active = true;

    // Emit an event with the original (un-parsed) element as the new 'active'
    // element.  Don't emit an event if the flag is set.
    if (shouldEmit) {
      this.elementSelected.emit(this.elements[this.activeElement.id]);
    }
  }

  /**
   * Scales a given `Coordinate` by the inverse of the current `svgScale`.
   * Returns a new `Coordinate` with its values scaled and rounded.
   * @param c A `Coordinate` scale.
   */
  private toSvgScale(c: Coordinate) {
    return c.clone().scale(1 / this.svgScale).round();
  }

  /**
   * Converts a given `Coordinate` object in screen coordinate space to SVG
   * coordinate space.
   * @param c A `Coordinate` to convert to SVG coordinate space.
   */
  private toSvgSpace(c: Coordinate) {
    return Coordinate.difference(this.toSvgScale(c), this.toSvgScale(this.svgTransform));
  }

  hostData() {
    return {
      class: {
        'rl-map': true,
      },
    };
  }

  render() {
    const m = [
      this.svgScale, 0, 0, this.svgScale,
      this.svgTransform.x,
      this.svgTransform.y,
    ];
    const matrix = 'matrix(' + m.join(',') + ')';

    return (
      <svg class="rl-map__svg">
        <g class="rl-map__transform" transform={matrix}>
          <g class="rl-map__image-wrapper">
            <image
              class="rl-map__image"
              xlinkHref={this.mapImage !== undefined ? this.mapImage : undefined}
            >
            </image>
          </g>
          <g class="rl-map__elements">
            {this.processedElements.map(el => el.render())}
          </g>
        </g>
      </svg>
    );
  }
}
