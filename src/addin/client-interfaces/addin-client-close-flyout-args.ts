/**
 * Interface for closing the flyout add-in.
 */
export interface AddinClientCloseFlyoutArgs {

  /**
   * Context object to be passed to the parent add-in.
   * Will be included when resolving the promise returned from showFlyout.
   */
  context?: any;

}
