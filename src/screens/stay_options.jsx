import { useMemo, useState } from "react";

// Accommodation Options Screen – Final (Mobile First)
// Purpose: Compare accommodation options across different cities / legs of a trip

const accommodationData = {
  tokyo: [
    {
      id: "tokyo-1",
      name: "Shibuya Granbell Hotel",
      price: "$220 / night",
      location: "Shibuya",
      beds: 1,
      baths: 1,
      link: "https://example.com/shibuya-granbell",
    },
    {
      id: "tokyo-2",
      name: "Hotel Indigo Shibuya",
      price: "$260 / night",
      location: "Shibuya",
      beds: 1,
      baths: 1,
      link: "https://example.com/hotel-indigo",
    },
  ],
  osaka: [
    {
      id: "osaka-1",
      name: "Cross Hotel Osaka",
      price: "$190 / night",
      location: "Namba",
      beds: 1,
      baths: 1,
      link: "https://example.com/cross-hotel",
    },
    {
      id: "osaka-2",
      name: "Citadines Namba",
      price: "$210 / night",
      location: "Namba",
      beds: 1,
      baths: 1,
      link: "https://example.com/citadines",
    },
  ],
  kyoto: [
    {
      id: "kyoto-1",
      name: "The Thousand Kyoto",
      price: "$240 / night",
      location: "Kyoto Station",
      beds: 1,
      baths: 1,
      link: "https://example.com/thousand-kyoto",
    },
  ],
};

export default function AccommodationOptionsScreenFinal() {
  const [city, setCity] = useState("tokyo");
  const [selected, setSelected] = useState(null);

  const options = useMemo(() => accommodationData[city], [city]);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 px-4 py-3">
        <h1 className="text-base font-semibold">Accommodations</h1>
        <p className="text-xs text-neutral-500">Compare places to stay</p>
      </header>

      {/* City toggle */}
      <div className="px-4 pt-4">
        <div className="flex gap-2 overflow-x-auto">
          {Object.keys(accommodationData).map((c) => (
            <button
              key={c}
              onClick={() => {
                setCity(c);
                setSelected(null);
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

      {/* Accommodation cards */}
      <main className="px-4 py-4 pb-24">
        <div className="grid grid-cols-1 gap-3">
          {options.map((o) => {
            const isSelected = selected === o.id;
            return (
              <button
                key={o.id}
                onClick={() => setSelected(o.id)}
                className={
                  "text-left rounded-2xl border p-4 bg-white shadow-sm transition " +
                  (isSelected ? "border-amber-500" : "border-neutral-200")
                }
              >
                <p className="text-sm font-semibold">{o.name}</p>
                <p className="text-xs text-neutral-500 mt-0.5">{o.location}</p>

                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xs font-medium">{o.price}</p>
                  <a
                    href={o.link}
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs text-blue-600 underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    View link
                  </a>
                </div>

                <div className="mt-3 flex gap-3 text-[11px] text-neutral-500">
                  <span>🛏 {o.beds} bed</span>
                  <span>🛁 {o.baths} bath</span>
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
              (selected ? "bg-amber-600 hover:bg-amber-700" : "bg-amber-300 cursor-not-allowed")
            }
            disabled={!selected}
            onClick={() => console.log("SELECT_ACCOMMODATION", selected)}
          >
            Select accommodation
          </button>
        </div>
      </div>
    </div>
  );
}
