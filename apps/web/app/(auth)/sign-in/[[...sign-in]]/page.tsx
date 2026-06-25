import { AuthPanel } from "@/components/auth/auth-provider";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <AuthPanel mode="sign-in" />
    </main>
  );
}
