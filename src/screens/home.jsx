import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="text-2xl font-semibold">Travel App V0</h1>
        <p className="text-sm text-neutral-600">
          Local dev home — quick access to all screens
        </p>

        <div className="space-y-3">
          <Link
            to="/trips"
            className="block rounded-xl border border-neutral-200 bg-white p-4 text-sm font-medium hover:bg-neutral-100"
          >
            Trips List →
          </Link>

          <Link
            to="/trips/japan-2025"
            className="block rounded-xl border border-neutral-200 bg-white p-4 text-sm font-medium hover:bg-neutral-100"
          >
            Trip Detail (Japan) →
          </Link>

          <Link
            to="/trips/japan-2025/itinerary"
            className="block rounded-xl border border-neutral-200 bg-white p-4 text-sm font-medium hover:bg-neutral-100"
          >
            Shared Itinerary →
          </Link>
          
          
          <Link
          to="/add-item"
          className="block rounded-xl border border-neutral-200 bg-white p-4 text-sm font-medium hover:bg-neutral-100"
        >
          Add Item Modal (V2) →
        </Link>
        <Link
          to="/flights"
          className="block rounded-xl border border-neutral-200 bg-white p-4 text-sm font-medium hover:bg-neutral-100"
        >
          Flight Options →
        </Link>
        <Link
          to="/stays"
          className="block rounded-xl border border-neutral-200 bg-white p-4 text-sm font-medium hover:bg-neutral-100"
        >
          Stay Options →
        </Link>
        <Link
            to="/saved"
            className="block rounded-xl border border-neutral-200 bg-white p-4 text-sm font-medium hover:bg-neutral-100"
          >
            Saved Items →
          </Link>
        </div>

        <div className="pt-4 text-xs text-neutral-500">
          This screen is for development only.
        </div>
      </div>
    </div>
  );
}

