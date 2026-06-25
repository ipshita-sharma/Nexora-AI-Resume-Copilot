"use client";

import { useState } from "react";
import { Download, FileText } from "lucide-react";
import { toast } from "sonner";

import { useCareerAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { exportReport } from "@/services/api";

const reportTypes = [
  "Resume diagnostics PDF",
  "JD match report",
  "Mock interview feedback",
  "Learning roadmap"
];

export function ReportCenter() {
  const { getToken } = useCareerAuth();
  const [loading, setLoading] = useState(false);

  async function downloadReport() {
    setLoading(true);
    try {
      const token = await getToken();
      const blob = await exportReport(token);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "career-copilot-report.pdf";
      link.click();
      URL.revokeObjectURL(url);
      toast.success("Report exported");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Report export failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
      <Card>
        <CardHeader>
          <CardTitle>Export Center</CardTitle>
          <CardDescription>Create recruiter-ready or self-study reports from stored analyses.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={downloadReport} disabled={loading} className="w-full">
            <Download className="h-4 w-4" />
            {loading ? "Exporting..." : "Export PDF Report"}
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Report Templates</CardTitle>
          <CardDescription>Prepared for PDF generation and email notifications.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {reportTypes.map((type) => (
            <div key={type} className="flex items-center gap-3 rounded-md border p-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                <FileText className="h-5 w-5" />
              </span>
              <div>
                <p className="font-medium">{type}</p>
                <p className="text-sm text-muted-foreground">Database-backed export contract ready.</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
