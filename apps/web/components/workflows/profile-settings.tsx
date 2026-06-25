"use client";

import { FormEvent, useState } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";

import { useCareerAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateProfile } from "@/services/api";

export function ProfileSettings() {
  const { user, getToken } = useCareerAuth();
  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [targetRole, setTargetRole] = useState("Software Engineer Intern");
  const [skills, setSkills] = useState("React, Next.js, TypeScript, Python, SQL");
  const [loading, setLoading] = useState(false);

  async function save(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    try {
      const token = await getToken();
      await updateProfile(
        {
          full_name: fullName,
          target_role: targetRole,
          avatar_url: user?.imageUrl,
          skills: skills.split(",").map((skill) => skill.trim()).filter(Boolean)
        },
        token
      );
      toast.success("Profile saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save profile");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Clerk handles sign-in, sessions, and profile identity.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p className="font-medium">{user?.primaryEmailAddress?.emailAddress ?? "demo@career-copilot.local"}</p>
          <p className="text-muted-foreground">Protected dashboard routes are enforced through middleware.</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Career Profile</CardTitle>
          <CardDescription>Used to personalize resume scoring, interviews, and learning plans.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={save} className="space-y-4">
            <Input value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Full name" />
            <Input value={targetRole} onChange={(event) => setTargetRole(event.target.value)} placeholder="Target role" />
            <Textarea value={skills} onChange={(event) => setSkills(event.target.value)} placeholder="Skills, comma separated" />
            <Button disabled={loading}>
              <Save className="h-4 w-4" />
              {loading ? "Saving..." : "Save Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
