/**
 * Interface for informing the AddinClient that the add-in is ready.
 * Will dictate if and how the add-in should show in the host page.
 */
export interface AddinClientReadyArgs {

  /**
   * Indicates that the add-in should be shown in the host page.
   */
  showUI?: boolean;

  /**
   * Indicates a title for the add-in element in the host page.
   */
  title?: string;

  /**
   * For tile add-ins, indicates the summary text to be displayed when the tile is collapsed
   */
  summary?: string;
}
