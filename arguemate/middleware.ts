import { withAuth } from "next-auth/middleware"

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      // Protect all routes that start with /api (except auth endpoints)
      if (req.nextUrl.pathname.startsWith('/api') && 
          !req.nextUrl.pathname.startsWith('/api/auth')) {
        return !!token
      }
      return true
    },
  },
})

export const config = {
  matcher: [
    '/api/:path*',
    '/matches',
    '/profile',
    // Add other protected routes here
  ]
} 