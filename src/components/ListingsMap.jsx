import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { renderToString } from 'react-dom/server';
import { Home, Compass } from 'lucide-react';

const createCustomIcon = (type) => {
  const isAccommodation = type === 'Accommodation';
  const bgColor = isAccommodation ? '#2D5016' : '#db3f2c';
  
  const iconHtml = renderToString(
    <div style={{
      backgroundColor: bgColor,
      width: '36px',
      height: '36px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%',
      border: '3px solid white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
      color: 'white'
    }}>
      {isAccommodation ? <Home size={20} color="white" /> : <Compass size={20} color="white" />}
    </div>
  );

  return L.divIcon({
    html: iconHtml,
    className: 'custom-leaflet-icon',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18]
  });
};

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

const ListingsMap = ({ listings, onPinClick, mapStyle = {}, showLegend = true }) => {
  return (
    <div style={{ position: 'relative', width: '100%', height: 'calc(100vh - 280px)', minHeight: '400px', borderRadius: '12px', overflow: 'hidden', zIndex: 1, boxShadow: 'var(--shadow-sm)', ...mapStyle }}>
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
            icon={createCustomIcon(listing.type)}
            eventHandlers={{
              click: () => onPinClick(listing)
            }}
          >
          </Marker>
        ))}
      </MapContainer>

      {/* Legend */}
      {showLegend && (
        <div style={{
          position: 'absolute',
        bottom: '20px',
        left: '20px',
        backgroundColor: 'white',
        padding: '12px 16px',
        borderRadius: '8px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
          <div style={{
            backgroundColor: '#2D5016',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            color: 'white'
          }}>
            <Home size={14} color="white" />
          </div>
          Accommodation
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
          <div style={{
            backgroundColor: '#db3f2c',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            color: 'white'
          }}>
            <Compass size={14} color="white" />
          </div>
          Tours & Experiences
        </div>
      </div>
      )}
    </div>
  );
};

export default ListingsMap;
