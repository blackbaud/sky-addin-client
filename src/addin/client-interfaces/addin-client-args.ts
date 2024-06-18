import { AddinClientCallbacks } from './addin-client-callbacks';
import { AddinClientConfig } from './addin-client-config';

/**
 * Interface for constructing an AddinClient.
 */
export interface AddinClientArgs {

  /**
   * Callback functions to subscribe to various callbacks that may be raised from the AddinClient.
   */
  callbacks: AddinClientCallbacks;

  /**
   * Optional configuration for an AddinClient.
   */
  config?: AddinClientConfig;
}
