import { AddinTileSummaryStyle } from './addin-tile-summary-style';

/**
 * Interface for defining configuration options for Tile add-ins
 */
export interface AddinTileConfig {

  /**
   * The style to use for the tile summary
   */
  summaryStyle?: AddinTileSummaryStyle;

  /**
   * Indicates the summary text to be displayed when the tile is collapsed (only applicable when the style is Text)
   */
  summaryText?: string;

  /**
   * Indicates whether the tile summary should render a check (only applicable when the style is Check)
   */
  summaryChecked?: boolean;

  /**
   * Indicates whether to show the Help icon in the tile chrome
   * @deprecated Use {@link showInlineHelp} instead
   */
  showHelp?: boolean;

  /**
   * Indicates whether to show the inline help icon next to the tile header text
   */
  showInlineHelp?: boolean;

  /**
   * The content of the inline help popover
   */
  helpPopoverContent?: string;

  /**
   * The title of the inline help popover
   */
  helpPopoverTitle?: string;

  /**
   * Indicates whether to show the Settings icon in the tile chrome
   */
  showSettings?: boolean;

  /**
   * Indicates whether the tile content inset should be removed which allows
   * the content to extend all the way to the edge of the tile container (Default: false)
   */
  removeInset?: boolean;
}
