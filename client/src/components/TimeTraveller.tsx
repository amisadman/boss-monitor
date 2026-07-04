import { useState } from "react";
import { ClockCountdownIcon, SpinnerGapIcon } from "@phosphor-icons/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const TIME_PRESETS = [
  { label: "6 AM", hour: 6 },
  { label: "8 AM", hour: 8 },
  { label: "12 PM", hour: 12 },
  { label: "4 PM", hour: 16 },
  { label: "9 PM", hour: 21 },
  { label: "3 AM", hour: 3 },
];

export default function TimeTraveller() {
  const queryClient = useQueryClient();
  const [pendingHour, setPendingHour] = useState<number | null>(null);

  const jumpMutation = useMutation({
    mutationFn: async (hour: number) => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/simulator/time`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ hour }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to jump time");
      }

      return data as { success: boolean; simulatedTime: string };
    },
    onMutate: (hour) => {
      setPendingHour(hour);
    },
    onSuccess: () => {
      // Devices/usage/alerts will likely have changed as a result of the
      // jump (simulator re-evaluates on next tick, but refetch now so the
      // UI doesn't wait for the next interval to reflect the new time).
      queryClient.invalidateQueries({ queryKey: ["devices"] });
      queryClient.invalidateQueries({ queryKey: ["usage"] });
      queryClient.invalidateQueries({ queryKey: ["usage-hourly"] });
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
    onSettled: () => {
      setPendingHour(null);
    },
  });

  return (
    <>
      <button
        className="w-fit fixed bottom-3 left-3 rounded-full aspect-square overflow-hidden p-1.5 bg-yellow-400 text-white hover:-rotate-10 cursor-pointer hover:scale-125 transition-all duration-150"
        onClick={() => {
          (
            document.getElementById("time_travel_modal") as HTMLDialogElement
          )?.showModal();
        }}
        title="Time Travel"
      >
        <ClockCountdownIcon weight="fill" size={34} />
      </button>
      <dialog id="time_travel_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Time Travel</h3>
          <p>
            (For simulation purpose only) This changes the simulator&apos;s
            clock time.
          </p>

          <div className="grid grid-cols-3 gap-2 mt-4">
            {TIME_PRESETS.map(({ label, hour }) => {
              const isPending = jumpMutation.isPending && pendingHour === hour;
              return (
                <button
                  key={hour}
                  onClick={() => jumpMutation.mutate(hour)}
                  disabled={jumpMutation.isPending}
                  className="btn btn-outline btn-sm flex items-center justify-center gap-1.5 disabled:opacity-60"
                >
                  {isPending ? (
                    <SpinnerGapIcon size={14} className="animate-spin" />
                  ) : null}
                  {label}
                </button>
              );
            })}
          </div>

          {jumpMutation.isError ? (
            <p className="text-sm text-red-500 mt-3">
              {(jumpMutation.error as Error)?.message || "Something went wrong"}
            </p>
          ) : jumpMutation.isSuccess ? (
            <p className="text-sm text-green-600 mt-3">
              Jumped to{" "}
              {new Date(jumpMutation.data.simulatedTime).toLocaleString(
                "en-US",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZone: "UTC",
                },
              )}
            </p>
          ) : null}

          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
