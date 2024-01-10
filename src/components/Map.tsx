import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const MapComponent = () => {
  // Define the bounds (example values, adjust as needed)
  // Explicitly define the bounds as an array of LatLngTuple
  const bounds = new L.LatLngBounds(
    new L.LatLng(33, -83.5), // Southwest coordinates
    new L.LatLng(35, -81)  // Northeast coordinates
  );

  return (
    <MapContainer 
      center={[34.6834, -82.8374]} 
      zoom={12}
      minZoom={10} // Set minimum zoom level here
      maxZoom={18} // Set maximum zoom level here
      maxBounds={bounds}
      style={{ height: '100vh', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
    </MapContainer>
  );
};

export default MapComponent;
