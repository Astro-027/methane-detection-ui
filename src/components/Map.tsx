import React, { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import 'leaflet.heat';

// Define a new default icon with correct paths for TypeScript
const defaultIcon = new L.Icon({
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

const HeatMapOverlay = () => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // Fetch your data
    fetch("/data/UpdatedSimulatedData.txt")
      .then((response) => response.text())
      .then((text) => {
        const lines = text.trim().split("\n").slice(1); // Skip header
        const heatMapData = lines.map((line) => {
          const parts = line.trim().split(/\s+/);
          const lat = parseFloat(parts[1]);
          const lng = parseFloat(parts[2]);
          // Use either MSS or MMMS column for intensity
          const intensity = parseFloat(parts[8]); // Assuming MSS is in the 9th column
          return [lat, lng, intensity];
        });

        // Create and add the heat map layer
        // Bypass TypeScript type checking
        const heatLayer = (L as any).heatLayer(heatMapData, {
          radius: 25,
          blur: 15,
          maxZoom: 17,
        }).addTo(map);

        return () => {
          // Remove the heatLayer when the component is unmounted
          map.removeLayer(heatLayer);
        };
      });
  }, [map]); // Dependency array with map ensures effect runs once map is initialized

  return null; // This component does not render anything itself
};

const MapComponent = () => {
  const bounds = new L.LatLngBounds(
    new L.LatLng(31, -83), // Southwest coordinates
    new L.LatLng(35, -81)  // Northeast coordinates
  );

  return (
    <MapContainer
      center={[34.6834, -82.8374]}
      zoom={12}
      minZoom={6}
      maxZoom={18}
      maxBounds={bounds}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <HeatMapOverlay />
    </MapContainer>
  );
};

export default MapComponent;
