import { AddinClientInitArgs } from './addin-client-init-args';
import { AddinClientThemeSettings } from './addin-client-theme-settings';

/**
 * Interface for add-ins to subscribe to callbacks from the AddinClient.
 */
export interface AddinClientCallbacks {

  /**
   * Callback raised for the add-in to initialize, passing in contextual information.
   */
  init: (args: AddinClientInitArgs) => void;

  /**
   * Callback raised for box add-ins indicating that a control action was clicked.
   */
  actionClick?: (action: string) => void;

  /**
   * Callback raised for button add-ins indicating that the button was clicked.
   */
  buttonClick?: () => void;

  /**
   * Callback raised indicating context was updated by the host.
   */
  updateContext?: (context: any) => void;

  /**
   * Callback raised for tile add-ins indicating that the flyout's next button was clicked.
   */
  flyoutNextClick?: () => void;

  /**
   * Callback raised for tile add-ins indicating that the flyout's previous button was clicked.
   */
  flyoutPreviousClick?: () => void;

  /**
   * Callback raised for tile add-ins indicating that the help button was clicked.
   * @deprecated Use {@link AddinTileConfig.showInlineHelp} to show inline help instead and handle {@link inlineHelpClick} callback.
   */
  helpClick?: () => void;

  /**
   * Callback raised for tile add-ins indicating that the inline help button was clicked.
   */
  inlineHelpClick?: () => void;

  /**
   * Callback raised for tile add-ins indicating that the settings button was clicked.
   */
  settingsClick?: () => void;

  /**
   * Callback raised indicating the UX theme was changed in the host.
   */
  themeChange?: (settings: AddinClientThemeSettings) => void;

}
