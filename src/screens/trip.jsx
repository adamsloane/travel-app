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

        <div className="pt-2">
          <Link to={`/trips/${trip.id}/itinerary`} className="inline-flex rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            View itinerary
          </Link>
        </div>

        <Link to="/trips" className="text-sm text-blue-600 hover:underline">
          ← Back to Trips
        </Link>
      </main>
    </div>
  );
}
