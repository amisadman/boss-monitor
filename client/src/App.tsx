import Header from "./components/Header";
import OfficeMap from "./components/OfficeDevices";
import type { Device, UsageResponse } from "./types";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useDeviceSocket } from "./useDeviceSocket";
import { useAlertSocket } from "./useAlertSocket";
import AlertsPanel from "./components/AlertsPanel";
import {
  ChartLineIcon,
  GaugeIcon,
  LightbulbFilamentIcon,
  FanIcon,
  ChalkboardIcon,
  DesktopIcon,
} from "@phosphor-icons/react";
import UsageGraph from "./components/UsageGraph";
import Footer from "./components/Footer";

const ROOM_META: Record<
  "DrawingRoom" | "WorkRoom1" | "WorkRoom2",
  { label: string; icon: typeof ChalkboardIcon }
> = {
  DrawingRoom: { label: "Drawing Room", icon: ChalkboardIcon },
  WorkRoom1: { label: "Work Room 1", icon: DesktopIcon },
  WorkRoom2: { label: "Work Room 2", icon: DesktopIcon },
};

function DeviceRow({ device }: { device: Device }) {
  const isOn = device?.status === "on";
  const Icon = device?.type === "fan" ? FanIcon : LightbulbFilamentIcon;

  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-md px-2.5 py-2 transition-colors ${
        isOn ? "bg-primary/5" : "bg-transparent"
      }`}
    >
      <div className="flex items-center gap-2 min-w-0">
        <span
          className={`flex items-center justify-center w-7 h-7 rounded-full shrink-0 ${
            isOn ? "bg-primary/15 text-primary" : "bg-zinc-200 text-zinc-400"
          }`}
        >
          <Icon
            size={15}
            weight={isOn ? "fill" : "regular"}
            className={isOn && device?.type === "fan" ? "animate-spin" : ""}
            style={
              isOn && device?.type === "fan"
                ? { animationDuration: "1.6s" }
                : undefined
            }
          />
        </span>
        <span className="text-sm font-medium text-zinc-700 truncate">
          {device?.label?.split(" ")?.splice(1)?.join(" ")}
        </span>
      </div>

      <span
        className={`shrink-0 text-[10px] font-bold tracking-wide px-2 py-0.5 rounded-full ${
          isOn ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-400"
        }`}
      >
        {isOn ? "ON" : "OFF"}
      </span>
    </div>
  );
}

function RoomCard({
  roomKey,
  devices,
}: {
  roomKey: keyof typeof ROOM_META;
  devices: Device[];
}) {
  const meta = ROOM_META[roomKey];
  const onCount = devices.filter((d) => d?.status === "on").length;

  return (
    <div className="w-full rounded-lg bg-background border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-slate-100 bg-slate-50/60">
        <div className="flex items-center gap-2">
          <meta.icon size={16} className="text-primary" weight="bold" />
          <h4 className="text-sm font-semibold text-zinc-700">{meta.label}</h4>
        </div>
        <span className="text-[11px] font-mono font-medium text-zinc-400">
          {onCount}/{devices.length} on
        </span>
      </div>

      <div className="p-2 space-y-0.5">
        {devices.map((d) => (
          <DeviceRow key={d.deviceId} device={d} />
        ))}
      </div>
    </div>
  );
}

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

      <main className="w-full bg-base-100 px-2 py-4">
        <div className="relative w-full flex max-w-7xl mx-auto flex-col md:flex-row">
          {/* LEFT - Floorplan  */}
          <section className="md:w-2/3 flex justify-center relative overflow-hidden mb-5 md:mb-0 rounded-md">
            {devicesLoading ? (
              <div className="text-xl">Loading floor plan...</div>
            ) : devicesError ? (
              <div className="text-red-500">Error loading devices</div>
            ) : (
              <div className="w-full">
                <OfficeMap devices={devices} />

                <div className="text-xs text-success flex items-center gap-2 bg-background rounded-sm px-2 py-1.5 absolute top-2 right-2 font-medium shadow-xs">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  {totalDevicesOn} devices ON
                </div>
              </div>
            )}
          </section>

          {/* RIGHT - Sidebar (absolutely positioned; height locked to map's height) */}
          <section className="md:absolute md:top-0 md:right-0 h-full md:w-1/3 flex flex-col overflow-hidden bg-base-300/20 md:p-3 pt-0">
            <div className="w-full flex p-1 pt-0 gap-2">
              <button
                onClick={() => setTab("meter")}
                className={`btn btn-sm md:btn-sm flex-1 px-8 ${tab === "meter" ? "btn-primary" : ""}`}
              >
                <GaugeIcon weight="regular" size={16} /> Meter
              </button>
              <button
                onClick={() => setTab("graph")}
                className={`btn btn-sm md:btn-sm flex-1 px-8 ${tab === "graph" ? "btn-primary" : ""}`}
              >
                <ChartLineIcon weight="regular" size={16} /> Graph
              </button>
            </div>

            {/* Power Meter */}
            {tab === "meter" ? (
              <div className="p-2 pt-2 pb-1 overflow-y-auto">
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
                            <span className="capitalize text-center">
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
            <div className="p-2 flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
              <h3 className="text-lg font-semibold flex items-center gap-3 mb-3">
                Alerts
              </h3>
              <AlertsPanel />
            </div>
          </section>
        </div>

        {/* Bottom - Device Status */}
        <div className="p-2 pt-10">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-lg font-semibold block mb-3">Device Status</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <RoomCard
                roomKey="DrawingRoom"
                devices={devicesByRoom["DrawingRoom"]}
              />
              <RoomCard
                roomKey="WorkRoom1"
                devices={devicesByRoom["WorkRoom1"]}
              />
              <RoomCard
                roomKey="WorkRoom2"
                devices={devicesByRoom["WorkRoom2"]}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
