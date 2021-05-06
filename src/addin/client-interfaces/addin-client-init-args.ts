import { AddinClientReadyArgs } from './addin-client-ready-args';

/**
 * Interface for contextual information that will be provided in the init callback.
 */
export interface AddinClientInitArgs {

  /**
   * The environment id of the host page.
   */
  envId?: string;

  /**
   * Additional context of the host page, which will vary for different extension points.
   */
  context?: any;

  /**
   * Event types that are supported by the host page.
   */
   supportedEventTypes?: string[];

  /**
   * Call to inform the add-in client that the add-in is initialized and ready to be shown.
   * @param args Arguments describing how the add-in should render.
   */
  ready: (args: AddinClientReadyArgs) => void;

}
