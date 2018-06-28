import { AddinClientCallbacks } from './addin-client-callbacks';

/**
 * Interface for constructing an AddinClient.
 */
export interface AddinClientArgs {

  /**
   * Callback functions to subscribe to various callbacks that may be raised from the AddinClient.
   */
  callbacks: AddinClientCallbacks;

}
