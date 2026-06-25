import { LearningRoadmap } from "@/components/workflows/learning-roadmap";

export default function LearningPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Personalized learning engine</p>
        <h1 className="text-3xl font-semibold">Skill Gap Roadmap</h1>
      </div>
      <LearningRoadmap />
    </div>
  );
}
