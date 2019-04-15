/**
 * Interface for the return value from launching a flyout add-in.
 */
export interface AddinClientShowFlyoutResult {

  /**
   * A promise that will be resolved when the flyout add-in is closed.
   * Promise will resolve with context data passed by from the flyout add-in's closeFlyout call.
   */
  flyoutClosed: Promise<any>;
}
