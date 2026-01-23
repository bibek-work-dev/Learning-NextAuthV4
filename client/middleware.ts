import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  console.log("token", token);

  const url = req.nextUrl.clone();

  if (!token && url.pathname.startsWith("/profile")) {
    console.log("here");
    url.pathname = `/auth/login`;
    return NextResponse.redirect(url);
  }

  if (token && url.pathname.startsWith("/auth")) {
    url.pathname = "/profile/server";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [`/profile/:path`, "/auth/:path"],
};
