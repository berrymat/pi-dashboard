import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/status-badge";
import { PriorityBadge } from "@/components/priority-badge";
import { ProjectBadge } from "@/components/project-badge";
import { TimeAgo } from "@/components/time-ago";
import { getBriefing } from "@/lib/queries/briefing";
import {
  CheckSquare,
  Lightbulb,
  GitBranch,
  FolderKanban,
  Activity,
  AlertCircle,
  Hammer,
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const briefing = await getBriefing();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Cross-project intelligence overview
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatsCard
          icon={Hammer}
          label="Work in Progress"
          value={briefing.stats.inProgressWork}
          href="/work"
          accent={briefing.stats.inProgressWork > 0}
        />
        <StatsCard
          icon={FolderKanban}
          label="Projects"
          value={briefing.stats.totalProjects}
          href="/projects"
        />
        <StatsCard
          icon={CheckSquare}
          label="Pending Tasks"
          value={briefing.stats.pendingTasks}
          href="/tasks"
          accent={briefing.stats.pendingTasks > 0}
        />
        <StatsCard
          icon={AlertCircle}
          label="In Progress"
          value={briefing.stats.inProgressTasks}
          href="/tasks?status=in_progress"
          accent={briefing.stats.inProgressTasks > 0}
        />
        <StatsCard
          icon={Lightbulb}
          label="Ideas (Inbox)"
          value={briefing.stats.inboxIdeas}
          href="/ideas"
        />
        <StatsCard
          icon={GitBranch}
          label="Active Decisions"
          value={briefing.stats.activeDecisions}
          href="/decisions"
        />
      </div>

      {/* In-Progress Work */}
      {briefing.inProgressWork.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-heading">In-Progress Work</CardTitle>
              <Link
                href="/work"
                className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
              >
                View all
              </Link>
            </div>
            <CardDescription>Uncommitted work across machines</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {(() => {
                const byMachine = new Map<string, typeof briefing.inProgressWork>();
                for (const item of briefing.inProgressWork) {
                  if (!byMachine.has(item.machine)) byMachine.set(item.machine, []);
                  byMachine.get(item.machine)!.push(item);
                }
                const machineAccent: Record<string, string> = {
                  air: "border-l-primary",
                  imac: "border-l-amber-500",
                };
                return Array.from(byMachine.entries()).map(([machine, items]) => (
                  <div key={machine} className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{machine}</p>
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className={`border-l-2 ${machineAccent[machine] ?? "border-l-muted-foreground"} pl-3 py-1`}
                      >
                        <p className="text-sm font-medium">{item.summary.split("\n")[0]}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <ProjectBadge
                            project={
                              item.projects as unknown as {
                                slug: string;
                                name: string;
                              }
                            }
                          />
                          <TimeAgo date={item.updated_at} />
                        </div>
                      </div>
                    ))}
                  </div>
                ));
              })()}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Pending Tasks */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-heading">Pending Tasks</CardTitle>
              <Link
                href="/tasks"
                className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
              >
                View all
              </Link>
            </div>
            <CardDescription>Tasks needing attention</CardDescription>
          </CardHeader>
          <CardContent>
            {briefing.pendingTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No pending tasks</p>
            ) : (
              <div className="space-y-3">
                {briefing.pendingTasks.slice(0, 8).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start justify-between gap-2"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <ProjectBadge
                          project={
                            task.projects as unknown as {
                              slug: string;
                              name: string;
                            }
                          }
                        />
                        <StatusBadge status={task.status} />
                      </div>
                    </div>
                    <PriorityBadge priority={task.priority} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Inbox Ideas */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-heading">Ideas Inbox</CardTitle>
              <Link
                href="/ideas"
                className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
              >
                View all
              </Link>
            </div>
            <CardDescription>Ideas waiting to be triaged</CardDescription>
          </CardHeader>
          <CardContent>
            {briefing.inboxIdeas.length === 0 ? (
              <p className="text-sm text-muted-foreground">No ideas in inbox</p>
            ) : (
              <div className="space-y-3">
                {briefing.inboxIdeas.slice(0, 8).map((idea) => (
                  <div
                    key={idea.id}
                    className="flex items-start justify-between gap-2"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">
                        {idea.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <ProjectBadge
                          project={
                            idea.projects as unknown as {
                              slug: string;
                              name: string;
                            }
                          }
                        />
                      </div>
                    </div>
                    <PriorityBadge priority={idea.priority} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-heading">Recent Activity</CardTitle>
              <Link
                href="/activity"
                className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
              >
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {briefing.recentActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent activity</p>
            ) : (
              <div className="space-y-3">
                {briefing.recentActivity.slice(0, 8).map((entry) => (
                  <div key={entry.id} className="flex items-start gap-3">
                    <Activity className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm">{entry.description}</p>
                      <div className="flex items-center gap-2 mt-1">
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
                        <TimeAgo date={entry.created_at} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatsCard({
  icon: Icon,
  label,
  value,
  href,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  href: string;
  accent?: boolean;
}) {
  return (
    <Link href={href}>
      <Card className="hover:shadow-md hover:shadow-primary/5 transition-all duration-200 cursor-pointer">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <Icon
              className={`h-5 w-5 ${accent ? "text-primary" : "text-muted-foreground"}`}
            />
            <div>
              <p
                className={`text-2xl font-bold font-heading ${accent ? "text-primary" : ""}`}
              >
                {value}
              </p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
