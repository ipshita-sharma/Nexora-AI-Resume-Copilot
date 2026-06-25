"use client";

import { FormEvent, useState, useEffect } from "react";
import { Target } from "lucide-react";
import { toast } from "sonner";

import { useCareerAuth } from "@/components/auth/auth-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { analyzeJobMatch } from "@/services/api";
import { emptyJobMatch } from "@/services/demo-data";
import type { JobMatch } from "@/services/types";

export function JobMatcher() {
  const { getToken, user } = useCareerAuth();

const userId =
  user?.primaryEmailAddress?.emailAddress;

const getUserKey = (
  key: string
) => `${userId || "guest"}_${key}`;
  const [title, setTitle] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<JobMatch>(emptyJobMatch);
  const [loading, setLoading] = useState(false);

useEffect(() => {
  if (!userId) return;

  setTitle("");

  setResumeText(
    localStorage.getItem(
      getUserKey("uploadedResumeText")
    ) || ""
  );

  setJobDescription("");
}, [userId]);

  async function onSubmit(event: FormEvent) {
  event.preventDefault();

  if (!title && !resumeText && !jobDescription) {
    toast.error(
      "Upload a resume and paste a job description first."
    );
    return;
  }

  setLoading(true);

  try {
      const token = await getToken();
      const match = await analyzeJobMatch({ title, resume_text: resumeText, job_description: jobDescription }, token);
      setResult(match);

localStorage.setItem(
  getUserKey("jdMissingSkills"),
match.missing_skills.join(", ")
);

localStorage.setItem(
  getUserKey("targetRole"),
  match.title || title
);

localStorage.setItem(
  getUserKey("jobMatchScore"),
  String(match.match_score)
);

localStorage.setItem(
  getUserKey("lastJobDescription"),
jobDescription
);

localStorage.setItem(
  getUserKey("lastTargetRole"),
  title
);

toast.success("Job match analysis complete");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not match resume to JD");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Compare Resume to Job Description</CardTitle>
          <CardDescription>Uses semantic similarity plus skill and keyword coverage.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">

<div className="space-y-2">

<label className="text-sm font-medium">
Target Role
</label>

<Input
value={title}
onChange={(event)=>setTitle(event.target.value)}
placeholder="e.g. AI/ML Intern"
/>

</div>


<div className="space-y-2">

<label className="text-sm font-medium">
Resume Content
</label>

<Textarea
value={resumeText}
onChange={(event)=>setResumeText(event.target.value)}
className="min-h-56"
placeholder="Resume content"
/>

</div>


<div className="space-y-2">

<label className="text-sm font-medium">
Job Description
</label>

<Textarea
value={jobDescription}
onChange={(event)=>setJobDescription(event.target.value)}
className="min-h-56"
placeholder="Paste job description from LinkedIn or company career page"
/>

</div>

<Button className="w-full">

Calculate Match Score

</Button>

</form>
        </CardContent>
      </Card>

      <div className="space-y-5">
        <Card>
          <CardHeader>
            <CardTitle>{result.match_score ? `${Math.round(result.match_score)}% Match` : "Match Intelligence"}</CardTitle>
            <p className="text-sm text-zinc-400">

{result.match_score >= 80
? "Strong alignment"
: result.match_score >= 60
? "Moderate alignment"
: result.match_score > 0
? "Needs improvement"
: ""}

</p>
            <CardDescription>{result.summary || "Paste a JD to see fit, gaps, and a resume optimization roadmap."}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ["Overall", result.match_score],
                ["Semantic", result.semantic_score],
                ["Keyword", result.keyword_score]
              ].map(([label, value]) => (
                <div key={label as string} className="rounded-md border p-4">
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="mt-2 text-3xl font-semibold">{Math.round(Number(value))}</p>
                  <Progress value={Number(value)} className="mt-3" />
                </div>
              ))}
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Suggested keywords</p>
              <div className="flex flex-wrap gap-2">
                {result.suggested_keywords.map((keyword) => (
                  <Badge key={keyword}>{keyword}</Badge>
                ))}
                {result.suggested_keywords.length===0 && (

<p className="text-sm text-zinc-400">

No keyword recommendations generated yet.

</p>

)}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Improvement Roadmap</CardTitle>
            <CardDescription>Turn missing technologies into proof points.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {result.roadmap.map((step) => (
              <div key={step.topic} className="rounded-md border p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium">
{step.topic.replace(/\b\w/g, c => c.toUpperCase())}
</p>
                  <Badge>Priority {step.priority}</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{step.reason}</p>
                <ul className="mt-3 space-y-1 text-sm">
                  {step.actions.map((action) => (
                    <li key={action}>- {action}</li>
                  ))}
                </ul>
              </div>
            ))}
            {result.roadmap.length===0 && (

<div
className="
rounded-md
border
border-dashed
p-5
text-center
"
>

<p className="text-sm text-muted-foreground">

No improvement roadmap generated yet.

</p>

</div>

)}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
