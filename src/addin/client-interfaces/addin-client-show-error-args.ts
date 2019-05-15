/**
 * Interface for showing an error dialog from an add-in.
 */
export interface AddinClientShowErrorArgs {

  /**
   * Specifies a label for the action button that closes the error dialog.
   * Note: SKY UX 1 hosts always display close text as "OK"
   */
  closeText: string;

  /**
   * Specifies a description to provide additional details in the error dialog.
   */
  description: string;

  /**
   * Specifies a title to display in the error dialog.
   */
  title: string;
}
