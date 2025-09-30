import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const PropertyMap = ({ latitude, longitude, title, location }) => {
  const [position, setPosition] = useState(null);

  useEffect(() => {
    if (latitude && longitude) {
      setPosition([parseFloat(latitude), parseFloat(longitude)]);
    }
  }, [latitude, longitude]);

  // Eğer koordinat yoksa haritayı gösterme
  if (!position) {
    return (
      <div className="bg-gray-100 rounded-lg p-8 text-center">
        <div className="text-gray-500">
          <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-lg font-medium">Konum Bilgisi Mevcut Değil</p>
          <p className="text-sm">Bu emlak için harita konumu henüz eklenmemiş.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Konum</h3>
        <a
          href={`https://www.google.com/maps?q=${position[0]},${position[1]}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Google Maps'te Aç →
        </a>
      </div>
      
      <div className="h-64 w-full rounded-lg overflow-hidden border border-gray-200">
        <MapContainer
          center={position}
          zoom={15}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            <Popup>
              <div className="text-center">
                <h4 className="font-semibold">{title}</h4>
                <p className="text-sm text-gray-600">{location}</p>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
      
      <div className="text-sm text-gray-500">
        <p><strong>Koordinatlar:</strong> {position[0].toFixed(6)}, {position[1].toFixed(6)}</p>
      </div>
    </div>
  );
};

export default PropertyMap;