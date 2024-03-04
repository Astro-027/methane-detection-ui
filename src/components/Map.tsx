import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";

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

const DynamicOverlay = () => {
  const map = useMap();
  const markerClusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);

  useEffect(() => {
    if (!map) return;

    const markerClusterGroup = L.markerClusterGroup();
    markerClusterGroupRef.current = markerClusterGroup;
    map.addLayer(markerClusterGroup);

    fetch("/data/SimulatedData.txt")
      .then((response) => response.text())
      .then((text) => {
        const lines = text.trim().split("\n").slice(1);
        lines.forEach((line) => {
          const parts = line.trim().split(/\s+/);
          const lat = parseFloat(parts[1]);
          const lng = parseFloat(parts[2]);
          const marker = L.marker([lat, lng]);
          markerClusterGroup.addLayer(marker);
        });
      });

    return () => {
      markerClusterGroupRef.current &&
        map.removeLayer(markerClusterGroupRef.current);
    };
  }, [map]);

  return null;
};

const MapComponent = () => {

  const bounds = new L.LatLngBounds(
    new L.LatLng(31, -83), // Southwest coordinates
    new L.LatLng(35, -81)    // Northeast coordinates
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
    <DynamicOverlay />
  </MapContainer>
  );
  };

export default MapComponent;
