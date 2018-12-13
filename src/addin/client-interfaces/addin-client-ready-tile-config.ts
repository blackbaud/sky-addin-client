import { AddinTileSummaryStyle } from './addin-tile-summary-style';

/**
 * Interface for defining configuration options for Tile add-ins
 */
export interface AddinClientReadyTileConfig {

  /**
   * The style to use for the tile summary
   */
  style?: AddinTileSummaryStyle;

  /**
   * Indicates the summary text to be displayed when the tile is collapsed (only applicable when the style is Text)
   */
  summary?: string;

  /**
   * Indicates whether the tile summary should render a check (only applicable when the style is Check)
   */
  checked?: boolean;

  /**
   * Indicates whether to show the Help icon in the tile chrome
   */
  showHelp?: boolean;

  /**
   * Indicates whether to show the Settings icon in the tile chrome
   */
  showSettings?: boolean;

}
