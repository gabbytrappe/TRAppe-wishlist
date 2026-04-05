import React from 'react';
import { Heart, MapPin } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import styles from './ListingCard.module.css';

const ListingCard = ({ listing, onClick }) => {
  const { isSaved, toggleWishlist } = useWishlist();
  const saved = isSaved(listing.id);

  const handleToggle = (e) => {
    e.stopPropagation();
    toggleWishlist(listing);
  };

  return (
    <div className={styles.card} onClick={() => onClick && onClick(listing)}>
      <div className={styles.imageContainer}>
        <img src={listing.image} alt={listing.title} className={styles.image} />
        <button 
          className={`${styles.saveButton} ${saved ? styles.saved : ''}`}
          onClick={handleToggle}
          aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
        >
          <Heart size={20} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
      <div className={styles.content}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span className={styles.typeTag} style={{ marginBottom: 0 }}>{listing.type}</span>
          <span style={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>{listing.price}</span>
        </div>
        <h3 className={styles.title}>{listing.title}</h3>
        <div className={styles.location}>
          <MapPin size={14} />
          {listing.location}
        </div>
      </div>
    </div>
  );
}

export default ListingCard;
