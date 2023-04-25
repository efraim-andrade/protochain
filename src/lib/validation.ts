/**
 * Validation class
 */

export default class Validation {
  success: boolean;
  message: string;

  /**
   * Creates a new validation object
   * @param success if the validation was successful or not.
   * @param message the validation message, if validation failed.
   * @returns a new validation object.
   * @example
   * const validation = new Validation(true, "Validation was successful");
   * console.log(validation); // Validation { success: true, message: "Validation was successful" }
   */
  constructor(success = true, message = "") {
    this.success = success;
    this.message = message;
  }
}
