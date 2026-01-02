import { Link, useParams } from "react-router-dom";
import Nav from "../components/Nav";
import { trips } from "../data/trips";

export default function Trip() {
  const { tripId } = useParams();
  const trip = trips.find((t) => t.id === tripId);

  if (!trip) {
    return (
      <div className="min-h-screen bg-neutral-50 text-neutral-900">
        <Nav />
        <main className="max-w-md mx-auto px-4 py-6 space-y-3">
          <h1 className="text-xl font-semibold">Trip not found</h1>
          <Link to="/trips" className="text-sm text-blue-600 hover:underline">
            ← Back to Trips
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <Nav />
      <main className="max-w-md mx-auto px-4 py-6 space-y-3">
        <h1 className="text-xl font-semibold">{trip.name}</h1>
        <div className="text-sm text-neutral-700">{trip.destination}</div>
        <div className="text-sm text-neutral-500">{trip.dates}</div>

        <div className="pt-2 space-y-2">
          <Link to={`/trips/${trip.id}/itinerary`} className="inline-flex rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            View itinerary
          </Link>
        </div>

        <div className="pt-4 space-y-2">
          <h2 className="text-sm font-semibold text-neutral-700">Manage Trip</h2>
          <div className="grid grid-cols-2 gap-2">
            <Link
              to="/flights"
              className="rounded-xl border border-neutral-200 bg-white p-3 text-sm font-medium hover:bg-neutral-50 text-center"
            >
              ✈️ Flights
            </Link>
            <Link
              to="/stays"
              className="rounded-xl border border-neutral-200 bg-white p-3 text-sm font-medium hover:bg-neutral-50 text-center"
            >
              🏨 Stays
            </Link>
            <Link
              to="/activities"
              className="rounded-xl border border-neutral-200 bg-white p-3 text-sm font-medium hover:bg-neutral-50 text-center"
            >
              📍 Activities
            </Link>
            <Link
              to="/itinerary-management"
              className="rounded-xl border border-neutral-200 bg-white p-3 text-sm font-medium hover:bg-neutral-50 text-center"
            >
              📅 Manage Itinerary
            </Link>
          </div>
          <Link
            to="/add-item"
            className="block rounded-xl border border-neutral-200 bg-white p-3 text-sm font-medium hover:bg-neutral-50 text-center"
          >
            ➕ Add Item
          </Link>
        </div>

        <Link to="/trips" className="text-sm text-blue-600 hover:underline">
          ← Back to Trips
        </Link>
      </main>
    </div>
  );
}
