import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./screens/home";
import Trips from "./screens/trips";
import Trip from "./screens/trip";
import SharedItineraryView from "./screens/shared_itinerary";
import AddItemModalFinalV2 from "./screens/add_item_modal_v2";
import FlightOptionsScreenFinal from "./screens/flight_options";
import StayOptionsFinal from "./screens/stay_options";



export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/trips" element={<Trips />} />
        <Route path="/trips/:tripId" element={<Trip />} />

        {/* For now, reuse your existing itinerary screen */}
        <Route path="/trips/:tripId/itinerary" element={<SharedItineraryView />} />
        <Route path="/add-item" element={<AddItemModalFinalV2 />} />

        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/flights" element={<FlightOptionsScreenFinal />} />
        <Route path="/stays" element={<StayOptionsFinal />} />


      </Routes>
    </BrowserRouter>
  );
}
