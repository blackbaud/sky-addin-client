import { AddinClientReadyButtonConfig } from './addin-client-ready-button-config';
import { AddinClientReadyTabConfig } from './addin-client-ready-tab-config';
import { AddinClientReadyTileConfig } from './addin-client-ready-tile-config';

/**
 * Interface for informing the AddinClient that the add-in is ready.
 * Will dictate if and how the add-in should show in the host page.
 */
export interface AddinClientReadyArgs {

  /**
   * Indicates that the add-in should be shown in the host page.
   */
  showUI?: boolean;

  /**
   * Indicates a title for the add-in element in the host page.
   */
  title?: string;

  /**
   * Provides additional configuration for Button add-ins
   */
  buttonConfig?: AddinClientReadyButtonConfig;

  /**
   * Provides additional configuration for Tab add-ins
   */
  tabConfig?: AddinClientReadyTabConfig;

  /**
   * Provides additional configuration for Tile add-ins
   */
  tileConfig?: AddinClientReadyTileConfig;

}
