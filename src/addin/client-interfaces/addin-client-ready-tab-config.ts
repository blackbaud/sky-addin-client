import { AddinTabSummaryStyle } from './addin-tab-summary-style';

/**
 * Interface for defining configuration options for Tab add-ins
 */
export interface AddinClientReadyTabConfig {

  /**
   * The style to use for the tab summary
   */
  style?: AddinTabSummaryStyle;

  /**
   * Indicates the summary text to be displayed next to the tab caption (only applicable when the style
   * is Text)
   */
  summary?: string;

}
