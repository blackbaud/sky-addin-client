/**
 * Interface for updating the current flyout add-in.
 */
export interface AddinClientUpdateFlyoutArgs {

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
