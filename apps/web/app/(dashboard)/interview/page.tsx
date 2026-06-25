import { InterviewRoom } from "@/components/workflows/interview-room";

export default function InterviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Mock interview studio</p>
        <h1 className="text-3xl font-semibold">AI Mock Interview</h1>
      </div>
      <InterviewRoom />
    </div>
  );
}
