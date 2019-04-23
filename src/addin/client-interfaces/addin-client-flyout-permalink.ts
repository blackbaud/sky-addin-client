/**
 * Interface for information to display a permalink button
 * in the flyout header.
 */
export interface AddinClientFlyoutPermalink {

  /**
   * Specifies a text label for the permalink button.
   */
  label: string;

  /**
   * Specifies an external URL for the permalink.
   */
  url: string;
}
