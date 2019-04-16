/**
 * Interface for information to displays a permalink button
 * in the flyout header that navigates users to the URL
 * representative of the flyout's contents.
 */
export interface AddinClientFlyoutPermalink {

  /**
   * Specifies a text label for the permalink button.
   */
  label?: string;

  /**
   * Specifies an external URL for the permalink.
   */
  url?: string;
}
