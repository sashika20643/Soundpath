export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

export class ResponseFormatter {
  static success<T>(data: T, message?: string): ApiResponse<T> {
    return {
      success: true,
      data,
      message,
    };
  }

  static error(message: string, errors?: Record<string, string[]>): ApiResponse {
    return {
      success: false,
      error: message,
      errors,
    };
  }

  static validationError(errors: Record<string, string[]>): ApiResponse {
    return {
      success: false,
      error: "Validation failed",
      errors,
    };
  }

  static notFound(message = "Resource not found"): ApiResponse {
    return {
      success: false,
      error: message,
    };
  }

  static serverError(message = "Internal server error"): ApiResponse {
    return {
      success: false,
      error: message,
    };
  }
}
