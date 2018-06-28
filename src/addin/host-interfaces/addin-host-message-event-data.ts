import { AddinHostMessage } from './addin-host-message';

/**
 * Interface for messages posted to the add-in iframe from the host page.
 */
export interface AddinHostMessageEventData {

  /**
   * The type of the message.
   * Should match a collection of well-known types
   */
  messageType: string;

  /**
   * A value indicating the source of the message from the host page, to distinguish
   * from any other types of messages that might be emitted.
   *
   * Add-ins should be listening for a constant source of "bb-addin-host".
   */
  source: string;

  /**
   * The actual message data.
   * This will contain some constant fields and some fields that varies by message type.
   */
  message: AddinHostMessage;
}
