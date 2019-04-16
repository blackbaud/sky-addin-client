import { AddinClientFlyoutPermalink } from './addin-client-flyout-permalink';

/**
 * Interface for showing a flyout add-in.
 */
export interface AddinClientShowFlyoutArgs {

  /**
   * URL of the add-in to launch as a flyout.
   */
  url: string;

  /**
   * Specifies the default width of the flyout container. (Default: 500)
   */
  defaultWidth?: number;

  /**
   * Specifies the maximum resize width of the flyout container. (Default: defaultWidth)
   */
  maxWidth?: number;

  /**
   * Specifies the minimum resize width of the flyout container. (Default: 320)
   */
  minWidth?: number;

  /**
   * Indicates whether to display iterator buttons in the flyout header to allow
   * users to access the next and previous records in a record set. (Default: false)
   */
  showIterator?: boolean;

  /**
   * Disables the next iterator button in the flyout header that accesses the next
   * record in a record set. (Default: false)
   */
  iteratorNextDisabled?: boolean;

  /**
   * Disables the previous iterator button in the flyout header that accesses the
   * previous record in a record set. (Default: false)
   */
  iteratorPreviousDisabled?: boolean;

  /**
   * Displays a permalink button in the flyout header that navigates users to the URL
   * representative of the flyout's contents.
   */
  permalink?: AddinClientFlyoutPermalink;

  /**
   * Context information to pass to the flyout add-in when it receives the
   * init callback.
   */
  context?: any;
}
