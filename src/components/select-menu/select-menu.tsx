import { MDCSelect } from '@material/select/index';
import {
  Component,
  Element,
  Event,
  EventEmitter,
  Prop,
  h,
} from '@stencil/core';

let nextId = 0;

/**
 * A component that wraps a `Material Select Menu` component.
 */
@Component({
  tag: 'rl-select-menu',
  styleUrl: 'select-menu.scss',
})
export class Select {
  /**
   * Internal ID used to differentiate multiple menus.
   */
  readonly id = nextId++;

  /**
   * Reference to the internal Material Select component.
   */
  private select!: MDCSelect;

  /**
   * Root element.
   */
  @Element() root!: HTMLElement;

  /**
   * The label displayed on the select.
   */
  @Prop() label = '';

  /**
   * An array of the different options displayed in the select menu.
   */
  @Prop() options: { label: string, value: number }[] = [];

  /**
   * The index of the currently selected option or undefined if nothing selected.
   */
  @Prop() selectedOption?: number;

  /**
   * An event emitted when an item is selected.  The detail of the event is set
   * to the index of the item selected.
   */
  @Event() selected!: EventEmitter<number>;

  componentDidLoad() {
    this.select = new MDCSelect(this.root);
    this.select.listen('MDCSelect:change', () =>
      this.selected.emit(this.select.selectedIndex)
    );
  }

  componentDidUnload() {
    this.select.destroy();
  }

  hostData() {
    return {
      class: {
        'mdc-select': true,
      },
    };
  }

  render() {
    return ([
      <i class="mdc-select__dropdown-icon"></i>,
      <select class="mdc-select__native-control">
        {this.options.map((op, index) =>
          <option
            value={op.value}
            selected={index === this.selectedOption}
          >
            {op.label}
          </option>
        )}
      </select>,
      <label class="mdc-floating-label">{this.label}</label>,
      <div class="mdc-line-ripple"></div>,
    ]);
  }
}
