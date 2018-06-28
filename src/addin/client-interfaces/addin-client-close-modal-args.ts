/**
 * Interface for closing the modal add-in.
 */
export interface AddinClientCloseModalArgs {

  /**
   * Context object to be passed to the parent add-in.
   * Will be included when resolving the promise returned from showModal.
   */
  context?: any;

}
