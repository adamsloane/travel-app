// fights

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

// Flight Options Screen – Final (Mobile First)
// Purpose: Compare flights side-by-side (card list) and toggle Departing vs Returning

const flightsData = {
  departing: [
    {
      id: "dep-1",
      price: "$1,120",
      airline: "ANA",
      flightNo: "NH 109",
      stops: "Nonstop",
      route: "JFK → HND",
      depart: "Apr 12 • 10:30 AM",
      arrive: "Apr 13 • 2:15 PM",
    },
    {
      id: "dep-2",
      price: "$980",
      airline: "JAL",
      flightNo: "JL 5",
      stops: "1 stop",
      route: "JFK → HND",
      depart: "Apr 12 • 9:10 AM",
      arrive: "Apr 13 • 4:20 PM",
    },
    {
      id: "dep-3",
      price: "$860",
      airline: "United",
      flightNo: "UA 79",
      stops: "2 stops",
      route: "EWR → NRT",
      depart: "Apr 12 • 7:35 AM",
      arrive: "Apr 13 • 6:05 PM",
    },
  ],
  returning: [
    {
      id: "ret-1",
      price: "$1,090",
      airline: "ANA",
      flightNo: "NH 110",
      stops: "Nonstop",
      route: "KIX → JFK",
      depart: "Apr 18 • 6:45 PM",
      arrive: "Apr 18 • 5:10 PM",
    },
    {
      id: "ret-2",
      price: "$940",
      airline: "JAL",
      flightNo: "JL 6",
      stops: "1 stop",
      route: "ITM → JFK",
      depart: "Apr 18 • 11:20 AM",
      arrive: "Apr 18 • 8:30 PM",
    },
    {
      id: "ret-3",
      price: "$820",
      airline: "Delta",
      flightNo: "DL 276",
      stops: "2 stops",
      route: "KIX → LGA",
      depart: "Apr 18 • 9:05 AM",
      arrive: "Apr 18 • 10:15 PM",
    },
  ],
};

export default function FlightOptionsScreenFinal() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("departing"); // departing | returning
  const [selected, setSelected] = useState(null);

  const flights = useMemo(() => flightsData[tab], [tab]);

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
          <h1 className="text-base font-semibold">Flights</h1>
          <p className="text-xs text-neutral-500">Compare options and pick what works best</p>
        </div>
      </header>

      {/* Toggle */}
      <div className="px-4 pt-4">
        <div className="rounded-2xl border border-neutral-200 bg-white p-2 flex gap-2">
          <button
            className={
              "flex-1 rounded-xl py-2 text-xs font-semibold border transition " +
              (tab === "departing"
                ? "bg-neutral-900 text-white border-neutral-900"
                : "bg-white text-neutral-600 border-neutral-200")
            }
            onClick={() => setTab("departing")}
          >
            Departing
          </button>
          <button
            className={
              "flex-1 rounded-xl py-2 text-xs font-semibold border transition " +
              (tab === "returning"
                ? "bg-neutral-900 text-white border-neutral-900"
                : "bg-white text-neutral-600 border-neutral-200")
            }
            onClick={() => setTab("returning")}
          >
            Returning
          </button>
        </div>
      </div>

      {/* Flight cards */}
      <main className="px-4 py-4 pb-24">
        <div className="grid grid-cols-1 gap-3">
          {flights.map((f) => {
            const isSelected = selected === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setSelected(f.id)}
                className={
                  "text-left rounded-2xl border p-4 bg-white shadow-sm transition " +
                  (isSelected ? "border-blue-500" : "border-neutral-200")
                }
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{f.route}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {f.airline} • {f.flightNo} • {f.stops}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{f.price}</p>
                    <p className="text-[11px] text-neutral-500">per person</p>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-2">
                    <p className="text-[11px] text-neutral-500">Depart</p>
                    <p className="text-xs font-medium text-neutral-800">{f.depart}</p>
                  </div>
                  <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-2">
                    <p className="text-[11px] text-neutral-500">Arrive</p>
                    <p className="text-xs font-medium text-neutral-800">{f.arrive}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </main>

      {/* Bottom action */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 p-3">
        <div className="max-w-md mx-auto flex gap-2">
          <button
            className="flex-1 rounded-2xl border border-neutral-200 bg-white py-2.5 text-sm text-neutral-700"
            onClick={() => setSelected(null)}
          >
            Clear
          </button>
          <button
            className={
              "flex-1 rounded-2xl py-2.5 text-sm text-white " +
              (selected ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-300 cursor-not-allowed")
            }
            disabled={!selected}
            onClick={() => {
              console.log("SELECT_FLIGHT", selected);
              navigate(-1);
            }}
          >
            Select flight
          </button>
        </div>
      </div>
    </div>
  );
}

