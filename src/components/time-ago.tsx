"use client";

export function TimeAgo({ date }: { date: string }) {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  let text: string;
  if (diffMins < 1) text = "just now";
  else if (diffMins < 60) text = `${diffMins}m ago`;
  else if (diffHours < 24) text = `${diffHours}h ago`;
  else if (diffDays < 7) text = `${diffDays}d ago`;
  else
    text = d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: diffDays > 365 ? "numeric" : undefined,
    });

  return (
    <time
      dateTime={date}
      title={d.toLocaleString()}
      className="text-sm text-gray-500"
    >
      {text}
    </time>
  );
}
