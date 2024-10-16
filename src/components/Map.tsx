import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import { Link } from 'react-router-dom';

interface HeatMapOverlayProps {
  selectedColumn: number;
  selectedFilePath: string;
  selectedTime: number;
  minIntensity: number;
}

const HeatMapOverlay: React.FC<HeatMapOverlayProps> = ({ selectedColumn, selectedFilePath, selectedTime, minIntensity }) => {
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
      const response = await fetch(selectedFilePath);
      const text = await response.text();
      const lines = text.trim().split('\n').slice(1);
      const filteredData = lines.filter(line => {
        const parts = line.trim().split(/\s+/);
        const time = parseFloat(parts[0]);
        return time === selectedTime; // Filter by selectedTime
      });
      const heatMapData = filteredData.map(line => {
        const parts = line.trim().split(/\s+/);
        const lat = parseFloat(parts[1]);
        const lng = parseFloat(parts[2]);
        const intensity = parseFloat(parts[selectedColumn]);
        return intensity >= minIntensity ? [lat, lng, intensity] : null; // Filter by minIntensity
      }).filter(point => point !== null); // Remove null points

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
  }, [map, selectedColumn, selectedFilePath, selectedTime, minIntensity]); // Include minIntensity in the dependency array

  return null;
};

const MapComponent = () => {
  const [selectedColumn, setSelectedColumn] = useState(4);
  const [selectedFilePath, setSelectedFilePath] = useState('/data/scaled/NewUpdatedSimulatedData.txt');
  const [selectedTime, setSelectedTime] = useState(12);
  const [minIntensity, setMinIntensity] = useState(-0.096); // State for minimum intensity

  const bounds = new L.LatLngBounds(
    new L.LatLng(31, -83),
    new L.LatLng(35, -80)
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
        <HeatMapOverlay selectedColumn={selectedColumn} selectedFilePath={selectedFilePath} selectedTime={selectedTime} minIntensity={minIntensity} />
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
          <option value='/data/scaled/NewUpdatedSimulatedDataHR3-Part1.txt'>Data File 4</option>
          <option value='/data/scaled/NewUpdatedSimulatedDataHR3-Part2.txt'>Data File 5</option>
        </select>
        {/* Slider for selecting time */}
        <input
          type="range"
          min="12.0"
          max="36.0"
          step="0.1"
          value={selectedTime}
          onChange={e => setSelectedTime(parseFloat(e.target.value))}
          style={{ marginLeft: '20px' }}
        />
        <span style={{ marginLeft: '10px' }}>{selectedTime}</span> {/* Display the current selected time */}
        {/* Input for minimum intensity */}
        <input
          type="number"
          value={minIntensity}
          onChange={e => setMinIntensity(parseFloat(e.target.value))} // Selection for minIntesity
          style={{ marginLeft: '20px' }}
        />
      </div>
      <div>
        <Link to="/data-visualization">
          <button>Go to Data Visualization</button>
        </Link>
      </div>
    </div>
  );
};

export default MapComponent;
