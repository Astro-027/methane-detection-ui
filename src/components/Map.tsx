import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Rectangle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const MapComponent = () => {
  const bounds = new L.LatLngBounds(
    new L.LatLng(33, -83.5), // Southwest coordinates
    new L.LatLng(35, -81)    // Northeast coordinates
  );

  // DynamicOverlay defined inside MapComponent
  const DynamicOverlay = () => {
    const map = useMap();
    const [zoomLevel, setZoomLevel] = useState(map.getZoom());
  
    useEffect(() => {
      const zoomEndHandler = () => {
        setZoomLevel(map.getZoom());
      };
  
      map.on('zoomend', zoomEndHandler);
      return () => {
        map.off('zoomend', zoomEndHandler);
      };
    }, [map]);
  
    const calculateSquares = () => {
      let squares = [];
    
      if (zoomLevel > 13) {
        // Higher zoom level - show detailed data
        const areaBounds = {
          sw: { lat: 34.6734, lng: -82.8474 }, // Southwest corner of the area
          ne: { lat: 34.6934, lng: -82.8274 }  // Northeast corner of the area
        };
        const size = 0.005; // Smaller size for detailed data
    
        // Generate multiple points within the area
        for (let lat = areaBounds.sw.lat; lat < areaBounds.ne.lat; lat += size) {
          for (let lng = areaBounds.sw.lng; lng < areaBounds.ne.lng; lng += size) {
            squares.push(
              <Rectangle
                key={`${lat}-${lng}`}
                bounds={[
                  [lat, lng],
                  [lat + size, lng + size]
                ]}
                color="blue"
              />
            );
          }
        }
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
