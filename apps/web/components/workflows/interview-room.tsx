"use client";

import { FormEvent, useMemo, useState, useEffect } from "react";
import { Bot, Send } from "lucide-react";
import { toast } from "sonner";

import { useCareerAuth } from "@/components/auth/auth-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { answerInterview, startInterview } from "@/services/api";
import type { InterviewAnswerFeedback, InterviewQuestion, InterviewStart } from "@/services/types";

type Turn = {
  question: string;
  answer: string;
  feedback: InterviewAnswerFeedback;
};

export function InterviewRoom() {
  const { getToken, user } = useCareerAuth();

const userId =
  user?.primaryEmailAddress?.emailAddress;

const getUserKey = (
  key: string
) => `${userId || "guest"}_${key}`;
  const [role, setRole] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [interviewType, setInterviewType] = useState("");
  const [companyType, setCompanyType] = useState("");
  const [focusSkills, setFocusSkills] = useState("");
  const [session, setSession] = useState<InterviewStart | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
  if (!userId) return;

  setRole(
    localStorage.getItem(
      getUserKey("lastTargetRole")
    ) || ""
  );
}, [userId]);
  const averageScore = turns.length
? Math.round(
turns.reduce(
(total,item)=>total+item.feedback.score,
0
)/turns.length
)
:0;

  const currentQuestion: InterviewQuestion | null = useMemo(() => {
    if (!session) return null;
    return session.questions[currentIndex] ?? session.questions.at(-1) ?? null;
  }, [currentIndex, session]);

  async function start(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    try {
      const token = await getToken();
      const next = await startInterview(
  {
    role,
    difficulty,
    interview_type: interviewType,
    company_type: companyType,

    resume_context:
  localStorage.getItem(
    getUserKey("uploadedResumeText")
  ) || "",

    focus_skills: focusSkills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean)
  },
  token
);
      setSession(next);
      setCurrentIndex(0);
      setTurns([]);
      toast.success("Mock interview started");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not start interview");
    } finally {
      setLoading(false);
    }
  }

  async function submitAnswer(event: FormEvent) {
    event.preventDefault();
    if (!currentQuestion || !session) return;
    setLoading(true);
    try {
      const token = await getToken();
      const feedback = await answerInterview(
        {
          interview_id: session.interview_id,
          question: currentQuestion.question,
          answer,
          role,
          difficulty,
          transcript: turns.map((turn) => ({
            question: turn.question,
            answer: turn.answer,
            score: turn.feedback.score
          }))
        },
        token
      );
      setTurns((items)=>{

const updated = [
...items,
{
question: currentQuestion.question,
answer,
feedback
}
];

localStorage.setItem(
  getUserKey("interviewHistory"),
  JSON.stringify(updated)
);

return updated;

});
      localStorage.setItem(
  getUserKey("interviewWeakAreas"),
  (feedback.improvements || []).join(", ")
);
  setAnswer("");
      setCurrentIndex((index) => Math.min(index + 1, (session.questions.length || 1) - 1));
      toast.success("Answer scored");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not score answer");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[0.82fr_1.18fr]">
      <Card>
        <CardHeader>
          <CardTitle>Interview Setup</CardTitle>
          <CardDescription>Choose role, company context, difficulty, and focus areas.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={start} className="space-y-4">
            <Input value={role} onChange={(event) => setRole(event.target.value)} placeholder="Role" />
            <div className="grid gap-3 sm:grid-cols-2">
              <Select value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                <option value="senior">Senior</option>
              </Select>
              <Select value={interviewType} onChange={(event) => setInterviewType(event.target.value)}>
                <option value="mixed">Mixed</option>
                <option value="technical">Technical</option>
                <option value="behavioral">Behavioral</option>
                <option value="hr">HR</option>
              </Select>
            </div>
            <Select value={companyType} onChange={(event) => setCompanyType(event.target.value)}>
              <option value="startup">Startup</option>
              <option value="enterprise">Enterprise</option>
              <option value="big-tech">Big tech</option>
              <option value="consulting">Consulting</option>
            </Select>
            <Input value={focusSkills} onChange={(event) => setFocusSkills(event.target.value)} placeholder="Focus skills" />
            <Button disabled={loading} className="w-full">
              <Bot className="h-4 w-4" />
              {loading ? "Preparing..." : "Start Adaptive Interview"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-5">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle>AI Interview Room</CardTitle>
                <CardDescription>
                  {currentQuestion ? `Question ${currentIndex + 1} of ${session?.questions.length}` : "Start a session to generate calibrated questions."}
                </CardDescription>
                {session && (

<Progress
value={
((currentIndex+1)
/ session.questions.length)
*100
}
className="mt-4"
/>

)}
              </div>
              <Badge>{difficulty}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border bg-background p-4">
              <p className="text-sm text-muted-foreground">Current question</p>
              <p className="mt-2 text-lg font-medium">
                {currentQuestion?.question ?? "Your first question will appear here."}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">

{(currentQuestion?.rubric || []).map((rubric) => (

<Badge key={rubric}>
  {rubric}
</Badge>

))}

{(!currentQuestion?.rubric ||
currentQuestion.rubric.length===0) && (

<p className="text-sm text-zinc-400 mt-4">

No evaluation criteria generated yet.

</p>

)}

</div>
            </div>
            <form onSubmit={submitAnswer} className="mt-4 space-y-3">
              <Textarea
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                className="min-h-40"
                placeholder="Answer as if you are in a real interview. Use examples, tradeoffs, and measurable outcomes."
              />
              <Button disabled={!session || !answer || loading} className="w-full">
                <Send className="h-4 w-4" />
                {loading ? "Scoring..." : "Submit Answer"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>

<div className="flex items-center justify-between">

<CardTitle>
Performance Feedback
</CardTitle>

{averageScore>0 && (

<Badge>

Avg: {averageScore}

</Badge>

)}

</div>
            <CardDescription>Scores update after each answer.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {(turns.length ? turns : []).map((turn, index) => (
              <div key={`${turn.question}-${index}`} className="rounded-md border p-4">
                <p className="text-sm font-medium">Q{index + 1}. {turn.question}</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-4">
                  {[
                    ["Overall", turn.feedback.score],
                    ["Communication", turn.feedback.communication_score],
                    ["Technical", turn.feedback.technical_score],
                    ["Confidence", turn.feedback.confidence_score]
                  ].map(([label, value]) => (
                    <div key={label as string}>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{label}</span>
                        <span>{Math.round(Number(value))}</span>
                      </div>
                      <Progress value={Number(value)} className="mt-2" />
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-sm text-muted-foreground">Follow-up: {turn.feedback.improvements}</p>
              </div>
            ))}
            {!turns.length && (
              <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
                Submit an answer to receive rubric-based feedback.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
