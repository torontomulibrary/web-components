import { MDCDialog } from '@material/dialog/index';
import {
  Component,
  Element,
  Event,
  EventEmitter,
  Method,
  Prop,
} from '@stencil/core';

import { MapElementDetailMap, MapElementDetailType } from '../../interface';

let nextId = 0;

@Component({
  tag: 'rl-detail-dialog',
  styleUrl: 'detail-dialog.scss',
})

export class DetailDialog {
  private index = nextId++;

  private dialog: MDCDialog;

  private detailItems: HTMLRlDetailDialogItemElement[] = [];

  @Element() root!: HTMLElement;

  @Prop() elementId = -1;

  @Prop() dialogTitle = 'Detail Dialog';

  @Prop() dialogActions: string[] = ['No', 'Yes'];

  @Prop() details?: MapElementDetailMap;

  @Prop() categories!: { name: string, id: number, items: MapElementDetailType[] }[];

  @Event() addDetail!: EventEmitter;

  componentDidLoad() {
    this.dialog = new MDCDialog(this.root);
  }

  @Method()
  open() {
    this.dialog.open();
  }

  @Method()
  getDetails() {
    const details = this.detailItems.map(item => {
      return { ...item.getDetail(), remove: item.toRemove() };
    });
    return details;
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
