import { AddinToastStyle } from './addin-toast-style';

/**
 * Interface for showing a toast from an add-in.
 */
export interface AddinClientShowToastArgs {

  /**
   * The message to display in the toast.
   */
  message: string;

  /**
   * Specifies the style of the toast and determines the color and icon to display.
   * (Default: AddinToastStyle.Info)
   */
  style?: AddinToastStyle;

}
