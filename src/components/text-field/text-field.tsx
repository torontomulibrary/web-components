import { MDCTextField } from '@material/textfield/index';
import {
  Component,
  Element,
  Event,
  EventEmitter,
  Prop,
} from '@stencil/core';

let nextId = 0;

@Component({
  tag: 'rl-text-field',
  styleUrl: 'text-field.scss',
})

export class TextField {
  readonly id = nextId++;

  // private input!: HTMLTextAreaElement | HTMLInputElement;

  @Element() root!: HTMLElement;

  @Prop() label = '';

  @Prop() outlined = false;
  @Prop() disabled = false;
  @Prop() fullwidth = false;
  @Prop() textarea = false;

  @Prop() helperText = '';

  @Prop() value = '';

  @Prop() icon = '';
  @Prop() iconLocation: 'trailing' | 'leading' = 'leading';

  @Event() changeValue!: EventEmitter;

  componentDidLoad() {
    new MDCTextField(this.root);
  }

  hostData() {
    return {
      class: {
        'rl-text-field': true,
        'mdc-text-field': true,
        'mdc-text-field--outlined': this.outlined,
        'mdc-text-field--disabled': this.disabled,
        'mdc-text-field--fullwidth': this.fullwidth,
        'mdc-text-field--textarea': this.textarea,
        'mdc-text-field--with-leading-icon': this.icon !== '' && this.iconLocation === 'leading',
        'mdc-text-field--with-trailing-icon': this.icon !== '' && this.iconLocation === 'trailing',
      }
    };
  }

  render() {
    const fieldId = `rl-text-field-${this.id}`;
    const label = (<label htmlFor={fieldId} class={`mdc-floating-label ${this.value !== '' ? 'mdc-floating-label--float-above' : ''}`}>{this.label}</label>);
    const icon = this.icon !== '' ?
      (<i class="material-icons mdc-text-field__icon">{this.icon}</i>) :
      undefined;

    const field = this.textarea ?
    (
      <textarea
        id="textarea"
        class="mdc-text-field__input"
        rows={8}
        cols={40}
        onChange={e => {
          if (e !== undefined && e.target !== undefined &&
              e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement
              && e.target.value) {
            this.changeValue.emit(e.target.value);
          }
        }}
        // ref={el => {if (el !== undefined) { this.input = el; }}}
      >
        {this.value}
      </textarea>
    ) :
    (
      <input
        // ref={el => {if (el !== undefined) { this.input = el; }}}
        type="text"
        id={fieldId}
        class="mdc-text-field__input"
        value={this.value}
        onChange={e => {
          if (e !== undefined && e.target !== undefined &&
              e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement
              && e.target.value) {
            this.changeValue.emit(e.target.value);
          }
        }}
      >
      </input>
    );

    const content = this.textarea ?
    (
      <div class={`mdc-notched-outline ${this.value !== '' ? 'mdc-notched-outline--notched' : ''}`}>
        <div class="mdc-notched-outline__leading"></div>
        <div class="mdc-notched-outline__notch">
          {label}
        </div>
        <div class="mdc-notched-outline__trailing"></div>
      </div>
    ) : this.outlined ?
    (
    <div class={`mdc-notched-outline ${this.value !== '' ? 'mdc-notched-outline--notched' : ''}`}>
      <div class="mdc-notched-outline__leading"></div>
        <div class="mdc-notched-outline__notch">
          {label}
        </div>
      <div class="mdc-notched-outline__trailing"></div>
    </div>
    ) :
    ([label, <div class="mdc-line-ripple"></div>]);

    return ([
      icon,
      field,
      content
    ]);
  }
}
