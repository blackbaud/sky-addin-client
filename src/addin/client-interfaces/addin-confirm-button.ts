import { AddinConfirmButtonStyle } from './addin-confirm-button-style';

/**
 * Interface for confirm button configuration.
 */
export interface AddinConfirmButton {

  /**
   * Specifies an identifier to return when users select the button to close
   * the confirmation dialog. This is useful to determine which button users select.
   */
  action: string;

  /**
   * Specifies the label for the button.
   */
  text: string;

  /**
   * Indicates whether to place focus on this button by default. (Default: false)
   */
  autofocus?: boolean;

  /**
   * Specifies specific styling to apply to the button.
   */
  style?: AddinConfirmButtonStyle;
}
