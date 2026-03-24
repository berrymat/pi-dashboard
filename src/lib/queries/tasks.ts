import { getSupabaseClient } from "../supabase";
import type { Task } from "../types";

export async function getTasks(opts?: {
  projectSlug?: string;
  status?: string;
  includeDone?: boolean;
}): Promise<Task[]> {
  const supabase = getSupabaseClient();

  let query = supabase
    .from("tasks")
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
  } else if (!opts?.includeDone) {
    query = query.in("status", ["pending", "in_progress"]);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getTaskCounts(): Promise<
  Record<string, { pending: number; in_progress: number; done: number }>
> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("tasks")
    .select("status, projects(slug)");

  if (error) throw error;

  const counts: Record<
    string,
    { pending: number; in_progress: number; done: number }
  > = {};

  for (const task of data ?? []) {
    const slug =
      (task.projects as unknown as { slug: string })?.slug ?? "global";
    if (!counts[slug]) counts[slug] = { pending: 0, in_progress: 0, done: 0 };
    const status = task.status as "pending" | "in_progress" | "done";
    if (status in counts[slug]) counts[slug][status]++;
  }

  return counts;
}
