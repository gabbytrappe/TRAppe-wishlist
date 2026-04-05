import React, { useState } from 'react';
import { useWishlist } from '../context/WishlistContext';
import ListingCard from '../components/ListingCard';
import ListingModal from '../components/ListingModal';

const Wishlist = () => {
  const { wishlist } = useWishlist();
  const [filter, setFilter] = useState('All'); // 'All', 'Accommodation', 'Experiences'
  const [selectedListing, setSelectedListing] = useState(null);

  const filteredListings = wishlist.filter(listing => 
    filter === 'All' ? true : listing.type === filter
  );

  return (
    <div>
      <h2 style={{ marginBottom: '16px' }}>Your Wishlist</h2>
      
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

      {selectedListing && <ListingModal listing={selectedListing} onClose={() => setSelectedListing(null)} />}
    </div>
  );
};

export default Wishlist;
