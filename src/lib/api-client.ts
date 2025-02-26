// interface ApiResponse<T> {
//   data?: T;
//   error?: string;
//   message?: string;
// }

class ApiClient {
  private static errorHandler(error: unknown) {
    console.error(`API 请求失败:`, error);
    if (typeof window !== 'undefined') {
      alert(error instanceof Error ? error.message : '请求失败');
    }
  }

  private static validateResponse<T>(data: T | null | undefined): data is T {
    if (!data) {
      throw new Error('返回数据为空');
    }
    if (Array.isArray(data) && data.length === 0) {
      throw new Error('未找到数据');
    }
    return true;
  }

  private static async request<T>(
    url: string, 
    options: RequestInit = {},
    validateFn?: (data: T) => boolean
  ): Promise<T | null> {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `请求失败: ${response.status}`);
      }

      if (validateFn && !validateFn(data)) {
        throw new Error('数据格式验证失败');
      }

      return data;
    } catch (error) {
      this.errorHandler(error);
      return null;
    }
  }

  static async get<T>(
    url: string, 
    params?: Record<string, string>,
    validateFn?: (data: T) => boolean
  ) {
    const queryString = params ? `?${new URLSearchParams(params)}` : '';
    return this.request<T>(`${url}${queryString}`, {}, validateFn);
  }

  static async post<T>(
    url: string, 
    data: unknown,
    validateFn?: (data: T) => boolean
  ) {
    return this.request<T>(
      url, 
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      validateFn
    );
  }
}

export default ApiClient; 