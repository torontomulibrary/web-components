import { newSpecPage } from '@stencil/core/testing';
import { PanZoom } from './pan-zoom';

describe('pan-zoom', () => {
  it('should render the component', async () => {
    const page = await newSpecPage({
      components: [ PanZoom ],
      html: `<rl-pan-zoom></rl-pan-zoom>`,
    });

    expect(page.root).toEqualLightHtml(`<rl-pan-zoom class="rl-pan-zoom"></rl-pan-zoom>`);
    expect(page.root).toEqualHtml(
      `<rl-pan-zoom class="rl-pan-zoom">
        <mock:shadow-root>
          <div class="rl-pan-zoom__transform" style="transform: translate3d(0px, 0px, 0px) scale(1);">
            <slot name="pz-content"></slot>
          </div>
        </mock:shadow-root>
      </rl-pan-zoom>`
    );
  });
});
