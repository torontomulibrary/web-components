export interface MapElementProps {
  /**
   * Indicates whether this `MapElement` is currently selected by the user. When
   * active, the `MapElement` is styled differently.  Defaults to `false`.
   */
  active: boolean;

  /**
   * Indicates whether this `MapElement` receives mouse and touch events.
   * Defaults to `true`.
   */
  clickable: boolean;

  /**
   * The unique identifier for this `MapElement`.
   */
  id: number;

  /**
   * The name of this `MapElement`.
   */
  name: string;

  /**
   * The scale of this `MapElement`.
   */
  scale: number;

  /**
   * Indicates if this `MapElement` is currently visible. Defaults to `true`.
   */
  visible: boolean;

  /**
   * The z-index used to draw this `MapElement`.  Defaults to 1.
   */
  zIndex: number;
}
