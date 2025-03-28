import { AddinClientThemeSettings } from '../client-interfaces';

/**
 * Interface for the actual message data embedded in an AddinHostMessageEventData.
 * The populated fields will vary by the message type.
 */
export interface AddinHostMessage {

  /**
   * Identifier to correlate authentication token requests from the add-in client to the host.
   */
  authTokenRequestId?: number;

  /**
   * Authentication token for the current user.
   */
  authToken?: string;

  /**
   * Additional context of the host page, which will vary for different extension points.
   */
  context?: any;

  /**
   * The environment id of the host page.
   */
  envId?: string;

  /**
   * Identifier to correlate modal requests from the add-in client to the host.
   */
  modalRequestId?: number;

  /**
   * Identifier to correlate events from the add-in client to the host.
   */
  eventRequestId?: number;

  /**
   * Generic field for passing information about the request, such as the explanation for a
   * auth-token-fail message or action message for closing a dialog.
   */
  reason?: string;

  /**
   * Event types that are supported by the host page.
   */
  supportedEventTypes?: string[];

  /**
   * The UX theme of the host page, which will vary for different extension points.
   */
  themeSettings?: AddinClientThemeSettings;

  /**
   * Data being returned back to the host from the add-in client.
   */
  data?: any;
}
