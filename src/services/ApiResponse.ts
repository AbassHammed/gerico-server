/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Hammed Abass. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
export class ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  statusCode: number;

  private constructor(
    statusCode: number,
    success: boolean,
    data?: T,
    message?: string,
    error?: string,
  ) {
    this.statusCode = statusCode;
    this.success = success;
    this.data = data;
    this.message = message;
    this.error = error;
  }

  static success<T>(statusCode: number, data?: T, message?: string): ApiResponse<T> {
    return new ApiResponse(statusCode, true, data, message);
  }

  static error<T>(statusCode: number, error: string): ApiResponse<T> {
    return new ApiResponse(statusCode, false, undefined, undefined, error);
  }
}
