import { AddinConfirmButton } from './addin-confirm-button';

/**
 * Interface for showing a confirm dialog from an add-in.
 */
export interface AddinClientShowConfirmArgs {

  /**
   * Specifies the message to display in a bold font at the top of the dialog.
   */
  message: string;

  /**
   * Specifies secondary text to display in plain font under the primary message.
   */
  body?: string;

  /**
   * Specifies an array of AddinConfirmButton objects that defines the
   * configuration for the confirm dialog's buttons.
   */
  buttons: AddinConfirmButton[];
}
