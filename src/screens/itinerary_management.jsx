import { useMemo, useState } from "react";

// Itinerary Management Screen – Final (Mobile First)
// Purpose: Adjust timing/ordering of itinerary items. Keep line items tight.
// Requirements included: Day 1/Day 2/Day 3 labels (no summaries), tight rows, move within day (up/down),
// move between days (left/right), add event modal with website link field.

const initialDays = [
  {
    id: 1,
    title: "Day 1",
    items: [
      {
        id: "d1-1",
        time: "9:30 AM",
        label: "Arrive at Haneda",
        icon: "✈️",
        link: "",
      },
      {
        id: "d1-2",
        time: "11:00 AM",
        label: "Hotel check-in (Shibuya)",
        icon: "🏨",
        link: "https://example.com/hotel",
      },
      {
        id: "d1-3",
        time: "1:00 PM",
        label: "Lunch at Tsukiji Market",
        icon: "🍣",
        link: "https://example.com/tsukiji",
      },
    ],
  },
  {
    id: 2,
    title: "Day 2",
    items: [
      {
        id: "d2-1",
        time: "10:00 AM",
        label: "Coffee at Blue Bottle",
        icon: "☕",
        link: "",
      },
      {
        id: "d2-2",
        time: "3:00 PM",
        label: "Explore Harajuku",
        icon: "🛍️",
        link: "",
      },
    ],
  },
  {
    id: 3,
    title: "Day 3",
    items: [
      {
        id: "d3-1",
        time: "9:00 AM",
        label: "Bullet train to Osaka",
        icon: "🚅",
        link: "",
      },
    ],
  },
];

const iconChoices = ["📍", "🍽️", "☕", "🗼", "⛩️", "🛍️", "🎟️", "🚶", "🚕", "🚌", "🚅", "✈️", "🏨", "🧳"];

