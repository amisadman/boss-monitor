import Header from "./components/Header";
import OfficeMap from "./components/OfficeDevices";
import type { Device, UsageResponse } from "./types";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useDeviceSocket } from "./useDeviceSocket";
import { useAlertSocket } from "./useAlertSocket";
import AlertsPanel from "./components/AlertsPanel";
import { ChartLineIcon, GaugeIcon } from "@phosphor-icons/react";
import UsageGraph from "./components/UsageGraph";

export default function App() {
  useDeviceSocket();
  useAlertSocket();

  // States
  const [tab, setTab] = useState<"meter" | "graph">("meter");

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
      DrawingRoom: [],
      WorkRoom1: [],
      WorkRoom2: [],
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

      <main className="w-full bg-base-100">
        <div className="relative w-full flex max-w-7xl mx-auto">
          {/* LEFT - Floorplan  */}
          <section className="w-2/3 flex justify-center relative overflow-hidden">
            {devicesLoading ? (
              <div className="text-xl">Loading floor plan...</div>
            ) : devicesError ? (
              <div className="text-red-500">Error loading devices</div>
            ) : (
              <div className="w-full">
                <OfficeMap devices={devices} />

                <div className="text-xs text-success flex items-center gap-2 bg-background rounded-sm px-2 py-1.5 absolute top-1.5 right-1.5 font-medium shadow-xs">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  {totalDevicesOn} devices ON
                </div>
              </div>
            )}
          </section>

          {/* RIGHT - Sidebar (absolutely positioned; height locked to map's height) */}
          <section className="absolute top-0 right-0 h-full w-1/3 flex flex-col overflow-hidden bg-base-300/20">
            <div className="w-full flex p-1 gap-1">
              <button
                onClick={() => setTab("meter")}
                className={`btn btn-sm px-8 ${tab === "meter" ? "btn-primary" : ""}`}
              >
                <GaugeIcon weight="regular" size={16} /> Meter
              </button>
              <button
                onClick={() => setTab("graph")}
                className={`btn btn-sm px-8 ${tab === "graph" ? "btn-primary" : ""}`}
              >
                <ChartLineIcon weight="regular" size={16} /> Graph
              </button>
            </div>

            {/* Power Meter */}
            {tab === "meter" ? (
              <div className="p-5 pt-2 pb-1 overflow-y-auto">
                <h3 className="text-lg font-semibold flex items-center gap-3">
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
                    <div className="flex justify-between gap-3 border border-slate-200 bg-base-100">
                      {(["DrawingRoom", "WorkRoom1", "WorkRoom2"] as const).map(
                        (room, index) => (
                          <div
                            key={room}
                            className={`flex flex-col-reverse items-center text-sm p-3 ${index === 1 ? "border-x" : "border-none"} border-slate-200 flex-1`}
                          >
                            <span className="capitalize">
                              {room === "DrawingRoom"
                                ? "Drawing Room"
                                : room === "WorkRoom1"
                                  ? "Work 1"
                                  : "Work 2"}
                            </span>
                            <span className="font-mono font-semibold text-primary text-xl">
                              {usage.perRoomWatts[room] || 0}W
                            </span>
                          </div>
                        ),
                      )}
                    </div>

                    {/* Estimated Today */}
                    <div className="flex justify-between text-sm p-3 border border-slate-200 bg-base-100">
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
            ) : (
              <UsageGraph />
            )}

            {/* Live Alerts List — takes remaining space, scrolls independently */}
            <div className="p-5 flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
              <h3 className="text-lg font-semibold flex items-center gap-3 mb-3">
                Alerts
              </h3>
              <AlertsPanel />
            </div>
          </section>
        </div>

        {/* Bottom */}
        <div className="bg-base-200 p-5">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-lg font-semibold block mb-3">Device Status</h2>

            <div className="flex flex-row gap-5">
              <div className="w-full p-3 rounded-sm bg-accent/10 border border-accent/30">
                <h4 className="text-sm font-medium pb-1.5 mb-1.5 border-b border-slate-300 text-primary text-center">
                  Drawing
                </h4>
                <div className="space-y-1 text-sm font-mono font-semibold">
                  {devicesByRoom["DrawingRoom"].map((d) => (
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
                  {devicesByRoom["WorkRoom1"].map((d) => (
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
                  {devicesByRoom["WorkRoom2"].map((d) => (
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
        </div>
      </main>
    </>
  );
}
