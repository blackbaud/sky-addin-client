import { AddinClientArgs } from './client-interfaces/addin-client-args';
import { AddinClientCloseModalArgs } from './client-interfaces/addin-client-close-modal-args';
import { AddinClientEventArgs } from './client-interfaces/addin-client-event-args';
import { AddinClientNavigateArgs } from './client-interfaces/addin-client-navigate-args';
import { AddinClientOpenHelpArgs } from './client-interfaces/addin-client-open-help-args';
import { AddinClientReadyArgs } from './client-interfaces/addin-client-ready-args';
import { AddinClientShowConfirmArgs } from './client-interfaces/addin-client-show-confirm-args';
import { AddinClientShowErrorArgs } from './client-interfaces/addin-client-show-error-args';
import { AddinClientShowFlyoutArgs } from './client-interfaces/addin-client-show-flyout-args';
import { AddinClientShowFlyoutResult } from './client-interfaces/addin-client-show-flyout-result';
import { AddinClientShowModalArgs } from './client-interfaces/addin-client-show-modal-args';
import { AddinClientShowModalResult } from './client-interfaces/addin-client-show-modal-result';
import { AddinClientShowToastArgs } from './client-interfaces/addin-client-show-toast-args';
import { AddinHostMessage } from './host-interfaces/addin-host-message';
import { AddinHostMessageEventData } from './host-interfaces/addin-host-message-event-data';

/**
 * Collection of regexs for our whitelist of host origins.
 */
const allowedOrigins = [
  /^https\:\/\/[\w\-\.]+\.blackbaud\.com$/,
  /^https\:\/\/[\w\-\.]+\.blackbaud\-dev\.com$/,
  /^http\:\/\/[\w\-\.]+\.blackbaud\-dev\.com$/,
  /^https\:\/\/[\w\-\.]+\.blackbaudhosting\.com$/,
  /^https\:\/\/[\w\-\.]+\.bbcloudservices\.com$/,
  /^https\:\/\/localhost(\:[0-9]+)?$/,
  /^https\:\/\/secure[2|3|8]\.convio\.net$/,
  /^https\:\/\/testweb\.convio\.com$/,
  /^https\:\/\/[\w\-\.]+\.conviocloud\.com$/,
  /^https\:\/\/[\w\-\.]+\.blackbaudcloud\.com$/
];

/**
 * Callback function to execute when an add-in event occurs.
 * @param context Abitrary context object passed to the event callback.
 * @param done Optional callback function to be executed when the client is done
 * processing the event.
 *
 * The following event types require the 'done' callback to be provided:
 * - 'form-save'
 * - 'form-cancel'
 */
export type AddinEventCallback = (context: any, done?: () => void) => void;

/**
 * Client for interacting with the parent page hosting the add-in.
 */
export class AddinClient {

  /**
   * Tracks pending request to reeceive an auth-token from the host.
   */
  private authTokenRequests: any[] = [];

  /**
   * Counter to provide unique ids for each auth token request.
   */
  private lastAuthTokenRequestId = 0;

  /**
   * Tracks modal add-ins that have been launched from this add-in.
   */
  private modalRequests: any[] = [];

  /**
   * Counter to provide unique ids for each modal request.
   */
  private lastModalRequestId = 0;

  /**
   * Tracks the current flyout add-in that has been launched from this add-in.
   */
  private flyoutRequest: any;

  /**
   * Tracks the current confirm dialog that has been launched from this add-in.
   */
  private confirmRequest: any;

  /**
   * The origin of the host page.
   */
  private trustedOrigin: string;

  /**
   * A message handler listening to post-message events from the host page.
   */
  private windowMessageHandler: (event: MessageEvent) => void;

  /**
   * setInterval id for tracking height changes of the iframe.
   */
  private heightChangeIntervalId: any;

  /**
   * Tracks the last height posted to the host page.
   */
  private lastPostedIframeHeight: number;

  /**
   * Stores the registered add-in events.
   * Key - the event type.
   * Value - The callback function to be executed when the event type occurs.
   */
  private registeredAddinEvents: {[key: string]: AddinEventCallback} = {};

