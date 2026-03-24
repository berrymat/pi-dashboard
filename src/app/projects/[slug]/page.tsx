import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/status-badge";
import { PriorityBadge } from "@/components/priority-badge";
import { TimeAgo } from "@/components/time-ago";
import { getProject } from "@/lib/queries/projects";
import { getTasks } from "@/lib/queries/tasks";
import { getIdeas } from "@/lib/queries/ideas";
import { getDecisions } from "@/lib/queries/decisions";
import { getActivity } from "@/lib/queries/activity";
import { notFound } from "next/navigation";
import { ExternalLink, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const [tasks, ideas, decisions, activity] = await Promise.all([
    getTasks({ projectSlug: slug, includeDone: true }),
    getIdeas({ projectSlug: slug }),
    getDecisions({ projectSlug: slug }),
    getActivity({ projectSlug: slug, limit: 20 }),
  ]);

  const pendingTasks = tasks.filter(
    (t) => t.status === "pending" || t.status === "in_progress"
  );
  const doneTasks = tasks.filter((t) => t.status === "done");

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/projects"
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-2 transition-colors"
        >
          <ArrowLeft className="h-3 w-3" /> Projects
        </Link>
        <h1 className="font-heading text-3xl font-bold tracking-tight">{project.name}</h1>
        <p className="text-muted-foreground mt-1 font-mono text-sm">{project.slug}</p>
        {project.description && (
          <p className="text-muted-foreground mt-2">{project.description}</p>
        )}
        <div className="flex flex-wrap gap-2 mt-3">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
          {project.repo_url && (
            <a
              href={project.repo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
            >
              <ExternalLink className="h-3 w-3" /> Repository
            </a>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-heading">
              Tasks ({pendingTasks.length} open, {doneTasks.length} done)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start justify-between gap-2"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <StatusBadge status={task.status} />
                      {task.is_manual && (
                        <Badge variant="outline" className="text-xs">
                          manual
                        </Badge>
                      )}
                    </div>
                  </div>
                  <PriorityBadge priority={task.priority} />
                </div>
              ))}
              {pendingTasks.length === 0 && (
                <p className="text-sm text-muted-foreground">No open tasks</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Ideas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-heading">Ideas ({ideas.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ideas.slice(0, 10).map((idea) => (
                <div
                  key={idea.id}
                  className="flex items-start justify-between gap-2"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{idea.title}</p>
                    <StatusBadge status={idea.status} />
                  </div>
                  <PriorityBadge priority={idea.priority} />
                </div>
              ))}
              {ideas.length === 0 && (
                <p className="text-sm text-muted-foreground">No ideas</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Decisions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-heading">
              Decisions ({decisions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {decisions.map((decision) => (
                <div key={decision.id}>
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium">{decision.title}</p>
                    <StatusBadge status={decision.decision_type} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {decision.description}
                  </p>
                  {decision.revisit_when && (
                    <p className="text-xs text-amber-600 mt-1">
                      Revisit: {decision.revisit_when}
                    </p>
                  )}
                </div>
              ))}
              {decisions.length === 0 && (
                <p className="text-sm text-muted-foreground">No decisions</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-heading">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activity.slice(0, 10).map((entry) => (
                <div key={entry.id} className="flex items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm">{entry.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {entry.activity_type.replace(/_/g, " ")}
                      </Badge>
                      <TimeAgo date={entry.created_at} />
                    </div>
                  </div>
                </div>
              ))}
              {activity.length === 0 && (
                <p className="text-sm text-muted-foreground">No activity</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
