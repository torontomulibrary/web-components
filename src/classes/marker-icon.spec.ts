import { MarkerIcon } from './marker-icon';
import { Coordinate } from '../utils/coordinate';

describe('marker-icon', () => {
  const mi = new MarkerIcon();

  it('builds', () => {
    expect(mi).toBeTruthy();
  });

  it('anchor parameter works', () => {
    mi.anchor = new Coordinate(10, 10);
    expect(mi.anchor.x).toEqual(10);
    expect(mi.anchor.y).toEqual(10);
  });

  it('originalSize parameter works', () => {
    mi.originalSize = {width: 10, height: 10};
    expect(mi.originalSize.height).toEqual(10);
    expect(mi.originalSize.width).toEqual(10);
  });

  it('size parameter works', () => {
    mi.size = {width: 10, height: 10};
    expect(mi.size.height).toEqual(10);
    expect(mi.size.width).toEqual(10);
  });

  it('scale paramter works', () => {
    mi.scale = 10;
    expect(mi.scale).toEqual(10);
  });

  it('url parameter works', () => {
    mi.url = 'foo';
    expect(mi.url).toEqual('foo');
  });
});
