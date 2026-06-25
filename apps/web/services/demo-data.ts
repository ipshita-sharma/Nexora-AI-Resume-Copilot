import type { AnalyticsOverview, JobMatch, LearningRoadmap, ResumeAnalysis } from "@/services/types";

export const emptyAnalytics: AnalyticsOverview = {
  ats_trend: [],
  interview_trend: [],
  skill_progress: [],
  match_history: [],
  weak_areas: [],
  recommendations: [],
  summary_cards: []
};

export const emptyResumeAnalysis: ResumeAnalysis = {
  sections: {},
  extracted_skills: [],
  missing_skills: [],
  missing_keywords: [],
  weak_sections: [],
  scores: { ats: 0, semantic: 0, keyword: 0, formatting: 0, grammar: 0 },
  suggestions: [],
  summary: ""
};

export const emptyJobMatch: JobMatch = {
  match_score: 0,
  semantic_score: 0,
  keyword_score: 0,
  missing_skills: [],
  suggested_keywords: [],
  roadmap: [],
  summary: ""
};

export const emptyRoadmap: LearningRoadmap = {
  target_role: "",
  recommendations: [],
  weekly_plan: []
};
