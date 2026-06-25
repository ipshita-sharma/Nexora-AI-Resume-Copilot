import { JobMatcher } from "@/components/workflows/job-matcher";

export default function MatcherPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Application fit lab</p>
        <h1 className="text-3xl font-semibold">Job Description Matcher</h1>
      </div>
      <JobMatcher />
    </div>
  );
}
