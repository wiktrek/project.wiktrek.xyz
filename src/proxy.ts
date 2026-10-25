import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  // Only run on routes that call auth() on the server (directly or through the
  // tRPC context). Static pages like / and /games skip the proxy entirely.
  // Add a route here if it starts calling auth().
  matcher: [
    "/(api|trpc)(.*)",
    "/(poll|url|link|todo|recipe|go|sign-in|sign-up)",
    "/(poll|url|link|todo|recipe|go|sign-in|sign-up)/(.*)",
  ],
};