export default function ItineraryManagementScreenFinal() {
  const [days, setDays] = useState(initialDays);
  const [activeDayId, setActiveDayId] = useState(1);

  // Add Event modal
  const [openAdd, setOpenAdd] = useState(false);
  const [newIcon, setNewIcon] = useState("📍");
  const [newTime, setNewTime] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [newLink, setNewLink] = useState("");

  const activeDay = useMemo(
    () => days.find((d) => d.id === activeDayId) || days[0],
    [days, activeDayId]
  );

  const dayIndex = useMemo(
    () => days.findIndex((d) => d.id === activeDayId),
    [days, activeDayId]
  );

  const moveWithinDay = (itemId, dir) => {
    // dir: -1 (up) | +1 (down)
    setDays((prev) => {
      return prev.map((d) => {
        if (d.id !== activeDayId) return d;
        const idx = d.items.findIndex((it) => it.id === itemId);
        if (idx === -1) return d;
        const nextIdx = idx + dir;
        if (nextIdx < 0 || nextIdx >= d.items.length) return d;

        const copy = [...d.items];
        const [moved] = copy.splice(idx, 1);
        copy.splice(nextIdx, 0, moved);
        return { ...d, items: copy };
      });
    });
  };

  const moveBetweenDays = (itemId, dir) => {
    // dir: -1 (to previous day) | +1 (to next day)
    setDays((prev) => {
      const fromIdx = prev.findIndex((d) => d.id === activeDayId);
      const toIdx = fromIdx + dir;
      if (toIdx < 0 || toIdx >= prev.length) return prev;

      const fromDay = prev[fromIdx];
      const toDay = prev[toIdx];

      const item = fromDay.items.find((it) => it.id === itemId);
      if (!item) return prev;

      const newFromItems = fromDay.items.filter((it) => it.id !== itemId);
      const newToItems = [item, ...toDay.items]; // MVP: insert at top of target day

      const next = [...prev];
      next[fromIdx] = { ...fromDay, items: newFromItems };
      next[toIdx] = { ...toDay, items: newToItems };

      // Also switch active day to the destination so user sees it move
      setActiveDayId(prev[toIdx].id);

      return next;
    });
  };

  const openAddModal = () => {
    setNewIcon("📍");
    setNewTime("");
    setNewLabel("");
    setNewLink("");
    setOpenAdd(true);
  };

  const saveNewEvent = () => {
    if (!newLabel.trim()) return;
    const id = `d${activeDayId}-${Date.now()}`;

    setDays((prev) =>
      prev.map((d) => {
        if (d.id !== activeDayId) return d;
        return {
          ...d,
          items: [
            ...d.items,
            {
              id,
              time: newTime.trim() || "",
              label: newLabel.trim(),
              icon: newIcon,
              link: newLink.trim(),
            },
          ],
        };
      })
    );

    setOpenAdd(false);
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 px-4 py-3">
        <h1 className="text-base font-semibold">Itinerary</h1>
        <p className="text-xs text-neutral-500">Reorder and move items across days</p>
      </header>

      {/* Day selector (shorter width) */}
      <div className="px-4 pt-4">
        <div className="flex items-center gap-3">
          <div className="w-28">
            <label className="text-[11px] text-neutral-500">Day</label>
            <select
              className="mt-1 w-full rounded-xl border border-neutral-300 bg-white p-2 text-sm"
              value={activeDayId}
              onChange={(e) => setActiveDayId(Number(e.target.value))}
            >
              {days.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.title}
                </option>
              ))}
            </select>
          </div>

          {/* Spacer to give description more room */}
          <div className="flex-1">
            <div className="rounded-2xl border border-neutral-200 bg-white px-3 py-2">
              <p className="text-[11px] text-neutral-500">Tip</p>
              <p className="text-xs text-neutral-700">
                Use ⬆️⬇️ to reorder within the day, and ◀︎▶︎ to move between days.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tight list */}
      <main className="px-4 py-4 pb-24">
        <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-neutral-200 flex items-center justify-between">
            <p className="text-sm font-semibold">{activeDay.title}</p>
            <button
              className="rounded-full bg-blue-600 text-white px-3 py-1.5 text-xs hover:bg-blue-700"
              onClick={openAddModal}
            >
              + Add event
            </button>
          </div>

          {activeDay.items.length === 0 ? (
            <div className="p-4 text-xs text-neutral-500">No events yet.</div>
          ) : (
            <div className="divide-y divide-neutral-200">
              {activeDay.items.map((it, idx) => {
                const isFirst = idx === 0;
                const isLast = idx === activeDay.items.length - 1;
                const canPrev = dayIndex > 0;
                const canNext = dayIndex < days.length - 1;

                return (
                  <div key={it.id} className="px-4 py-3 flex items-start gap-3">
                    {/* Icon */}
                    <div className="mt-0.5 h-8 w-8 rounded-xl bg-neutral-100 flex items-center justify-center text-base">
                      {it.icon}
                    </div>

                    {/* Tight text */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-neutral-800 truncate">
                        {it.time ? `${it.time} — ` : ""}
                        {it.label}
                      </p>
                      {it.link ? (
                        <a
                          href={it.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-blue-600 underline"
                        >
                          Link
                        </a>
                      ) : (
                        <p className="text-[11px] text-neutral-500">&nbsp;</p>
                      )}
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex gap-1">
                        <button
                          className={
                            "h-8 w-8 rounded-xl border text-xs " +
                            (isFirst
                              ? "border-neutral-200 text-neutral-300 cursor-not-allowed"
                              : "border-neutral-300 text-neutral-700")
                          }
                          disabled={isFirst}
                          onClick={() => moveWithinDay(it.id, -1)}
                          aria-label="Move up"
                        >
                          ⬆️
                        </button>
                        <button
                          className={
                            "h-8 w-8 rounded-xl border text-xs " +
                            (isLast
                              ? "border-neutral-200 text-neutral-300 cursor-not-allowed"
                              : "border-neutral-300 text-neutral-700")
                          }
                          disabled={isLast}
                          onClick={() => moveWithinDay(it.id, 1)}
                          aria-label="Move down"
                        >
                          ⬇️
                        </button>
                      </div>

                      <div className="flex gap-1">
                        <button
                          className={
                            "h-8 w-8 rounded-xl border text-xs " +
                            (!canPrev
                              ? "border-neutral-200 text-neutral-300 cursor-not-allowed"
                              : "border-neutral-300 text-neutral-700")
                          }
                          disabled={!canPrev}
                          onClick={() => moveBetweenDays(it.id, -1)}
                          aria-label="Move to previous day"
                        >
                          ◀︎
                        </button>
                        <button
                          className={
                            "h-8 w-8 rounded-xl border text-xs " +
                            (!canNext
                              ? "border-neutral-200 text-neutral-300 cursor-not-allowed"
                              : "border-neutral-300 text-neutral-700")
                          }
                          disabled={!canNext}
                          onClick={() => moveBetweenDays(it.id, 1)}
                          aria-label="Move to next day"
                        >
                          ▶︎
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Add Event modal */}
      {openAdd && (
        <>
          <div className="fixed inset-0 bg-black/30" onClick={() => setOpenAdd(false)} />
          <div className="fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center">
            <div className="w-full max-w-md rounded-3xl bg-white shadow-xl border border-neutral-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-neutral-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-neutral-500">Add event</p>
                    <h2 className="text-base font-semibold">{activeDay.title}</h2>
                  </div>
                  <button
                    className="h-9 w-9 rounded-full border border-neutral-200 bg-white text-neutral-600"
                    onClick={() => setOpenAdd(false)}
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="px-5 py-4 space-y-3">
                <div>
                  <label className="text-xs font-semibold">Icon</label>
                  <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
                    {iconChoices.map((ic) => (
                      <button
                        key={ic}
                        className={
                          "h-10 w-10 rounded-2xl border flex items-center justify-center text-base shrink-0 " +
                          (newIcon === ic
                            ? "border-neutral-900 bg-neutral-900 text-white"
                            : "border-neutral-200 bg-white text-neutral-700")
                        }
                        onClick={() => setNewIcon(ic)}
                        aria-label={`Choose ${ic}`}
                      >
                        {ic}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-semibold">Time (optional)</label>
                    <input
                      className="mt-1 w-full rounded-xl border border-neutral-300 p-2 text-sm"
                      placeholder="e.g., 7:30 PM"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold">Website link (optional)</label>
                    <input
                      className="mt-1 w-full rounded-xl border border-neutral-300 p-2 text-sm"
                      placeholder="https://..."
                      value={newLink}
                      onChange={(e) => setNewLink(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold">Description</label>
                  <input
                    className="mt-1 w-full rounded-xl border border-neutral-300 p-2 text-sm"
                    placeholder="Keep it tight (short line item)"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                  />
                  <p className="mt-1 text-[11px] text-neutral-500">
                    Tip: Short descriptions keep more on the screen.
                  </p>
                </div>
              </div>

              <div className="px-5 py-4 border-t border-neutral-200 bg-white flex gap-2">
                <button
                  className="flex-1 rounded-2xl border border-neutral-200 bg-white py-2.5 text-sm text-neutral-700"
                  onClick={() => setOpenAdd(false)}
                >
                  Cancel
                </button>
                <button
                  className={
                    "flex-1 rounded-2xl py-2.5 text-sm text-white " +
                    (newLabel.trim()
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-blue-300 cursor-not-allowed")
                  }
                  disabled={!newLabel.trim()}
                  onClick={saveNewEvent}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

