import {
  ArrowUpRight,
  Bot,
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";

type Activity = {
  id: string;
  agentType: string;
  action: string;
  reason?: string | null;
  amount?: number | null;
  status: string;
  approvedBy?: string | null;
  createdAt: string;
};

export default function AgentActivity({
  activity,
}: {
  activity: Activity[];
}) {
  return (
    <section className="rounded-2xl border border-[#e9e1d7] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.025)]">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-[#ad6945]" />

            <h2 className="font-semibold">
              AI Agent Activity
            </h2>
          </div>

          <p className="mt-1 text-xs text-neutral-400">
            What Raze agents are doing
          </p>
        </div>

        <button className="flex items-center gap-1 text-xs font-medium text-[#9c5e3b]">
          View all
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="mt-5">
        {activity.length === 0 ? (
          <div className="flex h-52 items-center justify-center text-sm text-neutral-400">
            No agent activity yet.
          </div>
        ) : (
          activity.slice(0, 7).map((item) => (
            <div
              key={item.id}
              className="flex gap-3 border-b border-[#f1ece6] py-3.5 last:border-0"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f7eee7]">
                <Bot className="h-4 w-4 text-[#ad6945]" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="truncate text-sm font-medium">
                      {formatAction(
                        item.action
                      )}
                    </p>

                    <p className="mt-0.5 text-[11px] text-neutral-400">
                      {item.agentType} Agent
                    </p>
                  </div>

                  <ActivityStatus
                    status={item.status}
                  />
                </div>

                {item.reason && (
                  <p className="mt-1 line-clamp-1 text-[11px] text-neutral-400">
                    {item.reason}
                  </p>
                )}

                <p className="mt-1 text-[10px] text-neutral-300">
                  {formatDate(
                    item.createdAt
                  )}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

function ActivityStatus({
  status,
}: {
  status: string;
}) {
  if (status === "COMPLETED") {
    return (
      <CheckCircle2 className="h-4 w-4 text-green-500" />
    );
  }

  if (status === "FAILED") {
    return (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  }

  if (
    status === "PROPOSED" ||
    status === "APPROVED"
  ) {
    return (
      <Clock3 className="h-4 w-4 text-amber-500" />
    );
  }

  return (
    <span className="h-2 w-2 rounded-full bg-neutral-300" />
  );
}

function formatAction(action: string) {
  return action
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(
      /\b\w/g,
      (char) => char.toUpperCase()
    );
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}