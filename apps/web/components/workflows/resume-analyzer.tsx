"use client";
import jsPDF from "jspdf";
import { FormEvent, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FileUp, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { useCareerAuth } from "@/components/auth/auth-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { analyzeResume } from "@/services/api";
import { emptyResumeAnalysis } from "@/services/demo-data";
import type { ResumeAnalysis } from "@/services/types";

export function ResumeAnalyzer() {
  const { getToken, user } = useCareerAuth();

const userId =
  user?.primaryEmailAddress?.emailAddress;

const getUserKey = (
  key: string
) => `${userId || "guest"}_${key}`;
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [result, setResult] = useState<ResumeAnalysis>(emptyResumeAnalysis);
  const resultRef = useRef<HTMLDivElement>(null);
  function exportPDF() {
  const pdf = new jsPDF();

  pdf.setFontSize(18);
  pdf.text("AI Resume Analysis Report", 20, 20);

  pdf.setFontSize(12);

  pdf.text(
    `ATS Score: ${Math.round(result.scores.ats || 0)}/100`,
    20,
    40
  );

  pdf.text(
    `Summary: ${result.summary || "No summary available"}`,
    20,
    55,
    { maxWidth: 170 }
  );

  pdf.text(
    `Detected Skills: ${
      result.extracted_skills.join(", ") || "None"
    }`,
    20,
    90,
    { maxWidth: 170 }
  );

  pdf.text(
    `Missing Skills: ${
      result.missing_skills.join(", ") || "None"
    }`,
    20,
    120,
    { maxWidth: 170 }
  );

  pdf.save("resume-analysis-report.pdf");
}

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setAnalysisStep(1);

    const formData = new FormData();
    if (file) formData.append("file", file);
    formData.append("resume_text", resumeText);
    formData.append("target_role", targetRole);
    formData.append("job_description", jobDescription);

    try {
      const token = await getToken();
      setAnalysisStep(2);

const analysis = await analyzeResume(
  formData,
  token
);

setAnalysisStep(3);

setResult(analysis);

if (analysis.resume_text) {
  localStorage.setItem(
  getUserKey("uploadedResumeText"),
  analysis.resume_text
);
}

localStorage.setItem(
  getUserKey("atsSummary"),
  analysis.summary
);

localStorage.setItem(
  getUserKey("resumeSkills"),
  analysis.extracted_skills.join(", ")
);

localStorage.setItem(
  getUserKey("resumeMissingSkills"),
  analysis.missing_skills.join(", ")
);

localStorage.setItem(
  getUserKey("resumeWeakSections"),
  analysis.weak_sections.join(", ")
);

localStorage.setItem(
  getUserKey("uploadedResumeText"),
  analysis.resume_text || ""
);

setTimeout(() => {
  resultRef.current?.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}, 300);

toast.success("Resume analysis complete");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Resume analysis failed");
    } finally {
      setLoading(false);
    }
  }

  const hasResult = result.summary.length > 0;

  return (
    <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
      <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>Analyze Resume</CardTitle>
          <CardDescription>Upload a PDF or paste text. The backend runs parsing, section extraction, semantic scoring, and structured feedback.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div
  className="
    glass-premium
    rounded-[28px]
    border-2
    border-dashed
    border-cyan-400/20
    p-4
    transition-all
    duration-300
    hover:border-cyan-400/40
    hover:bg-white/[0.03]
  "
>
              <label className="flex cursor-pointer items-center gap-3 text-sm">
                <span
  className="
    glow
    flex
    h-12
    w-12
    items-center
    justify-center
    rounded-2xl
    bg-gradient-to-br
    from-cyan-400
    to-teal-500
    text-white
  "
>
                  <FileUp className="h-5 w-5" />
                </span>
                <span>
                  {file ? (

<div className="space-y-2">

<p className="font-medium text-white">
✓ Resume Uploaded
</p>

<p className="text-sm text-zinc-400">
{file.name}
</p>

<p className="text-xs text-zinc-500">
{(file.size / (1024 * 1024)).toFixed(2)} MB
</p>

</div>

) : (

<div>

<p className="font-medium">
Upload PDF Resume
</p>

<p className="text-sm text-zinc-400">
Drag & drop or click to upload
</p>

</div>

)}
                  <span className="text-muted-foreground">PDF parsing is handled by the FastAPI service.</span>
                </span>
                <Input
                  type="file"
                  accept=".pdf,.txt"
                  className="hidden"
                  onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                />
              </label>
            </div>
            <Input value={targetRole} onChange={(event)=>setTargetRole(event.target.value)} placeholder="Target role (e.g. AI Engineer Intern)"/>
            {!file && (
<Textarea
  value={resumeText}
  onChange={(event) => setResumeText(event.target.value)}
  className="min-h-64"
  placeholder="Paste resume text here if you don't upload a PDF"
/>
)}
            <Textarea
  value={jobDescription}
  onChange={(event) => setJobDescription(event.target.value)}
  className="min-h-32"
  placeholder="Paste job description for ATS matching (optional)"
/>
            <Button disabled={loading} className="w-full">
  <Sparkles className="h-4 w-4" />
  {loading
    ? "AI analyzing resume..."
    : "Run AI Resume Analysis"}
</Button>
{
loading && (

<div className="
mt-4
rounded-3xl
border
border-cyan-400/10
bg-cyan-400/[0.03]
p-5
space-y-5
">

<p className="font-medium">
AI Pipeline Running
</p>

{[
["Extracting Resume Structure",1],
["Matching ATS Keywords",2],
["Generating AI Suggestions",3]
].map(([label,step]) => (

<div
key={String(label)}
className="space-y-2"
>

<div className="flex justify-between text-sm">

<span>{label}</span>

<span>
{analysisStep >= Number(step)
? "✓"
: "..."
}
</span>

</div>

<Progress
value={
analysisStep >= Number(step)
? 100
: 20
}
/>

</div>

))}

</div>

)
}
            
          </form>
          <div className="flex justify-end pt-4">

<Button
onClick={exportPDF}
variant="outline"
className="
rounded-2xl
border-cyan-400/20
bg-cyan-400/[0.03]
hover:bg-cyan-400/10
"
>

Download Report PDF

</Button>

</div>
        </CardContent>
      </Card>
      </div>
      <div className="space-y-5">

{!hasResult ? (

<Card className="glass-premium rounded-[30px] border border-white/10 h-full">
<CardContent className="flex h-full min-h-[700px] flex-col items-center justify-center text-center p-8">

<div className="mb-6 text-6xl">
🚀
</div>

<h2 className="text-3xl font-bold">
Ready for AI Resume Analysis
</h2>

<p className="mt-4 max-w-md text-zinc-400">
Upload your resume and get ATS scoring,
skill intelligence, recruiter simulation,
and personalized recommendations.
</p>

<div className="mt-8 grid gap-3 text-left">

<p>✓ ATS compatibility analysis</p>
<p>✓ Missing skills detection</p>
<p>✓ Recruiter scan simulation</p>
<p>✓ Improvement roadmap</p>

</div>

</CardContent>
</Card>

) : (

<div
ref={resultRef}
className="space-y-5"
>
        <Card>
          <CardHeader>
            <CardTitle>ATS Score Breakdown</CardTitle>
            <CardDescription>{hasResult ? result.summary : "Run an analysis to generate a score and roadmap."}</CardDescription>
          </CardHeader>
            <CardContent className="space-y-6">

<div className="flex justify-center">

<div className="relative flex items-center justify-center h-52 w-52">

<svg className="absolute h-full w-full -rotate-90">

{/* background ring */}

<circle
cx="104"
cy="104"
r="85"
stroke="rgba(255,255,255,0.08)"
strokeWidth="12"
fill="none"
/>

{/* score ring */}

<circle
cx="104"
cy="104"
r="85"
stroke="url(#scoreGradient)"
strokeWidth="12"
fill="none"
strokeLinecap="round"
strokeDasharray="534"
strokeDashoffset={
534 - ((result.scores.ats || 0) / 100) * 534
}
/>

<defs>
<linearGradient id="scoreGradient">
<stop offset="0%" stopColor="#22d3ee"/>
<stop offset="100%" stopColor="#14b8a6"/>
</linearGradient>
</defs>

</svg>

<div className="text-center z-10">

<p className="text-5xl font-bold">
{Math.round(result.scores.ats || 0)}
</p>

<p className="text-sm text-zinc-400">
ATS Score
</p>

<p className="text-xs text-zinc-500 mt-1">
out of 100
</p>

</div>

</div>

</div>

<div className="grid grid-cols-2 gap-4">

{[
["Semantic",result.scores.semantic || 0],
["Keywords",result.scores.keyword || 0],
["Formatting",result.scores.formatting || 0],
["Grammar",result.scores.grammar || 0]
].map(([label,score]) => (

<div
key={String(label)}
className="rounded-2xl bg-white/[0.03] p-4"
>

<p className="text-zinc-400">
{label}
</p>

<p className="mt-2 text-2xl font-bold">
{Math.round(Number(score))}
</p>

</div>

))}

</div>

</CardContent>
        </Card>

        <div className="grid gap-5 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Skills Intelligence</CardTitle>
              <CardDescription>Extracted skills and missing signals.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-5">

<div>

<p className="mb-3 text-sm font-semibold">
Detected Skills
</p>

<div className="flex flex-wrap gap-3">

{(
result.extracted_skills
).map((skill)=>(

<Badge
key={skill}
className="
bg-cyan-400/10
text-cyan-300
border
border-cyan-400/20
px-3
py-1
"
>

✓ {skill}

</Badge>

))}

</div>

</div>

<div>

<p className="mb-3 text-sm font-semibold">
Missing Signals
</p>

<div className="flex flex-wrap gap-3">

{(
result.missing_skills
).map((skill)=>(

<Badge
key={skill}
className="
bg-red-500/10
text-red-300
border
border-red-500/20
px-3
py-1
"
>

⚠ {skill}

</Badge>

))}

</div>

</div>

</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Improvement Queue</CardTitle>
              <CardDescription>Prioritized suggestions generated from the pipeline.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">

{result.suggestions.map((item) => (

<div
key={item.title}
className="
glass-premium
rounded-3xl
border
border-white/10
bg-white/[0.03]
p-5
"
>

<div className="flex items-center justify-between gap-2">

<p className="font-medium">
{item.title}
</p>

<Badge>
{item.priority}
</Badge>

</div>

<p className="mt-2 text-sm text-muted-foreground">
{item.impact}
</p>

<p className="mt-2 text-sm">
{item.action}
</p>

</div>

))}

{result.suggestions.length===0 && (

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

No recommendations generated yet.

Run an AI analysis to receive suggestions.

</p>

</div>

)}

</CardContent>
          </Card>
        </div>
        <Card className="glass-premium rounded-[30px] border border-white/10">
<CardHeader>
<CardTitle className="text-white">
Recruiter Simulation
</CardTitle>

<CardDescription className="text-zinc-400">
6-second recruiter scan result
</CardDescription>

</CardHeader>

<CardContent className="space-y-3">

<div className="space-y-5">

{[
["Keyword Visibility", result.scores.keyword || 0],
["Semantic Match", result.scores.semantic || 0],
["Formatting", result.scores.formatting || 0],
["Overall ATS", result.scores.ats || 0]
].map(([label,value]) => (

<div key={String(label)} className="space-y-2">

<p className="flex justify-between">

<span>{label}</span>

<span>{Math.round(Number(value))}%</span>

</p>

<Progress value={Number(value)} />

</div>

))}

</div>

</CardContent>
</Card>

</div>

)}
</div>
</div>
);
}
