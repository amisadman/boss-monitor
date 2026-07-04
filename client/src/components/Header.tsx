import moment from "moment";
import { useState, useEffect, useRef } from "react";
import { ClockIcon } from "@phosphor-icons/react";
import type { UsageResponse } from "../types";
import { getSocket } from "../socket";

// Must match backend .env values so the client-side ticking matches the
// simulator's real advancement rate between server broadcasts.
const CLOCK_SPEED = Number(import.meta.env.VITE_SIMULATOR_CLOCK_SPEED) || 120;

function Header() {
  // Keep the authoritative simulated time in a ref so the ticking interval
  // always reads/writes the latest value without needing to be recreated.
  const simulatedTimeRef = useRef<Date>(new Date());
  const [displayTime, setDisplayTime] = useState<string>("--:--:--");

  // 1. Get the initial simulated time from the usage endpoint on load.
  useEffect(() => {
    const load = async () => {
      const result = await fetch(
        `${import.meta.env.VITE_API_URL}/api/usage`,
      ).then((res) => res.json());
      const data: UsageResponse = result?.data;
      if (data?.simulatedTime) {
        simulatedTimeRef.current = new Date(data.simulatedTime);
        setDisplayTime(moment.utc(simulatedTimeRef.current).format("hh:mma"));
      }
    };
    load();
  }, []);

  // 2. Locally tick the clock forward every real second, advanced by
  //    CLOCK_SPEED simulated seconds, so it moves smoothly between the
  //    backend's actual tick broadcasts (every SIMULATOR_TICK_RATE_MS).
  useEffect(() => {
    const interval = setInterval(() => {
      simulatedTimeRef.current = new Date(
        simulatedTimeRef.current.getTime() + CLOCK_SPEED * 1000,
      );
      setDisplayTime(moment.utc(simulatedTimeRef.current).format("hh:mma"));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 3. Resync to the backend's authoritative time on every broadcast, so
  //    small drift from step 2 never accumulates over a long session.
  useEffect(() => {
    const socket = getSocket();

    const handleUpdate = (payload: { simulatedTime: string }) => {
      if (payload?.simulatedTime) {
        simulatedTimeRef.current = new Date(payload.simulatedTime);
        setDisplayTime(moment.utc(simulatedTimeRef.current).format("hh:mma"));
      }
    };

    socket.on("device:update", handleUpdate);
    return () => {
      socket.off("device:update", handleUpdate);
    };
  }, []);

  return (
    <header className="w-full bg-base-200 sticky top-0 z-50 shadow-sm">
      <div className="w-full max-w-7xl mx-auto px-3 h-20 flex items-center justify-between gap-5">
        <span
          className="flex items-center gap-2 font-bold text-success text-base tooltip tooltip-right"
          data-tip="UI is based on real-time simulated data"
        >
          <span className="w-2 aspect-square block rounded-full bg-green-500 animate-pulse"></span>
          LIVE
        </span>

        <h1 className="text-2xl">
          Office<span className="font-bold text-primary">Monitor</span>
        </h1>

        <div className="flex items-center gap-5">
          <label className="swap swap-rotate">
            {/* this hidden checkbox controls the state */}
            <input type="checkbox" className="theme-controller" value="night" />

            {/* sun icon */}
            <svg
              className="swap-off h-6 w-6 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
            </svg>

            {/* moon icon */}
            <svg
              className="swap-on h-6 w-6 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
            </svg>
          </label>

          <span
            className="flex items-center gap-1 font-medium min-w-25 px-2 py-1.5 bg-secondary/10 border border-secondary/5 rounded-lg tooltip tooltip-bottom"
            data-tip="Simulation time"
          >
            <ClockIcon weight="bold" />
            <span className="-mt-0.5">{displayTime}</span>
          </span>
        </div>
      </div>
    </header>
  );
}

export default Header;
