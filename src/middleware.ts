import { authMiddleware } from "@kinde-oss/kinde-auth-nextjs/server";

export const config = {
  matcher: [
    "/search",
    "/upload/:path*",
    "/ask",
    "/auth-callback",
    "/dashboard",
    "/billing",
    "/podcast",
  ],
};

export default authMiddleware;
