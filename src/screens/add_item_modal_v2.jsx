import { useMemo, useState } from "react";

// Add Item Modal – Final v2 (Mobile First)
// Purpose: Universal entry point for adding Flights / Accommodations / Activities / People
// Includes: category selection, category-specific fields, confirmed vs considering, optional website link

const CATEGORIES = [
  { key: "flight", label: "Flight", icon: "✈️" },
  { key: "accommodation", label: "Accommodation", icon: "🏨" },
  { key: "activity", label: "Activity", icon: "📍" },
  { key: "person", label: "Person", icon: "👤" },
];

export default function AddItemModalFinalV2() {
  const [open, setOpen] = useState(true);
  const [category, setCategory] = useState("activity");
  const [status, setStatus] = useState("considering"); // considering | confirmed

  // Shared fields
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [link, setLink] = useState("");

  // Flight
  const [flightFrom, setFlightFrom] = useState("");
  const [flightTo, setFlightTo] = useState("");
  const [flightDepart, setFlightDepart] = useState("");
  const [flightArrive, setFlightArrive] = useState("");
  const [flightAirline, setFlightAirline] = useState("");
  const [flightPrice, setFlightPrice] = useState("");
  const [flightStops, setFlightStops] = useState("0");

  // Accommodation
  const [accCity, setAccCity] = useState("");
  const [accCheckIn, setAccCheckIn] = useState("");
  const [accCheckOut, setAccCheckOut] = useState("");
  const [accPriceNight, setAccPriceNight] = useState("");
  const [accBedrooms, setAccBedrooms] = useState("");
  const [accBathrooms, setAccBathrooms] = useState("");

  // Activity
  const [actCity, setActCity] = useState("");
  const [actType, setActType] = useState("restaurant"); // restaurant | activity | sight | other
  const [actEstCost, setActEstCost] = useState("");

  // Person
  const [personName, setPersonName] = useState("");
  const [personRole, setPersonRole] = useState("travelmate"); // travelmate | family | friend | other
  const [personPhone, setPersonPhone] = useState("");

  const primaryLabel = useMemo(() => {
    const c = CATEGORIES.find((c) => c.key === category);
    return c ? `${c.icon} Add ${c.label}` : "Add Item";
  }, [category]);

  const reset = () => {
    setStatus("considering");
    setTitle("");
    setNotes("");
    setLink("");

    setFlightFrom("");
    setFlightTo("");
    setFlightDepart("");
    setFlightArrive("");
    setFlightAirline("");
    setFlightPrice("");
    setFlightStops("0");

    setAccCity("");
    setAccCheckIn("");
    setAccCheckOut("");
    setAccPriceNight("");
    setAccBedrooms("");
    setAccBathrooms("");

    setActCity("");
    setActType("restaurant");
    setActEstCost("");

    setPersonName("");
    setPersonRole("travelmate");
    setPersonPhone("");
  };

  const handleSave = () => {
    // In a real app, you'd validate and persist.
    // For wireframe: console.log payload and close.
    const payload = {
      category,
      status,
      shared: { title, notes, link },
      flight:
        category === "flight"
          ? {
              from: flightFrom,
              to: flightTo,
              depart: flightDepart,
              arrive: flightArrive,
              airline: flightAirline,
              price: flightPrice,
              stops: flightStops,
            }
          : null,
      accommodation:
        category === "accommodation"
          ? {
              city: accCity,
              checkIn: accCheckIn,
              checkOut: accCheckOut,
              priceNight: accPriceNight,
              bedrooms: accBedrooms,
              bathrooms: accBathrooms,
            }
          : null,
      activity:
        category === "activity"
          ? {
              city: actCity,
              type: actType,
              estCost: actEstCost,
            }
          : null,
      person:
        category === "person"
          ? {
              name: personName,
              role: personRole,
              phone: personPhone,
            }
          : null,
    };
    console.log("ADD_ITEM_MODAL_SAVE", payload);
    setOpen(false);
    reset();
  };

  if (!open) {
    return (
      <div className="min-h-screen bg-neutral-50 text-neutral-900 flex items-center justify-center p-6">
        <div className="max-w-sm w-full rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm text-center">
          <p className="text-sm font-semibold">Modal closed</p>
          <p className="text-xs text-neutral-500 mt-1">(This is just a wireframe state.)</p>
          <button
            className="mt-4 rounded-full bg-blue-600 text-white px-4 py-2 text-xs hover:bg-blue-700"
            onClick={() => setOpen(true)}
          >
            Re-open
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30" />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center">
        <div className="w-full max-w-md rounded-3xl bg-white shadow-xl border border-neutral-200 overflow-hidden">
          {/* Header */}
          <div className="px-5 py-4 border-b border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-500">Add to trip</p>
                <h2 className="text-base font-semibold">{primaryLabel}</h2>
              </div>
              <button
                className="h-9 w-9 rounded-full border border-neutral-200 bg-white text-neutral-600"
                onClick={() => {
                  setOpen(false);
                  reset();
                }}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Category chips */}
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {CATEGORIES.map((c) => {
                const active = c.key === category;
                return (
                  <button
                    key={c.key}
                    className={
                      "shrink-0 rounded-full px-3 py-1.5 text-xs border transition " +
                      (active
                        ? "bg-neutral-900 text-white border-neutral-900"
                        : "bg-white text-neutral-700 border-neutral-200")
                    }
                    onClick={() => setCategory(c.key)}
                  >
                    <span className="mr-1">{c.icon}</span>
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Body */}
          <div className="px-5 py-4 space-y-4 max-h-[70vh] overflow-auto">
            {/* Status toggle */}
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-3">
              <p className="text-xs font-semibold text-neutral-700">Status</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button
                  className={
                    "rounded-xl border px-3 py-2 text-xs " +
                    (status === "considering"
                      ? "bg-white border-neutral-900 text-neutral-900"
                      : "bg-white border-neutral-200 text-neutral-500")
                  }
                  onClick={() => setStatus("considering")}
                >
                  Considering
                </button>
                <button
                  className={
                    "rounded-xl border px-3 py-2 text-xs " +
                    (status === "confirmed"
                      ? "bg-white border-neutral-900 text-neutral-900"
                      : "bg-white border-neutral-200 text-neutral-500")
                  }
                  onClick={() => setStatus("confirmed")}
                >
                  Confirmed
                </button>
              </div>
            </div>

            {/* Shared fields */}
            <div className="space-y-2">
              <div>
                <label className="text-xs font-semibold">Title</label>
                <input
                  className="mt-1 w-full rounded-xl border border-neutral-300 p-2 text-sm"
                  placeholder={
                    category === "flight"
                      ? "e.g., ANA 109"
                      : category === "accommodation"
                      ? "e.g., Shibuya Granbell Hotel"
                      : category === "person"
                      ? "e.g., Jake"
                      : "e.g., Sushi Saito"
                  }
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-semibold">Website Link (optional)</label>
                <input
                  className="mt-1 w-full rounded-xl border border-neutral-300 p-2 text-sm"
                  placeholder="https://..."
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-semibold">Notes (optional)</label>
                <textarea
                  className="mt-1 w-full rounded-xl border border-neutral-300 p-2 text-sm min-h-[72px]"
                  placeholder="Anything to remember…"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

            {/* Category-specific blocks */}
            {category === "flight" && (
              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-3 space-y-2">
                <p className="text-xs font-semibold text-blue-700">Flight details</p>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    className="rounded-xl border border-blue-200 bg-white p-2 text-sm"
                    placeholder="From (JFK)"
                    value={flightFrom}
                    onChange={(e) => setFlightFrom(e.target.value)}
                  />
                  <input
                    className="rounded-xl border border-blue-200 bg-white p-2 text-sm"
                    placeholder="To (HND)"
                    value={flightTo}
                    onChange={(e) => setFlightTo(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    className="rounded-xl border border-blue-200 bg-white p-2 text-sm"
                    placeholder="Depart date/time"
                    value={flightDepart}
                    onChange={(e) => setFlightDepart(e.target.value)}
                  />
                  <input
                    className="rounded-xl border border-blue-200 bg-white p-2 text-sm"
                    placeholder="Arrive date/time"
                    value={flightArrive}
                    onChange={(e) => setFlightArrive(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    className="rounded-xl border border-blue-200 bg-white p-2 text-sm col-span-2"
                    placeholder="Airline / Flight #"
                    value={flightAirline}
                    onChange={(e) => setFlightAirline(e.target.value)}
                  />
                  <input
                    className="rounded-xl border border-blue-200 bg-white p-2 text-sm"
                    placeholder="$ Price"
                    value={flightPrice}
                    onChange={(e) => setFlightPrice(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[11px] text-blue-700">Stops</label>
                  <select
                    className="mt-1 w-full rounded-xl border border-blue-200 bg-white p-2 text-sm"
                    value={flightStops}
                    onChange={(e) => setFlightStops(e.target.value)}
                  >
                    <option value="0">Nonstop</option>
                    <option value="1">1 stop</option>
                    <option value="2">2 stops</option>
                    <option value="3">3+ stops</option>
                  </select>
                </div>
              </div>
            )}

            {category === "accommodation" && (
              <div className="rounded-2xl border border-amber-100 bg-amber-50 p-3 space-y-2">
                <p className="text-xs font-semibold text-amber-700">Accommodation details</p>
                <input
                  className="rounded-xl border border-amber-200 bg-white p-2 text-sm"
                  placeholder="City (Tokyo)"
                  value={accCity}
                  onChange={(e) => setAccCity(e.target.value)}
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    className="rounded-xl border border-amber-200 bg-white p-2 text-sm"
                    placeholder="Check-in"
                    value={accCheckIn}
                    onChange={(e) => setAccCheckIn(e.target.value)}
                  />
                  <input
                    className="rounded-xl border border-amber-200 bg-white p-2 text-sm"
                    placeholder="Check-out"
                    value={accCheckOut}
                    onChange={(e) => setAccCheckOut(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    className="rounded-xl border border-amber-200 bg-white p-2 text-sm col-span-1"
                    placeholder="$ / night"
                    value={accPriceNight}
                    onChange={(e) => setAccPriceNight(e.target.value)}
                  />
                  <input
                    className="rounded-xl border border-amber-200 bg-white p-2 text-sm"
                    placeholder="Beds"
                    value={accBedrooms}
                    onChange={(e) => setAccBedrooms(e.target.value)}
                  />
                  <input
                    className="rounded-xl border border-amber-200 bg-white p-2 text-sm"
                    placeholder="Baths"
                    value={accBathrooms}
                    onChange={(e) => setAccBathrooms(e.target.value)}
                  />
                </div>
              </div>
            )}

            {category === "activity" && (
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3 space-y-2">
                <p className="text-xs font-semibold text-emerald-700">Activity details</p>
                <input
                  className="rounded-xl border border-emerald-200 bg-white p-2 text-sm"
                  placeholder="City / neighborhood (Shibuya)"
                  value={actCity}
                  onChange={(e) => setActCity(e.target.value)}
                />
                <div className="grid grid-cols-2 gap-2">
                  <select
                    className="rounded-xl border border-emerald-200 bg-white p-2 text-sm"
                    value={actType}
                    onChange={(e) => setActType(e.target.value)}
                  >
                    <option value="restaurant">Restaurant</option>
                    <option value="activity">Activity</option>
                    <option value="sight">Sight</option>
                    <option value="other">Other</option>
                  </select>
                  <input
                    className="rounded-xl border border-emerald-200 bg-white p-2 text-sm"
                    placeholder="$ est. cost (optional)"
                    value={actEstCost}
                    onChange={(e) => setActEstCost(e.target.value)}
                  />
                </div>
              </div>
            )}

            {category === "person" && (
              <div className="rounded-2xl border border-violet-100 bg-violet-50 p-3 space-y-2">
                <p className="text-xs font-semibold text-violet-700">Person details</p>
                <input
                  className="rounded-xl border border-violet-200 bg-white p-2 text-sm"
                  placeholder="Name"
                  value={personName}
                  onChange={(e) => setPersonName(e.target.value)}
                />
                <div className="grid grid-cols-2 gap-2">
                  <select
                    className="rounded-xl border border-violet-200 bg-white p-2 text-sm"
                    value={personRole}
                    onChange={(e) => setPersonRole(e.target.value)}
                  >
                    <option value="travelmate">Travel mate</option>
                    <option value="family">Family</option>
                    <option value="friend">Friend</option>
                    <option value="other">Other</option>
                  </select>
                  <input
                    className="rounded-xl border border-violet-200 bg-white p-2 text-sm"
                    placeholder="Phone (optional)"
                    value={personPhone}
                    onChange={(e) => setPersonPhone(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* View-only hint */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-3">
              <p className="text-[11px] text-neutral-500">
                Tip: For MVP, you can save the item as “Considering” by default and let the user confirm later.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-neutral-200 bg-white flex gap-2">
            <button
              className="flex-1 rounded-2xl border border-neutral-200 bg-white py-2.5 text-sm text-neutral-700"
              onClick={() => {
                setOpen(false);
                reset();
              }}
            >
              Cancel
            </button>
            <button
              className="flex-1 rounded-2xl bg-blue-600 py-2.5 text-sm text-white hover:bg-blue-700"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
