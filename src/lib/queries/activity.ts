import { getSupabaseClient } from "../supabase";
import type { ActivityLog } from "../types";

export async function getActivity(opts?: {
  projectSlug?: string;
  limit?: number;
}): Promise<ActivityLog[]> {
  const supabase = getSupabaseClient();

  let query = supabase
    .from("activity_log")
    .select("*, projects(slug, name)")
    .order("created_at", { ascending: false })
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

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}
