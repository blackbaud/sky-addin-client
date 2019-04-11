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
   * Callback raised for button add-ins indicating that the button was clicked.
   */
  buttonClick?: () => void;

  flyoutCloseClick?: () => void;

  flyoutNextClick?: () => void;

  flyoutPreviousClick?: () => void;

  /**
   * Callback raised for tile add-ins indicating that the help button was clicked.
   */
  helpClick?: () => void;

  /**
   * Callback raised for tile add-ins indicating that the settings button was clicked.
   */
  settingsClick?: () => void;

}
