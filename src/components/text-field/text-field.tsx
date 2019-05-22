import { MDCTextField } from '@material/textfield/index';
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
 * A component that wraps a `Material Text Field` component.
 */
@Component({
  tag: 'rl-text-field',
  styleUrl: 'text-field.scss',
})
export class TextField {
  /**
   * Internal ID used to differentiate multiple text fields.
   */
  readonly id = nextId++;

  /**
   * The root element of this component.
   */
  @Element() root!: HTMLElement;

  /**
   * The supplemental label for the text field.
   */
  @Prop() label = '';

  /**
   * A flag indicating if the text field has an outlined style.
   */
  @Prop() outlined = false;

  /**
   * A flag indicating if the text field is disabled and does not allow user
   * input.
   */
  @Prop() disabled = false;

  /**
   * A flag indicating if the text field uses the full-width style.
   */
  @Prop() fullwidth = false;

  /**
   * A flag indicating if the text field uses a textarea instead of an input.
   */
  @Prop() textarea = false;

  /**
   * Additional text displayed below the main text field.
   */
  @Prop() helperText = '';

  /**
   * The current value of the text field input or text area.
   */
  @Prop() value = '';

  /**
   * An icon displayed within the text field.
   */
  @Prop() icon = '';

  /**
   * The location of the icon displayed within the text field.
   */
  @Prop() iconLocation: 'trailing' | 'leading' = 'leading';

  /**
   * An event emitted when the value of the input or textarea changes.
   */
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
          if (e.target !== null &&
              (e.target instanceof HTMLInputElement ||
              e.target instanceof HTMLTextAreaElement)) {
            this.changeValue.emit(e.target.value);
          }
        }}
      >
        {this.value}
      </textarea>
    ) :
    (
      <input
        type="text"
        id={fieldId}
        class="mdc-text-field__input"
        value={this.value}
        onChange={e => {
          if (e.target !== null &&
              (e.target instanceof HTMLInputElement ||
              e.target instanceof HTMLTextAreaElement)) {
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
