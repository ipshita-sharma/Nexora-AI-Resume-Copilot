"use client";

import { FormEvent, useState, useEffect } from "react";
import { BookOpenCheck } from "lucide-react";
import { toast } from "sonner";

import { useCareerAuth } from "@/components/auth/auth-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createRoadmap } from "@/services/api";
import { emptyRoadmap } from "@/services/demo-data";
import type { LearningRoadmap as LearningRoadmapType } from "@/services/types";


function splitList(value: string) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function renderBadges(value: string) {
  return splitList(value).map((item) => (
    <Badge
  key={item}
  className="mr-2 mb-2"
>
  {item}
</Badge>
  ));
}

const getUserKey = (
  userId: string | undefined,
  key: string
) => `${userId || "guest"}_${key}`;

export function LearningRoadmap() {
  const { getToken } = useCareerAuth();
  const { user } = useCareerAuth();
  const userId = user?.primaryEmailAddress?.emailAddress;
  const [targetRole, setTargetRole] = useState("");
  const [timeline, setTimeline] = useState("1 Month");

const [missingSkills, setMissingSkills] = useState("");

const [weakAreas, setWeakAreas] = useState("");

const [weakSections, setWeakSections] = useState("");
  const [roadmap, setRoadmap] = useState<LearningRoadmapType>(emptyRoadmap);
  const [loading, setLoading] = useState(false);

useEffect(() => {
  if (!userId) return;

  setTargetRole(
    localStorage.getItem(
      getUserKey(userId, "targetRole")
    ) || ""
  );

  setMissingSkills(
    localStorage.getItem(
      getUserKey(userId, "jdMissingSkills")
    ) ||
    localStorage.getItem(
      getUserKey(userId, "resumeMissingSkills")
    ) ||
    ""
  );

  setWeakAreas(
    localStorage.getItem(
      getUserKey(userId, "interviewWeakAreas")
    ) || ""
  );

  setWeakSections(
    localStorage.getItem(
      getUserKey(userId, "resumeWeakSections")
    ) || ""
  );
}, [userId]);

  async function onSubmit(event: FormEvent) {
  event.preventDefault();

  if (
    !missingSkills &&
    !weakAreas &&
    !weakSections
  ) {
    toast.error(
      "Upload a resume, analyze a JD, or complete an interview first."
    );
    return;
  }

  setLoading(true);

  try {
      const token = await getToken();
      const result = await createRoadmap(
  {
  target_role: targetRole,
  timeline: timeline,

  resume_context:
    localStorage.getItem(
  getUserKey(userId, "uploadedResumeText")
) || "",

  resume_skills: (
    localStorage.getItem(getUserKey(userId, "resumeSkills")) || ""
  )
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),

  missing_skills: splitList(missingSkills),

  jd_missing_skills: (
    localStorage.getItem(getUserKey(userId, "jdMissingSkills")) || ""
  )
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),

  interview_weak_areas: splitList(weakAreas),

  resume_weak_sections: splitList(weakSections),

  job_match_score: Number(
    localStorage.getItem(getUserKey(userId, "jobMatchScore")) || 0
  )
},
  token
);
      setRoadmap(result);
      toast.success("Learning roadmap generated");
    } catch {
      toast.error("Could not generate roadmap");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[0.78fr_1.22fr]">
      <Card>
        <CardHeader>
          <CardTitle>Personalization Inputs</CardTitle>
          <CardDescription>Review the gaps identified from your resume and interviews, then generate a personalized learning roadmap.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
  <p className="text-sm font-medium">Target Role</p>
  <Input
    placeholder="AI/ML Intern"
    value={targetRole}
    onChange={(event) => setTargetRole(event.target.value)}
  />
</div>

<div className="space-y-2">
  <p className="text-sm font-medium">Timeline</p>

  <select
    value={timeline}
    onChange={(e) => setTimeline(e.target.value)}
    className="w-full rounded-md border bg-background px-3 py-2"
  >
    <option>2 Weeks</option>
    <option>1 Month</option>
    <option>2 Months</option>
    <option>3 Months</option>
    <option>6 Months</option>
  </select>
</div>

<div className="space-y-2">
  <p className="text-sm font-medium">Missing Skills</p>

  <div className="min-h-[60px] rounded-md border p-3">
    {renderBadges(missingSkills)}
  </div>
</div>

<div className="space-y-2">
  <p className="text-sm font-medium">Interview Weak Areas</p>

  <div className="min-h-[60px] rounded-md border p-3">
    {renderBadges(weakAreas)}
  </div>
</div>

<div className="space-y-2">
  <p className="text-sm font-medium">Resume Weak Sections</p>

  <div className="min-h-[60px] rounded-md border p-3">
    {renderBadges(weakSections)}
  </div>
</div>
            <Button disabled={loading} className="w-full">
              <BookOpenCheck className="h-4 w-4" />
              {loading ? "Generating..." : "Generate Learning Plan"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-5">
        <Card>
          <CardHeader>
            <CardTitle>Roadmap for {roadmap.target_role}</CardTitle>
            <CardDescription>Prioritized learning recommendations.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {roadmap?.recommendations?.map((rec) => (
              <div key={rec.topic} className="rounded-md border p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium">{rec.topic}</p>
                  <Badge>Priority {rec.priority}</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{rec.reason}</p>
                <div className="mt-4 space-y-2">
                  {rec.actions.map((action) => (
                    <div key={action.label} className="flex items-center justify-between gap-2 rounded-md bg-muted px-3 py-2 text-sm">
                      <span>{action.label}</span>
                      <Badge>{action.effort}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {roadmap.recommendations.length===0 && (

<div
className="
rounded-3xl
border
border-dashed
border-white/10
p-5
text-center
"
>

<p className="text-zinc-400">

No learning recommendations generated yet.

Analyze your resume or complete interviews
to create a personalized roadmap.

</p>

</div>

)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Execution Plan</CardTitle>
            <CardDescription>Concrete practice schedule generated from your gaps.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {roadmap?.weekly_plan?.map((day) => (
              <div key={`${day.day}-${day.focus}`} className="grid gap-3 rounded-md border p-4 md:grid-cols-[120px_1fr_1fr]">
                <p className="font-medium">{day.day}</p>
                <p className="text-sm">{day.task}</p>
                <p className="text-sm text-muted-foreground">{day.outcome}</p>
              </div>
            ))}
            {roadmap.weekly_plan.length===0 && (

<div
className="
rounded-3xl
border
border-dashed
border-white/10
p-5
text-center
"
>

<p className="text-zinc-400">

No execution plan available yet.

Generate a roadmap first.

</p>

</div>

)}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
