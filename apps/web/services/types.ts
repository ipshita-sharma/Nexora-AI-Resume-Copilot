export type ScoreBreakdown = {
  ats: number;
  semantic: number;
  keyword: number;
  formatting: number;
  grammar: number;
};

export type Suggestion = {
  title: string;
  impact: string;
  priority: "low" | "medium" | "high" | string;
  action: string;
};

export type ResumeAnalysis = {
  resume_id?: string;
  filename?: string;
  target_role?: string;

  resume_text?: string;

  sections: Record<string, string>;
  extracted_skills: string[];
  missing_skills: string[];
  missing_keywords: string[];
  weak_sections: string[];
  scores: ScoreBreakdown;
  suggestions: Suggestion[];
  summary: string;
};

export type JobMatch = {
  match_id?: string;
  title?: string;
  match_score: number;
  semantic_score: number;
  keyword_score: number;
  missing_skills: string[];
  suggested_keywords: string[];
  roadmap: Array<{ topic: string; reason: string; actions: string[]; priority: number }>;
  summary: string;
};

export type InterviewQuestion = {
  id: string;
  type: string;
  question: string;
  rubric: string[];
};

export type InterviewStart = {
  interview_id?: string;
  role: string;
  difficulty: string;
  interview_type: string;
  company_type: string;
  questions: InterviewQuestion[];
  current_question: InterviewQuestion;
};

export type InterviewAnswerFeedback = {
  score: number;
  communication_score: number;
  technical_score: number;
  confidence_score: number;
  strengths: string[];
  improvements: string[];
  follow_up_question: string;
};

export type LearningRoadmap = {
  target_role: string;
  recommendations: Array<{
    topic: string;
    priority: number;
    reason: string;
    actions: Array<{ label: string; type: string; effort: string }>;
  }>;
  weekly_plan: Array<{ day: string; focus: string; task: string; outcome: string }>;
};

export type AnalyticsOverview = {
  ats_trend: Array<Record<string, string | number>>;
  interview_trend: Array<Record<string, string | number>>;
  skill_progress: Array<{ skill: string; value: number }>;
  match_history: Array<Record<string, string | number>>;
  weak_areas: Array<{ name: string; count: number }>;
  recommendations: Array<{ topic: string; priority: number; reason: string }>;
  summary_cards: Array<{ label: string; value: string | number; delta: string }>;
};
