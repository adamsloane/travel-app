import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./screens/home";
import Trips from "./screens/trips";
import Trip from "./screens/trip";
import SharedItineraryView from "./screens/shared_itinerary";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/trips" element={<Trips />} />
        <Route path="/trips/:tripId" element={<Trip />} />

        {/* For now, reuse your existing itinerary screen */}
        <Route path="/trips/:tripId/itinerary" element={<SharedItineraryView />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
