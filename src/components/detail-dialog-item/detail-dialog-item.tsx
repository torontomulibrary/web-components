import {
  Component,
  Method,
  Prop,
  State,
  Watch,
} from '@stencil/core';

import { MapElementDetail, MapElementDetailType } from '../../interface';

let nextId = 0;

/**
 * An entry to be displayed as part of a `DetailDialog`.
 */
@Component({
  tag: 'rl-detail-dialog-item',
  styleUrl: 'detail-dialog-item.scss',
})
export class DetailDialogItem {
  private index = nextId++;
  private itemId = 0;

  /**
   * A flag indicating that this item will be removed when all the details are
   * serialized and sent to the server.
   */
  @State() remove = false;

  /**
   * The description for this item.
   */
  @State() description = '';

  /**
   * The name of this item.
   */
  @State() name = '';

  /**
   * Alternate text for this item.
   */
  @State() altText = '';

  /**
   * The ID of the detail type of this item.
   */
  @State() detailTypeId = -1;

  /**
   * The short code of this item.
   */
  @State() code = '';

  /**
   * The currently selected category.
   */
  @State() categorySelection = 0;

  /**
   * All the possible values for the type of this `DetailDialogItem`.
   */
  @State() typeOptions: MapElementDetailType[] = [];

  /**
   * The currently selected item Type.
   */
  @State() typeSelection = 0;

  /**
   * The `MapElementDetail` that this item is displaying the information of.
   */
  @Prop() detail?: MapElementDetail;
  @Watch('detail')
  onDetailChanged() {
    if (this.detail) {
      this.description = this.detail.description;
      this.name = this.detail.name;
      this.altText = this.detail.altText;
      this.itemId = this.detail.id;
      this.detailTypeId = this.detail.detailTypeId;
      this.code = this.detail.code;

      if (this.detail.detailTypeId > 0) {
        // Set the selected category and detailType to match.
        this.categoryOptions.forEach((c, cidx) => {
          c.items.forEach((dt, dtidx) => {
            if (this.detailTypeId === dt.id) {
              this.updateCategory(cidx);
              this.typeSelection = dtidx; // { ...dt };
            }
          });
        });
      }
    }
  }

  /**
   * An array of all the different categories that can be selected.
   */
  @Prop() categoryOptions!: { name: string, id: number, items: MapElementDetailType[] }[];
  @Watch('categoryOptions')
  onCategoryOptionsChanged() {
    this.updateCategory(0);
  }

  updateCategory(newIndex: number) {
    this.categorySelection = newIndex;
    this.typeOptions = this.categoryOptions[newIndex].items;
    this.typeSelection = 0;
  }

  componentWillLoad() {
    // If categories have already been provided, set the types options to the
    // items of the first category, as that is selected by default.
    if (this.categoryOptions) {
      this.typeOptions = this.categoryOptions[0].items;
    }
  }

  componentDidLoad() {
    this.updateCategory(this.categorySelection);
    this.onDetailChanged();
  }

  /**
   * Returns a `Promise` that resolves to a `MapElementDetail` object with
   * values set as those of this `DetailDialogItem`.
   */
  @Method()
  getDetail() {
    return Promise.resolve({
      description: this.description,
      name: this.name,
      code: this.code,
      altText: this.altText,
      id: this.itemId,
      detailTypeId: this.typeSelection ? this.typeOptions[this.typeSelection].id : 1,
    } as MapElementDetail);
  }

  /**
   * Returns a `Promise` that resolves to whether or not this `DetailDialogItem`
   * is to be removed or not.
   */
  @Method()
  toRemove() {
    return Promise.resolve(this.remove);
  }

  hostData() {
    return {
      class: {
        'rl-detail-dialog-item': true,
        'rl-detail-dialog-item--removed': this.remove,
      },
      id: `rl-detail-dialog-item-${this.index}`
    };
  }

  render() {
    if (this.categorySelection === undefined || this.typeSelection === undefined || this.remove) {
      return null;
    }

    return ([
      <div class="rl-text-field-container">
        <rl-select-menu
          label="Category"
          options={this.categoryOptions.map(c => c.name)}
          selectedOption={this.categorySelection}
          onSelected={evt => {
            const categories = this.categoryOptions[evt.detail];
            this.updateCategory(evt.detail);
            // this.categorySelection = evt.detail;
            this.typeOptions = [ ...categories.items ];
            this.typeSelection = 0;
          }}
        >
        </rl-select-menu>
      </div>,
      <div class="rl-text-field-container">
        <rl-select-menu
          label="Type"
          options={this.typeOptions.map((i: MapElementDetailType) => i.name)}
          selectedOption={this.typeSelection}
          onSelected={evt => {
            this.typeSelection = evt.detail;
          }}
        >
        </rl-select-menu>
      </div>,
      <div class="rl-text-field-container">
        <rl-text-field label="Code" value={this.code} onChangeValue={(e: CustomEvent) => this.code = e.detail}>
        </rl-text-field>
      </div>,
      <div class="rl-text-field-container">
        <rl-text-field label="Name" value={this.name} onChangeValue={(e: CustomEvent) => this.name = e.detail}>
        </rl-text-field>
      </div>,
      <div class="rl-text-field-container">
        <rl-text-field label="Description" value={this.description} onChangeValue={(e: CustomEvent) => this.description = e.detail}>
        </rl-text-field>
      </div>,
      <div class="rl-text-field-container">
        <rl-text-field label="Alt Text" value={this.altText} onChangeValue={(e: CustomEvent) => this.altText = e.detail}>
        </rl-text-field>
      </div>,
      <button type="button" class="mdc-button">
        <span
          class="mdc-button__label"
          onClick={_ => this.remove = true}
        >
          Remove
        </span>
      </button>
    ]);
  }
}
