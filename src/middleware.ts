import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { auth0Config } from '@/lib/auth0/config'

const auth0Edge = initAuth0Edge(auth0Config)

export default async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const session = await auth0Edge.getSession(request, response)

  if (!session) {
    // Redirect to login page if not logged in
    const url = new URL('/api/auth/login', request.url)
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: '/((?!api/auth|_next/static|_next/image|favicon.png|public|svg|images).*)',
}
