import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { withClerkMiddleware } from "@clerk/nextjs";
const projects = [
  "term",
  "poll",
  "url"
]
function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/q/")) {
    const a = `https://project.wiktrek.xyz/projects/poll${req.nextUrl.pathname}`;
    return NextResponse.redirect(a);
  }
  if (req.nextUrl.pathname.startsWith("/r/")) {
    const a = `https://project.wiktrek.xyz/projects/recipe${req.nextUrl.pathname}`;
    return NextResponse.redirect(a);
  }
   for (let i = 0; i < projects.length; i++) {
    if (req.nextUrl.pathname === '/' + projects[i]) {
  const a = `https://project.wiktrek.xyz/projects/${projects[i]}`;
      return NextResponse.redirect(a);
    }
  }
}
 

// export default authMiddleware({
//   publicRoutes: ["/"]
// });
export default withClerkMiddleware(middleware)
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/"],
};