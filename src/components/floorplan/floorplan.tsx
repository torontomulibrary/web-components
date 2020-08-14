import {
  LIB02Flat,
} from './floors';
import { Component, Event, EventEmitter, Host, Prop, h } from '@stencil/core';

import { SVGContent } from './content';
import { SVGDefs } from './defs';

@Component({
  tag: 'rl-floorplan',
  styleUrl: 'floorplan.scss',
  shadow: true,
})
export class Floorplan {
  private data = {
    'LIB-02' : LIB02Flat,
  };

  /**
   * Event fired when an element in the SVG is clicked (if it is clickable).
   * Details will be the `id` of the clicked element.
   */
  @Event() rlElementClicked!: EventEmitter<string>;

  /**
   * Event fired when the SVG is clicked but no specific element is targeted,
   * that is, the active element is cleared.
   */
  @Event() rlElementCleared!: EventEmitter<void>;

  /**
   * An array of extra attributes that will be assigned to each element based
   * on the element's code.
   */
  @Prop() extraElementData?: {[key: string]: { [key: string]: string }};

  /**
   * The ID of the floorplan to display.
   */
  @Prop() floorId?: string;

  /**
   * The height for the SVG element.
   */
  @Prop() height = '2400';

  /**
   * The width for the SVG element.
   */
  @Prop() width = '4800';

  /**
   * Setting to use the orthographic variant of the floorplan.
   */
  @Prop() useOrtho = false;

  /**
   * Setting to true adds a viewbox attribute to the SVG element.
   */
  @Prop() useViewbox = false;

  /**
   * The width of the SVG viewbox.
   */
  @Prop() vbHeight = this.height;

  /**
   * The height of the SVG viewbox.
   */
  @Prop() vbWidth = this.width;

  render() {
    const elements = this.floorId !== undefined && this.data[this.floorId] !== undefined
        ? this.data[this.floorId]
        : [{
            'elem': 'text',
            'prefix': '',
            'local': 'text',
            'attrs': {
              'style': 'font-size: 72px; text-anchor: middle;',
              'x': '50%',
              'y': '50%',
            },
            'content': [{
              'text': 'No SVG Specified',
            }],
          }];

    return (
      <Host class="rl-floorplan">
        <svg
          width={this.width}
          height={this.height}
          viewBox={this.useViewbox ? `0 0 ${this.vbWidth} ${this.vbHeight}` : undefined}
          class="rl-floorplan__svg"
          onClick={(e: MouseEvent) => {
            if (e.target instanceof SVGElement && e.target.classList.contains('rl-clickable')) {
              this.rlElementClicked.emit(e.target.id);
            } else {
              this.rlElementCleared.emit();
            }
          }}
        >
          <SVGDefs></SVGDefs>
          <g>
            <SVGContent elements={elements} extra={this.extraElementData}></SVGContent>
          </g>
        </svg>
      </Host>
    );
  }

}
