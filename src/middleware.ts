import { clerkMiddleware } from "@clerk/nextjs/server";

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export default clerkMiddleware();

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/"],
};
