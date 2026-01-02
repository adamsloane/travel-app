import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

// Activity Options Screen – Final (Mobile First)
// Purpose: View all saved activities/restaurants/places, compare quickly, and add into itinerary.
// MVP: No sort/filter. Each card has a small visual (emoji). "Add to itinerary" is the primary action.

const activityData = {
  tokyo: [
    {
      id: "tokyo-a1",
      emoji: "🍣",
      name: "Tsukiji Outer Market Lunch",
      type: "Restaurant",
      location: "Chuo City",
      blurb: "Great casual seafood stalls — go early.",
      link: "https://example.com/tsukiji",
    },
    {
      id: "tokyo-a2",
      emoji: "🗼",
      name: "Tokyo Tower",
      type: "Sight",
      location: "Minato",
      blurb: "Golden hour views + quick photo stop.",
      link: "https://example.com/tokyo-tower",
    },
    {
      id: "tokyo-a3",
      emoji: "☕",
      name: "Blue Bottle Coffee",
      type: "Cafe",
      location: "Aoyama",
      blurb: "Easy mid-day reset spot.",
      link: "https://example.com/blue-bottle",
    },
  ],
  osaka: [
    {
      id: "osaka-a1",
      emoji: "🍜",
      name: "Ichiran Ramen",
      type: "Restaurant",
      location: "Namba",
      blurb: "Fast, classic ramen — good solo seat setup.",
      link: "https://example.com/ichiran",
    },
    {
      id: "osaka-a2",
      emoji: "🎧",
      name: "Listening Bar (Late Night)",
      type: "Night",
      location: "Shinsaibashi",
      blurb: "Good vibe for a wind-down night cap.",
      link: "https://example.com/listening-bar",
    },
  ],
  kyoto: [
    {
      id: "kyoto-a1",
      emoji: "⛩️",
      name: "Fushimi Inari",
      type: "Sight",
      location: "Fushimi",
      blurb: "Go early to beat crowds. Great walk.",
      link: "https://example.com/fushimi-inari",
    },
    {
      id: "kyoto-a2",
      emoji: "🍵",
      name: "Tea Ceremony Experience",
      type: "Activity",
      location: "Gion",
      blurb: "Book ahead. Nice cultural anchor.",
      link: "https://example.com/tea-ceremony",
    },
  ],
};

export default function ActivityOptionsScreenFinal() {
  const navigate = useNavigate();
  const [city, setCity] = useState("tokyo");
  const [selectedId, setSelectedId] = useState(null);
  const [openAdd, setOpenAdd] = useState(false);

  // Add-to-itinerary mini flow (MVP)
  const [day, setDay] = useState("Day 1");
  const [time, setTime] = useState("");

  const options = useMemo(() => activityData[city], [city]);
  const selected = useMemo(
    () => options.find((o) => o.id === selectedId) || null,
    [options, selectedId]
  );

  const resetAddFlow = () => {
    setOpenAdd(false);
    setDay("Day 1");
    setTime("");
  };

  const handleAddToItinerary = () => {
    if (!selected) return;
    console.log("ADD_TO_ITINERARY", {
      activityId: selected.id,
      name: selected.name,
      day,
      time,
      city,
    });
    resetAddFlow();
    navigate("/itinerary-management");
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 px-4 py-3 relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 top-3 text-sm text-blue-600 hover:underline"
        >
          ← Back
        </button>
        <div className="text-center">
          <h1 className="text-base font-semibold">Activities</h1>
          <p className="text-xs text-neutral-500">
            Saved places you can add to your itinerary
          </p>
        </div>
      </header>

      {/* City toggle */}
      <div className="px-4 pt-4">
        <div className="flex gap-2 overflow-x-auto">
          {Object.keys(activityData).map((c) => (
            <button
              key={c}
              onClick={() => {
                setCity(c);
                setSelectedId(null);
              }}
              className={
                "shrink-0 rounded-full px-4 py-2 text-xs border transition " +
                (city === c
                  ? "bg-neutral-900 text-white border-neutral-900"
                  : "bg-white text-neutral-600 border-neutral-200")
              }
            >
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <main className="px-4 py-4 pb-28">
        <div className="grid grid-cols-1 gap-3">
          {options.map((o) => {
            const isSelected = selectedId === o.id;
            return (
              <button
                key={o.id}
                onClick={() => setSelectedId(o.id)}
                className={
                  "text-left rounded-2xl border p-4 bg-white shadow-sm transition " +
                  (isSelected ? "border-emerald-500" : "border-neutral-200")
                }
              >
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-neutral-100 flex items-center justify-center text-xl">
                    {o.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold">{o.name}</p>
                        <p className="text-[11px] text-neutral-500 mt-0.5">
                          {o.type} • {o.location}
                        </p>
                      </div>
                      <span className="text-[11px] rounded-full border border-neutral-200 px-2 py-0.5 text-neutral-600">
                        Saved
                      </span>
                    </div>
                    <p className="text-xs text-neutral-700 mt-2 line-clamp-2">
                      {o.blurb}
                    </p>
                    <div className="mt-2">
                      <a
                        href={o.link}
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs text-blue-600 underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open link
                      </a>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </main>

      {/* Bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 p-3">
        <div className="max-w-md mx-auto flex gap-2">
          <button
            className="flex-1 rounded-2xl border border-neutral-200 bg-white py-2.5 text-sm text-neutral-700"
            onClick={() => setSelectedId(null)}
          >
            Clear
          </button>
          <button
            className={
              "flex-1 rounded-2xl py-2.5 text-sm text-white " +
              (selectedId
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-emerald-300 cursor-not-allowed")
            }
            disabled={!selectedId}
            onClick={() => setOpenAdd(true)}
          >
            Add to itinerary
          </button>
        </div>
      </div>

      {/* Add-to-itinerary mini modal (MVP) */}
      {openAdd && selected && (
        <>
          <div className="fixed inset-0 bg-black/30" onClick={resetAddFlow} />
          <div className="fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center">
            <div className="w-full max-w-md rounded-3xl bg-white shadow-xl border border-neutral-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-neutral-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-neutral-500">Add to itinerary</p>
                    <h2 className="text-base font-semibold">
                      {selected.emoji} {selected.name}
                    </h2>
                  </div>
                  <button
                    className="h-9 w-9 rounded-full border border-neutral-200 bg-white text-neutral-600"
                    onClick={resetAddFlow}
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="px-5 py-4 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-semibold">Day</label>
                    <select
                      className="mt-1 w-full rounded-xl border border-neutral-300 p-2 text-sm"
                      value={day}
                      onChange={(e) => setDay(e.target.value)}
                    >
                      <option>Day 1</option>
                      <option>Day 2</option>
                      <option>Day 3</option>
                      <option>Day 4</option>
                      <option>Day 5</option>
                      <option>Day 6</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold">Time (optional)</label>
                    <input
                      className="mt-1 w-full rounded-xl border border-neutral-300 p-2 text-sm"
                      placeholder="e.g., 12:30 PM"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-3">
                  <p className="text-[11px] text-neutral-600">
                    MVP note: This screen is the bridge from "saved ideas" to "scheduled itinerary."
                  </p>
                </div>
              </div>

              <div className="px-5 py-4 border-t border-neutral-200 bg-white flex gap-2">
                <button
                  className="flex-1 rounded-2xl border border-neutral-200 bg-white py-2.5 text-sm text-neutral-700"
                  onClick={resetAddFlow}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 rounded-2xl bg-emerald-600 py-2.5 text-sm text-white hover:bg-emerald-700"
                  onClick={handleAddToItinerary}
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

