import { Component, Element, Event, EventEmitter, FunctionalComponent, Host, Prop, Watch, h } from '@stencil/core';

import { SVGSYM } from './sym';

@Component({
  tag: 'rl-svg-floorplan',
  styleUrl: 'svg-floorplan.scss',
  shadow: true
})
export class SVGFloorplan {
  private svgRoot?: SVGElement;

  @Element() root!: HTMLRlSvgFloorplanElement;

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
   * The contents of the SVG, as a `FunctionalComponent`.
   */
  @Prop() svg?: FunctionalComponent;

  /**
   * The width for the SVG element.
   */
  @Prop() width = '4800';

  /**
   * The height for the SVG element.
   */
  @Prop() height = '2400';

  /**
   * The height of the SVG viewbox.
   */
  @Prop() vbWidth = this.width;

  /**
   * The width of the SVG viewbox.
   */
  @Prop() vbHeight = this.height;

  /**
   * Setting to true adds a viewbox attribute to the SVG element.
   */
  @Prop() useViewbox = false;

  /**
   * The ID of the active (selected) element.
   */
  @Prop() activeId = '';
  @Watch('activeId')
  onActiveIdChange(newVal: string, oldVal: string) {
    if (newVal !== oldVal && this.svgRoot !== undefined) {
      const selected = this.svgRoot.querySelector('.rl-svg-floorplan--selected');

      if (selected !== null) {
        selected.classList.remove('rl-svg-floorplan--selected');
      }

      if (newVal !== '') {
        const active = this.svgRoot.querySelector(`#${newVal}`);
        if (active !== null) {
          active.classList.add('rl-svg-floorplan--selected');
        }
      }
    }
  }

  render() {
    const SVG = this.svg !== undefined ? this.svg : () => ([
      <text x="50%" y="50%" style={{ 'font-size': '72px', 'text-anchor': 'middle' }}>No SVG Specified</text>,
    ]);

    return (
      <Host class="rl-svg-floorplan">
        <svg
          width={this.width}
          height={this.height}
          viewBox={this.useViewbox ? `0 0 ${this.vbWidth} ${this.vbHeight}` : undefined}
          class="rl-svg-floorplan__svg"
          ref={e => this.svgRoot = e}
          onClick={(e: MouseEvent) => {
            if (e.target instanceof SVGElement && e.target.classList.contains('rl-clickable')) {
              this.rlElementClicked.emit(e.target.id);
            } else {
              this.rlElementCleared.emit();
            }
          }}
        >
          <SVGSYM></SVGSYM>
          <g>
            <SVG></SVG>
          </g>
        </svg>
      </Host>
    );
  }

}
