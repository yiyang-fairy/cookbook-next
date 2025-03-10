import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 只处理 GET 请求
  if (request.method === 'GET') {
    // 获取原始响应
    const response = NextResponse.next()
    
    // 添加缓存控制头
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')
    
    return response
  }
  
  return NextResponse.next()
}

// 配置中间件匹配的路径
export const config = {
  matcher: '/api/:path*'  // 只匹配 api 路由
} 