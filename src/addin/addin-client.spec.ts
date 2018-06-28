import { AddinClient } from './addin-client';
import { AddinClientCloseModalArgs } from './client-interfaces/addin-client-close-modal-args';
import { AddinClientInitArgs } from './client-interfaces/addin-client-init-args';
import { AddinClientNavigateArgs } from './client-interfaces/addin-client-navigate-args';
import { AddinClientOpenHelpArgs } from './client-interfaces/addin-client-open-help-args';
import { AddinClientReadyArgs } from './client-interfaces/addin-client-ready-args';
import { AddinClientShowModalArgs } from './client-interfaces/addin-client-show-modal-args';
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

    describe('auth-token', () => {

      it('should pass result back through promise from getAuthToken.',
        (done) => {
          let tokenReceived: string = null;

          const client = new AddinClient({
            callbacks: {
              init: () => { return; }
            }
          });

          initializeHost();

          client.getAuthToken().then((token: string) => {
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

      it('should reject the promise from getAuthToken and return the reason.',
        () => {
          let reasonReceived: string = null;

          const client = new AddinClient({
            callbacks: {
              init: () => { return; }
            }
          });

          initializeHost();

          client.getAuthToken().catch((reason: string) => {
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

  describe('getAuthToken', () => {

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

        client.getAuthToken();

        expect(postedMessage.message.authTokenRequestId).toBe(1);
        expect(postedMessage.messageType).toBe('get-auth-token');
        expect(postedOrigin).toBe(TEST_HOST_ORIGIN);

        client.getAuthToken();

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
        let initArgs = null;

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
        jasmine.clock().tick(1100);

        // Validate message was sent.
        expect(postedMessage.message.height).toBe('215px');
        expect(postedMessage.messageType).toBe('height-change');
        expect(postedOrigin).toBe(TEST_HOST_ORIGIN);
        postedMessage = undefined;
        postedOrigin = undefined;

        // Don't change height and wait for interval
        expect(document.body.offsetHeight).toBe(200);
        jasmine.clock().tick(1100);

        // Validate message was sent.
        expect(postedMessage).toBe(undefined);
        expect(postedOrigin).toBe(undefined);
        postedMessage = undefined;
        postedOrigin = undefined;

        // Change height and complete init.ready.  This should trigger the message even without waiting
        // on the interval to pass.
        document.body.style.height = '300px';
        expect(document.body.offsetHeight).toBe(300);
        initArgs.ready();

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
