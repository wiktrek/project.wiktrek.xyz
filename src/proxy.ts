import { clerkMiddleware } from "@clerk/nextjs/server";

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and static files.
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes. tRPC paths contain dots.
    "/(api|trpc)(.*)",
  ],
};
