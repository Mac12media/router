export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|profile|check-email|sport-icons|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico)$).*)",
  ],
};
