"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

export function TrendChart({
  data,
  dataKey = "score"
}: {
  data: Array<Record<string, string | number>>;
  dataKey?: string;
}) {
  return (
    <div className="h-72 w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            left: 0,
            right: 8,
            top: 20,
            bottom: 0
          }}
        >
          <defs>
            <linearGradient
              id="premiumFill"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor="#2DD4BF"
                stopOpacity={0.35}
              />

              <stop
                offset="95%"
                stopColor="#2DD4BF"
                stopOpacity={0}
              />
            </linearGradient>

            <filter id="glow">
              <feGaussianBlur
                stdDeviation="4"
                result="coloredBlur"
              />

              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <CartesianGrid
            stroke="rgba(255,255,255,0.06)"
            strokeDasharray="3 3"
            vertical={false}
          />

          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            fontSize={12}
            stroke="#71717a"
          />

          <YAxis
            domain={[0,100]}
            tickLine={false}
            axisLine={false}
            fontSize={12}
            stroke="#71717a"
          />

          <Tooltip
            contentStyle={{
              borderRadius: "20px",
              border: "1px solid rgba(255,255,255,.08)",
              background: "rgba(15,15,20,.8)",
              backdropFilter: "blur(20px)",
              color: "#fff"
            }}
          />

          <Area
            type="monotone"
            dataKey={dataKey}
            stroke="#2DD4BF"
            fill="url(#premiumFill)"
            strokeWidth={3}
            filter="url(#glow)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SkillBarChart({
  data
}: {
  data: Array<{
    skill:string;
    value:number;
  }>
}) {
  return (
    <div className="h-72 w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{
            left: 16,
            right: 12,
            top: 6,
            bottom: 6
          }}
        >
          <CartesianGrid
            stroke="rgba(255,255,255,0.05)"
            horizontal={false}
          />

          <XAxis
            type="number"
            hide
            domain={[0,100]}
          />

          <YAxis
            type="category"
            dataKey="skill"
            width={110}
            tickLine={false}
            axisLine={false}
            fontSize={12}
            stroke="#a1a1aa"
          />

          <Tooltip
            contentStyle={{
              borderRadius:"18px",
              border:"1px solid rgba(255,255,255,.08)",
              background:"rgba(15,15,20,.8)",
              backdropFilter:"blur(20px)"
            }}
          />

          <Bar
            dataKey="value"
            radius={[20,20,20,20]}
            fill="#2DD4BF"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}