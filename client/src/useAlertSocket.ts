import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getSocket } from "./socket";
import type { Alert } from "./types";

export function useAlertSocket() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = getSocket();

    const handleNewAlert = (alert: Alert) => {
      queryClient.setQueryData<Alert[]>(["alerts"], (old = []) => {
        // Avoid duplicates if the same alert arrives twice (e.g. reconnect)
        const exists = old.some((a) => a._id === alert._id);
        if (exists) return old;
        // Newest first
        return [alert, ...old];
      });
    };

    const handleResolvedAlert = (alert: Alert) => {
      queryClient.setQueryData<Alert[]>(["alerts"], (old = []) =>
        old.map((a) => (a._id === alert._id ? alert : a)),
      );
    };

    socket.on("alert:new", handleNewAlert);
    socket.on("alert:resolved", handleResolvedAlert);

    return () => {
      socket.off("alert:new", handleNewAlert);
      socket.off("alert:resolved", handleResolvedAlert);
    };
  }, [queryClient]);
}
