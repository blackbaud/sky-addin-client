# 1.1.0 (2020-10-30)
- Deprecate help widget related functionality.

# 1.0.21 (2020-11-04)
- Add support for event handler to process blocking events from the add-in host.

# 1.0.20 (2020-07-28)
- Add event handler for processing events sent from the add-in host.

# 1.0.19 (2020-07-07)
- Updated `allowedOrigins` to support Luminate Online

# 1.0.18 (2020-06-04)
- Fixed a bug where localhost required a port in the allowed origins list. [#40](https://github.com/blackbaud/sky-addin-client/pull/40) (Thanks [@MatthewMazaika](https://github.com/MatthewMazaika)!)

# 1.0.17 (2020-05-06)
- Added `updateContext` callback to notify add-in when context information has been updated.


# 1.0.16 (2020-04-22)
- Added `showWait` and `hideWait` methods to allow developers to show/hide a page-blocking-wait, respectively.

# 1.0.15 (2020-04-02)

- Updated `devDependencies` and instructions for consuming from CDN.

# 1.0.14 (2020-03-04)

- Added `AddinModalConfig` with optional `fullPage` property (Default: false) to indicate if a modal add-in will be
displayed full page.

# 1.0.13 (2019-10-04)

- Added `removeInset` property to `AddinTileConfig` to specify whether the tile content inset should be removed
which allows the content to extend all the way to the edge of the tile container (Default: false)

# 1.0.12 (2019-05-14)

- Added a `showConfirm` method to allow developers to show a confirm dialog with a title, description body,
and button configuration containing custom actions to return when the dialog closes.
- Added a `showError` method to allow developers to show an error dialog with a title, error description, and
text for the close button.

# 1.0.11 (2019-05-03)

- Added a `closeFlyout` method to allow developers to close a flyout panel.
- The `showFlyout` method will now return a Promise which will resolve when the flyout is closed.

# 1.0.10 (2019-04-16)

- Added a `showFlyout` method to allow developers to display supplementary information in a flyout panel.

# 1.0.9 (2019-03-01)

- Added a `showToast` method to allow developers to show a toast with a provided message and toast style.

# 1.0.8 (2019-02-13)

- To remove confusion and clarify the intent, we've added a new method named `getUserIdentityToken`.  This method is
used to obtain a user identity token from the host application and replaces the `getAuthToken` method (which is still
functional but marked as deprecated).

- Added tile config options to allow developers to provide additional metadata, such as tile summary details and whether
to show a tile's help or settings icons.

- Added `helpClick` and `settingsClick` callbacks to allow developers to take action when the tile help and settings
icons (respectfully) are clicked.

# 1.0.7 (2019-02-01)

- Added a `buttonClick` callback for Button Add-ins to allow developers to take action when buttons are clicked.

- Added button config options to support Button Add-ins. This allows developers to provide `style` metadata -
essentially, the button's intent as it relates to CRUD operations (add, edit, delete). We will add more "styles" as
requested.

# 1.0.3 (2018-09-28)

- Bugfix when calculating height of addin.

# 1.0.2 (2018-08-13)

- Added import barrels for interfaces at the root.

# 1.0.1 (2018-07-26)

- Added import barrels for interfaces.

# 1.0.0 (2018-05-01)

- Added `openHelp` method to client.

# 1.0.0-alpha.1 (2017-09-11)

- Account for the add-in's body margin when resizing the iframe height.

# 1.0.0-alpha.0 (2017-08-25)

- Initial release.
