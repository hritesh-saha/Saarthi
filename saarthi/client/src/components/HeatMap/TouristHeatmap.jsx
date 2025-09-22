import React, { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import { calculateCenter, HeatmapLayer } from "../../utils/map";

const TouristHeatmap = ({ points = [], defaultCenter }) => {
  const mapCenter = useMemo(
    () => calculateCenter(points) || defaultCenter,
    [points, defaultCenter]
  );

  // Normalize intensities to 0–1 for Leaflet Heat
  const maxIntensity = Math.max(...points.map(p => p[2] || 0.2));

  const heatPoints = useMemo(
    () => points.map(p => [p[0], p[1], (p[2] || 0.2) / maxIntensity]),
    [points, maxIntensity]
  );

  if (!mapCenter) {
    return <div className="text-center text-gray-500">Loading map...</div>;
  }

  return (
    <div className="w-full h-[520px] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg">
      <MapContainer
        key={mapCenter.toString()}
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
            radius: 25,
            blur: 15,
            maxZoom: 17,
            gradient: {
              0.0: "white",
              0.2: "green",   // sparse / safe
              0.4: "yellow",  // moderate
              0.6: "orange",  // crowded
              1.0: "red",     // very crowded
            },
          }}
        />
      </MapContainer>
    </div>
  );
};

export default TouristHeatmap;