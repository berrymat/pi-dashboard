import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/status-badge";
import { ProjectBadge } from "@/components/project-badge";
import { TimeAgo } from "@/components/time-ago";
import { getDecisions } from "@/lib/queries/decisions";
import { AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DecisionsPage() {
  const decisions = await getDecisions({ activeOnly: true });

  // Group by decision type
  const chose = decisions.filter((d) => d.decision_type === "chose");
  const deferred = decisions.filter((d) => d.decision_type === "deferred");
  const rejected = decisions.filter((d) => d.decision_type === "rejected");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight">Decisions</h1>
        <p className="text-muted-foreground mt-1">
          {decisions.length} active decisions
        </p>
      </div>

      {deferred.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-heading font-semibold flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            Deferred ({deferred.length})
          </h2>
          {deferred.map((d) => (
            <DecisionCard key={d.id} decision={d} />
          ))}
        </div>
      )}

      {chose.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-heading font-semibold">Chose ({chose.length})</h2>
          {chose.map((d) => (
            <DecisionCard key={d.id} decision={d} />
          ))}
        </div>
      )}

      {rejected.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-heading font-semibold">
            Rejected ({rejected.length})
          </h2>
          {rejected.map((d) => (
            <DecisionCard key={d.id} decision={d} />
          ))}
        </div>
      )}

      {decisions.length === 0 && (
        <p className="text-sm text-muted-foreground">No active decisions</p>
      )}
    </div>
  );
}

function DecisionCard({
  decision,
}: {
  decision: {
    id: string;
    title: string;
    description: string;
    decision_type: string;
    revisit_when: string | null;
    tags: string[];
    created_at: string;
    projects?: { slug: string; name: string } | null;
  };
}) {
  return (
    <Card>
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="font-medium">{decision.title}</p>
            <p className="text-sm text-muted-foreground mt-1">{decision.description}</p>
            {decision.revisit_when && (
              <p className="text-sm text-amber-600 mt-2 font-medium">
                Revisit: {decision.revisit_when}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <ProjectBadge
                project={
                  decision.projects as unknown as {
                    slug: string;
                    name: string;
                  }
                }
              />
              <StatusBadge status={decision.decision_type} />
              {decision.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              <TimeAgo date={decision.created_at} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
