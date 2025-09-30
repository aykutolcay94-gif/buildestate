import React, { useState, useEffect, useRef } from 'react';
import { MapPin, AlertCircle } from 'lucide-react';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Auto-detect backend URL based on environment
const getBackendUrl = () => {
  // If environment variable is set, use it
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // Auto-detect based on current domain
  const currentDomain = window.location.hostname;
  
  if (currentDomain === 'localhost' || currentDomain === '127.0.0.1') {
    return 'http://localhost:4000';
  } else {
    // For production, try to find the backend URL
    // You should replace this with your actual backend domain
    return 'https://buildestate-backend.vercel.app';
  }
};

const Backendurl = getBackendUrl();

const PropertiesMap = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  // Default center (Muğla Bodrum-Milas region)
  const defaultCenter = [37.0344, 27.4305];
  const defaultZoom = 11;

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      // Initialize the map with explicit interaction options
      mapInstanceRef.current = L.map(mapRef.current, {
        center: defaultCenter,
        zoom: defaultZoom,
        dragging: true,
        touchZoom: true,
        doubleClickZoom: true,
        scrollWheelZoom: true,
        boxZoom: true,
        keyboard: true,
        zoomControl: true,
        attributionControl: true
      });

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstanceRef.current);

      // Ensure interactions are enabled after map initialization
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.dragging.enable();
          mapInstanceRef.current.touchZoom.enable();
          mapInstanceRef.current.doubleClickZoom.enable();
          mapInstanceRef.current.scrollWheelZoom.enable();
          mapInstanceRef.current.boxZoom.enable();
          mapInstanceRef.current.keyboard.enable();
        }
      }, 100);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current && properties.length > 0) {
      // Clear existing markers
      markersRef.current.forEach(marker => {
        mapInstanceRef.current.removeLayer(marker);
      });
      markersRef.current = [];

      // Add new markers
      properties.forEach(property => {
        if (property.latitude && property.longitude) {
          const marker = L.marker([parseFloat(property.latitude), parseFloat(property.longitude)])
            .addTo(mapInstanceRef.current);

          const popupContent = `
            <div style="min-width: 200px; padding: 8px;">
              <h3 style="font-weight: bold; font-size: 18px; margin-bottom: 8px;">${property.title || 'Başlık Yok'}</h3>
              <p style="color: #666; margin-bottom: 8px;">${property.location || 'Konum Belirtilmemiş'}</p>
              <p style="color: #2563eb; font-weight: bold; font-size: 18px; margin-bottom: 8px;">
                ₺${property.price ? property.price.toLocaleString() : 'Fiyat Belirtilmemiş'}
              </p>
              <div style="font-size: 14px; color: #666;">
                <p>${property.bedrooms || 0} yatak odası • ${property.bathrooms || 0} banyo</p>
                <p>${property.area || 0} m²</p>
              </div>
            </div>
          `;

          marker.bindPopup(popupContent);
          markersRef.current.push(marker);
        }
      });

      // Fit map to show all markers if there are any
      if (markersRef.current.length > 0) {
        const group = new L.featureGroup(markersRef.current);
        mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
      }
    }
  }, [properties]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      console.log('🗺️ PropertiesMap: Fetching properties from:', `${Backendurl}/api/products/list`);
      const response = await axios.get(`${Backendurl}/api/products/list`);
      
      console.log('🗺️ PropertiesMap: API Response:', response.data);
      
      // Filter properties that have coordinates
      const propertiesWithCoords = response.data.property?.filter(
        property => property.latitude && property.longitude
      ) || [];
      
      console.log('🗺️ PropertiesMap: Properties with coordinates:', propertiesWithCoords);
      
      setProperties(propertiesWithCoords);
      setError(null);
    } catch (err) {
      console.error('🗺️ PropertiesMap: Error fetching properties:', err);
      setError('Emlaklar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="flex items-center gap-3 text-white">
          <MapPin className="w-6 h-6" />
          <div>
            <h2 className="text-2xl font-bold">Emlak Haritası</h2>
            <p className="text-blue-100">
              {properties.length} emlak konumu harita üzerinde gösteriliyor
            </p>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative" style={{ height: '500px' }}>
        {loading && (
          <div className="absolute inset-0 bg-gray-50 flex items-center justify-center z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Harita yükleniyor...</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 bg-red-50 flex items-center justify-center z-10">
            <div className="text-center text-red-600">
              <AlertCircle className="w-12 h-12 mx-auto mb-4" />
              <p className="font-semibold">{error}</p>
              <button 
                onClick={fetchProperties}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Tekrar Dene
              </button>
            </div>
          </div>
        )}

        <div 
          ref={mapRef} 
          style={{ 
            height: '100%', 
            width: '100%',
            position: 'relative',
            zIndex: 1,
            touchAction: 'pan-x pan-y',
            userSelect: 'none'
          }}
          className="rounded-b-xl"
        />

        {!loading && !error && properties.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="text-center text-gray-500">
              <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Henüz Konum Bilgisi Olan Emlak Yok
              </h3>
              <p className="text-gray-500">
                Emlaklar konum bilgileri eklendikçe harita üzerinde görünecektir.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertiesMap;