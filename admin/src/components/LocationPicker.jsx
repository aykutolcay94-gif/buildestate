import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map clicks
function LocationMarker({ position, setPosition }) {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom());
    }
  }, [position, map]);

  return position === null ? null : (
    <Marker position={position} />
  );
}

const LocationPicker = ({ latitude, longitude, onLocationChange }) => {
  const [position, setPosition] = useState(
    latitude && longitude ? { lat: latitude, lng: longitude } : null
  );

  // Default center (Turkey)
  const defaultCenter = [39.9334, 32.8597];

  useEffect(() => {
    if (position) {
      onLocationChange(position.lat, position.lng);
    }
  }, [position, onLocationChange]);

  const handleAddressSearch = async (address) => {
    try {
      // Simple geocoding using Nominatim (OpenStreetMap)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setPosition({ lat: parseFloat(lat), lng: parseFloat(lon) });
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Konum Seçin
        </label>
        <p className="text-sm text-gray-500 mb-3">
          Haritada istediğiniz konuma tıklayın veya aşağıdaki alana adres yazın
        </p>
        
        {/* Address Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Adres yazın ve Enter'a basın..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddressSearch(e.target.value);
              }
            }}
          />
        </div>

        {/* Map Container */}
        <div className="h-64 w-full border border-gray-300 rounded-md overflow-hidden">
          <MapContainer
            center={position || defaultCenter}
            zoom={position ? 15 : 6}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker position={position} setPosition={setPosition} />
          </MapContainer>
        </div>

        {/* Coordinates Display */}
        {position && (
          <div className="mt-2 p-2 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600">
              <strong>Seçilen Konum:</strong> {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationPicker;