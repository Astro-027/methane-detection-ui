import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Rectangle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface DataPoint {
  lat: number;
  lng: number;
  concentration: number;
}

const MapComponent = () => {
  const bounds = new L.LatLngBounds(
    new L.LatLng(33, -83.5), // Southwest coordinates
    new L.LatLng(35, -81)    // Northeast coordinates
  );

  const DynamicOverlay = () => {
    const map = useMap();
    const [zoomLevel, setZoomLevel] = useState(map.getZoom());
    const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);

    useEffect(() => {
      const zoomEndHandler = () => {
        setZoomLevel(map.getZoom());
      };

      map.on('zoomend', zoomEndHandler);

      // Fetch and parse the SimulatedData.txt file
      fetch('/data/SimulatedData.txt')
        .then(response => response.text())
        .then(text => {
          const lines = text.trim().split('\n').slice(1); // Skip the first line with column names
          const points = lines.map(line => {
            const parts = line.trim().split(/\s+/);
            return {
              lat: parseFloat(parts[1]), // Assuming latitude is the second column
              lng: parseFloat(parts[2]), // Assuming longitude is the third column
              concentration: parseFloat(parts[3]), // Assuming concentration is the fourth column
            };
          });
          setDataPoints(points);
        });

      return () => {
        map.off('zoomend', zoomEndHandler);
      };
    }, [map]);

    const calculateSquares = () => {
      let squares = [];

      if (zoomLevel > 13) {
        // Higher zoom level - show detailed data
        squares = dataPoints.map((point, index) => (
          <Rectangle
            key={index}
            bounds={[
              [point.lat - 0.005 / 2, point.lng - 0.005 / 2],
              [point.lat + 0.005 / 2, point.lng + 0.005 / 2]
            ]}
            color="blue"
          />
        ));
      } else {
        // Lower zoom level - show aggregated data
        const aggregatedData = { lat: 34.6834, lng: -82.8374 };
        const size = 0.05; // Larger size for aggregated data
        squares = [
          <Rectangle
            key="aggregated"
            bounds={[
              [aggregatedData.lat - size / 2, aggregatedData.lng - size / 2],
              [aggregatedData.lat + size / 2, aggregatedData.lng + size / 2]
            ]}
            color="red"
          />
        ];
      }

      return squares;
    };

    return <>{calculateSquares()}</>;
  };

  return (
    <MapContainer 
      center={[34.6834, -82.8374]} 
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
