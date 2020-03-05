/**
 * Interface for defining configuration options for Modal add-ins
 */
export interface AddinModalConfig {

  /**
   * Indicates that the modal is configured to display full screen (Default: false)
   *
   * When true, this instructs the host application to adjust the display
   * appropriately for a full-page modal.
   */
  fullPage?: boolean;
}
