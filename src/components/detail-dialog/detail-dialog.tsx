import { MDCDialog } from '@material/dialog/index';
import {
  Component,
  Element,
  Event,
  EventEmitter,
  Method,
  Prop,
  h,
} from '@stencil/core';

import {
  MapElementDetail,
  MapElementDetailMap,
  MapElementDetailType
} from '../../interface';

let nextId = 0;

@Component({
  tag: 'rl-detail-dialog',
  styleUrl: 'detail-dialog.scss',
})

export class DetailDialog {
  /**
   * Internal index used to differentiate multiple dialogs.
   */
  private index = nextId++;

  /**
   * Reference to the Material Dialog underlying this `DetailDialog`.
   */
  private dialog!: MDCDialog;

  /**
   * Array of the child `DetailDialogItem` elements.
   */
  private detailItems: HTMLRlDetailDialogItemElement[] = [];

  /**
   * Internal root of this component.
   */
  @Element() root!: HTMLElement;

  // @Prop() elementId = -1;

  /**
   * The title of the dialog window.
   */
  @Prop() dialogTitle = 'Detail Dialog';

  /**
   * An array of strings that will be used to create action buttons for the
   * dialog.  When the corresponding button is clicked by the user, MDCDialog
   * will emit an event with the lowercase version of the action. For example
   * the action `Yes` would emit the `MDCDialog:closing` with the property
   * `event.detail.action === 'yes'`.
   */
  @Prop() dialogActions: string[] = ['No', 'Yes'];

  /**
   * The details that will be displayed in this dialog.
   */
  @Prop() details?: MapElementDetailMap;

  /**
   * The different categories that each item can display.  Each category has
   * a set of Detailtypes.
   */
  @Prop() categories!: { name: string, id: number, items: MapElementDetailType[] }[];

  /**
   * An event emitted when a new `DetailDialogItem` is added to the dialog.
   */
  @Event() addDetail!: EventEmitter;

  componentDidLoad() {
    this.dialog = new MDCDialog(this.root);
  }

  /**
   * Opens this dialog.
   */
  @Method()
  async open() {
    this.dialog.open();
  }

  /**
   * Returns the values of all the DetailDialogItems as an array of
   * `MapElementDetails`
   */
  @Method()
  getDetails() {
    return Promise.all(
      this.detailItems.map(item => {
        return Promise.all([item.getDetail(), item.toRemove()]).then(values =>
          Promise.resolve({ ...values[0], remove: values[1] } as MapElementDetail)
        );
      })
    );
  }

  hostData() {
    return {
      class: {
        'mdc-dialog': true,
        'rl-detail-dialog': true,
      },
      role: 'alertdialog',
      'aria-modal': 'true',
      'aria-labelledby': `rl-detail-dialog__title-${this.index}`,
      'aria-describedby': `rl-detail_dialog__content-${this.index}`
    };
  }

  render() {
    this.detailItems = [];

    return ([
      <div class="mdc-dialog__container">
        <div class="mdc-dialog__surface" style={{ width: '60vw', height: '90vh' }}>
          <h2 class="mdc-dialog__title" id={`rl-detail-dialog__title-${this.index}`}>
            {this.dialogTitle}
          </h2>
          <div class="mdc-dialog__content" id={`rl-detail-dialog__content-${this.index}`}>
            {this.details && Object.values(this.details).map(detail =>
              <rl-detail-dialog-item
                detail={detail}
                categoryOptions={this.categories}
                ref={el => this.detailItems.push(el as HTMLRlDetailDialogItemElement)}
              >
              </rl-detail-dialog-item>
            )}
          </div>
          <button type="button" class="mdc-button">
            <span
              class="mdc-button__label"
              onClick={_ => this.addDetail.emit()}
            >
              Add Detail
            </span>
          </button>
          <footer class="mdc-dialog__actions">
            {this.dialogActions.map(action =>
              <button
                  class="mdc-button mdc-dialog__button"
                  data-mdc-dialog-action={action.toLowerCase()}
                  type="button"
              >
                <span class="mdc-button__label">{action}</span>
              </button>
            )}
          </footer>
        </div>
      </div>,
      <div class="mdc-dialog__scrim" />,
    ]);
  }
}
