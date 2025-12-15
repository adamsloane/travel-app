import { Link } from "react-router-dom";
import Nav from "../components/Nav";
import { trips } from "../data/trips";

export default function Trips() {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <Nav />

      <main className="max-w-md mx-auto px-4 py-4 space-y-3">
        <h1 className="text-xl font-semibold">Trips</h1>

        {trips.map((t) => (
          <div key={t.id} className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
            <div className="space-y-1">
              <div className="text-sm font-semibold">{t.name}</div>
              <div className="text-xs text-neutral-600">{t.dates}</div>
              <div className="text-xs text-neutral-500">{t.destination}</div>
            </div>

            <div className="mt-3 flex gap-3">
              <Link to={`/trips/${t.id}`} className="text-sm text-blue-600 hover:underline">
                View details →
              </Link>
              <Link to={`/trips/${t.id}/itinerary`} className="text-sm text-blue-600 hover:underline">
                Itinerary →
              </Link>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
