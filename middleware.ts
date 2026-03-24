export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|profile|check-email|sport-icons|posts/[^/]+(?:/opengraph-image)?|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico)$).*)",
  ],
};
