import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';

interface HeatMapOverlayProps {
  selectedColumn: number;
}

const HeatMapOverlay: React.FC<HeatMapOverlayProps> = ({ selectedColumn }) => {
  const map = useMap();
  const heatLayerRef = useRef<L.Layer>(); // Ref to keep track of the current heat layer


  useEffect(() => {
    const removeExistingHeatLayer = () => {
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current);
        heatLayerRef.current = undefined; // Clear the ref after removing the layer
      }
    };

    const fetchAndAddHeatLayer = async () => {
      const response = await fetch('/data/UpdatedSimulatedData.txt');
      const text = await response.text();
      const lines = text.trim().split('\n').slice(1); // Skip header line
      // Explicitly define the type of the accumulator as an array of arrays of numbers
      const heatMapData = lines.reduce<number[][]>((acc, line) => {
        const parts = line.trim().split(/\s+/);
        const lat = parseFloat(parts[1]);
        const lng = parseFloat(parts[2]);
        const intensity = parseFloat(parts[selectedColumn]);
        // Only add data points with intensity >= 0
        if (intensity >= -0.05) {
          acc.push([lat, lng, intensity]);
        }
        return acc;
      }, []); // Initialize the accumulator as an empty array of type number[][]

      removeExistingHeatLayer();

      // Create and add the new heat layer
      const heatLayer = (L as any).heatLayer(heatMapData, {
        radius: 25,
        blur: 15,
        maxZoom: 17,
      }).addTo(map);

      heatLayerRef.current = heatLayer; // Store the new layer in the ref
    };

    fetchAndAddHeatLayer();

    return () => {
      removeExistingHeatLayer();
    };
  }, [map, selectedColumn]);

  return null;
};

const MapComponent = () => {
  const [selectedColumn, setSelectedColumn] = useState(8);

  const bounds = new L.LatLngBounds(
    new L.LatLng(31, -83),
    new L.LatLng(35, -81)
  );

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <MapContainer
        center={[34.6834, -82.8374]}
        zoom={12}
        minZoom={6}
        maxZoom={18}
        maxBounds={bounds}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <HeatMapOverlay selectedColumn={selectedColumn} />
      </MapContainer>
      <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 1000 }}>
        <select value={selectedColumn} onChange={e => setSelectedColumn(parseInt(e.target.value, 10))}>
          <option value={8}>MSS</option>
          <option value={9}>MMMS</option>
        </select>
      </div>
    </div>
  );
};

export default MapComponent;
