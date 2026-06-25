"use client";

import { useRef, useState } from "react";
import {
  Sparkles,
  Upload,
  WandSparkles
} from "lucide-react";
import { useCareerAuth } from "@/components/auth/auth-provider";
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { ResumePreview } from "@/components/resume/resume-preview";

const priorities = [
  "ATS Optimization",
  "Stronger Project Bullets",
  "Technical Keywords",
  "Leadership",
  "Quantified Impact",
  "Interview Readiness",
  "Research Focus"
];

const companyTypes = [
  "Startup",
  "Big Tech",
  "Product Based",
  "Enterprise",
  "Research Lab",
  "Remote-first"
];

export function ResumeEngine() {

  const { user } = useCareerAuth();

const userId =
  user?.primaryEmailAddress?.emailAddress;

const getUserKey = (
  key: string
) => `${userId || "guest"}_${key}`;

  const [role, setRole] = useState("");
  const [industry, setIndustry] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("Fresher");
  const [jobDescription, setJobDescription] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);

  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);

  const [generatedResume, setGeneratedResume] = useState("");
  const [exportResumeText, setExportResumeText] = useState("");

  const [resumeSummary, setResumeSummary] = useState("");
  const [changes, setChanges] = useState<string[]>([]);
  const [atsImprovements, setAtsImprovements] = useState<string[]>([]);
  const [keywordsAdded, setKeywordsAdded] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  if (!userId) return;

  setResumeText(
    localStorage.getItem(
      getUserKey("resumeText")
    ) || ""
  );
}, [userId]);

  async function handleResumeUpload(
  event: React.ChangeEvent<HTMLInputElement>
) {

  const file = event.target.files?.[0];

if (!file) return;


// CLEAR OLD AI RESULT WHEN NEW RESUME UPLOADED
setGeneratedResume("");
setExportResumeText("");

setResumeSummary("");

setChanges([]);
setAtsImprovements([]);
setKeywordsAdded([]);


setResumeFile(file);

  try {

    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch(
      "http://localhost:8000/api/v1/resumes/extract",
      {
        method: "POST",
        body: formData
      }
    );

    const data = await response.json();

    setResumeText(data.text || "");

    localStorage.setItem(
  getUserKey("resumeText"),
  data.text || ""
);

  } catch (error) {

    console.error(error);

  }

}
async function generateAIResume() {

  if (!resumeText) return;

  setGeneratedResume("");
  setExportResumeText("");

  setLoading(true);

  try {

    const response = await fetch(
      "http://localhost:8000/api/v1/resumes/generate",
      {
        method: "POST",
        headers: {
          "Content-Type":"application/json"
        },
        body: JSON.stringify({
          resume_text: resumeText,
          target_role: role,
          industry,
          experience_level: experienceLevel,
          company_types: selectedCompanies,
          priorities: selectedPriorities,
          job_description: jobDescription
        })
      }
    );

    const data = await response.json();

let result = data;


// FIX nested JSON string coming from AI fallback
if (
  typeof data.improved_resume === "string" &&
  data.improved_resume.trim().startsWith("{")
) {

  try {

    result = JSON.parse(data.improved_resume);

  } catch {

    result = data;

  }

}


let finalResume = result.improved_resume || "";


// remove nested JSON from AI response
if (
  typeof finalResume === "string" &&
  finalResume.trim().startsWith("{")
) {

  try {

    const parsed = JSON.parse(finalResume);

    finalResume =
      parsed.improved_resume || "";

  } catch(error) {

    console.error(
      "Resume parse failed",
      error
    );

  }

}


setGeneratedResume(
  finalResume
);


setExportResumeText(
  finalResume
);

setResumeSummary(
  result.summary || ""
);

setChanges(
  result.changes || []
);

setAtsImprovements(
  result.ats_improvements || []
);

setKeywordsAdded(
  result.missing_keywords_added || []
);

  } catch (error) {

    console.error(error);

  } finally {

    setLoading(false);

  }

}

