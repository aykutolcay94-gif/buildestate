import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const SimpleMap = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      // Initialize the map
      mapInstanceRef.current = L.map(mapRef.current).setView([41.0082, 28.9784], 13);

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstanceRef.current);

      // Add a marker
      L.marker([41.0082, 28.9784]).addTo(mapInstanceRef.current)
        .bindPopup('Istanbul, Turkey')
        .openPopup();
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700">
        <h2 className="text-2xl font-bold text-white">Test Haritası</h2>
        <p className="text-blue-100">Leaflet ile oluşturulmuş basit harita</p>
      </div>
      <div 
        ref={mapRef} 
        style={{ height: '400px', width: '100%' }}
        className="rounded-b-xl"
      />
    </div>
  );
};

export default SimpleMap;