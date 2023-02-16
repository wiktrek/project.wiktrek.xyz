import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/go")) {
    const a = `https://project.wiktrek.xyz/api${req.nextUrl.pathname}`;
    return NextResponse.redirect(a);
  }
  if (req.nextUrl.pathname.startsWith("/q")) {
    const a = `https://project.wiktrek.xyz/projects/poll${req.nextUrl.pathname}`;
    return NextResponse.redirect(a);
  }
  if (req.nextUrl.pathname === "/poll") {
    const a = `https://project.wiktrek.xyz/projects/poll`;
    return NextResponse.redirect(a);
  }
}
