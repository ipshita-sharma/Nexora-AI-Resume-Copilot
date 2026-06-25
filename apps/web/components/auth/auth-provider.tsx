"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { ClerkProvider, SignIn, SignUp, UserButton, useAuth, useUser } from "@clerk/nextjs";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
export const isClerkConfigured =
  Boolean(publishableKey) &&
  !publishableKey?.includes("replace_me") &&
  !publishableKey?.includes("demo") &&
  (publishableKey?.length ?? 0) > 40;

console.log("CLERK KEY:", publishableKey);
console.log("IS CLERK CONFIGURED:", isClerkConfigured);

type CareerAuth = {
  getToken: () => Promise<string | null>;
  user: {
    fullName: string | null;
    imageUrl: string | null;
    primaryEmailAddress: { emailAddress: string } | null;
  } | null;
};

const demoUser = {
  fullName: null,
  imageUrl: null,
  primaryEmailAddress: { emailAddress: "demo@nexora.ai" }
};

const AuthContext = createContext<CareerAuth>({
  getToken: async () => null,
  user: demoUser
});

function ClerkBridge({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const { user } = useUser();
  const value = useMemo<CareerAuth>(
    () => ({
      getToken: auth.getToken,
      user: user
        ? {
            fullName: user.fullName,
            imageUrl: user.imageUrl,
            primaryEmailAddress: user.primaryEmailAddress
              ? { emailAddress: user.primaryEmailAddress.emailAddress }
              : null
          }
        : null
    }),
    [auth.getToken, user]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function AppAuthProvider({ children }: { children: ReactNode }) {
  if (!isClerkConfigured) {
    return (
      <AuthContext.Provider
        value={{
          getToken: async () => null,
          user: demoUser
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }

  return (
    <ClerkProvider>
      <ClerkBridge>{children}</ClerkBridge>
    </ClerkProvider>
  );
}

export function useCareerAuth() {
  return useContext(AuthContext);
}

export function UserMenu() {
  if (isClerkConfigured) {
    return <UserButton />;
  }
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
      DC
    </div>
  );
}

export function AuthPanel({ mode }: { mode: "sign-in" | "sign-up" }) {
  if (isClerkConfigured) {
    return mode === "sign-in" ? (
      <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
    ) : (
      <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{mode === "sign-in" ? "Demo sign in" : "Demo account"}</CardTitle>
        <CardDescription>
          Clerk keys are not configured locally, so the app is running with demo authentication.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild className="w-full">
          <Link href="/dashboard">Continue to dashboard</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
