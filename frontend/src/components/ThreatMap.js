// src/components/ThreatMap.js
import React, { useEffect, useRef } from 'react';

// Uses Leaflet via CDN (loaded in index.html)
// We render a simple map with markers for each geo-located threat

function ThreatMap({ threats }) {
  const mapRef    = useRef(null);
  const leafletRef = useRef(null);

  const geoThreats = threats.filter(
    t => t.latitude && t.longitude && t.latitude !== 0 && t.longitude !== 0
  );

  useEffect(() => {
    if (typeof window === 'undefined' || !window.L) return;
    const L = window.L;

    if (!leafletRef.current) {
      leafletRef.current = L.map(mapRef.current).setView([20, 0], 2);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(leafletRef.current);
    }

    // Clear old markers
    leafletRef.current.eachLayer(layer => {
      if (layer instanceof window.L.Marker || layer instanceof window.L.CircleMarker) {
        leafletRef.current.removeLayer(layer);
      }
    });

    // Add markers for each geo-located threat
    geoThreats.slice(0, 50).forEach(t => {
      const color = t.severity === 'HIGH' ? 'red' : t.severity === 'MEDIUM' ? 'orange' : 'green';
      window.L.circleMarker([t.latitude, t.longitude], {
        radius: t.severity === 'HIGH' ? 10 : 7,
        color,
        fillColor: color,
        fillOpacity: 0.7,
        weight: 2
      })
      .bindPopup(`
        <b>${t.severity} Threat</b><br>
        IP: ${t.ip}<br>
        Action: ${t.action}<br>
        Location: ${t.city || ''}, ${t.country || ''}
      `)
      .addTo(leafletRef.current);
    });
  }, [geoThreats]);

  return (
    <div className="panel">
      <h2>🗺️ Attack Map <span className="map-count">({geoThreats.length} geo-located threats)</span></h2>
      <div
        ref={mapRef}
        style={{ height: '380px', borderRadius: '8px', overflow: 'hidden' }}
      />
      <p className="map-note">
        🔴 High &nbsp; 🟠 Medium &nbsp; 🟢 Low &nbsp; (showing up to 50 recent geo-located threats)
      </p>
    </div>
  );
}

export default ThreatMap;
