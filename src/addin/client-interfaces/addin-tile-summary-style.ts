/*
 * Defines the style of the tile summary
 */
export enum AddinTileSummaryStyle {
  // No style (default)
  None = 0,

  // Show a text summary for the tile (the value to show will be the 'summary' property)
  Text = 1,

  // Show a check summary for the tile (the check will show based on the 'checked' property)
  Check = 2
}
