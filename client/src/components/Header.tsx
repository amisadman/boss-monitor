import moment from "moment";
import { useState, useEffect } from "react";
import { ClockIcon } from "@phosphor-icons/react";

function Header() {
  const [currentTime, setCurrentTime] = useState(moment().format("HH:mm:ss"));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(moment().format("HH:mm:ss"));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full border-b">
      <div className="w-full max-w-7xl mx-auto px-3 h-20 flex items-center justify-between gap-5">
        <span className="flex items-center gap-2 font-bold text-success text-base">
          <span className="w-2 aspect-square block rounded-full bg-green-500 animate-pulse"></span>
          LIVE
        </span>

        <h1 className="text-2xl">
          Office<span className="font-bold text-primary">Monitor</span>
        </h1>

        <span className="flex items-center gap-1 font-medium min-w-22">
          <ClockIcon weight="bold" /> {currentTime}
        </span>
      </div>
    </header>
  );
}

export default Header;
