import React, { createContext, useState, useEffect, useContext } from 'react';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('trappe_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('trappe_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (listing) => {
    setWishlist((prev) => {
      const isSaved = prev.some((item) => item.id === listing.id);
      if (isSaved) {
        return prev.filter((item) => item.id !== listing.id);
      } else {
        return [...prev, listing];
      }
    });
  };

  const isSaved = (listingId) => {
    return wishlist.some((item) => item.id === listingId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isSaved }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
