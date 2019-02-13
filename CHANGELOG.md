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
