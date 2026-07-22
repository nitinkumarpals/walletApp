import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get("token");

  if (!token) {
    // If no token is provided, redirect to the landing page
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Calculate expiration (matching backend's 1 day)
  const expires = new Date();
  expires.setDate(expires.getDate() + 1);

  // Set the token as an HttpOnly cookie for the vercel.app domain
  cookies().set("Authentication", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // Lax is perfectly safe here since it's a first-party cookie now!
    path: "/",
    expires,
  });

  // Redirect the user to the dashboard
  return NextResponse.redirect(new URL("/dashboard", request.url));
}
