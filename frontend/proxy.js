import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request) {
  return await updateSession(request);
}

// Backwards compatibility for Next.js middleware convention
export const middleware = proxy;

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
