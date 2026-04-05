import React, { useEffect } from 'react';
import { Heart, MapPin, X } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';

const ListingModal = ({ listing, onClose }) => {
  const { isSaved, toggleWishlist } = useWishlist();
  if (!listing) return null;
  const saved = isSaved(listing.id);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '24px',
        animation: 'fadeIn 0.2s ease'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          background: 'var(--color-surface)',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '500px',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
        }}
        onClick={(e) => e.stopPropagation()} /* Prevent closing when clicking inside */
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 10,
            background: 'rgba(255, 255, 255, 0.9)',
            padding: '8px',
            borderRadius: '50%',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <X size={20} color="var(--color-text-main)" />
        </button>

        {/* Hero Image */}
        <div style={{ width: '100%', minHeight: '250px', maxHeight: '300px', overflow: 'hidden' }}>
          <img 
            src={listing.image} 
            alt={listing.title} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div style={{ paddingRight: '16px' }}>
              <span style={{ 
                display: 'inline-block',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                color: 'black',
                background: '#ffa857',
                padding: '4px 8px',
                borderRadius: '4px',
                marginBottom: '12px',
                letterSpacing: '0.5px'
              }}>
                {listing.type}
              </span>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '8px', lineHeight: 1.2 }}>{listing.title}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
                <MapPin size={16} />
                {listing.location}
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px', minWidth: '40px' }}>
              <span style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '1.25rem' }}>
                {listing.price}
              </span>
              <button 
                onClick={() => toggleWishlist(listing)}
                style={{
                  background: saved ? 'var(--color-surface)' : 'white',
                  border: '1px solid var(--color-border)',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'var(--transition)'
                }}
                aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
              >
                <Heart size={20} fill={saved ? "var(--color-danger)" : "none"} color={saved ? "var(--color-danger)" : "var(--color-text-muted)"} />
              </button>
            </div>
          </div>

          {/* Description */}
          <div style={{ marginTop: '16px', marginBottom: '24px' }}>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6', fontSize: '0.95rem' }}>
              {listing.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{
              flex: 1,
              padding: '12px',
              background: '#db3f2c',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--border-radius)',
              fontWeight: 600,
              fontSize: '1rem',
              transition: 'var(--transition)'
            }}>
              Learn More
            </button>
            <button style={{
               flex: 1,
               padding: '12px',
               background: 'black',
               color: 'white',
               border: 'none',
               borderRadius: 'var(--border-radius)',
               fontWeight: 600,
               fontSize: '1rem',
               transition: 'var(--transition)'
            }}>
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingModal;
