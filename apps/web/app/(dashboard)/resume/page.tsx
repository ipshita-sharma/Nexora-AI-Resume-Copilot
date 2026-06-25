import { ResumeAnalyzer } from "@/components/workflows/resume-analyzer";

export default function ResumePage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Resume lab</p>
        <h1 className="text-3xl font-semibold">Resume Analyzer + ATS Scoring</h1>
      </div>
      <ResumeAnalyzer />
    </div>
  );
}
