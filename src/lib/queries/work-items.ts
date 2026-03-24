import { getSupabaseClient } from "../supabase";
import type { WorkItem } from "../types";

export async function getWorkItems(opts?: {
  projectSlug?: string;
  machine?: string;
  status?: string;
  includeComplete?: boolean;
  limit?: number;
}): Promise<WorkItem[]> {
  const supabase = getSupabaseClient();

  let query = supabase
    .from("work_items")
    .select("*, projects(slug, name)")
    .order("updated_at", { ascending: false })
    .limit(opts?.limit ?? 50);

  if (opts?.projectSlug) {
    const { data: project } = await supabase
      .from("projects")
      .select("id")
      .eq("slug", opts.projectSlug)
      .single();
    if (project) {
      query = query.eq("project_id", project.id);
    }
  }

  if (opts?.machine) {
    query = query.eq("machine", opts.machine);
  }

  if (opts?.status) {
    query = query.eq("status", opts.status);
  } else if (!opts?.includeComplete) {
    query = query.in("status", ["in_progress", "committed"]);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getWorkItemCounts(): Promise<{
  inProgress: number;
  byMachine: Record<string, number>;
}> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("work_items")
    .select("machine")
    .eq("status", "in_progress");

  if (error) throw error;

  const byMachine: Record<string, number> = {};
  for (const item of data ?? []) {
    byMachine[item.machine] = (byMachine[item.machine] || 0) + 1;
  }

  return {
    inProgress: data?.length ?? 0,
    byMachine,
  };
}
