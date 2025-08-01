# 1.7.2 (2025-07-15)
- Updated `allowedOrigins` to support JustGiving

# 1.7.1 (2025-07-08)
- Update `AddinClientThemeSettings` to support serialized UX theme settings.

# 1.7.0 (2025-04-01)
- Update `AddinEventCallback` to allow data to be returned.

# 1.6.1 (2025-02-03)
- Added `showInlineHelp`, `helpPopoverContent`, and `helpPopoverTitle` properties in `AddinBoxConfig` to support inline help in the box header.

# 1.6.0 (2024-11-12)
- Removed Good Move EMC portal origins from the `allowedOrigins` array.

# 1.5.1 (2024-10-24)
- Removed unused `helpKey` property from the `AddinBoxConfig`

# 1.5.0 (2024-10-08)
- Added `showInlineHelp`, `helpPopoverContent`, and `helpPopoverTitle` properties in `AddinTileConfig` to support inline help in tile header.
- Added `inlineHelpClick` callback in `AddinClientCallbacks` to handle inline help button click.

# 1.4.1 (2024-09-10)
- Addressed issue to prevent `supportedEventTypes` to be `undefined`. Should default to empty array.

# 1.4.0 (2024-08-21)
- Added a `actionClick` callback for Box Add-ins to allow developers to take action when actions are clicked.
- Added `AddinBoxConfig` interface for defining configuration options for `Box add-ins`.

# 1.3.0 (2024-06-18)
- Added `AddinClientConfig` interface to allow additional host origins to be supplied by an `AddinClient`.

# 1.2.2 (2024-04-25)
- Updated `allowedOrigins` to support Good Move and fix EMC portal issues

# 1.2.1 (2024-04-01)
- Package updates

# 1.2.0 (2023-09-27)
### Behavior change
- Allow host page to determine default values for flyout widths when not provided.

# 1.1.5 (2023-02-15)
- Add `themeChange` callback to indicate when the add-in host page UX theme changes.

# 1.1.4 (2023-01-11)
- Add `actionButtonConfig` and `tabConfig` to AddinClientReadyArgs.

# 1.1.3 (2022-05-12)
- Updated `allowedOrigins` to support Education Management

# 1.1.2 (2022-02-01)
- Updated `allowedOrigins` to support congregant portal

# 1.1.1 (2021-06-01)
- Add support for sending custom events to the add-in host page.

# 1.1.0 (2020-11-19)
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
