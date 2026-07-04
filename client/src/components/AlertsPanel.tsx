import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "motion/react";
import type { Alert } from "../types";

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ago`;
}

export default function AlertsPanel() {
  const queryClient = useQueryClient();

  const {
    data: alerts,
    isLoading,
    isError,
  } = useQuery<Alert[]>({
    queryKey: ["alerts"],
    queryFn: async () => {
      const result = await fetch(
        `${import.meta.env.VITE_API_URL}/api/alerts`,
      ).then((res) => res.json());
      return result?.data || [];
    },
  });

  const ackMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await fetch(
        `${import.meta.env.VITE_API_URL}/api/alerts/${id}/ack`,
        { method: "POST" },
      ).then((res) => res.json());
      return result?.data;
    },
    onSuccess: (updatedAlert: Alert) => {
      queryClient.setQueryData<Alert[]>(["alerts"], (old = []) =>
        old.map((a) => (a._id === updatedAlert._id ? updatedAlert : a)),
      );
    },
  });

  const activeAlerts = (alerts || []).filter((a) => !a.resolvedAt);

  if (isLoading)
    return <div className="text-sm text-zinc-400">Loading alerts...</div>;
  if (isError)
    return <div className="text-sm text-red-500">Error loading alerts</div>;

  if (activeAlerts.length === 0) {
    return (
      <div className="text-sm text-zinc-400 block py-5 text-center">
        No active alerts
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <AnimatePresence initial={false}>
        {activeAlerts.map((alert) => (
          <motion.div
            key={alert._id}
            layout
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 24, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
            className="flex items-start justify-between gap-3 rounded-md border border-amber-300/50 bg-amber-50 px-3 py-2"
          >
            <div>
              <p className="text-sm font-medium text-amber-900">
                {alert.message}
              </p>
              <p className="text-xs text-amber-700 mt-0.5">
                {alert.type === "after-hours" ? "After Hours" : "Prolonged On"}
                {" · "}
                {timeAgo(alert.triggeredAt)}
              </p>
            </div>

            <button
              onClick={() => ackMutation.mutate(alert._id)}
              disabled={ackMutation.isPending || alert.notifiedDiscord}
              className="shrink-0 text-xs font-semibold px-2 py-1 rounded-sm bg-amber-200 text-amber-900 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {alert.notifiedDiscord ? "Acked" : "Ack"}
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
