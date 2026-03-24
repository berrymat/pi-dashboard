import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/status-badge";
import { PriorityBadge } from "@/components/priority-badge";
import { ProjectBadge } from "@/components/project-badge";
import { TimeAgo } from "@/components/time-ago";
import { getIdeas } from "@/lib/queries/ideas";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function IdeasPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; project?: string }>;
}) {
  const params = await searchParams;
  const ideas = await getIdeas({
    status: params.status,
    projectSlug: params.project,
  });

  const statuses = ["inbox", "triaged", "in_progress", "done", "archived"];
  const currentStatus = params.status;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight">Ideas</h1>
        <p className="text-muted-foreground mt-1">{ideas.length} ideas</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        <Link href="/ideas">
          <Badge
            variant={!currentStatus ? "default" : "outline"}
            className="cursor-pointer"
          >
            All
          </Badge>
        </Link>
        {statuses.map((status) => (
          <Link key={status} href={`/ideas?status=${status}`}>
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
        {ideas.map((idea) => (
          <Card key={idea.id}>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{idea.title}</p>
                  {idea.body && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-3">
                      {idea.body}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <ProjectBadge
                      project={
                        idea.projects as unknown as {
                          slug: string;
                          name: string;
                        }
                      }
                    />
                    <StatusBadge status={idea.status} />
                    {idea.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                    <TimeAgo date={idea.created_at} />
                  </div>
                </div>
                <PriorityBadge priority={idea.priority} />
              </div>
            </CardContent>
          </Card>
        ))}
        {ideas.length === 0 && (
          <p className="text-sm text-muted-foreground">No ideas found</p>
        )}
      </div>
    </div>
  );
}
