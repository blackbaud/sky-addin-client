/*
 * Defines the type of the toast
 */
export enum AddinToastType {
  // The toast type to notify for a critical error
  Danger = 0,

  // The toast type to notify for informational purposes (default)
  Info = 1,

  // The toast type to notify for successful operation
  Success = 2,

  // The toast type to notify for a non-critical error
  Warning = 3
}
