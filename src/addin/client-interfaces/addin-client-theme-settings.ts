/**
 * Interface to specify the theme and mode to be applied to an add-in client.
 */
export interface AddinClientThemeSettings {

  /**
   * The theme configuration.
   */
  theme: string;

  /**
   * The theme mode.
   */
  mode: string;

  /**
   * Serialized theme settings for the UX theme and branding.
   */
  skyThemeSettings: string;
}