  private sentEvents: {[key: number]: () => void} = {};
  private pendingSentEvents: {[key: string]: any} = {};
  private eventRequestId: number = 0;
  private supportedEventTypes: string[] = [];

  /* istanbul ignore next */
  /**
   * @returns {string}  Returns the current query string path for the window, prefixed with ?.
   */
  private static getQueryString() {
    return window.location.search;
  }

  constructor(private args: AddinClientArgs) {
    this.windowMessageHandler = (event) => {
      this.handleMessage(event);
    };

    // Listen to messages from the host page.
    window.addEventListener('message', this.windowMessageHandler);

    // Inform the host page that the add-in is loaded and listening for messages.
    this.raiseAddinReadyMessage();
  }

  /**
   * Cleans up the AddinClient, releasing all resources.
   */
  public destroy() {
    window.removeEventListener('message', this.windowMessageHandler);

    if (this.heightChangeIntervalId) {
      clearInterval(this.heightChangeIntervalId);
    }
  }

  /**
   * Requests the host page to navigate.
   * @param args Arguments describing the navigation request.
   */
  public navigate(args: AddinClientNavigateArgs) {
    this.postMessageToHostPage({
      message: {
        url: args.url
      },
      messageType: 'navigate'
    });
  }

  /**
   * Requests an authentication token for the current user.
   * @deprecated Use getUserIdentityToken() instead.
   * @returns {Promise<any>} Returns a promise which will resolve with the token value.
   */
  public getAuthToken(): Promise<string> {
    return this.getUserIdentityToken();
  }

