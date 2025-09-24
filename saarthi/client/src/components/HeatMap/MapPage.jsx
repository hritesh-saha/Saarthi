import React, { useEffect, useMemo, useState } from "react";
import TouristHeatmap from "./TouristHeatmap";

// --- HELPER: Mock data generator with intensity ---
const generateMockPeople = (count, center, radius = 0.01, intensity = 1) => {
  const [lat, lng] = center;
  return Array.from({ length: count }, () => [
    lat + (Math.random() - 0.5) * radius,
    lng + (Math.random() - 0.5) * radius,
    intensity, // intensity controls color
  ]);
};

const MapPage = ({ onUpdateTotal }) => {
  const touristHotspots = [
    {
      name: "Victoria Memorial",
      center: [22.5448, 88.3426],
      count: 400,
      radius: 0.008,
    },
    {
      name: "Howrah Bridge",
      center: [22.5958, 88.2636],
      count: 350,
      radius: 0.01,
    },
    {
      name: "Dakshineswar Kali Temple",
      center: [22.6525, 88.3747],
      count: 250,
      radius: 0.008,
    },
    {
      name: "Park Street",
      center: [22.5509, 88.3564],
      count: 300,
      radius: 0.007,
    },
    {
      name: "Kalighat Temple",
      center: [22.4958, 88.3437],
      count: 200,
      radius: 0.006,
    },
    {
      name: "Science City",
      center: [22.5558, 88.3958],
      count: 150,
      radius: 0.01,
    },
    { name: "Eco Park", center: [22.6375, 88.4562], count: 180, radius: 0.012 },
    {
      name: "Marble Palace",
      center: [22.5885, 88.3555],
      count: 100,
      radius: 0.004,
    },
    {
      name: "Indian Museum",
      center: [22.5726, 88.3641],
      count: 250,
      radius: 0.005,
    },
  ];

  // Dense tourist hotspots → red
  const crowdedHotspots = useMemo(
    () =>
      touristHotspots.flatMap((spot) =>
        generateMockPeople(spot.count, spot.center, spot.radius, 1)
      ),
    []
  );

  const [safeZones, setSafeZones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlace, setSelectedPlace] = useState("");

  const kolkataCenter = [22.5726, 88.3639];

  // Sparse safe zones → green
  useEffect(() => {
    const safeLocations = generateMockPeople(200, kolkataCenter, 0.03, 0.5);
    setSafeZones(safeLocations);
    setIsLoading(false);
  }, []);

  // Filtered hotspots based on selection
  const filteredHotspots = useMemo(() => {
    if (!selectedPlace) return crowdedHotspots;
    const spot = touristHotspots.find((s) => s.name === selectedPlace);
    return spot
      ? generateMockPeople(spot.count, spot.center, spot.radius, 1)
      : [];
  }, [selectedPlace, crowdedHotspots]);

  // Update total tourists for dashboard
  useEffect(() => {
    if (onUpdateTotal) {
      onUpdateTotal(filteredHotspots.length + safeZones.length);
    }
  }, [filteredHotspots, safeZones, onUpdateTotal]);

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Kolkata Tourist Density
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Live monitoring of major tourist spots in Kolkata
          </p>
        </header>

        {/* Filter */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Filters
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col w-full sm:w-1/2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Filter by Tourist Spot
              </label>
              <div className="relative">
                <select
                  value={selectedPlace}
                  onChange={(e) => setSelectedPlace(e.target.value)}
                  className="block w-full appearance-none rounded-lg border border-gray-300 
        bg-white px-4 py-2.5 pr-10 text-sm font-medium text-gray-900 
        shadow-sm transition focus:border-blue-500 focus:ring-2 
        focus:ring-blue-500 focus:outline-none
        dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 
        dark:focus:border-blue-400 dark:focus:ring-blue-400"
                >
                  <option value="">All Places</option>
                  {touristHotspots.map((spot, idx) => (
                    <option key={idx} value={spot.name}>
                      {spot.name}
                    </option>
                  ))}
                </select>

                {/* Dropdown Icon */}
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400 dark:text-gray-300">
                  ▼
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Heatmap */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Tourist Heatmap
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Updated in real-time
            </span>
          </div>
          {isLoading ? (
            <div className="h-[500px] flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
              <svg
                className="animate-spin h-8 w-8 text-blue-500 mb-3"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              Loading location data...
            </div>
          ) : (
            <TouristHeatmap
              points={filteredHotspots.concat(safeZones)}
              defaultCenter={kolkataCenter}
            />
          )}
        </section>
      </div>
    </div>
  );
};

export default MapPage;
