import { AddinClientInitArgs } from './addin-client-init-args';

/**
 * Interface for add-ins to subscribe to callbacks from the AddinClient.
 */
export interface AddinClientCallbacks {

  /**
   * Callback raised for the add-in to initialize, passing in contextual information.
   */
  init: (args: AddinClientInitArgs) => void;

  /**
   * Callback raised for button extension add-ins indicating that the button was clicked.
   */
  buttonClick?: () => void;

}
