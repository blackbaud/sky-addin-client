import { AddinButtonConfig } from './addin-button-config';
import { AddinModalConfig } from './addin-modal-config';
import { AddinTileConfig } from './addin-tile-config';

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
  buttonConfig?: AddinButtonConfig;

  /**
   * Provides additional configuration for Tile add-ins
   */
  tileConfig?: AddinTileConfig;

 /**
  * Provides additional configuration for Modal add-ins
  */
  modalConfig?: AddinModalConfig;
}
