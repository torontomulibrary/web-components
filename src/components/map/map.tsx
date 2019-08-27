import {
  Component,
  Element,
  Event,
  EventEmitter,
  Listen,
  Prop,
  State,
  Watch,
  h,
} from '@stencil/core';

import { MapMarker } from '../../classes/map-marker';
import { MapPolygon } from '../../classes/map-polygon';
import {
  MapElementData,
  // MapElementDataMap,
  Size,
} from '../../interface';
import { Coordinate } from '../../utils/coordinate';
import { coordinateFromEvent } from '../../utils/helpers';
import {
  DEFAULT_MAX_SCALE,
  DEFAULT_MIN_SCALE,
  HYSTERESIS,
  STATES,
  computeLimits,
  getTarget,
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
  protected processedElements: (MapMarker | MapPolygon)[] = [];

  /**
   * The MapElement that is the target of any user interaction.
   */
  // protected targetElement?: MapMarker | MapPolygon;
  protected targetElement?: SVGElement;

  /**
   * The original size of the image being displayed by the map.
   */
  // protected imgSize?: Size;
  protected imgSize = { width: 4800, height: 2400 };

  /**
   * The original scale factor used to size the SVG so it fits into the SVG and
   * covers the entire SVG.
   */
  protected initialScale = 1;

  /**
   * The position of the most recent user interaction (mouse/touch-move).
   */
  protected last!: Coordinate;

  /**
   * The bounds used to restrict how far the SVG can be dragged.
   */
  protected limits?: DOMRect;

  /**
   * Timer used to debounce multiple resize events.
   */
  protected resizeDebounce: any;

  /**
   * The initial position of a user interaction (mousedown/touchstart).
   */
  protected start!: Coordinate;

  /**
   * The current state of the Map.
   */
  protected state = STATES.NORMAL;

  // Reference to the root node (`rl-map`).
  @Element() root!: HTMLElement;

  /**
   * The currently active element.
   */
  // @State() activeElement: MapMarker | MapPolygon | undefined;
  @State() activeElement?: SVGElement;

  /**
   * Flag indicating if the map image has loaded or not.
   */
  @State() imageLoaded = false;

  /**
   * The current size of the SVG element used to display the map.
   */
  @State() size: Size = { width: 1, height: 1 };

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
   * The ID of the currently active element.
   */
  // @Prop() activeElementId?: number;
  // @Watch('activeElementId')
  // onActiveElementIdChanged() {
  //   if (this.activeElementId && this.processedElements.length > 0) {
  //     this._setActiveElement(this.processedElements.find(i => i.id === this.activeElementId), false);
  //   }
  // }

  /**
   * An array of the elements that will be displayed on the Map.
   */
  @Prop({ mutable: true }) elements!: MapElementData[];

  /**
   * The image displayed on the Map.
   */
  @Prop() mapImage?: string;
  @Watch('mapImage')
  onMapImageChanged() {
    if (this.mapImage === undefined) {
      return;
    }

    const img = new Image();
    img.src = this.mapImage;
    this.imageLoaded = false;
    img.onload = () => {
      this.imageLoaded = true;

      if (this.imgSize &&
        this.imgSize.width === img.width &&
        this.imgSize.height === img.height) {
          return;
      }

      this.imgSize = { width: img.width, height: img.height };
      this.computeScale();
      this.limits = this.computeLimits();
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
   * An event fired when the user deselects the selected `MapElement`.
   */
  @Event() elementDeselected!: EventEmitter;

  /**
   * An event fired when the user selects a `MapElement`. The clicked element
   * will be passed as the event parameter.
   */
  @Event() elementSelected!: EventEmitter<SVGElement>;

  /**
   * Handle when the list of specified elements changes.
   */
  @Watch('elements')
  onElementsChanged() {
    // if (this.elements !== undefined) {
    this.processedElements = parseElements(this.elements);
    // }
  }

  componentDidLoad() {
    this.onMapImageChanged();
    // this.onElementsChanged();
    // this.onActiveElementIdChanged();
    this.onResize();
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
    const trgt = getTarget(e.target);
    if (trgt !== undefined) {
      // this.targetElement = this.processedElements.find(i => i.id === id);
      this.targetElement = trgt;
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
        if (this.limits !== undefined) {
          const delta = Coordinate.difference(point, this.last);
          this.svgTransform = Coordinate.sum(this.svgTransform, delta).limit(this.limits).round();
        }
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

    switch (this.state) {
      case STATES.DRAGGING:
        if (this.limits !== undefined) {
          const delta = Coordinate.difference(point, this.last);
          this.svgTransform = Coordinate.sum(this.svgTransform, delta).limit(this.limits).round();
        }
        break;
      case STATES.GESTURE_DOWN:
        if (this.targetElement !== undefined) {
          if (this.targetElement !== this.activeElement) {
            this._setActiveElement(this.targetElement);
            this.targetElement = undefined;
          }
        } else {
          if (this.activeElement !== undefined) {
            this.elementDeselected.emit(this.activeElement);
            this._clearActiveElement();
          }
        }
        break;
      default:
    }

    this.state = STATES.NORMAL;
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

      if (this.state === STATES.DRAGGING && this.limits !== undefined) {
        const delta = Coordinate.difference(point, this.last);
        this.svgTransform = Coordinate.sum(this.svgTransform, delta).limit(this.limits).round();
        this.state = STATES.NORMAL;
      }
    }
  }

  /**
   * Handles when the user performs a resize action.
   */
  @Listen('resize', { target: 'window' })
  onResize() {
    clearTimeout(this.resizeDebounce);
    this.resizeDebounce = setTimeout(_ => {
      // Use a 150ms delay to debounce multiple resize calls and effectively
      // perform the resize action only when the user is 'done' resizing.
      this.computeSvgSize();
      this.computeScale();
      this.limits = this.computeLimits();
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

    this.limits = this.computeLimits();
    const newPos = this.toSvgSpace(new Coordinate(e.clientX, e.clientY));
    const delta = Coordinate.difference(newPos, oldPos).scale(this.svgScale);
    this.svgTransform.translate(delta).limit(this.limits).round();
  }

  @Listen('keydown')
  onEnter(e: KeyboardEvent) {
    if (e.key === 'enter' && e.target && e.target instanceof SVGElement &&
      (e.target.classList.contains('rl-map-polygon') ||
      e.target.classList.contains('rl-map-marker'))) {
        const trgt = getTarget(e.target);
        if (trgt !== undefined) {
          // this.targetElement = this.processedElements.find(i => i.id === id);
          this._setActiveElement(trgt);
        }
      // this._setActiveElement(el);
    }
  }

  /**
   * Clears the currently active element.
   */
  private _clearActiveElement() {
    if (this.activeElement) {
      this.activeElement.classList.remove('rl-active');
    }
    this.activeElement = undefined;
  }

  /**
   * Updates the limits used to restrict the how far the SVG transform can be
   * moved keeping the map from being panning beyond the edge of the image.
   */
  private computeLimits() {
    const { imgSize, size } = this;

    if (imgSize !== undefined) {
      return computeLimits(imgSize, size, this.svgScale);
    } else {
      return new DOMRect(0, 0, 1, 1);
    }
  }

  /**
   * Computes the scale factor needed to resize the full map image to be as
   * large as possible, and cropping it vertically/horizontally so no empty
   * space exists if the container has different aspect from the image. This is
   * like CSS `background-size: cover` or SVG `aspectRatio xMidYMid slice`.
   */
  private computeScale() {
    const { imgSize, size } = this;

    if (imgSize === undefined) {
      this.svgScale = this.initialScale = 1;
    } else {
      this.svgScale = this.initialScale =
          Math.max(size.width / imgSize.width, size.height / imgSize.height);
    }
  }

  /**
   * Determines the current size of the SVG element serving as the container
   * for the entire map.
   */
  private computeSvgSize() {
    const root = this.root.querySelector('svg');
    const rect = root && root.getBoundingClientRect();

    if (rect !== null) {
      this.size = { width: rect.width, height: rect.height };
    }
  }

  /**
   * Sets the currently active element of the Map.
   *
   * @param el The Element that will be set as the active element.
   */
  private _setActiveElement(el?: SVGElement, shouldEmit = true) {
    if (!el || (this.activeElement && el.id === this.activeElement.id)) {
      return;
    }

    this._clearActiveElement();
    this.activeElement = el;
    // this.activeElement.active = true;
    this.activeElement.classList.add('rl-active');

    // Emit an event with the original (un-parsed) element as the new 'active'
    // element.  Don't emit an event if the flag is set.
    if (shouldEmit) {
      this.elementSelected.emit(this.activeElement);
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
        'rl-map--loaded': this.imageLoaded,
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
      <svg class="rl-svg">
        <SVGSYM></SVGSYM>
        <g transform={matrix}>
          <LIB02></LIB02>
        </g>
      </svg>
    );
  }
}
