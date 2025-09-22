import { useEffect } from "react";
import { useMap } from "react-leaflet";

//utility to calculate the geometric center of all points.
export const calculateCenter = (points) => {
  if (!points || points.length === 0) return null;

  const total = points.reduce(
    (acc, point) => {
      acc.lat += point[0];
      acc.lng += point[1];
      return acc;
    },
    { lat: 0, lng: 0 }
  );

  return [total.lat / points.length, total.lng / points.length];
};

export const HeatmapLayer = ({ points, options }) => {
  const map = useMap();
  
  useEffect(() => {
    if (!map) return;
    const heat = L.heatLayer(points, options).addTo(map);
    return () => map.removeLayer(heat);
  }, [map, points, options]);

  return null;
};
