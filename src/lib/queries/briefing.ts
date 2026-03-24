import { getSupabaseClient } from "../supabase";
import type { Task, Idea, Decision, ActivityLog, WorkItem } from "../types";

export interface BriefingData {
  recentActivity: ActivityLog[];
  pendingTasks: Task[];
  inboxIdeas: Idea[];
  activeDecisions: Decision[];
  inProgressWork: WorkItem[];
  stats: {
    totalProjects: number;
    pendingTasks: number;
    inProgressTasks: number;
    inboxIdeas: number;
    activeDecisions: number;
    inProgressWork: number;
  };
}

export async function getBriefing(projectSlug?: string): Promise<BriefingData> {
  const supabase = getSupabaseClient();

  let projectId: string | undefined;
  if (projectSlug) {
    const { data: project } = await supabase
      .from("projects")
      .select("id")
      .eq("slug", projectSlug)
      .single();
    projectId = project?.id;
  }

  // Run all queries in parallel
  const [
    activityResult,
    tasksResult,
    ideasResult,
    decisionsResult,
    projectCountResult,
    workItemsResult,
  ] = await Promise.all([
    // Recent activity
    (() => {
      let q = supabase
        .from("activity_log")
        .select("*, projects(slug, name)")
        .order("created_at", { ascending: false })
        .limit(10);
      if (projectId) q = q.eq("project_id", projectId);
      return q;
    })(),

    // Pending/in-progress tasks
    (() => {
      let q = supabase
        .from("tasks")
        .select("*, projects(slug, name)")
        .in("status", ["pending", "in_progress"])
        .order("created_at", { ascending: false });
      if (projectId) q = q.eq("project_id", projectId);
      return q;
    })(),

    // Inbox ideas
    (() => {
      let q = supabase
        .from("ideas")
        .select("*, projects(slug, name)")
        .eq("status", "inbox")
        .order("created_at", { ascending: false })
        .limit(10);
      if (projectId) q = q.eq("project_id", projectId);
      return q;
    })(),

    // Active decisions
    (() => {
      let q = supabase
        .from("decisions")
        .select("*, projects(slug, name)")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (projectId) q = q.eq("project_id", projectId);
      return q;
    })(),

    // Project count
    supabase.from("projects").select("id", { count: "exact", head: true }),

    // In-progress work items
    (() => {
      let q = supabase
        .from("work_items")
        .select("*, projects(slug, name)")
        .eq("status", "in_progress")
        .order("updated_at", { ascending: false });
      if (projectId) q = q.eq("project_id", projectId);
      return q;
    })(),
  ]);

  const recentActivity = (activityResult.data as ActivityLog[]) ?? [];
  const pendingTasks = (tasksResult.data as Task[]) ?? [];
  const inboxIdeas = (ideasResult.data as Idea[]) ?? [];
  const activeDecisions = (decisionsResult.data as Decision[]) ?? [];
  const inProgressWork = (workItemsResult.data as WorkItem[]) ?? [];

  return {
    recentActivity,
    pendingTasks,
    inboxIdeas,
    activeDecisions,
    inProgressWork,
    stats: {
      totalProjects: projectCountResult.count ?? 0,
      pendingTasks: pendingTasks.filter((t) => t.status === "pending").length,
      inProgressTasks: pendingTasks.filter((t) => t.status === "in_progress")
        .length,
      inboxIdeas: inboxIdeas.length,
      activeDecisions: activeDecisions.length,
      inProgressWork: inProgressWork.length,
    },
  };
}
