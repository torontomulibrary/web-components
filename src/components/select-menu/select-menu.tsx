import { MDCSelect } from '@material/select/index';
import {
  Component,
  Element,
  Event,
  EventEmitter,
  Prop,
} from '@stencil/core';

let nextId = 0;

@Component({
  tag: 'rl-select-menu',
  styleUrl: 'select-menu.scss',
})

export class Select {
  readonly id = nextId++;

  private select!: MDCSelect;

  @Element() root!: HTMLElement;

  @Prop() label = '';
  @Prop() options: string[] = [];
  @Prop() selectedOption?: string;

  @Event() selected!: EventEmitter;

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
        {this.options.map(option => {
          const o = option.toLowerCase();
          return option === this.selectedOption ?
          <option value={o} selected>{option}</option> :
          <option value={o}>{option}</option>;
        })}
      </select>,
      <label class="mdc-floating-label">{this.label}</label>,
      <div class="mdc-line-ripple"></div>,
    ]);
  }
}
