import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/resume(.*)",
  "/matcher(.*)",
  "/interview(.*)",
  "/learning(.*)",
  "/reports(.*)",
  "/settings(.*)"
]);

const isClerkConfigured =
  Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.includes("replace_me") &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.includes("demo") &&
  (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.length ?? 0) > 40;

export default isClerkConfigured
  ? clerkMiddleware(async (auth, req) => {
      if (isProtectedRoute(req)) {
        await auth.protect();
      }
    })
  : function proxy() {
      return NextResponse.next();
    };

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"]
};
