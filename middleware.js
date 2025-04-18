import { NextResponse } from 'next/server';

// Helper function to check if a path matches any of the given routes
function matchesRoute(path, routes) {
    return routes.some(route => path.startsWith(route));
}

export function middleware(request) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('token');
    const role = request.cookies.get('role')?.value;

    // Define route groups
    const publicRoutes = ['/', '/about', '/shop', '/blog', '/contact'];
    const authRoutes = ['/account'];
    const adminRoutes = ['/dashboard/admin'];
    const userRoutes = ['/dashboard/user'];
    const protectedRoutes = [...adminRoutes, ...userRoutes];

    // Static files and API routes should pass through
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.includes('favicon.ico') ||
        pathname.startsWith('/static')
    ) {
        return NextResponse.next();
    }

    // Public routes are always accessible
    if (matchesRoute(pathname, publicRoutes)) {
        return NextResponse.next();
    }

    // Handle authentication routes
    if (matchesRoute(pathname, authRoutes)) {
        // Redirect authenticated users to their dashboard
        if (token) {
            const redirectUrl = role === 'admin' ? '/dashboard/admin' : '/dashboard/user';
            return NextResponse.redirect(new URL(redirectUrl, request.url));
        }
        return NextResponse.next();
    }

    // Protected routes require authentication
    if (matchesRoute(pathname, protectedRoutes)) {
        if (!token) {
            return NextResponse.redirect(new URL('/account', request.url));
        }

        // Admin routes require admin role
        if (matchesRoute(pathname, adminRoutes) && role !== 'admin') {
            return NextResponse.redirect(new URL('/dashboard/user', request.url));
        }

        return NextResponse.next();
    }

    // For any other routes, allow access
    return NextResponse.next();
}

// Configure middleware to run on all routes except specific static and API routes
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}; 