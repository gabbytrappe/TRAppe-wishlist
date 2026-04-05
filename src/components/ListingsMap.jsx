import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapBoundsInfo = ({ listings }) => {
  const map = useMap();

  useEffect(() => {
    if (listings.length === 0) return;
    
    if (listings.length === 1) {
      map.setView(listings[0].coordinates, 10);
      return;
    }
    
    const bounds = L.latLngBounds(listings.map(l => l.coordinates));
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [listings, map]);

  return null;
};

const ListingsMap = ({ listings, onPinClick }) => {
  return (
    <div style={{ position: 'relative', width: '100%', height: 'calc(100vh - 280px)', minHeight: '400px', borderRadius: '12px', overflow: 'hidden', zIndex: 1, boxShadow: 'var(--shadow-sm)' }}>
      <MapContainer 
        center={[20, 0]} 
        zoom={2} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        <MapBoundsInfo listings={listings} />

        {listings.map(listing => (
          <Marker 
            key={listing.id} 
            position={listing.coordinates}
            eventHandlers={{
              click: () => onPinClick(listing)
            }}
          >
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default ListingsMap;
