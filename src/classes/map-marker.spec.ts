import { MapMarker } from './map-marker';
import { Coordinate } from '../utils/coordinate';
import { MarkerIcon } from './marker-icon';

describe('map-marker', () => {
  const mm = new MapMarker();

  it('builds', () => {
    expect(mm).toBeTruthy();
  });

  it('anchor parameter works', () => {
    // Defaults to Coordinate(0, 0)
    expect(mm.anchor.x).toBe(0);
    mm.anchor = new Coordinate(10, 10);
    expect(mm.anchor.x).toBe(10);
  });

  it('available parameter works', () => {
    // Defaults to false
    expect(mm.available).toBe(false);
    mm.available = true;
    expect(mm.available).toBe(true);
  });

  it('icon parameter works', () => {
    // Defaults to undefinded
    expect(mm.icon).toBeFalsy();
    const icon = new MarkerIcon();
    mm.icon = icon;
    expect(mm.icon).toBe(icon);
  });

  it('label parameter works', () => {
    // Defaults to ''
    expect(mm.label).toBe('');
    mm.label = 'foo';
    expect(mm.label).toBe('foo');
  });

  it('opacity parameter works', () => {
    // Defaults to 1
    expect(mm.opacity).toBe(1);
    mm.opacity = 0.3;
    expect(mm.opacity).toBe(0.3);
    // Clamped to [0, 1]
    mm.opacity = -1;
    expect(mm.opacity).toBe(0);
    mm.opacity = 2;
    expect(mm.opacity).toBe(1);
  });

  it('position parameter works', () => {
    // Defaults to Coorindate(0, 0)
    expect(mm.position.x).toBe(0);
    mm.position = new Coordinate(20, 20);
    expect(mm.position.x).toBe(20);
  });

  it('moves by an amount', () => {
    mm.move(new Coordinate(10, 10));
    expect(mm.position.x).toBe(30);
  });

  it('builds with options', () => {
    const mm2 = new MapMarker({
      anchor: new Coordinate(15, 15),
      available: true,
      label: 'bar',
      opacity: 0.5,
      position: new Coordinate(45, 45),
    });

    expect(mm2.anchor.x).toBe(15);
    expect(mm2.available).toBe(true);
    expect(mm2.label).toBe('bar');
    expect(mm2.opacity).toBe(0.5);
    expect(mm2.position.x).toBe(45);
  });
});
