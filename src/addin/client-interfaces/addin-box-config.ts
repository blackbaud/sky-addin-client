import { AddinBoxControl } from './addin-box-control';

/**
 * Interface for defining configuration options for Box add-ins
 */
export interface AddinBoxConfig {
  /**
   * The controls to use for the box context menu
   */
  controls: AddinBoxControl[] | undefined;

  /**
   * The help key to open when the Help icon is clicked
   */
  helpKey?: string | undefined;
}
