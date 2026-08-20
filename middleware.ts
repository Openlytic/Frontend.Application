import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

const isTokenExpired = (token: string): boolean => {
  try {
    const { exp } = jwtDecode(token);
    return typeof exp === "number" ? exp * 1000 < Date.now() : true;
  } catch {
    return true;
  }
};

// Routes that are reachable without a valid session token.
const PUBLIC_PATHS = [
  "/login",
  "/signup",
  "/forgot-password",
  "/create-account",
  "/account-verification",
  "/create-new-password",
  "/oauth",
  "/user-invitation",
  "/maintenance",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_PATHS.includes(pathname);
  const existingToken = request.cookies.get("accessToken");

  // Dev-only: render the private shell without a session (UI previews).
  if (process.env.DEV_PREVIEW === "true") {
    return NextResponse.next();
  }

  if (isPublic && existingToken && !isTokenExpired(existingToken.value)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!isPublic && (!existingToken || isTokenExpired(existingToken.value))) {
    const url = new URL("/login", request.url);
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
