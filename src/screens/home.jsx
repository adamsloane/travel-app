import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="text-2xl font-semibold">Travel App V0</h1>
        <p className="text-sm text-neutral-600">
          Local build — just for you.
        </p>

        <Link
          to="/itinerary"
          className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          View Shared Itinerary
        </Link>
      </div>
    </div>
  );
}
