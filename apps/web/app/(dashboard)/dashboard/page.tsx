import { DashboardOverview } from "@/components/dashboard/dashboard-overview";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
  <p className="text-sm uppercase tracking-wider text-cyan-400">
    AI Career Operating System
  </p>

  <h1 className="text-4xl font-bold tracking-tight">
    Nexora Command Center
  </h1>

  <p className="text-zinc-400">
    Track your progress from student to hired.
  </p>
</div>
      <DashboardOverview />
    </div>
  );
}
