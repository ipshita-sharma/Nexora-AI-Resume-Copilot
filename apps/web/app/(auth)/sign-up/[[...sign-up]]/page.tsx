import { AuthPanel } from "@/components/auth/auth-provider";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <AuthPanel mode="sign-up" />
    </main>
  );
}
