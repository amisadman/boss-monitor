import { useState } from "react";
import type { Device } from "../types";
import officeMapCircuit from "/electriclayout.png";
import officeMapSvg from "/OfficeMap.svg";
import { CircuitryIcon, PaintBrushBroadIcon } from "@phosphor-icons/react";
// import officeMapSvg from "/OfficeMapAutocad.jpg";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type DeviceType = "light" | "fan";
export type DeviceStatus = "on" | "off";

interface Position {
  x: number;
  y: number;
}

// interface RoomBounds {
//   x: number;
//   y: number;
//   width: number;
//   height: number;
// }

// ---------------------------------------------------------------------------
// Shared coordinate system (native units from the exported SVG)
// ---------------------------------------------------------------------------
const SVG_WIDTH = 1560;
const SVG_HEIGHT = 1000;

// Room bounding boxes (for reference / future use, e.g. hit-testing, labels)
// const ROOMS: Record<string, RoomBounds> = {
//   drawing: { x: 35, y: 36, width: 476, height: 653 },
//   work1: { x: 542, y: 36, width: 476, height: 653 },
//   work2: { x: 1049, y: 36, width: 476, height: 653 },
// };

// Hand-placed device positions (in native SVG units) chosen to sit in open
// ceiling space around the desk/table clusters in each room. Tweak the x/y
// values here to line them up exactly how you want against your furniture.
const POSITIONS: Record<string, Position> = {
  // Drawing room (table/cabinet cluster sits around x168-378, y241-484)
  "drawing-light-1": { x: 130, y: 120 },
  "drawing-light-2": { x: 425, y: 350 },
  "drawing-light-3": { x: 130, y: 600 },
  "drawing-fan-1": { x: 255, y: 170 },
  "drawing-fan-2": { x: 255, y: 550 },

  // Work1 (desk clusters around x570-950, y150-550)
  "work1-light-1": { x: 620, y: 105 },
  "work1-light-2": { x: 940, y: 105 },
  "work1-light-3": { x: 780, y: 600 },
  "work1-fan-1": { x: 778, y: 250 },
  "work1-fan-2": { x: 778, y: 470 },

  // Work2 (mirrors work1, shifted right)
  "work2-light-1": { x: 1127, y: 105 },
  "work2-light-2": { x: 1447, y: 105 },
  "work2-light-3": { x: 1287, y: 600 },
  "work2-fan-1": { x: 1300, y: 250 },
  "work2-fan-2": { x: 1300, y: 470 },
};

// ---------------------------------------------------------------------------
// Light component
// ---------------------------------------------------------------------------
interface LightProps {
  isOn: boolean;
  label?: string;
}

export function Light({ isOn, label }: LightProps) {
  return (
    <div
      style={{
        position: "relative",
        width: 36,
        height: 36,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      className="tooltip tooltip-bottom"
      data-tip={label}
    >
      {isOn && (
        <div
          style={{
            position: "absolute",
            width: 70,
            height: 70,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,224,102,0.55) 0%, rgba(255,224,102,0) 70%)",
            animation: "light-glow-pulse 2.2s ease-in-out infinite",
            pointerEvents: "none",
          }}
        />
      )}
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        style={{ position: "relative", zIndex: 1 }}
      >
        <path
          d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.44.9 1.02.9 1.6H14.6c0-.58.3-1.16.9-1.6A6 6 0 0 0 12 3z"
          fill={isOn ? "#FFE066" : "#4a4a4a"}
          stroke={isOn ? "#FFC93C" : "#2b2b2b"}
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Fan component
// ---------------------------------------------------------------------------
interface FanProps {
  isOn: boolean;
  label?: string;
}

export function Fan({ isOn, label }: FanProps) {
  return (
    <div
      style={{
        width: 100,
        height: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      className="tooltip tooltip-bottom"
      data-tip={label}
    >
      <svg
        width="70"
        height="70"
        viewBox="0 0 24 24"
        style={{
          animation: isOn ? "fan-spin 0.9s linear infinite" : "none",
          transformOrigin: "center",
        }}
      >
        <circle cx="12" cy="12" r="1.6" fill={isOn ? "#EAEAEA" : "#666"} />
        {[0, 90, 180, 270].map((deg) => (
          <path
            key={deg}
            d="M12 12 C 12 7, 15 5, 17.5 6.5 C 16.5 9.5, 14.5 11.5, 12 12 Z"
            fill={isOn ? "#D8D8D8" : "#555"}
            stroke={isOn ? "#B8B8B8" : "#3a3a3a"}
            strokeWidth="0.5"
            transform={`rotate(${deg} 12 12)`}
          />
        ))}
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// OfficeMap component
// ---------------------------------------------------------------------------
interface OfficeMapProps {
  devices?: Device[];
}

export default function OfficeMap({ devices = [] }: OfficeMapProps) {
  // States
  const [circuitMode, setCircuitMode] = useState(false);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 1200,
        margin: "0 auto",
        aspectRatio: `${SVG_WIDTH} / ${SVG_HEIGHT}`,
      }}
    >
      <style>{`
        @keyframes fan-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes light-glow-pulse {
          0%, 100% { opacity: 0.55; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.08); }
        }
      `}</style>

      <img
        src={circuitMode ? officeMapCircuit : officeMapSvg}
        alt="Office floor plan"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "block",
        }}
        draggable={false}
      />

      {devices.map((device) => {
        const pos = POSITIONS[device.deviceId];
        if (!pos) return null; // no known slot for this device, skip

        const leftPct = (pos.x / SVG_WIDTH) * 100;
        const topPct = (pos.y / SVG_HEIGHT) * 100;
        const isOn = device.status === "on";

        return (
          <div
            key={device.deviceId}
            style={{
              position: "absolute",
              left: `${leftPct}%`,
              top: `${topPct}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            {device.type === "light" ? (
              <Light isOn={isOn} label={device.label} />
            ) : device.type === "fan" ? (
              <Fan isOn={isOn} label={device.label} />
            ) : null}
          </div>
        );
      })}

      <div className="flex flex-row absolute -top-10 md:top-2 left-1/2 -translate-x-1/2 rounded-sm overflow-hidden shadow-lg">
        <button
          className={`block p-1.5 ${circuitMode ? "bg-cyan-300" : "bg-white"} shadow-lg cursor-pointer`}
          onClick={() => setCircuitMode((prev) => !prev)}
          title="Circuit Mode"
        >
          <CircuitryIcon
            weight="duotone"
            size={24}
            color={!circuitMode ? "#2bdcff" : "#fff"}
          />
        </button>
        <button
          className={`block p-1.5 ${!circuitMode ? "bg-teal-400" : "bg-white"} shadow-lg cursor-pointer`}
          onClick={() => setCircuitMode((prev) => !prev)}
          title="Hide Circuit"
        >
          <PaintBrushBroadIcon
            weight="duotone"
            size={24}
            color={circuitMode ? "#00d5be" : "#fff"}
          />
        </button>
      </div>
    </div>
  );
}