async function exportResume() {

  if (!exportResumeText) return;

  try {

    const response = await fetch(
      "http://localhost:8000/api/v1/resumes/export",
      {
        method: "POST",
        headers: {
          "Content-Type":"application/json"
        },
        body: JSON.stringify({
  resume: exportResumeText
})
      }
    );

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "AI_Optimized_Resume.docx";

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);

  } catch (error) {

    console.error(error);

  }

}

  function togglePriority(item: string) {
    setSelectedPriorities((prev)=>
      prev.includes(item)
        ? prev.filter((value)=>value!==item)
        : [...prev,item]
    );
  }

  function toggleCompany(item: string) {
    setSelectedCompanies((prev)=>
      prev.includes(item)
        ? prev.filter((value)=>value!==item)
        : [...prev,item]
    );
  }

  return (

    <div className="space-y-6">

      <Card className="rounded-[30px] border border-white/10">

        <CardHeader>

          <div className="flex items-center gap-4">

            <div
              className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-gradient-to-br
              from-cyan-400
              to-teal-500
              text-white
            "
            >
              <Sparkles className="h-7 w-7" />
            </div>

            <div>

              <CardTitle className="text-3xl">
                AI Resume Engine
              </CardTitle>

              <CardDescription className="mt-2 text-base">
                Generate an optimized, ATS-friendly,
                role-specific resume using AI.
              </CardDescription>

            </div>

          </div>

        </CardHeader>

      </Card>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">

        <Card className="rounded-[30px] border border-white/10">

          <CardHeader>

            <CardTitle>
              Resume Configuration
            </CardTitle>

            <CardDescription>
              Customize how AI optimizes your resume.
            </CardDescription>

          </CardHeader>

          <CardContent className="space-y-5">

            <div className="space-y-2">

              <label className="text-sm font-medium">
                Target Role
              </label>

              <Input
                value={role}
                onChange={(e)=>setRole(e.target.value)}
                placeholder="e.g. AI Engineer Intern"
              />

            </div>

            <div className="space-y-2">

              <label className="text-sm font-medium">
                Target Industry
              </label>

              <Input
                value={industry}
                onChange={(e)=>setIndustry(e.target.value)}
                placeholder="e.g. AI/ML, FinTech, Web Development"
              />

            </div>

            <div className="space-y-2">

              <label className="text-sm font-medium">
                Experience Level
              </label>

              <Select
                value={experienceLevel}
                onChange={(e)=>setExperienceLevel(e.target.value)}
              >

                <option value="Fresher">
                  Fresher
                </option>

                <option value="Intern">
                  Intern
                </option>

                <option value="Junior">
                  Junior
                </option>

                <option value="Mid-level">
                  Mid-level
                </option>

              </Select>

            </div>

            <div className="space-y-3">

              <label className="text-sm font-medium">
                Target Company Types
              </label>

              <div className="flex flex-wrap gap-2">

                {companyTypes.map((item)=>(

                  <button
                    key={item}
                    type="button"
                    onClick={()=>toggleCompany(item)}
                    className={`
                    rounded-full
                    border
                    px-4
                    py-2
                    text-sm
                    transition-all
                    ${
                      selectedCompanies.includes(item)
                      ? "border-cyan-400 bg-cyan-500/20 text-cyan-300"
                      : "border-white/10 text-zinc-400"
                    }
                    `}
                  >

                    {item}

                  </button>

                ))}

              </div>

            </div>

            <div className="space-y-3">

              <label className="text-sm font-medium">
                Optimization Priorities
              </label>

              <div className="flex flex-wrap gap-2">

                {priorities.map((item)=>(

                  <button
                    key={item}
                    type="button"
                    onClick={()=>togglePriority(item)}
                    className={`
                    rounded-full
                    border
                    px-4
                    py-2
                    text-sm
                    transition-all
                    ${
                      selectedPriorities.includes(item)
                      ? "border-cyan-400 bg-cyan-500/20 text-cyan-300"
                      : "border-white/10 text-zinc-400"
                    }
                    `}
                  >

                    {item}

                  </button>

                ))}

              </div>

            </div>

            <div className="space-y-2">

              <label className="text-sm font-medium">
                Job Description (optional)
              </label>

              <Textarea
                value={jobDescription}
                onChange={(e)=>setJobDescription(e.target.value)}
                className="min-h-40"
                placeholder="Paste job description for role-specific optimization"
              />

            </div>

            <>

<input
  ref={fileInputRef}
  type="file"
  accept=".txt,.pdf,.doc,.docx"
  className="hidden"
  onChange={handleResumeUpload}
/>

<Button
  type="button"
  className="w-full"
  onClick={()=>fileInputRef.current?.click()}
>

  <Upload className="h-4 w-4" />

  {resumeFile
    ? resumeFile.name
    : "Upload Resume"}

</Button>

</>

            <Button
onClick={generateAIResume}
disabled={!resumeText || loading}
className="
w-full
bg-gradient-to-r
from-cyan-500
to-teal-500
text-white
"
>

              <WandSparkles className="h-4 w-4" />

              Generate AI Resume

            </Button>

          </CardContent>

        </Card>

        <Card className="rounded-[30px] border border-white/10">

          <CardHeader>

            <CardTitle>
              AI Resume Preview
            </CardTitle>

            <CardDescription>
              Your optimized resume will appear here.
            </CardDescription>

          </CardHeader>

          <CardContent>

<div className="grid gap-6 xl:grid-cols-2">

<div
className="
rounded-2xl
border
border-white/10
bg-white/[0.02]
p-5
"
>

<div className="mb-4 flex items-center justify-between">

<p className="text-sm font-semibold">

Original Resume

</p>

<Badge>

Uploaded

</Badge>

</div>

<div
className="
max-h-[700px]
overflow-y-auto
rounded-xl
bg-black/20
p-4
"
>

<pre
className="
whitespace-pre-wrap
text-sm
text-zinc-300
"
>

{resumeText || "Upload a resume to preview original content."}

</pre>

</div>

</div>


<div
className="
rounded-2xl
border
border-cyan-500/20
bg-cyan-500/[0.03]
p-5
"
>

<div className="mb-4 flex items-center justify-between">

<p className="text-sm font-semibold text-cyan-300">

AI Optimized Resume

</p>

<Badge
className="
bg-cyan-500/20
text-cyan-300
border-cyan-500/20
"
>

AI Enhanced

</Badge>
<Button
size="sm"
onClick={exportResume}
disabled={!exportResumeText}
>

Download

</Button>

</div>

{resumeSummary && (

<div
className="
mb-5
rounded-xl
border
border-cyan-500/20
bg-cyan-500/5
p-4
"
>

<p className="text-sm font-medium text-cyan-300">

Optimization Summary

</p>

<p className="mt-2 text-sm text-zinc-300">

{resumeSummary}

</p>

</div>

)}
{(changes.length > 0 ||
atsImprovements.length > 0 ||
keywordsAdded.length > 0) && (

<div className="mb-5 space-y-4">

{changes.length > 0 && (

<div
className="
rounded-xl
border
border-white/10
bg-white/[0.03]
p-4
"
>

<p className="mb-3 text-sm font-semibold">

AI Improvements

</p>

<div className="space-y-2">

{changes.map((item, index)=>(

<div
key={index}
className="
flex
items-start
gap-2
text-sm
text-zinc-300
"
>

<span className="text-cyan-400">

✓

</span>

<span>

{item}

</span>

</div>

))}

</div>

</div>

)}

{atsImprovements.length > 0 && (

<div
className="
rounded-xl
border
border-cyan-500/20
bg-cyan-500/[0.04]
p-4
"
>

<p className="mb-3 text-sm font-semibold text-cyan-300">

ATS Improvements

</p>

<div className="space-y-2">

{atsImprovements.map((item, index)=>(

<div
key={index}
className="
flex
items-start
gap-2
text-sm
text-zinc-300
"
>

<span className="text-cyan-400">

↑

</span>

<span>

{item}

</span>

</div>

))}

</div>

</div>

)}

{keywordsAdded.length > 0 && (

<div
className="
rounded-xl
border
border-emerald-500/20
bg-emerald-500/[0.04]
p-4
"
>

<p className="mb-3 text-sm font-semibold text-emerald-300">

Keywords Added

</p>

<div className="flex flex-wrap gap-2">

{keywordsAdded.map((item, index)=>(

<Badge
key={index}
className="
bg-emerald-500/10
text-emerald-300
border-emerald-500/20
"
>

{item}

</Badge>

))}

</div>

</div>

)}

</div>

)}

<div
className="
max-h-[700px]
overflow-y-auto
rounded-xl
bg-black/20
p-4
"
>

<ResumePreview
content={generatedResume}
/>

</div>

</div>

</div>

</CardContent>

        </Card>

      </div>

    </div>

  );
}