import { Badge } from "@/components/ui/badge";
import { ProjectBadge } from "@/components/project-badge";
import { TimeAgo } from "@/components/time-ago";
import { getActivity } from "@/lib/queries/activity";
import {
  Activity,
  PlayCircle,
  StopCircle,
  FileEdit,
  Lightbulb,
  Link2,
  CheckSquare,
  GitBranch,
} from "lucide-react";

export const dynamic = "force-dynamic";

const activityIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  session_start: PlayCircle,
  session_end: StopCircle,
  file_change: FileEdit,
  idea_captured: Lightbulb,
  dependency_confirmed: Link2,
  task_completed: CheckSquare,
  decision_made: GitBranch,
};

export default async function ActivityPage() {
  const activity = await getActivity({ limit: 100 });

  // Group by date
  const grouped = new Map<string, typeof activity>();
  for (const entry of activity) {
    const date = new Date(entry.created_at).toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    if (!grouped.has(date)) grouped.set(date, []);
    grouped.get(date)!.push(entry);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight">Activity Log</h1>
        <p className="text-muted-foreground mt-1">
          Recent activity across all projects
        </p>
      </div>

      {Array.from(grouped.entries()).map(([date, entries]) => (
        <div key={date}>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 sticky top-0 bg-background py-1">
            {date}
          </h2>
          <div className="space-y-3 ml-2 border-l-2 border-border pl-4">
            {entries.map((entry) => {
              const Icon =
                activityIcons[entry.activity_type] ?? Activity;
              return (
                <div key={entry.id} className="flex items-start gap-3">
                  <Icon className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm">{entry.description}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <ProjectBadge
                        project={
                          entry.projects as unknown as {
                            slug: string;
                            name: string;
                          }
                        }
                      />
                      <Badge variant="outline" className="text-xs">
                        {entry.activity_type.replace(/_/g, " ")}
                      </Badge>
                      {typeof entry.context?.machine === "string" && (
                        <Badge variant="secondary" className="text-xs">
                          {entry.context.machine}
                        </Badge>
                      )}
                      <TimeAgo date={entry.created_at} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {activity.length === 0 && (
        <p className="text-sm text-muted-foreground">No activity recorded</p>
      )}
    </div>
  );
}
