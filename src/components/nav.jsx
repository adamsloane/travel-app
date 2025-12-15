import { Link } from "react-router-dom";

export default function Nav() {
  return (
    <div className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-neutral-200">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-4">
        <Link to="/" className="text-sm font-medium text-neutral-800 hover:underline">
          Home
        </Link>
        <Link to="/trips" className="text-sm font-medium text-neutral-800 hover:underline">
          Trips
        </Link>
      </div>
    </div>
  );
}
