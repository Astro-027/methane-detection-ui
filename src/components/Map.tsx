import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Rectangle, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface DataPoint {
  lat: number;
  lng: number;
  concentration: number;
}

const DynamicOverlay = () => {
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [visiblePoints, setVisiblePoints] = useState<DataPoint[]>([]);

  // Custom hook to handle map events and update visible points
  const map = useMapEvents({
    zoomend: () => {
      updateVisiblePoints();
    },
    moveend: () => {
      updateVisiblePoints();
    }
  });

  useEffect(() => {
    // Fetch and parse the SimulatedData.txt file
    fetch('/data/SimulatedData.txt')
      .then(response => response.text())
      .then(text => {
        const lines = text.trim().split('\n').slice(1); // Skip the header line
        const points = lines.map(line => {
          const parts = line.trim().split(/\s+/);
          return {
            lat: parseFloat(parts[1]),
            lng: parseFloat(parts[2]),
            concentration: parseFloat(parts[3]),
          };
        });
        setDataPoints(points);
        setVisiblePoints(points); // Initialize visible points
      });
  }, []);

  // Function to update visible points based on the current map bounds
  const updateVisiblePoints = () => {
    const bounds = map.getBounds();
    const pointsInView = dataPoints.filter(point => bounds.contains(L.latLng(point.lat, point.lng)));
    setVisiblePoints(pointsInView);
  };

  const calculateSquares = () => {
    return visiblePoints.map((point, index) => (
      <Rectangle
        key={index}
        bounds={[
          [point.lat - 0.005 / 2, point.lng - 0.005 / 2],
          [point.lat + 0.005 / 2, point.lng + 0.005 / 2]
        ]}
        color="blue"
      />
    ));
  };

  return <>{calculateSquares()}</>;
};

const MapComponent = () => {
  const bounds = new L.LatLngBounds(
    new L.LatLng(31, -83), // Southwest coordinates
    new L.LatLng(35, -81)    // Northeast coordinates
  );

  return (
    <MapContainer 
      center={[32.9, -82.005]} 
      zoom={12}
      minZoom={10}
      maxZoom={18}
      maxBounds={bounds}
      style={{ height: '100vh', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <DynamicOverlay />
    </MapContainer>
  );
};

export default MapComponent;
