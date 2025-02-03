import { AddinBoxControl } from './addin-box-control';

/**
 * Interface for defining configuration options for Box add-ins
 */
export interface AddinBoxConfig {
  /**
   * The controls to use for the box context menu
   */
  controls?: AddinBoxControl[] | undefined;

   /**
   * Indicates whether to show the inline help icon in the box header
   */
   showInlineHelp?: boolean | undefined;

   /**
    * The content of the help popover.
    */
   helpPopoverContent?: string | undefined;
 
   /**
    * The title of the help popover.
    */
   helpPopoverTitle?: string | undefined;
}
