
/**
 * Configuration properties for an AddinClient.
 */
export interface AddinClientConfig {
 /**
   * Optional list of allowed origins, as RegExp, to trust as add-in hosts for this add-in client.
   */
  allowedOrigins?: RegExp[];
}