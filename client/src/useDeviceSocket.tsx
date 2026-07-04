import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { Device } from "./types";
import { getSocket } from "./socket";

interface DeviceUpdatePayload {
  devices: Device[];
  simulatedTime: string;
  totalWattsNow: number;
  perRoomWatts: Record<string, number>;
  estimatedKwhToday: number;
}

export function useDeviceSocket() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = getSocket();

    const handleUpdate = (payload: DeviceUpdatePayload) => {
      // Update the devices list consumed by your existing useQuery(["devices"])
      queryClient.setQueryData(["devices"], payload.devices);

      // Update the usage summary consumed by your existing useQuery(["usage"])
      queryClient.setQueryData(["usage"], {
        totalWattsNow: payload.totalWattsNow,
        perRoomWatts: payload.perRoomWatts,
        estimatedKwhToday: payload.estimatedKwhToday,
      });
    };

    socket.on("device:update", handleUpdate);

    return () => {
      socket.off("device:update", handleUpdate);
    };
  }, [queryClient]);
}
