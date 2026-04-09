import React, { createContext, useState, useEffect, useContext } from 'react';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('trappe_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [folderNames, setFolderNames] = useState(() => {
    const saved = localStorage.getItem('trappe_wishlist_folders');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('trappe_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('trappe_wishlist_folders', JSON.stringify(folderNames));
  }, [folderNames]);

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

  const updateFolderName = (originalCountry, newName) => {
    setFolderNames((prev) => ({
      ...prev,
      [originalCountry]: newName
    }));
  };

  return (
    <WishlistContext.Provider value={{ wishlist, folderNames, toggleWishlist, isSaved, updateFolderName }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
