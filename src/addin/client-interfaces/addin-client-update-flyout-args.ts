/**
 * Interface for updating the current flyout add-in.
 */
export interface AddinClientUpdateFlyoutArgs {

  /**
   * URL of the add-in to launch as a flyout.
   */
  url: string;

  /**
   *
   */
  iteratorNextDisabled?: boolean;

  /**
   *
   */
  iteratorPreviousDisabled?: boolean;

  /**
   *
   */
  showPermalink?: boolean;

  /**
   *
   */
  permalinkLabel?: string;

  /**
   *
   */
  permalinkUrl?: string;

  /**
   * Context information to pass to the flyout add-in when it receives the
   * init callback.
   */
  context?: any;

}
