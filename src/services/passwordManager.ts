/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Hammed Abass. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
class PasswordManager {
  private readonly MINIMUM_LENGTH = 8;

  /**
   * Generates a default password using lastname and date of birth
   * Pattern: year + trimmedLastName + zeros (if needed) to reach 8 chars
   * Example: "2000SMITH" or "2000LEE00"
   * @param lastName - The user's last name
   * @param dateOfBirth - User's date of birth
   * @returns Generated password string
   */
  public generateDefaultPassword(lastName: string, dateOfBirth: Date): string {
    const year = dateOfBirth.getFullYear();
    const trimmedLastName = lastName.replace(/[^A-Za-z]/g, '').toUpperCase();
    let password = `${year}${trimmedLastName}`;

    if (password.length < this.MINIMUM_LENGTH) {
      password = password.padEnd(this.MINIMUM_LENGTH, '0');
    }

    return password;
  }

  /**
   * Checks if a password matches the default pattern
   * Pattern: 4 digits followed by letters and possibly zeros, minimum 8 characters
   * @param password - Password to validate
   * @returns boolean indicating if password matches pattern
   */
  public isDefaultPattern(password: string): boolean {
    // Pattern: 4 digits followed by letters and possibly zeros at the end, minimum 8 chars
    const pattern = /^\d{4}[A-Z]+0*$/;
    return pattern.test(password) && password.length >= this.MINIMUM_LENGTH;
  }
}

export default new PasswordManager();
