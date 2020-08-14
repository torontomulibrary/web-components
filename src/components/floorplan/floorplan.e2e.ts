import { newE2EPage } from '@stencil/core/testing';

describe('rl-floorplan', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<rl-floorplan></rl-floorplan>');
    const element = await page.find('rl-floorplan');
    expect(element).toHaveClass('hydrated');
  });
});
