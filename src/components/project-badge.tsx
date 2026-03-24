import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export function ProjectBadge({
  project,
}: {
  project: { slug: string; name: string } | null | undefined;
}) {
  if (!project) {
    return (
      <Badge variant="outline" className="text-muted-foreground">
        Global
      </Badge>
    );
  }
  return (
    <Link href={`/projects/${project.slug}`}>
      <Badge
        variant="outline"
        className="hover:bg-primary/5 hover:border-primary/30 cursor-pointer transition-colors duration-200"
      >
        {project.slug}
      </Badge>
    </Link>
  );
}
