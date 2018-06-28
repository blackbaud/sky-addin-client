/**
 * Interface for showing a modal add-in.
 */
export interface AddinClientShowModalArgs {

  /**
   * URL of the add-in to launch as a modal.
   */
  url?: string;

  /**
   * Context information to pass to the modal add-in when it receives the
   * init callback.
   */
  context?: any;

}
