import { AddinClient } from './addin-client';
import { AddinClientCloseModalArgs } from './client-interfaces/addin-client-close-modal-args';
import { AddinClientInitArgs } from './client-interfaces/addin-client-init-args';
import { AddinClientNavigateArgs } from './client-interfaces/addin-client-navigate-args';
import { AddinClientOpenHelpArgs } from './client-interfaces/addin-client-open-help-args';
import { AddinClientReadyArgs } from './client-interfaces/addin-client-ready-args';
import { AddinClientShowConfirmArgs } from './client-interfaces/addin-client-show-confirm-args';
import { AddinClientShowErrorArgs } from './client-interfaces/addin-client-show-error-args';
import { AddinClientShowFlyoutArgs } from './client-interfaces/addin-client-show-flyout-args';
import { AddinClientShowModalArgs } from './client-interfaces/addin-client-show-modal-args';
import { AddinClientShowToastArgs } from './client-interfaces/addin-client-show-toast-args';
import { AddinConfirmButtonStyle } from './client-interfaces/addin-confirm-button-style';
import { AddinToastStyle } from './client-interfaces/addin-toast-style';
import { AddinHostMessageEventData } from './host-interfaces/addin-host-message-event-data';

const TEST_HOST_ORIGIN = 'https://host.nxt.blackbaud.com';

function postMessageFromHost(msg: AddinHostMessageEventData, origin?: string) {
  if (!origin) { origin = TEST_HOST_ORIGIN; }

  window.dispatchEvent(new MessageEvent('message', {
    data: msg,
    origin
  }));
}

function initializeHost() {
  const msg: AddinHostMessageEventData = {
    message: {
      context: 'my_context',
      envId: 'my_envid'
    },
    messageType: 'host-ready',
    source: 'bb-addin-host'
  };

  postMessageFromHost(msg);
}

