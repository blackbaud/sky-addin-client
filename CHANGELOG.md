# 1.0.4 (2018-12-13)

- To remove confusion and clarify the intent, we've added a new method named `getUserIdentityToken`.  This method is
used to obtain a user identity token from the host application, and replaces the `getAuthToken` method (which is still
functional but marked as deprecated).

- We added config options for each type of add-in (Button, Tab, Tile) to allow developers to provide additional metadata
such as tile summary details and button icons.

- We added new `helpClick` and `settingsClick` callbacks, which allow developers to take action when the tile
help/settings icons are clicked.

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
