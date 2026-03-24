import { Badge } from "@/components/ui/badge";
import type { Priority } from "@/lib/types";

const priorityConfig: Record<
  Priority,
  { label: string; className: string }
> = {
  urgent: {
    label: "Urgent",
    className:
      "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800",
  },
  high: {
    label: "High",
    className:
      "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800",
  },
  normal: {
    label: "Normal",
    className:
      "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800",
  },
  low: {
    label: "Low",
    className:
      "bg-stone-100 text-stone-500 border-stone-200 dark:bg-stone-900 dark:text-stone-400 dark:border-stone-700",
  },
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  const config = priorityConfig[priority];
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}