describe('AddinClient ', () => {

  // Set the addinId query string.
  (AddinClient as any).getQueryString = () => {
    return '?test=value&addinId=test_id&test2=value2';
  };

  describe('constructor', () => {

    it('should raise "ready" message to "*" on constructor including the addinId from the query string.', () => {

      let post: any;

      window.parent.postMessage = (message, targetOrigin) => {
        post = {
          message,
          targetOrigin
        };
      };

      const client = new AddinClient({
        callbacks: {
          init: () => { return; }
        }
      });
      client.destroy();

      expect(post.message.messageType).toBe('ready');
      expect(post.message.source).toBe('bb-addin-client');
      expect(post.message.addinId).toBe('test_id');
      expect(post.targetOrigin).toBe('*');

    });

  });

  describe('getAuthToken', () => {

    it('should delegate to the "getUserIdentityToken" function.',
      () => {
        let delegated = false;

        const client = new AddinClient({
          callbacks: {
            init: () => { return; }
          }
        });

        initializeHost();

        spyOn(client, 'getUserIdentityToken').and.callFake(() => {
          delegated = true;
          return Promise.resolve('');
        });

        client.getAuthToken();

        client.destroy();

        expect(delegated).toBe(true);
      });

  });

  describe('handleMessage', () => {

    describe('host-ready', () => {

      it('should not call the "init" callback event if the source is not "bb-addin-host".',
        () => {
          let initCalled = false;
          const client = new AddinClient({
            callbacks: {
              init: () => { initCalled = true; }
            }
          });

          const msg: AddinHostMessageEventData = {
            message: {},
            messageType: 'host-ready',
            source: 'not-bb-addin-host'
          };

          postMessageFromHost(msg);

          client.destroy();

          expect(initCalled).toBe(false);
        });

      it('should call the "init" callback if source is "bb-addin-host" and pass through context and event id.',
        () => {
          let initArgs: any;

          const client = new AddinClient({
            callbacks: {
              init: (args: AddinClientInitArgs) => {
                initArgs = args;
              }
            }
          });

          const msg: AddinHostMessageEventData = {
            message: {
              context: 'my_context',
              envId: 'my_envid'
            },
            messageType: 'host-ready',
            source: 'bb-addin-host'
          };

          postMessageFromHost(msg);

          client.destroy();

          expect(initArgs.context).toBe('my_context');
          expect(initArgs.envId).toBe('my_envid');
        });

    });

    it('should disregard host messages from the wrong origin.',
      () => {
        let buttonClickCalled = false;

        const client = new AddinClient({
          callbacks: {
            buttonClick: () => { buttonClickCalled = true; },
            init: () => { return; }
          }
        });

        const msg: AddinHostMessageEventData = {
          message: {},
          messageType: 'button-click',
          source: 'bb-addin-host'
        };

        // Raising this message even though the host never issued host-ready.
        // Therefore the origin should not be trusted and message ignored.
        postMessageFromHost(msg);
        client.destroy();

        expect(buttonClickCalled).toBe(false);
      });

    describe('button-click', () => {

      it('should call the "buttonClick" callback.',
        () => {
          let buttonClickCalled = false;

          const client = new AddinClient({
            callbacks: {
              buttonClick: () => { buttonClickCalled = true; },
              init: () => { return; }
            }
          });

          initializeHost();

          const msg: AddinHostMessageEventData = {
            message: {},
            messageType: 'button-click',
            source: 'bb-addin-host'
          };

          postMessageFromHost(msg);
          client.destroy();

          expect(buttonClickCalled).toBe(true);
        });

      it('should tolerate the "buttonClick" callback being undefined.',
        () => {
          const client = new AddinClient({
            callbacks: {
              init: () => { return; }
            }
          });

          initializeHost();

          const msg: AddinHostMessageEventData = {
            message: {},
            messageType: 'button-click',
            source: 'bb-addin-host'
          };

          postMessageFromHost(msg);
          client.destroy();

          // No assertion.  Just don't fail.
        });

    });

    describe('help-click', () => {

      it('should call the "helpClick" callback.',
        () => {
          let helpClickCalled = false;

          const client = new AddinClient({
            callbacks: {
              helpClick: () => { helpClickCalled = true; },
              init: () => { return; }
            }
          });

          initializeHost();

          const msg: AddinHostMessageEventData = {
            message: {},
            messageType: 'help-click',
            source: 'bb-addin-host'
          };

          postMessageFromHost(msg);
          client.destroy();

          expect(helpClickCalled).toBe(true);
        });

      it('should tolerate the "helpClick" callback being undefined.',
        () => {
          const client = new AddinClient({
            callbacks: {
              init: () => { return; }
            }
          });

          initializeHost();

          const msg: AddinHostMessageEventData = {
            message: {},
            messageType: 'help-click',
            source: 'bb-addin-host'
          };

          postMessageFromHost(msg);
          client.destroy();

          // No assertion.  Just don't fail.
        });

    });

    describe('settings-click', () => {

      it('should call the "settingsClick" callback.',
        () => {
          let settingsClickCalled = false;

          const client = new AddinClient({
            callbacks: {
              init: () => { return; },
              settingsClick: () => { settingsClickCalled = true; }
            }
          });

          initializeHost();

          const msg: AddinHostMessageEventData = {
            message: {},
            messageType: 'settings-click',
            source: 'bb-addin-host'
          };

          postMessageFromHost(msg);
          client.destroy();

          expect(settingsClickCalled).toBe(true);
        });

      it('should tolerate the "settingsClick" callback being undefined.',
        () => {
          const client = new AddinClient({
            callbacks: {
              init: () => { return; }
            }
          });

          initializeHost();

          const msg: AddinHostMessageEventData = {
            message: {},
            messageType: 'settings-click',
            source: 'bb-addin-host'
          };

          postMessageFromHost(msg);
          client.destroy();

          // No assertion.  Just don't fail.
        });

    });

    describe('auth-token', () => {

      it('should pass result back through promise from getUserIdentityToken.',
        (done) => {
          let tokenReceived: string = null;

          const client = new AddinClient({
            callbacks: {
              init: () => { return; }
            }
          });

          initializeHost();

          client.getUserIdentityToken().then((token: string) => {
            tokenReceived = token;
          });

          const msg: AddinHostMessageEventData = {
            message: {
              authToken: 'the auth token',
              authTokenRequestId: 1 // One because this is the first request for this client.
            },
            messageType: 'auth-token',
            source: 'bb-addin-host'
          };

          postMessageFromHost(msg);
          client.destroy();

          // Delay the vaildation until after the post message is done.
          setTimeout(() => {
            expect(tokenReceived).toBe('the auth token');
            done();
          }, 0);

        });

    });

    describe('auth-token-fail', () => {

      it('should reject the promise from getUserIdentityToken and return the reason.',
        () => {
          let reasonReceived: string = null;

          const client = new AddinClient({
            callbacks: {
              init: () => { return; }
            }
          });

          initializeHost();

          client.getUserIdentityToken().catch((reason: string) => {
            reasonReceived = reason;
          });

          const msg: AddinHostMessageEventData = {
            message: {
              authTokenRequestId: 1, // One because this is the first request for this client.
              reason: 'the reason'
            },
            messageType: 'auth-token-fail',
            source: 'bb-addin-host'
          };

          postMessageFromHost(msg);
          client.destroy();

          // Delay the vaildation until after the post message is done.
          setTimeout(() => {
            expect(reasonReceived).toBe('the reason');
          }, 1);

        });

    });

    describe('close-modal', () => {

      it('should pass context back through promise from showModal.',
        (done) => {
          const testContext = {};
          let contextReceived: any = null;

          const client = new AddinClient({
            callbacks: {
              init: () => { return; }
            }
          });

          initializeHost();
          const args: AddinClientShowModalArgs = {};

          client.showModal(args).modalClosed.then((ctx: any) => {
            contextReceived = ctx;
          });

          const msg: AddinHostMessageEventData = {
            message: {
              context: testContext,
              modalRequestId: 1 // One because this is the first request for this client.
            },
            messageType: 'modal-closed',
            source: 'bb-addin-host'
          };

          postMessageFromHost(msg);
          client.destroy();

          // Delay the vaildation until after the post message is done.
          setTimeout(() => {
            expect(contextReceived).toBe(testContext);
            done();
          }, 100);

        });

    });

  });

  describe('init ready callback', () => {

    it('should raise "addin-ready" event.',
      () => {
        const readyArgs: AddinClientReadyArgs = {};
        let postedMessage: any;
        let postedOrigin: string;

        const client = new AddinClient({
          callbacks: {
            init: (args: AddinClientInitArgs) => {
              args.ready(readyArgs);
            }
          }
        });

        const msg: AddinHostMessageEventData = {
          message: {},
          messageType: 'host-ready',
          source: 'bb-addin-host'
        };

        spyOn(window.parent, 'postMessage').and.callFake((message: any, targetOrigin: string) => {
          postedMessage = message;
          postedOrigin = targetOrigin;
        });

        postMessageFromHost(msg);

        client.destroy();

        expect(postedMessage.message).toBe(readyArgs);
        expect(postedMessage.messageType).toBe('addin-ready');
        expect(postedOrigin).toBe(TEST_HOST_ORIGIN);
      });

  });

  describe('closeModal', () => {

    it('should raise "close-modal" event.',
      () => {
        let postedMessage: any;
        let postedOrigin: string;

        const client = new AddinClient({
          callbacks: {
            init: () => { return; }
          }
        });

        initializeHost();

        spyOn(window.parent, 'postMessage').and.callFake((message: any, targetOrigin: string) => {
          postedMessage = message;
          postedOrigin = targetOrigin;
        });

        const args: AddinClientCloseModalArgs = {};

        client.closeModal(args);

        client.destroy();

        expect(postedMessage.message).toBe(args);
        expect(postedMessage.messageType).toBe('close-modal');
        expect(postedOrigin).toBe(TEST_HOST_ORIGIN);
      });

  });

  describe('getUserIdentityToken', () => {

    it('should raise "get-auth-token" event with increasing request id.',
      () => {
        let postedMessage: any;
        let postedOrigin: string;

        const client = new AddinClient({
          callbacks: {
            init: () => { return; }
          }
        });

        initializeHost();

        spyOn(window.parent, 'postMessage').and.callFake((message: any, targetOrigin: string) => {
          postedMessage = message;
          postedOrigin = targetOrigin;
        });

        client.getUserIdentityToken();

        expect(postedMessage.message.authTokenRequestId).toBe(1);
        expect(postedMessage.messageType).toBe('get-auth-token');
        expect(postedOrigin).toBe(TEST_HOST_ORIGIN);

        client.getUserIdentityToken();

        // A second call should increment the request id
        expect(postedMessage.message.authTokenRequestId).toBe(2);
        expect(postedMessage.messageType).toBe('get-auth-token');
        expect(postedOrigin).toBe(TEST_HOST_ORIGIN);

        client.destroy();
      });

  });

  describe('navigate', () => {

    it('should raise "navigate" event with proper url.',
      () => {
        let postedMessage: any;
        let postedOrigin: string;

        const client = new AddinClient({
          callbacks: {
            init: () => { return; }
          }
        });

        initializeHost();

        spyOn(window.parent, 'postMessage').and.callFake((message: any, targetOrigin: string) => {
          postedMessage = message;
          postedOrigin = targetOrigin;
        });

        const args: AddinClientNavigateArgs = {
          url: 'https://renxt.blackbaud.com?test=1'
        };

        client.navigate(args);

        client.destroy();

        expect(postedMessage.message.url).toBe(args.url);
        expect(postedMessage.messageType).toBe('navigate');
        expect(postedOrigin).toBe(TEST_HOST_ORIGIN);
      });

  });

  describe('open-help', () => {

    it('should raise "open-help" event with proper help key.',
      () => {
        let postedMessage: any;
        let postedOrigin: string;

        const client = new AddinClient({
          callbacks: {
            init: () => { return; }
          }
        });

        initializeHost();

        spyOn(window.parent, 'postMessage').and.callFake((message: any, targetOrigin: string) => {
          postedMessage = message;
          postedOrigin = targetOrigin;
        });

        const args: AddinClientOpenHelpArgs = {
          helpKey: 'test-help-key.html'
        };

        client.openHelp(args);

        client.destroy();

        expect(postedMessage.message.helpKey).toBe(args.helpKey);
        expect(postedMessage.messageType).toBe('open-help');
        expect(postedOrigin).toBe(TEST_HOST_ORIGIN);
      });

  });

  describe('showModal', () => {

    it('should raise "show-modal" event with increasing request id.',
      () => {
        let postedMessage: any;
        let postedOrigin: string;

        const client = new AddinClient({
          callbacks: {
            init: () => { return; }
          }
        });

        initializeHost();

        spyOn(window.parent, 'postMessage').and.callFake((message: any, targetOrigin: string) => {
          postedMessage = message;
          postedOrigin = targetOrigin;
        });

        const args: AddinClientShowModalArgs = {};

        client.showModal(args);

        expect(postedMessage.message.args).toBe(args);
        expect(postedMessage.message.modalRequestId).toBe(1);
        expect(postedMessage.messageType).toBe('show-modal');
        expect(postedOrigin).toBe(TEST_HOST_ORIGIN);

        client.showModal(args);

        // A second call should increment the request id
        expect(postedMessage.message.args).toBe(args);
        expect(postedMessage.message.modalRequestId).toBe(2);
        expect(postedMessage.messageType).toBe('show-modal');
        expect(postedOrigin).toBe(TEST_HOST_ORIGIN);

        client.destroy();
      });

  });

  describe('show-toast', () => {

    it('should raise "show-toast" event with proper message.',
      () => {
        let postedMessage: any;
        let postedOrigin: string;

        const client = new AddinClient({
          callbacks: {
            init: () => { return; }
          }
        });

        initializeHost();

        spyOn(window.parent, 'postMessage').and.callFake((message: any, targetOrigin: string) => {
          postedMessage = message;
          postedOrigin = targetOrigin;
        });

        const args: AddinClientShowToastArgs = {
          message: 'this is a toast message',
          style: AddinToastStyle.Warning
        };

        client.showToast(args);

        client.destroy();

        expect(postedMessage.message.message).toBe(args.message);
        expect(postedMessage.messageType).toBe('show-toast');
        expect(postedOrigin).toBe(TEST_HOST_ORIGIN);
      });

  });

  describe('show-flyout', () => {

    it('should raise "show-flyout" event with proper message.',
      (done) => {
        let postedMessage: any;
        let postedOrigin: string;
        let initCalled: boolean = false;
        let flyoutNextClickCalled: boolean = false;
        let flyoutPreviousClickCalled: boolean = false;
        let flyoutClosedCalled: boolean = false;

        const client = new AddinClient({
          callbacks: {
            flyoutNextClick: () => { flyoutNextClickCalled = true; },
            flyoutPreviousClick: () => { flyoutPreviousClickCalled = true; },
            init: () => { initCalled = true; }
          }
        });

        initializeHost();

        spyOn(window.parent, 'postMessage').and.callFake((message: any, targetOrigin: string) => {
          postedMessage = message;
          postedOrigin = targetOrigin;
        });

        const args: AddinClientShowFlyoutArgs = {
          context: {
            userData: 'some data'
          },
          defaultWidth: 600,
          iteratorNextDisabled: false,
          iteratorPreviousDisabled: true,
          maxWidth: 1000,
          minWidth: 200,
          permalink: {
            label: 'some label',
            url: 'some url'
          },
          showIterator: true,
          url: 'some url'
        };

        client.showFlyout(args)
          .flyoutClosed.then(() => {
            flyoutClosedCalled = true;
          });

        const nextClickMsg: AddinHostMessageEventData = {
          message: {},
          messageType: 'flyout-next-click',
          source: 'bb-addin-host'
        };

        postMessageFromHost(nextClickMsg);

        const previousClickMsg: AddinHostMessageEventData = {
          message: {},
          messageType: 'flyout-previous-click',
          source: 'bb-addin-host'
        };

        postMessageFromHost(previousClickMsg);

        const closedMsg: AddinHostMessageEventData = {
          message: {},
          messageType: 'flyout-closed',
          source: 'bb-addin-host'
        };

        postMessageFromHost(closedMsg);

        client.destroy();

        expect(initCalled).toBe(true);
        expect(postedMessage.message.context).toBe(args.context);
        expect(postedMessage.message.defaultWidth).toBe(args.defaultWidth);
        expect(postedMessage.message.iteratorNextDisabled).toBe(args.iteratorNextDisabled);
        expect(postedMessage.message.iteratorPreviousDisabled).toBe(args.iteratorPreviousDisabled);
        expect(postedMessage.message.maxWidth).toBe(args.maxWidth);
        expect(postedMessage.message.minWidth).toBe(args.minWidth);
        expect(postedMessage.message.permalink).toBe(args.permalink);
        expect(postedMessage.message.showIterator).toBe(args.showIterator);
        expect(postedMessage.message.url).toBe(args.url);
        expect(postedMessage.messageType).toBe('show-flyout');
        expect(postedOrigin).toBe(TEST_HOST_ORIGIN);

        expect(flyoutNextClickCalled).toBe(true);
        expect(flyoutPreviousClickCalled).toBe(true);

        // Delay the vaildation until after the post message is done.
        setTimeout(() => {
          expect(flyoutClosedCalled).toBe(true);
          done();
        }, 100);
      });

  });

  describe('close-flyout', () => {

    it('should raise "close-flyout" event.',
      () => {
        let postedMessage: any;
        let postedOrigin: string;

        const client = new AddinClient({
          callbacks: {
            init: () => { return; }
          }
        });

        initializeHost();

        spyOn(window.parent, 'postMessage').and.callFake((message: any, targetOrigin: string) => {
          postedMessage = message;
          postedOrigin = targetOrigin;
        });

        client.closeFlyout();

        client.destroy();

        expect(postedMessage.message).toBe(undefined);
        expect(postedMessage.messageType).toBe('close-flyout');
        expect(postedOrigin).toBe(TEST_HOST_ORIGIN);
      });

  });

  describe('show-confirm', () => {

    it('should raise "show-confirm" event with proper message.',
      (done) => {
        let postedMessage: any;
        let postedOrigin: string;
        let confirmAction: string;

        const client = new AddinClient({
          callbacks: {
            init: () => { return; }
          }
        });

        initializeHost();

        spyOn(window.parent, 'postMessage').and.callFake((message: any, targetOrigin: string) => {
          postedMessage = message;
          postedOrigin = targetOrigin;
        });

        const args: AddinClientShowConfirmArgs = {
          body: 'Confirm dialog body text',
          buttons: [
            {
              action: 'action 1',
              text: 'Action 1'
            },
            {
              action: 'action 2',
              autofocus: true,
              style: AddinConfirmButtonStyle.Primary,
              text: 'Action 2'
            }
          ],
          message: 'This is a confirm'
        };

        client.showConfirm(args)
          .then((result) => {
            confirmAction = result;
          });

        const closedMsg: AddinHostMessageEventData = {
          message: {
            reason: 'some action'
          },
          messageType: 'confirm-closed',
          source: 'bb-addin-host'
        };

        postMessageFromHost(closedMsg);

        client.destroy();

        expect(postedMessage.message.message).toBe(args.message);
        expect(postedMessage.messageType).toBe('show-confirm');
        expect(postedOrigin).toBe(TEST_HOST_ORIGIN);

        // Delay the vaildation until after the post message is done.
        setTimeout(() => {
          expect(confirmAction).toBe('some action');
          done();
        }, 100);
      });
  });

  describe('show-error', () => {

    it('should raise "show-error" event with proper message.',
      () => {
        let postedMessage: any;
        let postedOrigin: string;

        const client = new AddinClient({
          callbacks: {
            init: () => { return; }
          }
        });

        initializeHost();

        spyOn(window.parent, 'postMessage').and.callFake((message: any, targetOrigin: string) => {
          postedMessage = message;
          postedOrigin = targetOrigin;
        });

        const args: AddinClientShowErrorArgs = {
          closeText: 'Close',
          description: 'Error desc',
          title: 'Error title'
        };

        client.showError(args);

        client.destroy();

        expect(postedMessage.message).toBe(args);
        expect(postedMessage.messageType).toBe('show-error');
        expect(postedOrigin).toBe(TEST_HOST_ORIGIN);
      });

  });

  describe('showWait', () => {
    let client: AddinClient;
    let spyPostMessage: jasmine.Spy;

    beforeEach(() => {
      client = new AddinClient({
        callbacks: {
          init: () => { return; }
        }
      });
      spyPostMessage = spyOn(window.parent, 'postMessage');
      spyPostMessage.and.stub();

      initializeHost();

      spyPostMessage.calls.reset();
    });

    afterEach(() => {
      client.destroy();
    });

    it('should raise "show-wait" event.',
      () => {
        const expected: any = jasmine.objectContaining({
          messageType: 'show-wait'
        });

        client.showWait();

        expect(window.parent.postMessage).toHaveBeenCalledWith(expected, jasmine.any(String));
      });

    it('should use trusted host.',
      () => {
        const expected: string = TEST_HOST_ORIGIN;

        client.showWait();

        expect(window.parent.postMessage).toHaveBeenCalledWith(jasmine.any(Object), expected);
      });

  });

  describe('hideWait', () => {
    let client: AddinClient;
    let spyPostMessage: jasmine.Spy;

    beforeEach(() => {
      client = new AddinClient({
        callbacks: {
          init: () => { return; }
        }
      });
      spyPostMessage = spyOn(window.parent, 'postMessage');
      spyPostMessage.and.stub();

      initializeHost();

      spyPostMessage.calls.reset();
    });

    afterEach(() => {
      client.destroy();
    });

    it('should raise "hide-wait" event.',
      () => {
        const expected: any = jasmine.objectContaining({
          messageType: 'hide-wait'
        });

        client.hideWait();

        expect(window.parent.postMessage).toHaveBeenCalledWith(expected, jasmine.any(String));
      });

    it('should use trusted host.',
      () => {
        const expected: string = TEST_HOST_ORIGIN;

        client.hideWait();

        expect(window.parent.postMessage).toHaveBeenCalledWith(jasmine.any(Object), expected);
      });

  });

  describe('postMessageToHostPage', () => {

    it('should warn if origin is invalid.',
      () => {
        const badOrigin = 'https://google.com';
        let messageWasSentFromAddin = false;
        let consoleWarningIssued = false;

        const client = new AddinClient({
          callbacks: {
            init: () => { return; }
          }
        });

        const msg: AddinHostMessageEventData = {
          message: {},
          messageType: 'host-ready',
          source: 'bb-addin-host'
        };

        // Initialize from the host with a bad origin
        postMessageFromHost(msg, badOrigin);

        // Spy on messages from the add-in to make sure it doesn't post.
        spyOn(window.parent, 'postMessage').and.callFake(() => {
          messageWasSentFromAddin = true;
        });

        // Spy on messages from the add-in to make sure it doesn't post.
        spyOn(console, 'warn').and.callFake(() => {
          consoleWarningIssued = true;
        });

        const args: AddinClientNavigateArgs = {
          url: 'https://renxt.blackbaud.com?test=1'
        };

        // Call navigate to trigger posting a message to the host.
        // Should result in a warning and not post because the host origin was not valid.
        client.navigate(args);

        client.destroy();

        expect(messageWasSentFromAddin).toBe(false);
        expect(consoleWarningIssued).toBe(true);
      });

  });

  describe('trackHeightChangesOfAddinContent', () => {

    it('should raise "height-change" event when the height changes.',
      () => {
        jasmine.clock().install();
        let postedMessage: any;
        let postedOrigin: string;
        let initArgs: AddinClientInitArgs;

        const client = new AddinClient({
          callbacks: {
            init: (args) => { initArgs = args; }
          }
        });

        initializeHost();

        spyOn(window.parent, 'postMessage').and.callFake((message: any, targetOrigin: string) => {
          // Filter out the add-in ready event.
          if (message.messageType === 'height-change') {
            postedMessage = message;
            postedOrigin = targetOrigin;
          }
        });

        // Change height and wait for interval
        // The height posted should be the sum of offset height and top/bottom margin.
        document.body.style.marginTop = '10px';
        document.body.style.marginBottom = '5px';
        document.body.style.height = '100px';
        expect(document.body.offsetHeight).toBe(100);
        expect(document.documentElement.offsetHeight).toBe(115);
        jasmine.clock().tick(1100);

        // Validate message was sent.
        expect(postedMessage.message.height).toBe('115px');
        expect(postedMessage.messageType).toBe('height-change');
        expect(postedOrigin).toBe(TEST_HOST_ORIGIN);
        postedMessage = undefined;
        postedOrigin = undefined;

        // Change height and wait for interval
        document.body.style.height = '200px';
        expect(document.body.offsetHeight).toBe(200);
        expect(document.documentElement.offsetHeight).toBe(215);
        jasmine.clock().tick(1100);

        // Validate message was sent.
        expect(postedMessage.message.height).toBe('215px');
        expect(postedMessage.messageType).toBe('height-change');
        expect(postedOrigin).toBe(TEST_HOST_ORIGIN);
        postedMessage = undefined;
        postedOrigin = undefined;

        // Don't change height and wait for interval
        expect(document.body.offsetHeight).toBe(200);
        expect(document.documentElement.offsetHeight).toBe(215);
        jasmine.clock().tick(1100);

        // Validate message was not sent.
        expect(postedMessage).toBe(undefined);
        expect(postedOrigin).toBe(undefined);
        postedMessage = undefined;
        postedOrigin = undefined;

        // Change height and complete init.ready.  This should trigger the message even without waiting
        // on the interval to pass.
        document.body.style.height = '300px';
        expect(document.body.offsetHeight).toBe(300);
        expect(document.documentElement.offsetHeight).toBe(315);
        expect(initArgs).not.toBe(null);
        if (initArgs) {
          initArgs.ready({});
        }

        // Validate message was sent.
        expect(postedMessage.message.height).toBe('315px');
        expect(postedMessage.messageType).toBe('height-change');
        expect(postedOrigin).toBe(TEST_HOST_ORIGIN);
        postedMessage = undefined;
        postedOrigin = undefined;

        client.destroy();
        jasmine.clock().uninstall();
      });

  });

});
