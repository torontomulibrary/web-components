import { MapPolygon } from './map-polygon';
import { Coordinate } from '../utils/coordinate';

describe('map-polygon', () => {
  const mp = new MapPolygon();

  it('builds', () => {
    expect(mp).toBeTruthy();
  });

  it('open parameter works', () => {
    // Defaults to false
    expect(mp.open).toEqual(false)
    mp.open = true;
    expect(mp.open).toEqual(true);
  });

  describe('points parameter', () => {
    // Defaults to []
    it('works', () => {
      expect(mp.points).toEqual([]);
      const points = [
        new Coordinate(0, 0),
        new Coordinate(10, 0),
        new Coordinate(10, 10),
        new Coordinate(0, 10),
      ];
      mp.points = points;
      expect(mp.points).toEqual(points);
    });

    it('works with open path', () => {
      expect(mp._path).toBe('M 0 0 L 10 0 L 10 10 L 0 10');
    });

    it('works with closed path', () => {
      mp.open = false;
      expect(mp._path).toBe('M 0 0 L 10 0 L 10 10 L 0 10 Z');
    });
  });

  describe('addPoint()', () => {
    it('works without index', () => {
      mp.addPoint(new Coordinate(0, 5));
      expect(mp._path).toBe('M 0 0 L 10 0 L 10 10 L 0 10 L 0 5 Z');
    });

    it('works with index', () => {
      mp.addPoint(new Coordinate(0, 5), 1);
      expect(mp._path).toBe('M 0 0 L 0 5 L 10 0 L 10 10 L 0 10 L 0 5 Z');
    });
  });

  it('move() works', () => {
    mp.move(new Coordinate(5, 5));
    expect(mp._path).toBe('M 5 5 L 5 10 L 15 5 L 15 15 L 5 15 L 5 10 Z');
  });

  it('movePoint() works', () => {
    mp.movePoint(new Coordinate(-5, -5), 0);
    expect(mp._path).toBe('M 0 0 L 5 10 L 15 5 L 15 15 L 5 15 L 5 10 Z');
  });

  describe('removePoint()', () => {
    it('works without index', () => {
      mp.removePoint();
      expect(mp._path).toBe('M 0 0 L 5 10 L 15 5 L 15 15 L 5 15 Z');
    });

    it('works with index', () => {
      mp.removePoint(1);
      expect(mp._path).toBe('M 0 0 L 15 5 L 15 15 L 5 15 Z');
    });
  });
});
