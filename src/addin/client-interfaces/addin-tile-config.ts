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
   */
  showHelp?: boolean;

  /**
   * Indicates whether to show the Settings icon in the tile chrome
   */
  showSettings?: boolean;

  /**
   * Indicates whether to enable padding around tile content (Default: true)
   */
  paddingEnabled?: boolean;
}
