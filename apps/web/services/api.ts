import { emptyAnalytics, emptyRoadmap } from "@/services/demo-data";
import type {
  AnalyticsOverview,
  InterviewAnswerFeedback,
  InterviewStart,
  JobMatch,
  LearningRoadmap,
  ResumeAnalysis
} from "@/services/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function request<T>(path: string, init: RequestInit = {}, token?: string | null): Promise<T> {
  const headers = new Headers(init.headers);
  if (!(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
    cache: "no-store"
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function fetchAnalytics(
token?: string | null
): Promise<AnalyticsOverview> {

return request<AnalyticsOverview>(
"/api/v1/analytics/overview",
{},
token
);

}

export function analyzeResume(formData: FormData, token?: string | null) {
  return request<ResumeAnalysis>("/api/v1/resumes/analyze", { method: "POST", body: formData }, token);
}

export function analyzeJobMatch(payload: Record<string, unknown>, token?: string | null) {
  return request<JobMatch>(
    "/api/v1/job-matches/analyze",
    { method: "POST", body: JSON.stringify(payload) },
    token
  );
}

export function startInterview(payload: Record<string, unknown>, token?: string | null) {
  return request<InterviewStart>("/api/v1/interviews/start", { method: "POST", body: JSON.stringify(payload) }, token);
}

export function answerInterview(payload: Record<string, unknown>, token?: string | null) {
  return request<InterviewAnswerFeedback>(
    "/api/v1/interviews/answer",
    { method: "POST", body: JSON.stringify(payload) },
    token
  );
}

export async function createRoadmap(
payload: Record<string, unknown>,
token?: string | null
): Promise<LearningRoadmap> {

return request<LearningRoadmap>(
"/api/v1/learning/roadmap",
{
method:"POST",
body:JSON.stringify(payload)
},
token
);

}

export function updateProfile(payload: Record<string, unknown>, token?: string | null) {
  return request<Record<string, unknown>>(
    "/api/v1/users/me",
    { method: "PATCH", body: JSON.stringify(payload) },
    token
  );
}

export async function exportReport(token?: string | null) {
  const headers = new Headers();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const response = await fetch(`${API_BASE}/api/v1/reports/export`, {
    method: "POST",
    headers
  });
  if (!response.ok) throw new Error("Could not export report");
  return response.blob();
}
