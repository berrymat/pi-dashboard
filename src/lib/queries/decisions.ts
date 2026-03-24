import { getSupabaseClient } from "../supabase";
import type { Decision } from "../types";

export async function getDecisions(opts?: {
  projectSlug?: string;
  activeOnly?: boolean;
}): Promise<Decision[]> {
  const supabase = getSupabaseClient();

  let query = supabase
    .from("decisions")
    .select("*, projects(slug, name)")
    .order("created_at", { ascending: false });

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

  if (opts?.activeOnly !== false) {
    query = query.eq("is_active", true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}
