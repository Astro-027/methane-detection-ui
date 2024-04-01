import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';

interface HeatMapOverlayProps {
  selectedColumn: number;
  selectedFilePath: string; // Add a prop for the selected file path
}

const HeatMapOverlay: React.FC<HeatMapOverlayProps> = ({ selectedColumn, selectedFilePath }) => {
  const map = useMap();
  const heatLayerRef = useRef<L.Layer>();

  useEffect(() => {
    const removeExistingHeatLayer = () => {
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current);
        heatLayerRef.current = undefined;
      }
    };

    const fetchAndAddHeatLayer = async () => {
      const response = await fetch(selectedFilePath); // Use the selected file path
      const text = await response.text();
      const lines = text.trim().split('\n').slice(1);
      const heatMapData = lines.reduce<number[][]>((acc, line) => {
        const parts = line.trim().split(/\s+/);
        const lat = parseFloat(parts[1]);
        const lng = parseFloat(parts[2]);
        const intensity = parseFloat(parts[selectedColumn]);
        if (intensity >= -0.096) {
          acc.push([lat, lng, intensity]);
        }
        return acc;
      }, []);

      removeExistingHeatLayer();

      const heatLayer = (L as any).heatLayer(heatMapData, {
        radius: 25,
        blur: 15,
        maxZoom: 17,
      }).addTo(map);

      heatLayerRef.current = heatLayer;
    };

    fetchAndAddHeatLayer();

    return () => {
      removeExistingHeatLayer();
    };
  }, [map, selectedColumn, selectedFilePath]); // Add selectedFilePath to the dependency array

  return null;
};

const MapComponent = () => {
  const [selectedColumn, setSelectedColumn] = useState(4);
  const [selectedFilePath, setSelectedFilePath] = useState('/data/scaled/NewUpdatedSimulatedData.txt'); // Default file path

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
        <HeatMapOverlay selectedColumn={selectedColumn} selectedFilePath={selectedFilePath} />
      </MapContainer>
      <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 1000 }}>
        <select value={selectedColumn} onChange={e => setSelectedColumn(parseInt(e.target.value, 10))}>
          <option value={4}>MSS</option>
          <option value={5}>MMMS</option>
        </select>
        <select value={selectedFilePath} onChange={e => setSelectedFilePath(e.target.value)}>
          <option value='/data/scaled/NewUpdatedSimulatedData.txt'>Data File 1</option>
          <option value='/data/scaled/NewUpdatedSimulatedDataHR-Part1.txt'>Data File 2</option>
          <option value='/data/scaled/NewUpdatedSimulatedDataHR-Part2.txt'>Data File 3</option>
        </select>
      </div>
    </div>
  );
};

export default MapComponent;
