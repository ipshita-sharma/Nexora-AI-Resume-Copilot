import { ArrowUpRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export function MetricCard({
  label,
  value,
  delta
}: {
  label: string;
  value: string | number;
  delta: string;
}) {
  return (
    <Card
      className="
        group
        glass-premium
        glow
        relative
        overflow-hidden
        rounded-[28px]
        border
        border-white/10
        bg-white/[0.03]
        shadow-xl
        backdrop-blur-2xl
        transition-all
        duration-500
        hover:-translate-y-1
        hover:border-cyan-400/20
        hover:bg-white/[0.05]
      "
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/[0.04] to-blue-500/[0.03]" />

      <CardContent className="relative p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-zinc-400">
              {label}
            </p>

            <p
              className="
                mt-3
                text-4xl
                font-semibold
                tracking-tight
                text-white
              "
            >
              {value}
            </p>
          </div>

          <span
            className="
              flex
              items-center
              gap-1
              rounded-2xl
              border
              border-white/10
              bg-white/[0.05]
              px-3
              py-1.5
              text-xs
              font-medium
              text-cyan-300
              backdrop-blur-xl
            "
          >
            {delta}

            <ArrowUpRight className="h-3 w-3" />
          </span>
        </div>
      </CardContent>
    </Card>
  );
}