/**
 * Interface for showing a flyout add-in.
 */
export interface AddinClientShowFlyoutArgs {

  /**
   * URL of the add-in to launch as a flyout.
   */
  url: string;

  defaultWidth?: number;

  maxWidth?: number;

  minWidth?: number;

  /**
   *
   */
  showIterator?: boolean;

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
