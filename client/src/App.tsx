import Header from "./components/Header";
import OfficeMap from "./components/OfficeDevices";
import type { Device, UsageResponse } from "./types";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useDeviceSocket } from "./useDeviceSocket";
import { useAlertSocket } from "./useAlertSocket";
import AlertsPanel from "./components/AlertsPanel";

export default function App() {
  useDeviceSocket();
  useAlertSocket();

  // Devices query
  const {
    data: devicesData,
    isLoading: devicesLoading,
    isError: devicesError,
  } = useQuery({
    queryKey: ["devices"],
    queryFn: async () => {
      const result = await fetch(
        `${import.meta.env.VITE_API_URL}/api/devices`,
      ).then((res) => res.json());
      return result?.data || [];
    },
  });

  // Usage query
  const { data: usage, isLoading: usageLoading } = useQuery<UsageResponse>({
    queryKey: ["usage"],
    queryFn: async () => {
      const result = await fetch(
        `${import.meta.env.VITE_API_URL}/api/usage`,
      ).then((res) => res.json());
      return result?.data || null;
    },
  });

  const devices: Device[] = devicesData || [];

  // Group devices by room
  const devicesByRoom = useMemo(() => {
    const grouped: Record<string, Device[]> = {
      drawing: [],
      work1: [],
      work2: [],
    };
    devices.forEach((device) => {
      if (grouped[device.room]) {
        grouped[device.room].push(device);
      }
    });
    return grouped;
  }, [devices]);

  const totalDevicesOn = devices.filter((d) => d.status === "on").length;

  return (
    <>
      <Header />

      <main className="w-full max-w-7xl mx-auto border-x border-b border-slate-200">
        {/*
          TOP ROW: height is driven entirely by the OfficeMap column, which
          is in normal flow. The sidebar is absolutely positioned inside this
          relative wrapper so its content can NEVER grow the wrapper's height
          — it's stretched to match (h-full) and scrolls internally instead.
        */}
        <div className="relative w-full flex">
          {/* LEFT - Floorplan (defines the row's height) */}
          <section className="w-2/3 flex justify-center relative overflow-hidden">
            {devicesLoading ? (
              <div className="text-xl">Loading floor plan...</div>
            ) : devicesError ? (
              <div className="text-red-500">Error loading devices</div>
            ) : (
              <div className="w-full">
                <OfficeMap devices={devices} />

                <div className="text-sm text-green-500 flex items-center gap-2 bg-white rounded-xl px-3 py-2 absolute top-3 right-3 font-semibold shadow-sm">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  {totalDevicesOn} devices ON
                </div>
              </div>
            )}
          </section>

          {/* RIGHT - Sidebar (absolutely positioned; height locked to map's height) */}
          <section className="absolute top-0 right-0 h-full w-1/3 border-l flex flex-col overflow-hidden">
            {/* Power Meter */}
            <div className="p-5 border-b overflow-y-auto">
              <h3 className="text-xl font-semibold flex items-center gap-3">
                Power Meter
              </h3>

              {usageLoading ? (
                <div>Loading usage...</div>
              ) : usage ? (
                <div className="space-y-3">
                  {/* Watts Now */}
                  <div className="pt-3 text-center">
                    <p className="text-5xl font-bold text-primary font-mono">
                      {usage.totalWattsNow}
                    </p>
                    <p className="text-zinc-400 mt-1">Watts Now</p>
                  </div>

                  {/* Usage Per Room */}
                  <div className="space-y-3 p-3 rounded-sm bg-primary/5">
                    {(["drawing", "work1", "work2"] as const).map((room) => (
                      <div
                        key={room}
                        className="flex justify-between items-center text-sm"
                      >
                        <span className="capitalize">
                          {room === "drawing"
                            ? "Drawing Room"
                            : room === "work1"
                              ? "Work 1"
                              : "Work 2"}
                        </span>
                        <span className="font-mono font-semibold text-primary">
                          {usage.perRoomWatts[room] || 0}W
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Estimated Today */}
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Estimated Today</span>
                    <span className="font-bold text-primary font-mono">
                      {usage.estimatedKwhToday.toFixed(2)} kWh
                    </span>
                  </div>
                </div>
              ) : (
                <div>No usage data</div>
              )}
            </div>

            {/* Live Alerts List — takes remaining space, scrolls independently */}
            <div className="p-5 flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
              <h4 className="font-medium mb-4 text-sm uppercase tracking-widest text-zinc-500">
                Alerts
              </h4>
              <AlertsPanel />
            </div>
          </section>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-200 p-5">
          <h2 className="text-lg font-semibold block mb-3">Device Status</h2>

          <div className="flex flex-row gap-5">
            <div className="w-full p-3 rounded-sm bg-accent/10 border border-accent/30">
              <h4 className="text-sm font-medium pb-1.5 mb-1.5 border-b border-slate-300 text-primary text-center">
                Drawing
              </h4>
              <div className="space-y-1 text-sm font-mono font-semibold">
                {devicesByRoom["drawing"].map((d) => (
                  <div key={d.deviceId}>
                    <span
                      className={`inline-block w-2 rounded-full aspect-square ${d?.status === "on" ? "bg-green-500" : "bg-red-500"}`}
                    ></span>{" "}
                    {d?.label}
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full p-3 rounded-sm bg-accent/10 border border-accent/30">
              <h4 className="text-sm font-medium pb-1.5 mb-1.5 border-b border-slate-300 text-primary text-center">
                Work 1
              </h4>
              <div className="space-y-1 text-sm font-mono font-semibold">
                {devicesByRoom["work1"].map((d) => (
                  <div key={d.deviceId}>
                    <span
                      className={`inline-block w-2 rounded-full aspect-square ${d?.status === "on" ? "bg-green-500" : "bg-red-500"}`}
                    ></span>{" "}
                    {d?.label}
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full p-3 rounded-sm bg-accent/10 border border-accent/30">
              <h4 className="text-sm font-medium pb-1.5 mb-1.5 border-b border-slate-300 text-primary text-center">
                Work 2
              </h4>
              <div className="space-y-1 text-sm font-mono font-semibold">
                {devicesByRoom["work2"].map((d) => (
                  <div key={d.deviceId}>
                    <span
                      className={`inline-block w-2 rounded-full aspect-square ${d?.status === "on" ? "bg-green-500" : "bg-red-500"}`}
                    ></span>{" "}
                    {d?.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