  /**
   * Requests a user identity token for the current user.
   * @returns {Promise<any>} Returns a promise which will resolve with the token value.
   */
  public getUserIdentityToken(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const authTokenRequestId = ++this.lastAuthTokenRequestId;

      this.authTokenRequests[authTokenRequestId] = {
        reject,
        resolve
      };

      this.postMessageToHostPage({
        message: {
          authTokenRequestId
        },
        messageType: 'get-auth-token'
      });
    });
  }

  /**
   * Requests the host page to launch a modal add-in.
   * @param args Arguments for launching the modal.
   * @returns {Promise<any>} Returns a promise that will be resolved when the modal add-in is closed.
   * Promise will resolve with context data passed by from the modal add-in's closeModal call.
   */
  public showModal(args: AddinClientShowModalArgs): AddinClientShowModalResult {
    return {
      modalClosed: new Promise<any>((resolve, reject) => {
        const modalRequestId = ++this.lastModalRequestId;

        this.modalRequests[modalRequestId] = {
          reject,
          resolve
        };

        this.postMessageToHostPage({
          message: {
            args,
            modalRequestId
          },
          messageType: 'show-modal'
        });
      })
    };
  }

  /**
   * Informs the host to close this modal add-in.
   * Should only be used from within the modal add-in and not the parent add-in.
   * @param args Arguments to provide a context object back to the parent add-in.
   */
  public closeModal(args: AddinClientCloseModalArgs) {
    this.postMessageToHostPage({
      message: args,
      messageType: 'close-modal'
    });
  }

  /**
   * Informs the host to open the help tab with the specified help key.
   * @param args Arguments for launching the help tab.
   */
  public openHelp(args: AddinClientOpenHelpArgs) {
    this.postMessageToHostPage({
      message: {
        helpKey: args.helpKey
      },
      messageType: 'open-help'
    });
  }

  /**
   * Informs the host to show a toast message.
   * @param args Arguments for showing a toast.
   */
  public showToast(args: AddinClientShowToastArgs) {
    this.postMessageToHostPage({
      message: args,
      messageType: 'show-toast'
    });
  }

  /**
   * Requests the host page to launch a flyout add-in.
   * @param args Arguments for launching the flyout.
   * @returns {Promise<any>} Returns a promise that will be resolved when the flyout add-in is closed.
   */
  public showFlyout(args: AddinClientShowFlyoutArgs): AddinClientShowFlyoutResult {
    return {
      flyoutClosed: new Promise<void>((resolve, reject) => {
        // assign default values if not specified,
        // consistent with SKY UX flyout defaults
        args.defaultWidth = args.defaultWidth || 500;
        args.maxWidth = args.maxWidth || args.defaultWidth;
        args.minWidth = args.minWidth || 320;

        this.flyoutRequest = {
          reject,
          resolve
        };

        this.postMessageToHostPage({
          message: args,
          messageType: 'show-flyout'
        });
      })
    };
  }

  /**
   * Requests the host page to close the flyout add-in.
   */
  public closeFlyout() {
    this.postMessageToHostPage({
      messageType: 'close-flyout'
    });
  }

  /**
   * Requests the host page to show a confirm dialog.
   * @param args Arguments for showing a confirm dialog.
   * @returns {Promise<string>} Returns a promise that will resolve with the
   * confirm action when the dialog is closed.
   */
  public showConfirm(args: AddinClientShowConfirmArgs): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.confirmRequest = {
        reject,
        resolve
      };

      this.postMessageToHostPage({
        message: args,
        messageType: 'show-confirm'
      });
    });
  }

  /**
   * Informs the host to show an error dialog.
   * @param args Arguments for showing an error dialog.
   */
  public showError(args: AddinClientShowErrorArgs): void {
    this.postMessageToHostPage({
      message: args,
      messageType: 'show-error'
    });
  }

  /**
   * Requests the host page to show the page blocking wait indicator.
   */
  public showWait(): void {
    this.postMessageToHostPage({
      messageType: 'show-wait'
    });
  }

  /**
   * Requests the host page to hide the page blocking wait indicator.
   */
  public hideWait(): void {
    this.postMessageToHostPage({
      messageType: 'hide-wait'
    });
  }

  /**
   * Registers a callback to be executed when the specified event type occurs.
   * @param eventType The event type to process.
   * @param callback The callback to execute when the event occurs.
   */
  public addEventHandler(eventType: string, callback: AddinEventCallback) {
    this.registeredAddinEvents[eventType] = callback;
  }

  public sendEvent(args: AddinClientEventArgs): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const eventType = args.type;

      if (!this.supportedEventTypes.includes(eventType)) {
        reject('Event type not supported');
      }

      const pendingEvent = this.pendingSentEvents[eventType];
      if (pendingEvent) {
        // cancel and reject pending event
        clearTimeout(pendingEvent.timeoutId);
        pendingEvent.reject('Event cancelled');
      }

      const timeoutId = setTimeout(() => {
        delete this.pendingSentEvents[eventType];

        this.postMessageToHostPage({
          message: {
            event: args,
            eventRequestId: this.eventRequestId
          },
          messageType: 'client-event'
        });

        this.sentEvents[this.eventRequestId] = resolve;
        this.eventRequestId++;
      }, 200);
      this.pendingSentEvents[eventType] = {
        timeoutId,
        reject
      };
    });
  }

  /**
   * Post a message to the host page informing it that the add-in is
   * now started and listening for messages from the host.
   */
  private raiseAddinReadyMessage() {
    // No sensitive data should be provided with this message!  This is the initial
    // message posted to the host page to establish whether the host origin is a
    // trusted origin and therefore will post to any host, trusted or untrusted.
    // The host should respond with a host-ready message which will include the origin
    // and will be validated against a whitelist of allowed origins so that subsequent
    // messages can be posted only to that trusted origin.
    this.postMessageToHostPage({
      messageType: 'ready'
    }, '*');
  }

  /**
   * Handles the modal-closed message from the host.
   * This is emitted to add-ins which have previously launched a modal, which is now
   * closing.
   * @param message The message data, which includes a context object from the closing modal, which should be passed
   * to the calling modal in the showModal promise.
   */
  private handleModalClosedMessage(message: AddinHostMessage) {
    const modalRequests = this.modalRequests;
    const modalRequestId = message.modalRequestId;
    const modalRequest = modalRequests[modalRequestId];

    modalRequest.resolve(message.context);

    modalRequests[modalRequestId] = undefined;
  }

  /**
   * Handles host message responses to a get-auth-token request.
   * @param data The message.
   */
  private handleAuthTokenMessage(data: AddinHostMessageEventData) {
    const authTokenRequests = this.authTokenRequests;
    const authTokenRequestId = data.message.authTokenRequestId;
    const authTokenRequest = authTokenRequests[authTokenRequestId];

    /* tslint:disable-next-line switch-default */
    switch (data.messageType) {
      case 'auth-token':
        const authToken = data.message.authToken;
        authTokenRequest.resolve(authToken);
        break;
      case 'auth-token-fail':
        authTokenRequest.reject(data.message.reason);
        break;
    }

    authTokenRequests[authTokenRequestId] = undefined;
  }

  /**
   * Handles message events received from the add-in host page.
   * @param event The event posted from the host.
   */
  private handleMessage(event: MessageEvent) {
    const data = event.data as AddinHostMessageEventData;

    if (data && data.source === 'bb-addin-host') {
      if (data.messageType === 'host-ready') {
        // The 'host-ready' message is the only message that's not validated against
        // the host origin since that is what's being established in the message.
        // This MUST be the first message posted by the host page or all further
        // communications with the host page will be blocked.
        this.setKnownAllowedHostOrigin(event.origin);

        this.trackHeightChangesOfAddinContent();

        // set the supported event types
        this.supportedEventTypes = data.message.supportedEventTypes;

        // Pass key data to the add-in for it to initiailze.
        this.args.callbacks.init({
          context: data.message.context,
          envId: data.message.envId,
          supportedEventTypes : data.message.supportedEventTypes,
          ready: (args: AddinClientReadyArgs) => {
            // Do an immediate height check since the add-in may render something
            // due to the context provided.  No need to wait a full second to reflect.
            this.checkForHeightChangesOfAddinContent();
            this.postMessageToHostPage({
              message: args,
              messageType: 'addin-ready'
            });
          }
        });

      } else if (this.isFromValidOrigin(event)) {
        /* tslint:disable-next-line switch-default */
        switch (data.messageType) {
          case 'auth-token':
          case 'auth-token-fail':
            this.handleAuthTokenMessage(data);
            break;
          case 'modal-closed':
            this.handleModalClosedMessage(data.message);
            break;
          case 'button-click':
            if (this.args.callbacks.buttonClick) {
              this.args.callbacks.buttonClick();
            }
            break;
          case 'update-context':
            if (this.args.callbacks.updateContext) {
              this.args.callbacks.updateContext(data.message);
            }
            break;
          case 'confirm-closed':
            if (this.confirmRequest) {
              this.confirmRequest.resolve(data.message.reason);
              this.confirmRequest = undefined;
            }
            break;
          case 'flyout-closed':
            if (this.flyoutRequest) {
              this.flyoutRequest.resolve();
              this.flyoutRequest = undefined;
            }
            break;
          case 'flyout-next-click':
            if (this.args.callbacks.flyoutNextClick) {
              this.args.callbacks.flyoutNextClick();
            }
            break;
          case 'flyout-previous-click':
            if (this.args.callbacks.flyoutPreviousClick) {
              this.args.callbacks.flyoutPreviousClick();
            }
            break;
          // TODO remove support for this message type when help support is removed in next major release
          case 'help-click':
            if (this.args.callbacks.helpClick) {
              this.args.callbacks.helpClick();
            }
            break;
          case 'settings-click':
            if (this.args.callbacks.settingsClick) {
              this.args.callbacks.settingsClick();
            }
            break;
          case 'host-event':
            this.processHostEvent(data.message);
            break;
          case 'event-received':
            this.resolveClientEvent(data.message);
            break;

        }
      } else {
        this.warnInvalidOrigin();
      }
    }
  }

  /**
   * Validates and registers a value as the origin of the parent page hosting the add-in.
   * If the provided origin matches against our trusted whitelist, then it will be saved.
   * Post messages will implicitly go to this origin and received messages will be filtered
   * to just messages from this origin.
   * @param hostOrigin
   */
  private setKnownAllowedHostOrigin(hostOrigin: string) {
    for (const allowedOrigin of allowedOrigins) {
      if (allowedOrigin.test(hostOrigin)) {
        this.trustedOrigin = hostOrigin;
        return;
      }
    }
  }

  /**
   * Checks if the height of the iFrame has changed since it was last
   * posted to the host page (or if it hasn't been posted yet) and initiates
   * a new post if so.
   */
  private checkForHeightChangesOfAddinContent() {
    // after some discussion and experimentation, using offsetHeight appears to be sufficient
    const newHeight = document.documentElement.offsetHeight;

    if (newHeight !== this.lastPostedIframeHeight) {
      this.lastPostedIframeHeight = newHeight;

      this.postMessageToHostPage({
        message: {
          height: newHeight + 'px'
        },
        messageType: 'height-change'
      });
    }
  }

  /**
   * Starts a timeout interval to watch for height changes
   * of the iframe content.
   */
  private trackHeightChangesOfAddinContent() {
    this.heightChangeIntervalId = setInterval(() => {
      this.checkForHeightChangesOfAddinContent();
    }, 1000);
  }

  /**
   * Posts a message to the parent window.
   * @param message The message content to post.
   * @param targetOrigin Optional. If provided, then the message will be posted to this origin.
   *                     If not, then it will post to the pre-determined host page origin.
   */
  private postMessageToHostPage(message: any, targetOrigin?: string) {
    message.source = 'bb-addin-client';
    message.addinId = this.getQueryVariable('addinId');

    targetOrigin = targetOrigin || this.trustedOrigin;

    if (targetOrigin) {
      window.parent.postMessage(message, targetOrigin);
    } else {
      this.warnInvalidOrigin();
    }
  }

  /**
   * Processes an add-in event that occurs from the host and responds
   * back to the host with an 'event-received' message.
   * @param message The message to process by looking up executing the registered callback
   * that matches the event type.
   */
  private processHostEvent(message: AddinHostMessage) {
    const eventArgs: AddinClientEventArgs = message.context;
    const callback: AddinEventCallback = this.registeredAddinEvents[eventArgs.type];
    let promise: Promise<void>;
    if (callback) {
      if (this.isBlockingEventType(eventArgs.type)) {
        promise = new Promise((resolve) => {
          callback(eventArgs.context, () => {
            resolve();
          });
        });
      } else {
        promise = new Promise((resolve) => {
          callback(eventArgs.context);
          resolve();
        });
      }
    } else {
      promise = Promise.resolve();
    }

    promise.then(() => this.postEventReceivedMessage(message.eventRequestId));
  }

  /**
   * Checks whether an event type is blocking and requires a response from the client
   * before responding to the host.
   * @param type The event type.
   */
  private isBlockingEventType(type: string): boolean {
    switch (type) {
      case 'form-save':
      case 'form-cancel':
        return true;
      default: break;
    }

    return false;
  }

  private postEventReceivedMessage(eventRequestId: number) {
    this.postMessageToHostPage({
      message: {
        eventRequestId
      },
      messageType: 'event-received'
    });
  }

  private resolveClientEvent(message: any) {
    const requestId = message.eventRequestId;
    const promiseResolve = this.sentEvents[requestId];
    if (promiseResolve) {
      promiseResolve();
      delete this.sentEvents[requestId];
    }
  }

  /**
   * Checks whether a MessageEvent is from the execetd host origin.
   * @param event
   */
  private isFromValidOrigin(event: MessageEvent): boolean {
    return event.origin === this.trustedOrigin;
  }

  /**
   * Log that a message was received with an invalid origin.
   */
  private warnInvalidOrigin() {
    console.warn(
      'The origin is not trusted because the host-ready message has not been ' +
      'sent or because the host origin is not a whitelisted origin.'
    );
  }

  /**
   * Reads a query string value from the current window location.
   * @param variable  Name of the query string parameter to ready.
   * @returns         The value of the query string parameter.
   */
  private getQueryVariable(variable: any) {
    const query = AddinClient.getQueryString().substring(1);
    const vars = query.split('&');
    for (const v of vars) {
      const pair = v.split('=');
      if (decodeURIComponent(pair[0]) === variable) {
        return decodeURIComponent(pair[1]);
      }
    }
  }

}
