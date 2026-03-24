// PI Database Types — mirrors schema from mcp-project-intelligence

export interface Project {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  platforms: string[];
  repo_url: string | null;
  local_path: string | null;
  tags: string[];
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Feature {
  id: string;
  project_id: string;
  name: string;
  description: string | null;
  platforms: string[];
  status: "active" | "planned" | "deprecated";
  tags: string[];
  created_at: string;
  updated_at: string;
  projects?: { slug: string; name: string };
}

export interface Dependency {
  id: string;
  source_feature_id: string;
  target_feature_id: string;
  dependency_type: "implies_change" | "blocks" | "shares_data" | "mirrors";
  confidence: "inferred" | "confirmed" | "manual";
  confidence_score: number | null;
  description: string | null;
  inferred_from: string | null;
  confirmed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Idea {
  id: string;
  project_id: string | null;
  feature_id: string | null;
  title: string;
  body: string | null;
  priority: Priority;
  status: "inbox" | "triaged" | "in_progress" | "done" | "archived";
  tags: string[];
  created_at: string;
  updated_at: string;
  projects?: { slug: string; name: string } | null;
}

export interface Task {
  id: string;
  project_id: string | null;
  feature_id: string | null;
  idea_id: string | null;
  title: string;
  body: string | null;
  priority: Priority;
  status: "pending" | "in_progress" | "done" | "cancelled";
  due_date: string | null;
  completed_at: string | null;
  is_manual: boolean;
  blocked_by: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
  projects?: { slug: string; name: string } | null;
}

export interface Decision {
  id: string;
  project_id: string | null;
  feature_id: string | null;
  title: string;
  description: string;
  decision_type: "chose" | "deferred" | "rejected";
  revisit_when: string | null;
  is_active: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
  projects?: { slug: string; name: string } | null;
}

export interface Pattern {
  id: string;
  project_id: string | null;
  name: string;
  description: string;
  rule_type: "sync_required" | "convention" | "architecture" | "process";
  trigger_conditions: Record<string, unknown> | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  projects?: { slug: string; name: string } | null;
}

export interface WorkItem {
  id: string;
  project_id: string;
  machine: string;
  branch: string | null;
  summary: string;
  body: string | null;
  status: "in_progress" | "committed" | "complete";
  commit_hash: string | null;
  tags: string[];
  metadata: Record<string, unknown>;
  started_at: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  projects?: { slug: string; name: string } | null;
}

export interface ActivityLog {
  id: string;
  project_id: string | null;
  feature_id: string | null;
  activity_type:
    | "session_start"
    | "session_end"
    | "file_change"
    | "idea_captured"
    | "dependency_confirmed"
    | "task_completed"
    | "decision_made"
    | "work_started"
    | "work_completed";
  description: string | null;
  context: Record<string, unknown>;
  created_at: string;
  projects?: { slug: string; name: string } | null;
}

export type Priority = "low" | "normal" | "high" | "urgent";
