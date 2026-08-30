import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/status-badge";
import { ProjectBadge } from "@/components/project-badge";
import { TimeAgo } from "@/components/time-ago";
import { getGuidanceByPattern, getPatterns } from "@/lib/queries/patterns";
import Link from "next/link";

export const dynamic = "force-dynamic";

const ruleTypeLabels: Record<string, string> = {
  failure_mode: "Failure mode",
  strategy: "Strategy",
  convention: "Convention",
  architecture: "Architecture",
  process: "Process",
  sync_required: "Sync required",
};

export default async function PatternsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; project?: string }>;
}) {
  const params = await searchParams;
  const patterns = await getPatterns({
    status: params.status,
    projectSlug: params.project,
  });
  const guidanceByPattern = await getGuidanceByPattern(
    patterns.map((p) => p.id)
  );

  const statuses = ["candidate", "active", "compiled", "retired"];
  const currentStatus = params.status;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          Patterns
        </h1>
        <p className="text-muted-foreground mt-1">
          {patterns.length} consolidated patterns — recurring failure modes and
          strategies distilled from experience
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        <Link href="/patterns">
          <Badge
            variant={!currentStatus ? "default" : "outline"}
            className="cursor-pointer"
          >
            Current
          </Badge>
        </Link>
        {statuses.map((status) => (
          <Link key={status} href={`/patterns?status=${status}`}>
            <Badge
              variant={currentStatus === status ? "default" : "outline"}
              className="cursor-pointer"
            >
              {status}
            </Badge>
          </Link>
        ))}
      </div>

      <div className="space-y-3">
        {patterns.map((pattern) => {
          const evidence = pattern.evidence ?? [];
          const confirms = evidence.filter(
            (e) => e.direction === "confirms"
          ).length;
          const contradicts = evidence.length - confirms;
          const guidance = guidanceByPattern[pattern.id] ?? [];

          return (
            <Card key={pattern.id}>
              <CardContent className="pt-4 pb-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium font-mono text-sm">
                      {pattern.name}
                    </p>
                    <StatusBadge status={pattern.status} />
                    <Badge variant="secondary" className="text-xs">
                      {ruleTypeLabels[pattern.rule_type] ?? pattern.rule_type}
                    </Badge>
                    <ProjectBadge
                      project={
                        pattern.projects as unknown as {
                          slug: string;
                          name: string;
                        } | null
                      }
                    />
                  </div>

                  <p className="text-sm">{pattern.description}</p>

                  {pattern.root_cause && (
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Root cause:</span>{" "}
                      {pattern.root_cause}
                    </p>
                  )}
                  {pattern.recommendation && (
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Fix:</span>{" "}
                      {pattern.recommendation}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <Badge variant="outline" className="text-xs">
                      ×{pattern.occurrence_count}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Last seen <TimeAgo date={pattern.last_seen_at} />
                    </span>
                    {pattern.source === "consolidator" && (
                      <Badge
                        variant="secondary"
                        className="text-xs text-muted-foreground"
                      >
                        consolidator
                      </Badge>
                    )}
                  </div>

                  {evidence.length > 0 && (
                    <details className="pt-1">
                      <summary className="text-xs text-muted-foreground cursor-pointer select-none">
                        Evidence ({confirms} confirms
                        {contradicts > 0 ? `, ${contradicts} contradicts` : ""})
                      </summary>
                      <ul className="mt-2 space-y-1.5 border-l-2 border-muted pl-3">
                        {evidence.map((e, i) => (
                          <li key={i} className="text-xs text-muted-foreground">
                            <span
                              className={
                                e.direction === "confirms"
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : "text-rose-600 dark:text-rose-400"
                              }
                            >
                              {e.direction === "confirms" ? "+" : "−"}
                            </span>{" "}
                            {e.note}{" "}
                            <span className="opacity-60">
                              ({e.ref_type}, {e.at.slice(0, 10)})
                            </span>
                          </li>
                        ))}
                      </ul>
                    </details>
                  )}

                  {guidance.length > 0 && (
                    <details className="pt-1">
                      <summary className="text-xs text-muted-foreground cursor-pointer select-none">
                        Guidance history ({guidance.length})
                      </summary>
                      <ul className="mt-2 space-y-1.5 border-l-2 border-muted pl-3">
                        {guidance.map((g) => (
                          <li key={g.id} className="text-xs text-muted-foreground">
                            <StatusBadge status={g.outcome} />{" "}
                            <span className="font-medium">{g.target}</span>:{" "}
                            {g.proposal}
                            {g.rationale && (
                              <span className="opacity-60"> — {g.rationale}</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </details>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
        {patterns.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No patterns found — the consolidation agent creates these from
            activity history
          </p>
        )}
      </div>
    </div>
  );
}
