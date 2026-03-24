import { getSupabaseClient } from "../supabase";
import type { Idea } from "../types";

export async function getIdeas(opts?: {
  projectSlug?: string;
  status?: string;
}): Promise<Idea[]> {
  const supabase = getSupabaseClient();

  let query = supabase
    .from("ideas")
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

  if (opts?.status) {
    query = query.eq("status", opts.status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}
