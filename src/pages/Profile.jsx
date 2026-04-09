import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { Camera, Check } from 'lucide-react';
import FolderCard from '../components/FolderCard';
import ListingCard from '../components/ListingCard';
import ListingModal from '../components/ListingModal';
import { mockListings } from '../data/mockListings';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { wishlist, folderNames, updateFolderName } = useWishlist();
  const { user, updateName, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect to login UI seamlessly if not securely logged in
  if (!user) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', fontFamily: '"Poppins", sans-serif', padding: '0 24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '24px' }}>
          Login or create an account to save your wishlist and view your profile
        </h2>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button 
            onClick={() => navigate('/login')}
            style={{ padding: '12px 32px', background: 'white', color: 'black', border: '2px solid black', borderRadius: '24px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', fontFamily: '"Poppins", sans-serif' }}
          >
            Log In
          </button>
          <button 
            onClick={() => navigate('/signup')}
            style={{ padding: '12px 32px', background: 'black', color: 'white', border: 'none', borderRadius: '24px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', fontFamily: '"Poppins", sans-serif' }}
          >
            Sign Up
          </button>
        </div>
      </div>
    );
  }

  const [photo, setPhoto] = useState(() => localStorage.getItem(`trappe_profile_photo_${user.email}`) || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200');
  
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(user.name);
  
  const [suggestionListings, setSuggestionListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);

  const fileInputRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    setSuggestionListings(prev => {
      const stillUnsaved = prev.filter(listing => !wishlist.find(saved => saved.id === listing.id));
      if (stillUnsaved.length === prev.length && prev.length > 0) return prev;
      const unsavedPool = mockListings.filter(listing => !wishlist.find(saved => saved.id === listing.id) && !stillUnsaved.find(p => p.id === listing.id));
      const shuffledPool = [...unsavedPool].sort(() => 0.5 - Math.random());
      const needed = Math.max(0, 6 - stillUnsaved.length);
      const newAdditions = shuffledPool.slice(0, needed);
      return [...stillUnsaved, ...newAdditions];
    });
  }, [wishlist]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.firstElementChild?.clientWidth || 280;
      scrollRef.current.scrollBy({ left: -(cardWidth + 16), behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.firstElementChild?.clientWidth || 280;
      scrollRef.current.scrollBy({ left: cardWidth + 16, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    localStorage.setItem(`trappe_profile_photo_${user.email}`, photo);
  }, [photo, user.email]);

  useEffect(() => {
    setTempName(user.name);
  }, [user.name]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveName = () => {
    if (tempName.trim()) {
      updateName(tempName.trim());
    }
    setIsEditingName(false);
  };

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

  const savedCount = wishlist.length;
  const foldersCount = Object.keys(folders).length;
  const countriesCount = foldersCount; 

  const handleLogout = () => {
    logout();
    navigate('/explore');
  };

  return (
    <div style={{ fontFamily: '"Poppins", sans-serif' }}>
      
      {/* Profile Header Area */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px', paddingTop: '16px' }}>
        
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <img 
            src={photo} 
            alt="Profile" 
            style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '2px solid black' }} 
          />
          <button 
            onClick={() => fileInputRef.current.click()}
            style={{
              position: 'absolute',
              bottom: '0',
              right: '0',
              backgroundColor: 'black',
              color: 'white',
              border: '2px solid white',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <Camera size={16} />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handlePhotoUpload} 
            accept="image/*" 
            style={{ display: 'none' }} 
          />
        </div>

        {isEditingName ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input 
              autoFocus
              value={tempName}
              onChange={e => setTempName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && saveName()}
              style={{
                fontSize: '1.5rem',
                fontWeight: 600,
                fontFamily: '"Poppins", sans-serif',
                border: '1px solid black',
                borderRadius: '8px',
                padding: '4px 12px',
                textAlign: 'center',
                maxWidth: '250px'
              }}
            />
            <button 
              onMouseDown={(e) => { e.preventDefault(); saveName(); }}
              style={{
                background: 'black',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                padding: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Check size={20} />
            </button>
          </div>
        ) : (
          <h2 
            onClick={() => {
              setTempName(user.name);
              setIsEditingName(true);
            }}
            style={{ fontSize: '1.75rem', fontWeight: 600, margin: 0, cursor: 'pointer', textAlign: 'center' }}
          >
            {user.name}
          </h2>
        )}
        <div style={{ color: 'var(--color-text-muted)', marginTop: '4px', fontSize: '0.95rem' }}>
          {user.email}
        </div>
      </div>

      {/* Tri-Column Layout Stats Bar */}
      <div style={{ display: 'flex', borderTop: '1px solid black', borderBottom: '1px solid black', padding: '16px 0', marginBottom: '40px' }}>
        <div style={{ flex: 1, textAlign: 'center', borderRight: '1px solid var(--color-border)' }}>
          <div style={{ fontWeight: 700, fontSize: '1.5rem' }}>{savedCount}</div>
          <div style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 500, color: 'var(--color-text-muted)' }}>Saved</div>
        </div>
        <div style={{ flex: 1, textAlign: 'center', borderRight: '1px solid var(--color-border)' }}>
          <div style={{ fontWeight: 700, fontSize: '1.5rem' }}>{countriesCount}</div>
          <div style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 500, color: 'var(--color-text-muted)' }}>Countries</div>
        </div>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontWeight: 700, fontSize: '1.5rem' }}>{foldersCount}</div>
          <div style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 500, color: 'var(--color-text-muted)' }}>Folders</div>
        </div>
      </div>

      {/* Duplicate Shared Wishlist Folders Preview */}
      <div style={{ marginBottom: '48px' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '24px' }}>My Wishlists</h3>
        {Object.keys(folders).length > 0 ? (
          <div className="listings-grid">
            {Object.keys(folders).map(country => (
              <FolderCard 
                key={country}
                country={country}
                customName={folderNames[country]}
                listings={folders[country]}
                onClick={() => navigate('/wishlist', { state: { targetFolder: country } })}
                onRename={updateFolderName}
              />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', marginTop: '48px', color: 'var(--color-text-muted)' }}>
            <p>No wishlists created yet.</p>
            <p style={{ fontSize: '0.875rem', marginTop: '8px' }}>Save items on the Explore map to build your first collection!</p>
          </div>
        )}
      </div>

      {/* Your Next Adventure Section */}
      {suggestionListings.length > 0 && (
        <div style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>Your Next Adventure 🌏</h3>
              <p style={{ color: 'var(--color-text-muted)', margin: '4px 0 0 0', fontSize: '0.9rem' }}>A little inspiration for your next trip</p>
            </div>
            
            {/* Desktop Arrows */}
            <div className="carousel-arrow" style={{ gap: '8px' }}>
              <button 
                onClick={scrollLeft} 
                style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid black', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'var(--transition)' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <button 
                onClick={scrollRight} 
                style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid black', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'var(--transition)' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            </div>
          </div>
          
          <style>{`
            .hide-scrollbar::-webkit-scrollbar { display: none; }
            .carousel-card { flex-shrink: 0; width: calc((100% - 16px) / 1.5); scroll-snap-align: start; }
            .carousel-arrow { display: none; }
            .carousel-scroll-area { scroll-snap-type: x mandatory; }
            @media (min-width: 768px) {
              .carousel-card { width: calc((100% - 32px) / 3); }
              .carousel-arrow { display: flex; }
              .carousel-scroll-area { scroll-behavior: smooth; scroll-snap-type: none; }
            }
          `}</style>
          
          <div style={{ position: 'relative' }}>
            <div 
              ref={scrollRef}
              className="hide-scrollbar carousel-scroll-area" 
              style={{
                display: 'flex',
                gap: '16px',
                overflowX: 'auto',
                paddingBottom: '16px',
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              {suggestionListings.map(listing => (
                <div key={listing.id} className="carousel-card">
                  <ListingCard listing={listing} onClick={setSelectedListing} />
                </div>
              ))}
            </div>
            
            {/* Scroll Right Shadow */}
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: '16px',
              width: '60px',
              background: 'linear-gradient(to left, rgba(0,0,0,0.06), transparent)',
              pointerEvents: 'none',
              borderTopRightRadius: '12px',
              borderBottomRightRadius: '12px'
            }} />
          </div>
        </div>
      )}

      <div style={{ textAlign: 'center', marginBottom: '80px' }}>
        <button 
          onClick={handleLogout}
          style={{ padding: '12px 32px', background: 'transparent', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)', borderRadius: '24px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', fontFamily: '"Poppins", sans-serif' }}
        >
          Log Out
        </button>
      </div>

      {selectedListing && <ListingModal listing={selectedListing} onClose={() => setSelectedListing(null)} />}
    </div>
  );
};

export default Profile;
