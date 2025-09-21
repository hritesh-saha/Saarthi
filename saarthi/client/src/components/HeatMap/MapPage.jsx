import React, { useEffect, useMemo, useState } from "react";
import TouristHeatmap from "./TouristHeatmap";

// This helper function can live here or in a separate utils file.
const generateMockPeople = (count, center, radius = 0.1) => {
  const [lat, lng] = center;
  return Array.from({ length: count }, () => [
    lat + (Math.random() - 0.5) * radius,
    lng + (Math.random() - 0.5) * radius,
  ]);
};

const MapPage = () => {
  // Mock tourist hotspots (kept as-is)
  const touristHotspots = [
    { name: "High Density Zone", center: [22.5448, 88.3426], count: 900, radius: 0.01 },
    { name: "Medium Density Zone", center: [22.5609, 88.3564], count: 500, radius: 0.02 },
    { name: "Low Density Zone", center: [22.5850, 88.3700], count: 150, radius: 0.015 },
    { name: "Scattered Medium Zone", center: [22.5533, 88.3541], count: 350, radius: 0.025 }
  ];

  // Mock data generator
  const peopleLocations2 = useMemo(
    () =>
      touristHotspots.flatMap((spot) =>
        generateMockPeople(spot.count, spot.center, spot.radius)
      ),
    []
  );

  const [peopleLocations, setPeopleLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [places, setPlaces] = useState([]); // Unique places from backend
  const [selectedPlace, setSelectedPlace] = useState(""); // Dropdown selection

  const kolkataCenter = [22.5726, 88.3639];

  // Fetch all locations initially to populate dropdown
  const baseurl=import.meta.env.VITE_API_URL;
  useEffect(() => {
    const fetchAllLocations = async () => {
      try {
        const response = await fetch(`${baseurl}/locations`);
        const data = await response.json();

        // Extract unique places for dropdown
        const uniquePlaces = [...new Set(data.map((loc) => loc.lastVisitedPlace).filter(Boolean))];
        setPlaces(uniquePlaces);

        // Format coordinates
        const formattedLocations = data.map((loc) => [
          parseFloat(loc.lastCoordinates.latitude),
          parseFloat(loc.lastCoordinates.longitude),
        ]);

        setPeopleLocations(formattedLocations);
      } catch (error) {
        console.error("Failed to fetch locations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllLocations();
  }, []);

  // Fetch filtered locations when a place is selected
  useEffect(() => {
    if (!selectedPlace) return;

    const fetchFilteredLocations = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5173/locations?place=${encodeURIComponent(selectedPlace)}`
        );
        const data = await response.json();

        const formattedLocations = data.map((loc) => [
          parseFloat(loc.lastCoordinates.latitude),
          parseFloat(loc.lastCoordinates.longitude),
        ]);

        setPeopleLocations(formattedLocations);
      } catch (error) {
        console.error("Failed to fetch filtered locations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilteredLocations();
  }, [selectedPlace]);

  if (isLoading) {
    return <div>Loading location data...</div>;
  }

  return (
    <div>
      <h1>Kolkata Tourist Density</h1>

      {/* Dropdown Filter */}
      <label style={{ display: "block", margin: "10px 0" }}>
        Select Place:{" "}
        <select
          value={selectedPlace}
          onChange={(e) => setSelectedPlace(e.target.value)}
        >
          <option value="">All Places</option>
          {places.map((place, idx) => (
            <option key={idx} value={place}>
              {place}
            </option>
          ))}
        </select>
      </label>

      {/* Heatmap */}
      <TouristHeatmap points={peopleLocations2.concat(peopleLocations)} defaultCenter={kolkataCenter} />
    </div>
  );
};

export default MapPage;
