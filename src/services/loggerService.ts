/* eslint-disable no-console */
function now() {
  return new Date().toLocaleString();
}
class ConsoleLogger {
  private logMessage(colorCode: string, message: string, ...args: any[]): void {
    console.log(`\x1b[${colorCode}[Gérico ${now()}]\x1b[0m`, message, ...args);
  }

  trace(message: string, ...args: any[]): void {
    this.logMessage('90m', message, ...args);
  }

  debug(message: string, ...args: any[]): void {
    this.trace(message, ...args);
  }

  info(message: string, ...args: any[]): void {
    this.trace(message, ...args);
  }

  warn(message: string, ...args: any[]): void {
    this.logMessage('93m', message, ...args);
  }

  error(message: string, ...args: any[]): void {
    this.logMessage('91m', message, ...args);
  }
}

export const logservice = new ConsoleLogger();
