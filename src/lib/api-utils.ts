import { NextResponse } from "next/server";

// 统一的错误响应格式
export interface ErrorResponse {
  error: string;
  message?: string;
  stack?: string;
}

// 创建错误响应的工具函数
export function createErrorResponse(
  message: string,
  status: number = 500,
  error?: Error
): NextResponse<ErrorResponse> {
  const response: ErrorResponse = {
    error: message,
    message: error?.message,
  };
  
  if (process.env.NODE_ENV === 'development' && error?.stack) {
    response.stack = error.stack;
  }
  
  return NextResponse.json(response, { status });
}

// 通用的数据验证函数
export function validateFields<T>(
  data: T,
  requiredFields: (keyof T)[],
  validators: { [K in keyof T]?: ((value: T[K]) => boolean) }
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // 检查必需字段
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null) {
      errors.push(`缺少必需字段: ${String(field)}`);
    }
  }

  // 运行自定义验证
  for (const [field, validator] of Object.entries(validators)) {
    const value = data[field as keyof T];
    const validatorFn = validator as ((value: unknown) => boolean);
    if (value !== undefined && validatorFn(value)) {
      errors.push(`字段 ${field} 验证失败`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}