export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|check-email|login|register|coaches|faq|toolkit|profile/[^/]+$|$|.*\\.svg$).*)",
  ],
};
