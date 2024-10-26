/* eslint-disable no-console */
function now() {
  return new Date().toLocaleString();
}
class ConsoleLogger {
  private isDev: boolean;

  constructor() {
    this.isDev = process.env.NODE_ENV === 'development';
  }

  private logMessage(colorCode: string, message: string, devOnly: boolean, ...args: any[]): void {
    if (!devOnly || this.isDev) {
      console.log(`\x1b[${colorCode}[Gérico ${now()}]\x1b[0m`, message, ...args);
    }
  }

  trace(devOnly: boolean = false, message: string, ...args: any[]): void {
    this.logMessage('90m', message, devOnly, ...args);
  }

  debug(devOnly: boolean = false, message: string, ...args: any[]): void {
    this.trace(devOnly, message, ...args);
  }

  info(devOnly: boolean = false, message: string, ...args: any[]): void {
    this.trace(devOnly, message, ...args);
  }

  warn(devOnly: boolean = false, message: string, ...args: any[]): void {
    this.logMessage('93m', message, devOnly, ...args);
  }

  error(devOnly: boolean = false, message: string, ...args: any[]): void {
    this.logMessage('91m', message, devOnly, ...args);
  }
}

export const logservice = new ConsoleLogger();
