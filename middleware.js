// Runs on Vercel's Edge, before any page or API route is served.
// Blocks everything except the login page / login endpoint / logo / favicon
// unless the visitor has the valid session cookie set by api/login.js.

export const config = {
  matcher: ['/((?!api/login|login.html|logosemfundo.png|favicon.ico).*)'],
};

export default function middleware(request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/raviera_auth=([^;]+)/);
  const value = match ? match[1] : null;

  if (value && value === process.env.AUTH_SECRET) {
    return; // cookie válido — deixa passar
  }

  return Response.redirect(new URL('/login.html', request.url));
}
