import React, { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import { calculateCenter } from "../../utils/map";

const HeatmapLayer = ({ points, options }) => {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    const heat = L.heatLayer(points, options).addTo(map);
    return () => { map.removeLayer(heat); };
  }, [map, points, options]);
  return null;
};


// --- REFACTORED DISPLAY COMPONENT ---
const TouristHeatmap = ({ points = [], defaultCenter }) => {
  // 1. Decide the center based on the provided points.
  //    If no points, use the default center.
  const mapCenter = useMemo(() => calculateCenter(points) || defaultCenter, [points, defaultCenter]);

  // 2. Format the points for the leaflet-heat library.
  const heatPoints = useMemo(
    () => points.map((p) => [p[0], p[1], 1]), // [lat, lng, intensity]
    [points]
  );

  // If mapCenter is not ready, don't render the map yet.
  if (!mapCenter) {
    return <div>Loading map...</div>;
  }
  
  return (
    <div className="w-full h-[520px] rounded-lg overflow-hidden border">
      {/* The 'key' prop is important! It forces React to re-render the map
        component if the center changes, ensuring it re-initializes correctly.
      */}
      <MapContainer
        key={mapCenter.toString()} // Force re-render on center change
        center={mapCenter}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <HeatmapLayer
          points={heatPoints}
          options={{
            radius: 20, blur: 15, maxZoom: 17,
            gradient: { 0.0: "white", 0.2: "green", 0.4: "yellow", 0.7: "orange", 1.0: "red" },
          }}
        />
      </MapContainer>
    </div>
  );
};

export default TouristHeatmap;