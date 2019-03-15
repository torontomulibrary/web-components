import {
  Component,
  Method,
  Prop,
  State,
  Watch,
} from '@stencil/core';

import { MapElementDetail, MapElementDetailType } from '../../interface';

let nextId = 0;

@Component({
  tag: 'rl-detail-dialog-item',
  styleUrl: 'detail-dialog-item.scss',
})

export class DetailDialogItem {
  private index = nextId++;
  private itemId = 0;

  @State() remove = false;
  @State() description = '';
  @State() name = '';
  @State() altText = '';
  @State() detailTypeId = -1;
  @State() code = '';

  // @Prop() detailTypes!: MapElementDetailTypeMap;

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
        // Set the selected category and detailType to mathch.
        this.categoryOptions.forEach(c => {
          c.items.forEach(dt => {
            if (this.detailTypeId === dt.id) {
              this.categorySelection = { ...c };
              this.typeSelection = { ...dt };
            }
          });
        });
      }
    }
  }

  /**
   * An array of all the different categories that can be selected.
   */
  @Prop({ mutable: true }) categoryOptions!: { name: string, id: number, items: MapElementDetailType[] }[];
  @Watch('categoryOptions')
  onCategoryOptionsChanged() {
    if (this.categoryOptions !== undefined && this.categorySelection === undefined) {
      this.categorySelection = { ...this.categoryOptions[0] };
    }
  }

  /**
   * The currently selected Category.
   */
  @Prop({ mutable: true }) categorySelection?: { name: string, id: number, items: MapElementDetailType[] };
  @Watch('categorySelection')
  onCategorySelectionChanged() {
    if (this.categorySelection !== undefined) {
      this.typeOptions = [ ...this.categorySelection.items ];
      this.typeSelection = { ...this.typeOptions[0] };
    }
  }

  // @Prop() categoryId?: number;

  /**
   * An array of all the different detail types that are available.
   */
  @Prop({ mutable: true }) typeOptions: MapElementDetailType[] = [];
  @Watch('typeOptions')
  onTypeOptionsChanged() {
    if (this.typeOptions !== undefined) {
      this.typeSelection = this.typeOptions[0];
    }
  }

  @Prop({ mutable: true }) typeSelection?: MapElementDetailType;
  @Watch('typeSelection')
  onTypeSelectionChanged() {
    if (this.typeSelection !== undefined) {
      this.detailTypeId = this.typeSelection.id;
    }
  }

  componentDidLoad() {
    this.onDetailChanged();
    this.onCategoryOptionsChanged();
  }

  @Method()
  getDetail() {
    return {
      description: this.description,
      name: this.name,
      code: this.code,
      altText: this.altText,
      id: this.itemId,
      detailTypeId: this.typeSelection ? this.typeSelection.id : 1,
    } as MapElementDetail;
  }

  @Method()
  toRemove() {
    return this.remove;
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
          selectedOption={this.categorySelection.name}
          onSelected={evt => {
            this.categorySelection = this.categoryOptions[evt.detail];
          }}
        >
        </rl-select-menu>
      </div>,
      <div class="rl-text-field-container">
        <rl-select-menu
          label="Type"
          options={this.typeOptions.map((i: MapElementDetailType) => i.name)}
          selectedOption={this.typeSelection.name}
          onSelected={evt => {
            this.typeSelection = this.typeOptions[evt.detail];
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
