# sky-addin-client
[![npm](https://img.shields.io/npm/v/@blackbaud/sky-addin-client.svg)](https://www.npmjs.com/package/@blackbaud/sky-addin-client)
[![coverage](https://codecov.io/github/blackbaud/sky-addin-client/coverage.svg?branch=master)](https://codecov.io/github/blackbaud/sky-addin-client/)

The SKY Add-in Client Library facilitates creating custom add-ins to extend UI experiences within Blackbaud applications.  Developers can register the add-in URL with their SKY API application, and at runtime the add-in will be loaded into an iframe within the application.  This library must be used in the add-in for it to render within the Blackbaud application. The `AddinClient` class will integrate with the host page, passing data and commands between the host and the add-in's iframe.

For SKY Add-ins written in SKY UX, the [SKY UX Add-in Client Library](https://github.com/blackbaud/skyux-lib-addin-client) can be used as a more Angular-friendly wrapper over this lower-level library.

For more information on creating SKY Add-ins, view the documentation on the [SKY API Developer Portal](https://developer.blackbaud.com/skyapi/docs/addins).

## Installation

### Prerequisites
This library makes extensive use of [ES6-style Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), so in order to support browsers that do not yet have native support for Promises (such as Internet Explorer 11) you will need to include a Promise polyfill such as [`es6-promise`](https://github.com/stefanpenner/es6-promise) and use the [auto-polyfill feature](https://github.com/stefanpenner/es6-promise#auto-polyfill) of the library so that `Promise` is added to the global environment.  This will need to be loaded on your page before the add-in library.

### ES6/TypeScript
- Ensure that you have Node v6+ and NPM v3+. To verify this, run `node -v` and `npm -v` at the command line.
- Install the library as a dependency of your project by running `npm install --save @blackbaud/sky-addin-client` in your project's folder.

### Vanilla JavaScript/ES5
The SKY Add-in Client Library is also distributed as a UMD bundle.  If you're using ES5 with Node or a tool like Browserify you can `require()` it:

```js
var BBSkyAddinClient = require('@blackbaud/sky-addin-client');
var client = new BBSkyAddinClient.AddinClient({...});
```

If you're not using a module loader or prefer to reference the file via CDN, you can load the file onto your page via `<script>` tag.

If using NPM, add a reference to `dist/bundles/sky-addin-client.umd.js` or concatenate that file with the rest of your page's JavaScript.

If using the SKY UX CDN, add a reference to `https://sky.blackbaudcdn.net/static/sky-addin-client/[VERSION]/sky-addin-client.umd.min.js`, where `[VERSION]` is the version you'd like to use.  Starting with version `1.0.15`, All versions published to NPM are also available through the CDN.  You can also reference the latest major version. Example versions:

- `https://sky.blackbaudcdn.net/static/sky-addin-client/1.0.15/sky-addin-client.umd.min.js`
- `https://sky.blackbaudcdn.net/static/sky-addin-client/1/sky-addin-client.umd.min.js`

You can now access it via the global `BBSkyAddinClient` variable:

```js
// BBSkyAddinClient is global here.
var client = new BBSkyAddinClient.AddinClient({...});
```


## Usage

#### Initializing the add-in
All add-ins must use this library in order to show in the host application. You will need to construct the `AddinClient` and register for any callbacks from the host page that you wish to handle.  You *must* register for `init`, which will pass key context information to your add-in.

Your `init` function will be called with an arguments object that contains:
 - `envId` - The environment ID for the host page
 - `context` - Additional context of the host page, which will vary for different extension points.
 - `supportedEventTypes` - The supported event types that are handled by the host page.
 - `themeSettings` - The UX theme of the host page.
 - `ready` - A callback to inform the add-in client that the add-in is initialized and ready to be shown.

Using the information provided in the `init` arguments, the add-in should determine if and how it should be rendered.  Then it should call the `ready` callback, informing the host page.

```js
var client = new AddinClient({
  callbacks: {
    init: (args) => {
      args.ready({
        showUI: true,
        title: 'My Custom Tile Title'
      });
    }
  }
});
```

You can also allow additional origins where your add-in client may run within a Blackbaud host page. Additional origins are supplied as regular expression patterns. The `AddinClient` already allows several Blackbaud host origins by default. If you find a need to extend the defaults, you may do so by populating the `AddinClientConfig`'s `allowedOrigins` property.

```js
var client = new AddinClient({
  callbacks: {
    init: (args) => {
      args.ready({
        showUI: true,
        title: 'My Custom Tile Title'
      });
    }
  },
  allowedOrigins: [
    /^https\:\/\/[\w\-\.]+\.additionalblackbauddomain\.com$/,
  ]
});
```

#### Tile add-ins
For tile add-ins, the URL for the add-in will be rendered in a visible iframe on the page, where you can render any custom content.  The iframe will initially be hidden until an initialize protocol is completed between the host and the add-in.

The host page will handle rendering the tile component around the add-in iframe.  When calling the `ready` callback, the `title` field will indicate the title for the tile.  Initially, the entire tile will be hidden, and will show on the page if `showUI` is set to `true` in the callback.  You can set it to `false` to indicate that the tile should not be shown, based on the user's privileges or context of the current record, etc.

Tile add-ins support an optional configuration object that can be used to further control the look/feel/behavior of the tile within the host application.  For
example, to control whether any additional summary text/image is shown when the tile is collapsed, and control whether the "inline help" or "settings" icons appear
in the tile header.

Tile add-ins support optional callbacks for `inlineHelpClick` and `settingsClick`, which will be invoked whenever the user clicks the "inline help" or "settings" icons, respectively:

```js
var client = new AddinClient({
  callbacks: {
    init: (args) => {
      args.ready({
        showUI: true,
        title: 'My Custom Tile Title',
        tileConfig: {
          summaryStyle: BBSkyAddinClient.AddinTileSummaryStyle.Text,
          summaryText: '18 records',
          showInlineHelp: true,
          showSettings: true
        }
      });
    },
    inlineHelpClick: () => {
      // The user has clicked the "Inline Help" icon in the tile header
    },
    settingsClick: () => {
      // The user has clicked the "Settings" icon in the tile header
    }
  }
});
```

Tile add-ins also support optional `helpPopoverContent` and `helpPopoverTitle` configuration properties to specify help text to be displayed in a popover when the "inline help" icon is clicked.

```js
var client = new AddinClient({
  callbacks: {
    init: (args) => {
      args.ready({
        showUI: true,
        title: 'My Custom Tile Title',
        tileConfig: {
          showInlineHelp: true,
          helpPopoverContent: 'Help popover content text',
          helpPopoverTitle: 'Help popover title'
        }
      });
    },
    inlineHelpClick: () => {
      // The user has clicked the "Inline Help" icon in the tile header
    }
  }
});
```

#### Tab add-ins (not yet supported, but coming soon)
For tab add-ins, the URL for the add-in will be rendered in a visible iframe on the page, where you can render any custom content.  The iframe will initially be hidden until an initialize protocol is completed between the host and the add-in.

The host page will handle rendering the tab component around the add-in iframe.  When calling the `ready` callback, the `title` field will indicate the title for the tab component.  Initially, the entire tab will be hidden, and will show on the page if `showUI` is set to `true` in the callback.  You can set it to `false` to indicate that the tab should not be shown, based on the user's privileges or context of the current record, etc.

Tab add-ins support an optional configuration object that can be used to further control the look/feel/behavior of the tab within the host application.  For
example, to control whether any additional summary text/image is shown next to the tab caption:

```js
var client = new AddinClient({
  callbacks: {
    init: (args) => {
      args.ready({
        showUI: true,
        title: 'My Custom Tab Title',
        tabConfig: {
          style: 'Text',
          summary: '20'
        }
      });
    }
  }
});
```

Tab add-ins will automatically track the height of the add-in's content and resize its container accordingly.

<strong>Note</strong>:  at this time, only Button and Tile add-ins are supported.  Tab add-ins are planned as a future enhancement.

#### Button add-ins
For button add-ins, the add-in iframe will always be hidden.  The `init` protocol is still used, where `showUI` indicates whether the button should show or not on the page.  The `title` field will specify the label for the button.

When doing a button add-in, an additional callback for `buttonClick` should be configured.  This will be invoked whenever the user clicks the button for the add-in to take action.

Button add-ins support an optional configuration object that can be used to further control the look/feel/behavior of the button within the host application.  For
example, to control whether any additional icon is shown next to the button text:

```js
var client = new AddinClient({
  callbacks: {
    init: (args) => {
      args.ready({
        showUI: true,
        title: 'My Custom Button Text',
        buttonConfig: {
          style: 'Add'
        }
      });
    },
    buttonClick: () => {
      // Show a modal or take action.
    }
  }
});
```

#### Entry form add-ins
For entry form add-ins, the URL for the add-in will be rendered in a visible iframe on the entry form, where you can render any custom content.  The iframe will initially be hidden until an initialize protocol is completed between the host and the add-in.

The host page will handle rendering the container around the add-in iframe.  When calling the `ready` callback, the `title` field will indicate the title for the vertical tab in the form.  Initially, the vertical tab will be hidden, and will only show on the form if `showUI` is set to `true` in the callback.  You can set it to `false` to indicate that the tab and add-in content should not be shown, based on the user's privileges or whether a user interface is appropriate for your use case.

Entry form add-ins support specific form events that may occur when user interaction causes form data to change, or when a form is saved or canceled.  To handle form events, call the `addEventHandler` method on the `AddinClient` class, passing the event type and callback function to be invoked when the event occurs:

```js
var client = new AddinClient({
  callbacks: {
    init: (args) => {
      args.ready({
        showUI: true,
        title: 'Custom entry form tab'
      });
    }
  }
});

// To handle add-in events, call the addEventHandler method
client.addEventHandler(
  'form-data-update',
  function (context) {
    // get updated data from context object
  }
);
```

Entry forms may also support the `form-save` and `form-cancel` event types.  These event types allow the add-in client to perform an asynchronous task (e.g. call a backend service) while the form is closing.  The callback's `done()` function MUST be called to allow the form to close.

```js
var client = new AddinClient({
  callbacks: {
    init: (args) => {
      args.ready({
        showUI: true,
        title: 'Custom entry form tab'
      });
    }
  }
});

// To handle add-in events, call the addEventHandler method
client.addEventHandler(
  'form-save',
  function (context, done) {
    // handle the save event, asynchronously

    done(); // When done, call the done function (tells the entry form it's OK to close)
  }
);
```

#### Showing a modal
Add-ins are capable of launching a "modal" user experience to show more details or gather additional input from the user.  The modal will be rendered in a separate full-screen iframe to maximize the available real estate (meaning, it will not be scoped to the bounds of the add-in's iframe).

To launch a modal, call the `showModal` function on the client, passing the URL for the modal and any context data needed by the modal:

```js
// Parent add-in launching a modal
var client = new AddinClient({...});
client.showModal({
  url: '<modal-addin-url>',
  context: { /* arbitrary context object to pass to modal */ }
});
```

##### Modal add-in
The host page will launch a full screen iframe for the URL provided, and load it as an add-in the same way it does for other types of add-ins.  The modal page must also pull in the SKY Add-in Client Library and make use of the `AddinClient`.

The modal add-in will be responsible for rendering the modal element itself (including any chrome around the modal content).  To create a native modal experience, the add-in may set the body background to `transparent` and launch a SKY UX modal within its full screen iframe.

As with a typical add-in, the modal add-in should register for the `init` callback and will receive `envId` in the arguments. The `context` field for arguments will match the context object passed into the `showModal` call from the parent add-in.  Note that this is crossing iframes so the object has been serialized and deserialized.  It can be used for passing data but not functions.

##### Closing the modal
The modal add-in is responsible for triggering the close with the `closeModal` function on the client.  It is able to pass context information back to the parent add-in:

```js
// Modal add-in rendered in full screen iframe
var client = new AddinClient({...});
client.closeModal({
  context: { /* arbitrary context object to pass to parent add-in */ }
});
```

The parent add-in can listen to the close event via the `modalClosed` Promise returned from `showModal`. The Promise will resolve when the modal is closed, and will include the context data returned from the modal:

```js
// Parent add-in launching a modal
var client = new AddinClient({...});
var modal = client.showModal({
  url: '<modal-addin-url>',
  context: { /* arbitrary context object to pass to modal */ }
});

modal.modalClosed.then((context) => {
  // Handle that the modal is closed.
  // Use the context data passed back from closeModal.
});
```

#### Navigating the parent page

The add-in can choose to navigate the parent page based on user interactions.  To do so, call the `navigate` method on the `AddinClient` object.  This function takes an object argument with property `url` for where to navigate.  A fully qualified url should be used.

```js
var client = new AddinClient({...});
client.navigate({ url: '<target_url>' });
```

#### Opening the Blackbaud Help flyout (Internal-use only)
The add-in can instruct the parent page to display the Help flyout, and specify which topic to display. To do this, call the `openHelp` method on the `AddinClient` object. This function takes an object argument with property `helpKey` for the name of the help topic to display. A single .html file should be named.

```js
var client = new AddinClient({...});
client.openHelp({ helpKey: '<target_page>.html' });
```

#### Showing a toast

The add-in can instruct the parent page to show a toast. To do this, call the `showToast` method on the `AddinClient` object. This function takes an object argument with properties `message` and `style` representing the content and the display style of the toast.

```js
var client = new AddinClient({...});
client.showToast({ message: 'toast message', style: AddinToastStyle.Info });
```

#### Showing a flyout
Add-ins are capable of launching a "flyout" user experience to display additional information.

To launch a flyout, call the `showFlyout` function on the client, passing the URL for the flyout and any context data needed by the flyout:

```js
// Parent add-in launching a flyout
var client = new AddinClient({...});
client.showFlyout({
  url: '<flyout-addin-url>',
  context: { /* arbitrary context object to pass to flyout */ }
});
```

##### Flyout add-in
The host page will launch an iframe for the URL provided, and load it as an add-in the same way it does for other types of add-ins.  The flyout page must also pull in the SKY Add-in Client Library and make use of the `AddinClient`.

As with a typical add-in, the flyout add-in should register for the `init` callback and will receive `envId` in the arguments. The `context` field for arguments will match the context object passed into the `showFlyout` call from the parent add-in.  Note that this is crossing iframes so the object has been serialized and deserialized.  It can be used for passing data but not functions.

##### Closing the flyout
An add-in is able to close the flyout by calling the `closeFlyout` function on the client:

```js
// Close an open flyout from the client
var client = new AddinClient({...});
client.closeFlyout();
```

The parent add-in can listen to the close event via the `flyoutClosed` Promise returned from `showFlyout`. The Promise will resolve when the flyout is closed:

```js
// Parent add-in launching a flyout
var client = new AddinClient({...});
var flyout = client.showFlyout({
  url: '<flyout-addin-url>',
  context: { /* arbitrary context object to pass to flyout */ }
});

flyout.flyoutClosed.then(() => {
  // Handle that the flyout is closed.
});
```

#### Showing a confirm dialog

The add-in can instruct the parent page to show a confirm dialog. To do this, call the `showConfirm` method on the `AddinClient` object. This function takes an object argument with properties `message`, `body`, and `buttons` representing the title, body, and buttons to display on the confirm dialog.

```js
var client = new AddinClient({...});
client.showConfirm(
  {
    message: 'confirm title',
    body: 'confirm message body',
    buttons: [
      {
        action: 'ok',
        text: 'OK',
        autofocus: true,
        style: AddinConfirmButtonStyle.Primary
      },
      {
        action: 'cancel',
        text: 'Cancel',
        style: AddinConfirmButtonStyle.Link
      }
    ]
  }).then((action: string) {
    // Handle the action returned from the confirm dialog.
  });
```

#### Showing an error dialog

The add-in can instruct the parent page to show an error dialog. To do this, call the `showError` method on the `AddinClient` object. This function takes an object argument with properties `closeText`, `description` and `title` representing the button text, desciption of error, and title of error to display on the error dialog.

```js
var client = new AddinClient({...});
client.showError(
  {
    closeText: 'OK',
    description: 'An unexpected error occurred',
    title: 'Error'
  });
```

#### Page-blocking wait indicator
The add-in can instruct the parent page to show a page-blocking wait indicator. To do this, call the `showWait` method on the `AddinClient` object.

```js
var client = new AddinClient({...});
client.showWait();
```

##### Ending the wait indicator
An add-in is able to end the wait indicator by calling the `hideWait` function on the client:

```js
var client = new AddinClient({...});
client.hideWait();
```

#### Sending custom events to the host page
An add-in can send a custom event to the host page, as long as the host supports the event type.
Before sending an event to the host page, you must register for `init` and check the `supportedEventTypes`
property to determine what event types the host page will handle.

```js
var supportedEventTypes;

var client = new AddinClient({
  callbacks: {
    init: (args) => {
      supportedEventTypes = args.supportedEventTypes;

      args.ready({
        showUI: true
      });
    }
  }
});

// Before sending event, check to make sure the event is supported by the host page
if (supportedEventTypes.includes('my-event-type')) {
  // To send add-in events to the host, call the sendEvent method
  client.sendEvent({
    type: 'my-event-type',
    context: { /* context object to pass to host page */ }
  }).then(() => {
    // host page received the event
  }).catch((err) => {
    // an error occurred while attempting to send the event
  });
}
```

To determine the add-in extension points that support custom events,
please see https://developer.blackbaud.com/skyapi/docs/addins/concepts/extension-points.

## Authentication
SKY add-ins support a single-sign-on (SSO) mechanism that can be used to correlate the Blackbaud user with a user in the add-in's native system.

The `AddinClient` provides a `getUserIdentityToken` function for getting a short-lived "user identity token" from the host page.  This token is a signed value that is issued to the SKY API application and represents the Blackbaud user's identity.

The general flow is that when an add-in is instantiated, it can request a user identity token from the host page using the `getUserIdentityToken` function. The host page will return the user identity token to the add-in.  The add-in can then pass the token to its own backend, where it can be validated and used to look up a user in the add-in's native system. If a user mapping exists, then the add-in can present content to the user.  If no user mapping exists, the add-in can prompt the user to login.  Once the user's identity in the native system is known, the add-in can persist the user mapping so that on subsequent loads the user doesn't have to log in again (even across devices).

Note that the user identity token is a JWT that is signed by the SKY API OAuth 2.0 service, but it cannot be used to make calls to the SKY API.  In order to make SKY API calls, a proper SKY API access token must be obtained.

##### Getting the user identity token
The `getUserIdentityToken` function will return a Promise which will resolve with the token value.

```js
var client = new AddinClient({...});
client.getUserIdentityToken().then((token: string) => {
  // use the token.
  var userIdentityToken = token;
  . . .
});
```
##### Validating the token
After obtaining a user identity token from the host page, the add-in can pass the token to its own backend.  The backend should first validate the token against the SKY API OpenIDConnect endpoint in order to ensure that it hasn't expired or been altered in any way.  This validation step is required in order for the backend to trust the user identity token.

The OpenIDConnect configuration can be found at https://oauth2.sky.blackbaud.com/.well-known/openid-configuration.

Developers building add-ins in .NET can make use of a Blackbaud-provided library to assist with validating the user identity token. This library is distributed as a NuGet package named `Blackbaud.Addin.TokenAuthentication`.  The package wraps up the logic for validating the user identity token JWT, and can be found at https://www.nuget.org/packages/Blackbaud.Addin.TokenAuthentication.

The following C# code snippet shows how to use the `Blackbaud.Addin.TokenAuthentication` library to validate the raw JWT token value passed in from the add-in client:

```cs
// this represents the user identity token returned from getUserIdentityToken()
var rawToken = "(raw token value)";

// this is the ID of the developer's SKY API application
var applicationId = "(some application ID)";

// create and validate the user identity token
UserIdentityToken uit;
try
{
    uit = await UserIdentityToken.ParseAsync(rawToken, applicationId);

    // if valid, the UserId property contains the Blackbaud user's ID
    var userId = uit.UserId;
}
catch (TokenValidationException ex)
{
    // process the exception
}
```

Once the token has been validated, the add-in's backend will know the Blackbaud user ID and can determine if a user mapping exists for a user in the add-in's system. If a mapping exists, then the add-in's backend can immediately present the content for the add-in. If no user mapping exists, the add-in can prompt the user to login.

For more information on Blackbaud's SKY Add-in framework, please see https://developer.blackbaud.com/skyapi/docs/addins.
