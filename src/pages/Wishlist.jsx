import React, { useState, useMemo, useEffect } from 'react';
import { useWishlist } from '../context/WishlistContext';
import ListingCard from '../components/ListingCard';
import ListingModal from '../components/ListingModal';
import FolderCard from '../components/FolderCard';
import ListingsMap from '../components/ListingsMap';
import { ArrowLeft } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const Wishlist = () => {
  const { wishlist, folderNames, updateFolderName } = useWishlist();
  const [viewMode, setViewMode] = useState('Folders'); // 'Folders' or 'All Saved'
  const [activeFolderCountry, setActiveFolderCountry] = useState(null);
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.targetFolder) {
      setViewMode('Folders');
      setActiveFolderCountry(location.state.targetFolder);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const [filter, setFilter] = useState('All'); // 'All', 'Accommodation', 'Experiences'
  const [selectedListing, setSelectedListing] = useState(null);

  const folders = useMemo(() => {
    const grouped = {};
    wishlist.forEach(listing => {
      const parts = listing.location.split(',').map(s => s.trim());
      const country = parts.length > 1 ? parts[parts.length - 1] : parts[0];
      if (!grouped[country]) grouped[country] = [];
      grouped[country].push(listing);
    });
    return grouped;
  }, [wishlist]);

  // Clean up selection if dynamic folder disappears entirely
  if (activeFolderCountry && (!folders[activeFolderCountry] || folders[activeFolderCountry].length === 0)) {
    setActiveFolderCountry(null);
  }

  const toggleStyle = (isActive) => ({
    flex: 1,
    padding: '10px',
    textAlign: 'center',
    fontWeight: 600,
    fontSize: '0.9rem',
    background: isActive ? 'black' : 'white',
    color: isActive ? 'white' : 'black',
    cursor: 'pointer',
    transition: 'var(--transition)'
  });

  const filteredListings = wishlist.filter(listing => 
    filter === 'All' ? true : listing.type === filter
  );

  return (
    <div>
      <style>
        {`
          .wishlist-layout {
            display: flex;
            flex-direction: column;
            gap: 24px;
            margin-bottom: 24px;
          }
          .wishlist-map-container {
            width: 100%;
            height: 200px;
            position: relative;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: var(--shadow-sm);
          }
          .wishlist-content-container {
            width: 100%;
          }
          @media (min-width: 768px) {
            .wishlist-layout {
              flex-direction: row-reverse;
              align-items: flex-start;
            }
            .wishlist-map-container {
              flex: 0 0 calc(40% - 12px);
              position: sticky;
              top: 80px; 
              height: calc(100vh - 120px);
            }
            .wishlist-content-container {
              flex: 0 0 calc(60% - 12px);
            }
          }
        `}
      </style>

      <h2 style={{ marginBottom: '16px' }}>Your Wishlist</h2>
      
      <div className="wishlist-layout">
        {/* Map Section */}
        <div className="wishlist-map-container">
          <ListingsMap 
            listings={wishlist} 
            onPinClick={setSelectedListing} 
            mapStyle={{ height: '100%', minHeight: '100%' }} 
            showLegend={false} 
          />
          {wishlist.length === 0 && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              zIndex: 1000,
              color: '#4b5563',
              fontWeight: 500
            }}>
              Save listings to see them on your map
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="wishlist-content-container">
          {/* Top Banner Toggle */}
      <div style={{ display: 'flex', marginBottom: '24px', borderRadius: '12px', overflow: 'hidden', border: '1px solid black' }}>
        <div 
          style={{...toggleStyle(viewMode === 'Folders'), borderRight: '1px solid black'}}
          onClick={() => { setViewMode('Folders'); setActiveFolderCountry(null); }}
        >
          Folders
        </div>
        <div 
          style={{...toggleStyle(viewMode === 'All Saved')}}
          onClick={() => { setViewMode('All Saved'); setActiveFolderCountry(null); }}
        >
          All Saved
        </div>
      </div>
      
      {viewMode === 'Folders' && !activeFolderCountry && (
        <>
          {Object.keys(folders).length > 0 ? (
            <div className="listings-grid">
              {Object.keys(folders).map(country => (
                <FolderCard 
                  key={country}
                  country={country}
                  customName={folderNames[country]}
                  listings={folders[country]}
                  onClick={() => setActiveFolderCountry(country)}
                  onRename={updateFolderName}
                />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', marginTop: '48px', color: 'var(--color-text-muted)' }}>
              <p>No listings saved here yet.</p>
              <p style={{ fontSize: '0.875rem', marginTop: '8px' }}>Explore and tap the heart to save your favorites into folders!</p>
            </div>
          )}
        </>
      )}

      {viewMode === 'Folders' && activeFolderCountry && (
        <div>
          <button 
            onClick={() => setActiveFolderCountry(null)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              marginBottom: '24px',
              background: 'white',
              border: '1px solid black',
              borderRadius: '20px',
              cursor: 'pointer',
              fontWeight: 600,
              color: 'black'
            }}
          >
            <ArrowLeft size={18} />
            Back to Folders
          </button>
          
          <h3 style={{ marginBottom: '24px', fontSize: '1.5rem' }}>
            {folderNames[activeFolderCountry] || activeFolderCountry}
          </h3>

          <div className="listings-grid">
            {folders[activeFolderCountry]?.map(listing => (
              <ListingCard key={listing.id} listing={listing} onClick={setSelectedListing} />
            ))}
          </div>
        </div>
      )}

      {viewMode === 'All Saved' && (
        <>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
            {['All', 'Accommodation', 'Experiences'].map(type => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                style={{
                  padding: '6px 16px',
                  borderRadius: '20px',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  border: '1px solid black',
                  background: filter === type ? 'black' : 'white',
                  color: filter === type ? 'white' : 'black',
                  transition: 'var(--transition)'
                }}
              >
                {type}
              </button>
            ))}
          </div>

          {filteredListings.length > 0 ? (
            <div className="listings-grid">
              {filteredListings.map(listing => (
                <ListingCard key={listing.id} listing={listing} onClick={setSelectedListing} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', marginTop: '48px', color: 'var(--color-text-muted)' }}>
              <p>No listings saved here yet.</p>
              <p style={{ fontSize: '0.875rem', marginTop: '8px' }}>Explore and tap the heart to save your favorites!</p>
            </div>
          )}
        </>
      )}
        </div>
      </div>

      {selectedListing && <ListingModal listing={selectedListing} onClose={() => setSelectedListing(null)} />}
    </div>
  );
};

export default Wishlist;
