import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Google Maps Link Converter Screen
// Purpose: Convert Google Maps links into structured place data
export default function MapsConverter() {
  const navigate = useNavigate();
  const [mapsUrl, setMapsUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [placeData, setPlaceData] = useState(null);

  // Extract Place ID from various Google Maps URL formats
  const extractPlaceId = (url) => {
    try {
      // Format 1: Direct place_id parameter
      const directIdMatch = url.match(/[?&]place_id=([^&]+)/);
      if (directIdMatch) return decodeURIComponent(directIdMatch[1]);

      // Format 2: Extract from data parameter - look for place ID patterns
      const dataMatch = url.match(/data=([^&?]+)/);
      if (dataMatch) {
        const decoded = decodeURIComponent(dataMatch[1]);
        
        // Try multiple patterns for place ID in the data parameter
        // Pattern 1: !1s followed by place ID (standard format)
        const pattern1 = decoded.match(/!1s([A-Za-z0-9_-]+)/);
        if (pattern1) {
          const potentialId = pattern1[1];
          // Validate it looks like a place ID (starts with ChIJ or similar)
          if (potentialId.startsWith('ChIJ') || potentialId.length > 20) {
            return potentialId;
          }
        }
        
        // Pattern 2: Look for encoded place ID in various positions
        // Sometimes it's in a different format
        const pattern2 = decoded.match(/!1s([^!]+)/);
        if (pattern2) {
          const candidate = pattern2[1];
          // If it contains a colon, it's likely the old format, skip it
          if (!candidate.includes(':')) {
            return candidate;
          }
        }
      }

      // Format 3: Extract place name and use Text Search (fallback)
      // This will be handled in the main function
      const placeNameMatch = url.match(/\/place\/([^/@]+)/);
      if (placeNameMatch) {
        return null; // Signal to use Text Search
      }

      return null;
    } catch (e) {
      console.error("Error extracting place ID:", e);
      return null;
    }
  };

  // Helper function to build proxy URL for Google Places API
  const buildPlacesApiUrl = (endpoint, params) => {
    const API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY || "YOUR_API_KEY_HERE";
    const queryParams = new URLSearchParams({ ...params, key: API_KEY });
    return `http://localhost:3001/api/places/${endpoint}?${queryParams.toString()}`;
  };

  // Infer category from place types
  const inferCategory = (types) => {
    if (!types || !Array.isArray(types)) return "other";
    
    const typeStr = types.join(" ").toLowerCase();
    
    if (typeStr.includes("restaurant") || typeStr.includes("food") || typeStr.includes("cafe") || typeStr.includes("meal")) {
      return "restaurant";
    }
    if (typeStr.includes("lodging") || typeStr.includes("hotel") || typeStr.includes("accommodation")) {
      return "accommodation";
    }
    if (typeStr.includes("tourist_attraction") || typeStr.includes("museum") || typeStr.includes("park") || typeStr.includes("sight")) {
      return "sight";
    }
    if (typeStr.includes("amusement") || typeStr.includes("activity") || typeStr.includes("entertainment")) {
      return "activity";
    }
    
    return "other";
  };

  const handleConvert = async () => {
    if (!mapsUrl.trim()) {
      setError("Please enter a Google Maps URL");
      return;
    }

    setLoading(true);
    setError("");
    setPlaceData(null);

    try {
      let placeDetails = null;
      const placeId = extractPlaceId(mapsUrl);

      if (placeId) {
        // Use Place Details API via proxy
        const detailsUrl = buildPlacesApiUrl("place/details/json", {
          place_id: placeId,
          fields: "name,formatted_address,address_components,types,geometry"
        });
        const response = await fetch(detailsUrl);
        const data = await response.json();
        
        if (data.status === "OK" && data.result) {
          placeDetails = data.result;
        } else if (data.status === "NOT_FOUND" || data.status === "INVALID_REQUEST") {
          // Place ID not found, fall through to text search
          console.log("Place ID not found, trying text search...");
        } else {
          throw new Error(data.error_message || "Failed to fetch place details");
        }
      }

      // Fallback: Use Text Search with place name and coordinates
      if (!placeDetails) {
        // Extract place name from URL
        const placeNameMatch = mapsUrl.match(/\/place\/([^/@]+)/);
        // Extract coordinates if available
        const coordsMatch = mapsUrl.match(/@([0-9.-]+),([0-9.-]+)/);
        
        let searchQuery = "";
        if (placeNameMatch) {
          // Decode the place name (handles URL encoding like %26 for &)
          searchQuery = decodeURIComponent(placeNameMatch[1].replace(/\+/g, " "));
        }
        
        // If we have coordinates, add them to improve search accuracy
        if (coordsMatch && searchQuery) {
          const lat = coordsMatch[1];
          const lng = coordsMatch[2];
          // Use nearby search with the place name and coordinates via proxy
          const nearbyUrl = buildPlacesApiUrl("place/nearbysearch/json", {
            location: `${lat},${lng}`,
            radius: "50",
            keyword: searchQuery
          });
          const nearbyResponse = await fetch(nearbyUrl);
          const nearbyData = await nearbyResponse.json();
          
          if (nearbyData.status === "OK" && nearbyData.results && nearbyData.results.length > 0) {
            // Get details of first result via proxy
            const firstResult = nearbyData.results[0];
            const detailsUrl = buildPlacesApiUrl("place/details/json", {
              place_id: firstResult.place_id,
              fields: "name,formatted_address,address_components,types,geometry"
            });
            const detailsResponse = await fetch(detailsUrl);
            const detailsData = await detailsResponse.json();
            
            if (detailsData.status === "OK" && detailsData.result) {
              placeDetails = detailsData.result;
            }
          }
        }
        
        // If nearby search didn't work, try text search via proxy
        if (!placeDetails && searchQuery) {
          const searchUrl = buildPlacesApiUrl("place/textsearch/json", {
            query: searchQuery
          });
          const response = await fetch(searchUrl);
          const data = await response.json();
          
          if (data.status === "OK" && data.results && data.results.length > 0) {
            // Get details of first result via proxy
            const firstResult = data.results[0];
            const detailsUrl = buildPlacesApiUrl("place/details/json", {
              place_id: firstResult.place_id,
              fields: "name,formatted_address,address_components,types,geometry"
            });
            const detailsResponse = await fetch(detailsUrl);
            const detailsData = await detailsResponse.json();
            
            if (detailsData.status === "OK" && detailsData.result) {
              placeDetails = detailsData.result;
            }
          }
        }
      }

      if (!placeDetails) {
        throw new Error("Could not find place information. Please check the URL format.");
      }

      // Extract location (city/neighborhood)
      const getLocation = (addressComponents) => {
        if (!addressComponents) return "Unknown";
        
        // Try to find city, neighborhood, or locality
        const city = addressComponents.find(comp => 
          comp.types.includes("locality") || comp.types.includes("administrative_area_level_1")
        );
        const neighborhood = addressComponents.find(comp => 
          comp.types.includes("neighborhood") || comp.types.includes("sublocality")
        );
        
        return neighborhood?.long_name || city?.long_name || "Unknown";
      };

      const extractedData = {
        name: placeDetails.name || "Unknown",
        location: getLocation(placeDetails.address_components),
        fullAddress: placeDetails.formatted_address || "",
        category: inferCategory(placeDetails.types),
        types: placeDetails.types || [],
        placeId: placeDetails.place_id || placeId,
        mapsUrl: mapsUrl,
      };

      setPlaceData(extractedData);
    } catch (e) {
      setError(e.message || "Failed to convert link. Please try again.");
      console.error("Conversion error:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMapsUrl("");
    setPlaceData(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 px-4 py-3 relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 top-3 text-sm text-blue-600 hover:underline"
        >
          ← Back
        </button>
        <div className="text-center">
          <h1 className="text-base font-semibold">Maps Link Converter</h1>
          <p className="text-xs text-neutral-500">
            Paste a Google Maps link to extract place info
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 max-w-md mx-auto space-y-4">
        {/* Input Section */}
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1">
              Google Maps URL
            </label>
            <textarea
              className="w-full rounded-xl border border-neutral-300 p-3 text-sm min-h-[100px]"
              placeholder="Paste Google Maps link here..."
              value={mapsUrl}
              onChange={(e) => setMapsUrl(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="flex gap-2">
            <button
              className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm text-white hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
              onClick={handleConvert}
              disabled={loading || !mapsUrl.trim()}
            >
              {loading ? "Converting..." : "Convert"}
            </button>
            <button
              className="rounded-xl border border-neutral-200 bg-white py-2.5 px-4 text-sm text-neutral-700"
              onClick={handleClear}
              disabled={loading}
            >
              Clear
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Results Display */}
        {placeData && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-emerald-900">Extracted Data</h2>
              <span className="text-xs rounded-full bg-emerald-200 px-2 py-1 text-emerald-800">
                {placeData.category}
              </span>
            </div>

            <div className="space-y-2">
              <div>
                <p className="text-xs text-emerald-700 font-semibold">Name</p>
                <p className="text-sm text-emerald-900 mt-0.5">{placeData.name}</p>
              </div>

              <div>
                <p className="text-xs text-emerald-700 font-semibold">Location</p>
                <p className="text-sm text-emerald-900 mt-0.5">{placeData.location}</p>
                {placeData.fullAddress && (
                  <p className="text-xs text-emerald-600 mt-0.5">{placeData.fullAddress}</p>
                )}
              </div>

              <div>
                <p className="text-xs text-emerald-700 font-semibold">Category</p>
                <p className="text-sm text-emerald-900 mt-0.5 capitalize">{placeData.category}</p>
              </div>

              <div className="pt-2 border-t border-emerald-200">
                <a
                  href={placeData.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-blue-600 underline"
                >
                  Open in Google Maps →
                </a>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 flex gap-2">
              <button
                className="flex-1 rounded-xl border border-emerald-300 bg-white py-2 text-xs text-emerald-700 hover:bg-emerald-100"
                onClick={() => {
                  console.log("Place data:", placeData);
                  // You can add logic here to save to trip or navigate to add-item modal
                }}
              >
                Copy Data
              </button>
              <button
                className="flex-1 rounded-xl bg-emerald-600 py-2 text-xs text-white hover:bg-emerald-700"
                onClick={() => {
                  // Navigate to add-item modal with pre-filled data
                  navigate("/add-item", { 
                    state: { 
                      prefill: {
                        title: placeData.name,
                        link: placeData.mapsUrl,
                        city: placeData.location,
                        type: placeData.category,
                      }
                    }
                  });
                }}
              >
                Add to Trip
              </button>
            </div>
          </div>
        )}

        {/* Help Text */}
        <div className="rounded-xl border border-neutral-200 bg-white p-3">
          <p className="text-xs text-neutral-600">
            <strong>Tip:</strong> Paste any Google Maps link (place, directions, etc.) and we'll extract the place name, location, and category.
          </p>
        </div>
      </main>
    </div>
  );
}

