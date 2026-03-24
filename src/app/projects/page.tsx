import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getProjects } from "@/lib/queries/projects";
import { getTaskCounts } from "@/lib/queries/tasks";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const [projects, taskCounts] = await Promise.all([
    getProjects(),
    getTaskCounts(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight">Projects</h1>
        <p className="text-muted-foreground mt-1">{projects.length} registered projects</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => {
          const counts = taskCounts[project.slug];
          return (
            <Link key={project.id} href={`/projects/${project.slug}`}>
              <Card className="hover:shadow-md hover:shadow-primary/5 transition-all duration-200 cursor-pointer h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-heading">{project.name}</CardTitle>
                  <CardDescription className="text-xs font-mono">
                    {project.slug}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {project.description && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {project.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  {counts && (
                    <div className="flex gap-3 text-xs text-muted-foreground">
                      {counts.pending > 0 && (
                        <span>{counts.pending} pending</span>
                      )}
                      {counts.in_progress > 0 && (
                        <span>{counts.in_progress} in progress</span>
                      )}
                    </div>
                  )}
                  {project.repo_url && (
                    <div className="mt-2">
                      <ExternalLink className="h-3 w-3 inline text-muted-foreground" />
                      <span className="text-xs text-muted-foreground ml-1">
                        GitHub
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
