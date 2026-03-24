import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/status-badge";
import { ProjectBadge } from "@/components/project-badge";
import { TimeAgo } from "@/components/time-ago";
import { getWorkItems } from "@/lib/queries/work-items";
import { GitBranch } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function WorkPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; machine?: string }>;
}) {
  const params = await searchParams;

  const items = await getWorkItems({
    status: params.status,
    machine: params.machine,
    includeComplete: params.status === "complete",
  });

  const statuses = ["in_progress", "committed", "complete"];
  const currentStatus = params.status;

  // Group by machine
  const byMachine = new Map<string, typeof items>();
  for (const item of items) {
    if (!byMachine.has(item.machine)) byMachine.set(item.machine, []);
    byMachine.get(item.machine)!.push(item);
  }

  // Machine display config
  const machineConfig: Record<string, { label: string; accent: string }> = {
    air: { label: "MacBook Air", accent: "border-l-primary" },
    imac: { label: "iMac", accent: "border-l-amber-500" },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight">Work</h1>
        <p className="text-muted-foreground mt-1">
          In-progress and recent work across machines
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        <Link href="/work">
          <Badge
            variant={!currentStatus ? "default" : "outline"}
            className="cursor-pointer"
          >
            Active
          </Badge>
        </Link>
        {statuses.map((status) => (
          <Link key={status} href={`/work?status=${status}`}>
            <Badge
              variant={currentStatus === status ? "default" : "outline"}
              className="cursor-pointer"
            >
              {status.replace(/_/g, " ")}
            </Badge>
          </Link>
        ))}
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No work items found</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {Array.from(byMachine.entries()).map(([machine, machineItems]) => {
            const config = machineConfig[machine] ?? {
              label: machine,
              accent: "border-l-muted-foreground",
            };
            return (
              <div key={machine} className="space-y-3">
                <h2 className="font-heading text-lg font-semibold">
                  {config.label}
                  <span className="text-muted-foreground font-normal text-sm ml-2">
                    {machine}
                  </span>
                </h2>
                {machineItems.map((item) => (
                  <Card
                    key={item.id}
                    className={`border-l-4 ${config.accent}`}
                  >
                    <CardContent className="pt-4 pb-4">
                      <div className="space-y-2">
                        <p className="font-medium text-sm whitespace-pre-line">
                          {item.summary}
                        </p>
                        {item.body && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {item.body}
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-2">
                          <ProjectBadge
                            project={
                              item.projects as unknown as {
                                slug: string;
                                name: string;
                              }
                            }
                          />
                          <StatusBadge status={item.status} />
                          {item.branch && (
                            <Badge
                              variant="outline"
                              className="text-xs font-mono gap-1"
                            >
                              <GitBranch className="h-3 w-3" />
                              {item.branch}
                            </Badge>
                          )}
                          {item.commit_hash && (
                            <Badge
                              variant="secondary"
                              className="text-xs font-mono"
                            >
                              {item.commit_hash.slice(0, 7)}
                            </Badge>
                          )}
                          <TimeAgo date={item.updated_at} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
