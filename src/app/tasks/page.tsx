import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/status-badge";
import { PriorityBadge } from "@/components/priority-badge";
import { ProjectBadge } from "@/components/project-badge";
import { TimeAgo } from "@/components/time-ago";
import { getTasks } from "@/lib/queries/tasks";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; project?: string }>;
}) {
  const params = await searchParams;
  const tasks = await getTasks({
    status: params.status,
    projectSlug: params.project,
    includeDone: params.status === "done",
  });

  const statuses = ["pending", "in_progress", "done"];
  const currentStatus = params.status;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight">Tasks</h1>
        <p className="text-muted-foreground mt-1">{tasks.length} tasks</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        <Link href="/tasks">
          <Badge
            variant={!currentStatus ? "default" : "outline"}
            className="cursor-pointer"
          >
            Open
          </Badge>
        </Link>
        {statuses.map((status) => (
          <Link key={status} href={`/tasks?status=${status}`}>
            <Badge
              variant={currentStatus === status ? "default" : "outline"}
              className="cursor-pointer"
            >
              {status.replace(/_/g, " ")}
            </Badge>
          </Link>
        ))}
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <Card key={task.id}>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{task.title}</p>
                  {task.body && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {task.body}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <ProjectBadge
                      project={
                        task.projects as unknown as {
                          slug: string;
                          name: string;
                        }
                      }
                    />
                    <StatusBadge status={task.status} />
                    {task.is_manual && (
                      <Badge variant="outline" className="text-xs">
                        manual
                      </Badge>
                    )}
                    {task.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                    <TimeAgo date={task.created_at} />
                    {task.due_date && (
                      <span className="text-xs text-muted-foreground">
                        Due:{" "}
                        {new Date(task.due_date).toLocaleDateString("en-GB")}
                      </span>
                    )}
                  </div>
                </div>
                <PriorityBadge priority={task.priority} />
              </div>
            </CardContent>
          </Card>
        ))}
        {tasks.length === 0 && (
          <p className="text-sm text-muted-foreground">No tasks found</p>
        )}
      </div>
    </div>
  );
}
