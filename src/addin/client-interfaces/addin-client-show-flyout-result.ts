/**
 * Interface for the return value from showing a flyout add-in.
 */
export interface AddinClientShowFlyoutResult {

  /**
   * A promise that will be resolved when the flyout add-in is closed.
   */
  flyoutClosed: Promise<void>;
}
