import { MarkerSymbol } from './marker-symbol';
import { Coordinate } from '../utils/coordinate';

describe('marker-symbol', () => {
  const ms = new MarkerSymbol();

  it('builds', () => {
    expect(ms).toBeTruthy();
  });

  it('anchor parameter works', () => {
    ms.anchor = new Coordinate(10, 10);
    expect(ms.anchor.x).toEqual(10);
    expect(ms.anchor.y).toEqual(10);
  });

  it('path parameter works with path', () => {
    ms.path = 'M 10 10 L 10 20 L 20 20 L 20 10 Z';
    expect(ms.path).toEqual('M 10 10 L 10 20 L 20 20 L 20 10 Z');
    expect(ms._pathName).toEqual('custom');
  });

  it('path parameter works with string', () => {
    ms.path = 'computer';
    expect(ms.path).toEqual('M 8 36 c -2 0 -4 -2 -4 -4 v -20 c 0 -2 2 -4 4 -4 h 32 c 2 0 4 2 4 4 v 20 c 0 2 -2 4 -4 4 h 8 v 4 h -48 v -4 z M 8 12 h 32 v 20 h -32 z');
    expect(ms._pathName).toEqual('computer');
  });

  it('rotation paramter works', () => {
    ms.rotation = 10;
    expect(ms.rotation).toEqual(10);
  });

  it('rotation paramter works beyond 360', () => {
    ms.rotation = 370;
    expect(ms.rotation).toEqual(10);
  });

  it('size parameter works', () => {
    ms.size = {width: 10, height: 10};
    expect(ms.size.height).toEqual(10);
    expect(ms.size.width).toEqual(10);
  });

  it('renders', () => {
    const el = ms.render();
    expect(el).toBeTruthy();
  })
});
