/**
 * Interface for arguments sent when an add-in event occurs.
 */
export interface AddinClientEventArgs {
  /**
   * The type of event.
   */
  type: string;

  /**
   * The context data for the event.
   */
  context: any;
}
