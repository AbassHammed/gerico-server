/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Hammed Abass. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

function now() {
  return new Date().toLocaleString();
}
class ConsoleLogger {
  private logMessage(colorCode: string, message: any, ...args: any[]): void {
    // eslint-disable-next-line no-console
    console.log(`\x1b[${colorCode}[Gérico ${now()}]\x1b[0m`, message, ...args);
  }

  trace(message: any, ...args: any[]): void {
    this.logMessage('90m', message, ...args);
  }

  debug(message: any, ...args: any[]): void {
    this.trace(message, ...args);
  }

  info(message: any, ...args: any[]): void {
    this.trace(message, ...args);
  }

  warn(message: any, ...args: any[]): void {
    this.logMessage('93m', message, ...args);
  }

  error(message: any, ...args: any[]): void {
    this.logMessage('91m', message, ...args);
  }
}

export const logservice = new ConsoleLogger();
