import { getSupabaseClient } from "../supabase";
import type { GuidanceImpact, Pattern } from "../types";

export async function getPatterns(opts?: {
  projectSlug?: string;
  status?: string;
}): Promise<Pattern[]> {
  const supabase = getSupabaseClient();

  let query = supabase
    .from("patterns")
    .select("*, projects(slug, name)")
    .order("last_seen_at", { ascending: false });

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
  } else {
    query = query.neq("status", "retired");
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getGuidanceByPattern(
  patternIds: string[]
): Promise<Record<string, GuidanceImpact[]>> {
  if (patternIds.length === 0) return {};
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("guidance_impact")
    .select("*")
    .in("pattern_id", patternIds)
    .order("created_at", { ascending: false });

  if (error) throw error;

  const byPattern: Record<string, GuidanceImpact[]> = {};
  for (const impact of data ?? []) {
    const key = impact.pattern_id as string;
    if (!byPattern[key]) byPattern[key] = [];
    byPattern[key].push(impact);
  }
  return byPattern;
}
