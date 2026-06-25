"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useCareerAuth } from "@/components/auth/auth-provider";
import { SkillBarChart, TrendChart } from "@/components/charts/trend-chart";
import { MetricCard } from "@/components/dashboard/metric-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchAnalytics } from "@/services/api";
import { emptyAnalytics } from "@/services/demo-data";
import type { AnalyticsOverview } from "@/services/types";

export function DashboardOverview() {
  const { getToken } = useCareerAuth();
  const [data, setData] =
useState<AnalyticsOverview>(emptyAnalytics);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    let mounted = true;
    getToken()
      .then((token) => fetchAnalytics(token))
      .then((overview) => {
        if (mounted) setData(overview);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [getToken]);

  if (loading) {
    return <Skeleton className="h-[640px] w-full" />;
  }
  const isEmpty =
  !data.summary_cards?.length ||
  (
    data.summary_cards?.every(
      (card) => Number(card.value) === 0
    )
  );
  if (isEmpty) {
  return (
    <Card
      className="
        glass-premium
        rounded-[30px]
        border
        border-white/10
        bg-white/[0.03]
        p-8
        backdrop-blur-2xl
      "
    >
      <CardHeader>
  <CardTitle className="text-3xl text-white">
    Welcome to Nexora AI 👋
  </CardTitle>

  <CardDescription className="text-zinc-400 text-base">
    Let's build your path from student to hired.
  </CardDescription>

  <button
    onClick={() => router.push("/resume")}
    className="
      mt-4
      w-fit
      rounded-2xl
      bg-cyan-500
      px-6
      py-3
      font-semibold
      text-black
      transition-all
      duration-300
      hover:scale-105
    "
  >
    Start Your Career Analysis →
  </button>
</CardHeader>

      <CardContent className="space-y-4">
        <div
  onClick={() => router.push("/resume")}
  className="
    rounded-2xl
    border
    border-white/10
    p-5
    cursor-pointer
    transition-all
    duration-300
    hover:-translate-y-1
    hover:border-cyan-400/40
    hover:bg-cyan-500/5
  "
>
  <p className="font-semibold text-white">
    📄 Upload Resume
  </p>

  <p className="mt-2 text-sm text-zinc-400">
    Get ATS score, keyword analysis and improvement suggestions.
  </p>
</div>

        <div
        onClick={() => router.push("/matcher")}
  className="
    rounded-2xl
    border
    border-white/10
    p-5
    cursor-pointer
    transition-all
    duration-300
    hover:-translate-y-1
    hover:border-cyan-400/40
    hover:bg-cyan-500/5
  "
>
  <p className="font-semibold text-white">
    🎯 Analyze Job Description
  </p>

  <p className="mt-2 text-sm text-zinc-400">
    Compare your profile against real job requirements.
  </p>
</div>

        <div   
   onClick={() => router.push("/interview")}    
  className="
    rounded-2xl
    border
    border-white/10
    p-5
    cursor-pointer
    transition-all
    duration-300
    hover:-translate-y-1
    hover:border-cyan-400/40
    hover:bg-cyan-500/5
  "
>
  <p className="font-semibold text-white">
    🎤 Start Mock Interview
  </p>

  <p className="mt-2 text-sm text-zinc-400">
    Practice technical and HR interviews with AI feedback.
  </p>
</div>
      </CardContent>
    </Card>
  );
}
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-6 md:grid-cols-2 xl:grid-cols-4"
      >
        {data?.summary_cards?.map((card) => (
          <MetricCard key={card.label} label={card.label} value={card.value} delta={card.delta} />
        ))}
      </motion.div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card
  className="
    glass-premium
    rounded-[30px]
    border
    border-white/10
    bg-white/[0.03]
    shadow-xl
    backdrop-blur-2xl
  "
>
          <CardHeader>
            <CardTitle className="text-lg font-semibold tracking-tight text-white">ATS Score Trend</CardTitle>
            <CardDescription className="text-sm text-zinc-400">Resume quality over recent versions.</CardDescription>
          </CardHeader>
          <CardContent>
            <TrendChart data={data?.ats_trend || []} />
          </CardContent>
        </Card>
        <Card
  className="
    glass-premium
    rounded-[30px]
    border
    border-white/10
    bg-white/[0.03]
    shadow-xl
    backdrop-blur-2xl
  "
>
          <CardHeader>
            <CardTitle className="text-lg font-semibold tracking-tight text-white">Skill Progress</CardTitle>
            <CardDescription className="text-sm text-zinc-400">Skill evidence accumulated across resumes and interviews.</CardDescription>
          </CardHeader>
          <CardContent>
            <SkillBarChart data={data?.skill_progress || []} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card
  className="
    glass-premium
    rounded-[30px]
    border
    border-white/10
    bg-white/[0.03]
    shadow-xl
    backdrop-blur-2xl
  "
>
          <CardHeader>
            <CardTitle className="text-lg font-semibold tracking-tight text-white">Interview Performance</CardTitle>
            <CardDescription className="text-sm text-zinc-400">Mock interview score trend.</CardDescription>
          </CardHeader>
          <CardContent>
            <TrendChart data={data?.interview_trend || []} />
          </CardContent>
        </Card>
        <Card
  className="
    glass-premium
    rounded-[30px]
    border
    border-white/10
    bg-white/[0.03]
    shadow-xl
    backdrop-blur-2xl
  "
>
          <CardHeader>
            <CardTitle className="text-lg font-semibold tracking-tight text-white">Weak Area Heatmap</CardTitle>
            <CardDescription className="text-sm text-zinc-400">Most repeated improvement themes.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {data?.weak_areas?.map((area) => (
              <div key={area.name} className="
  flex
  items-center
  justify-between
  rounded-2xl
  border
  border-white/10
  bg-white/[0.03]
  p-4
  backdrop-blur-xl
">
                <span className="text-sm font-medium">{area.name}</span>
                <Badge>{area.count} signals</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card
  className="
    glass-premium
    rounded-[30px]
    border
    border-white/10
    bg-white/[0.03]
    shadow-xl
    backdrop-blur-2xl
  "
>
        <CardHeader>
          <CardTitle className="text-lg font-semibold tracking-tight text-white">Next Best Actions</CardTitle>
          <CardDescription className="text-sm text-zinc-400">Prioritized by resume gaps, JD matching, and interview feedback.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          {data?.recommendations?.map((item, index) => (
            <div key={`${item.topic}-${index}`} className="
  rounded-3xl
  border
  border-white/10
  bg-white/[0.03]
  p-5
  shadow-lg
  backdrop-blur-xl
  transition-all
  duration-300
  hover:-translate-y-1
  hover:bg-white/[0.05]
">
              <Badge className="mb-3">Priority {item.priority}</Badge>
              <p className="font-medium">{item.topic}</p>
              <p className="mt-2 text-sm text-muted-foreground">{item.reason}</p>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card
  className="
    glass-premium
    rounded-[30px]
    border
    border-white/10
    bg-white/[0.03]
  "
>
  <CardHeader>
    <CardTitle className="text-white">
      AI Insights Feed
    </CardTitle>

    <CardDescription className="text-zinc-400">
      Personalized intelligence generated from your activity
    </CardDescription>
  </CardHeader>

  <CardContent className="space-y-4">

{data?.recommendations?.map((item,index)=>(

<div
key={`${item.topic}-${index}`}
className="
rounded-2xl
border
border-white/10
bg-white/[0.03]
p-4
"
>

<p className="font-medium">

{item.topic}

</p>

<p className="mt-2 text-sm text-zinc-400">

{item.reason}

</p>

</div>

))}

{!data?.recommendations?.length && (

<div
className="
rounded-2xl
border
border-dashed
border-white/10
p-5
text-center
"
>

<p className="text-zinc-400">

No AI insights available yet.

Complete resume analysis or interviews
to generate personalized insights.

</p>

</div>

)}

</CardContent>
</Card>
    </div>
  );
}
