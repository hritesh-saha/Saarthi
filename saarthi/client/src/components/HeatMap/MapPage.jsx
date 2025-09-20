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
  // The hotspot definitions remain for generating mock data.
  // LATER: This entire block will be replaced by a fetch call.
  const touristHotspots = [
    { name: "High Density Zone", center: [22.5448, 88.3426], count: 900, radius: 0.01 },
    { name: "Medium Density Zone", center: [22.5609, 88.3564], count: 500, radius: 0.02 },
    { name: "Low Density Zone", center: [22.5850, 88.3700], count: 150, radius: 0.015 },
    { name: "Scattered Medium Zone", center: [22.5533, 88.3541], count: 350, radius: 0.025 }
  ];

  // This generates the mock data. When you get data from the backend,
  // you will simply set it to a state variable.
  const peopleLocations2 = useMemo(
    () =>
      touristHotspots.flatMap((spot) =>
        generateMockPeople(spot.count, spot.center, spot.radius)
      ),
    []
  );


  const [peopleLocations, setPeopleLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Optional: for loading state

  // 2. Use useEffect to fetch data when the component mounts.
  useEffect(() => {
    // This function fetches and formats your data.
    const fetchLocations = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch("http://localhost:5173/locations"); 
        const data = await response.json();

        // The map needs [latitude, longitude]
        const formattedLocations = data.map(location => [
          parseFloat(location.lastCoordinates.latitude), // Convert string to number
          parseFloat(location.lastCoordinates.longitude) // Convert string to number
        ]);
        
        setPeopleLocations(formattedLocations); // Update the state with real data
      } catch (error) {
        console.error("Failed to fetch locations:", error);
      } finally {
        setIsLoading(false); // Stop loading indicator
      }
    };

    fetchLocations();
  }, []); // The empty dependency array [] ensures this runs only once.

  // A fallback center in case no data is available.
  const kolkataCenter = [22.5726, 88.3639];

  if (isLoading) {
    return <div>Loading location data...</div>;
  }

  return (
    <div>
      <h1>Kolkata Tourist Density</h1>
      {/* Pass the data points and a default center to the display component.
        This is much cleaner.
      */}
      <TouristHeatmap points={peopleLocations2} defaultCenter={kolkataCenter} />
    </div>
  );
};

export default MapPage;