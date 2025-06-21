import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/bots(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip static assets and internal Next.js routes
    "/((?!_next|.*\\.(?:js|css|png|jpg|jpeg|svg|ico|woff2?|ttf|eot|map)).*)",
    // Always apply to API and tRPC
    "/(api|trpc)(.*)",
  ],
};
