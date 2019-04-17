import { MapElement } from './map-element';

describe('map-element', () => {
  const me = new MapElement();

  it('builds', () => {
    expect(me).toBeTruthy();
  });

  it('active parameter works', () => {
    // Defaults to false
    expect(me.active).toEqual(false);
    me.active = true;
    expect(me.active).toEqual(true);
  });

  it('clickable parameter works', () => {
    // Defaults to true
    expect(me.clickable).toEqual(true);
    me.clickable = false;
    expect(me.clickable).toEqual(false);
  });

  it('id parameter works', () => {
    // Defaults to -1
    expect(me.id).toEqual(-1);
    me.id = 1;
    expect(me.id).toEqual(1);
  });

  it('name parameter works', () => {
    // Defaults to ''
    expect(me.name).toEqual('');
    me.name = 'foo';
    expect(me.name).toEqual('foo');
  });

  it('scale parameter works', () => {
    // Defaults to 1
    expect(me.scale).toEqual(1);
    me.scale = 2;
    expect(me.scale).toEqual(2);
  });

  it('visible parameter works', () => {
    // Defaults to true
    expect(me.visible).toEqual(true);
    me.visible = false;
    expect(me.visible).toEqual(false);
  });

  it('zIndex parameter works', () => {
    // Defaults to 1
    expect(me.zIndex).toEqual(1);
    me.zIndex = 1000;
    expect(me.zIndex).toEqual(1000);
  });

  it('builds with options', () => {
    const me2 = new MapElement({
      name: 'bash',
      zIndex: 123,
    });

    expect(me2.zIndex).toBe(123);
    expect(me2.name).toBe('bash');
  });
});
