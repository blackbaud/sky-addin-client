/**
 * Interface for defining configuration options for Modal add-ins
 */
export interface AddinModalConfig {

  /**
   * Indicates that the modal is configured to display full screen (Default: false)
   *
   * The appropriate adjustments should be made to the host page when
   * a modal is configured to display full-page. For example, hide the
   * help button when its display conflicts with a full-page modal.
   */
  fullPage?: boolean;
}
