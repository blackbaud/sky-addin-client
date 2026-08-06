/**
 * Controls independent modal body and host-overlay styling.
 */
export interface AddinModalStyle {

  /**
   * When true, makes the add-in document body transparent.
   */
  transparentBackground?: boolean;

  /**
   * Controls the host overlay appearance.
   *
   * When false, asks a compatible host to make its overlay transparent.
   * When true or omitted, the host retains its visible overlay.
   */
  hostOverlay?: boolean;
}

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

  /**
   * Controls independent modal body and host-overlay styling.
   */
  style?: AddinModalStyle;
}
