import { AddinToastType } from './addin-toast-type';

/**
 * Interface for showing a toast from an add-in.
 */
export interface AddinClientShowToastArgs {

  /**
   * The message to display in the toast.
   */
  message?: string;

  /**
   * Specifies the type of toast and determines the color and icon to display.
   * (Default: AddinToastType.Info)
   */
  type?: AddinToastType;

}
