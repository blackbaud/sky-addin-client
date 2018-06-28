/**
 * Interface for the return value from launching a modal add-in.
 */
export interface AddinClientShowModalResult {

  /**
   * A promise that will be resolved when the modal add-in is closed.
   * Promise will resolve with context data passed by from the modal add-in's closeModal call.
   */
  modalClosed: Promise<any>;

}
