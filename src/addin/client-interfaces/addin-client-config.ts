
/**
 * Configuration properties for an AddinClient.
 */
export interface AddinClientConfig {
 /**
   * Optional list of allowed origins, as RegExp, to trust as add-in hosts for this add-in client.
   */
  allowedOrigins?: RegExp[];

  /**
   * When true, the client makes the add-in's body background transparent and adds a
   * `sky-addin-modal` marker class to the document body when the add-in initializes.
   * Use this for modal add-ins so the host page shows through behind the modal and the
   * SKY UX modal backdrop does not double up with the host's. Off by default so existing
   * add-ins are unaffected.
   */
  enableModalBackgroundTransparency?: boolean;
}