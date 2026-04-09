import React, { useState, useMemo } from 'react';
import ListingCard from '../components/ListingCard';
import ListingsMap from '../components/ListingsMap';
import { mockListings } from '../data/mockListings';
import ListingModal from '../components/ListingModal';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Explore = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [typeFilter, setTypeFilter] = useState('All');
  const [countryFilter, setCountryFilter] = useState('All');
  const [cityFilter, setCityFilter] = useState('All');
  const [priceFilter, setPriceFilter] = useState('All');
  const [selectedListing, setSelectedListing] = useState(null);
  
  const [viewMode, setViewMode] = useState('Grid');

  // Extract unique countries and cities from the listings
  const { countries, cities } = useMemo(() => {
    const countrySet = new Set(['All']);
    const citySet = new Set(['All']);
    mockListings.forEach(l => {
      const parts = l.location.split(',').map(s => s.trim());
      if (parts.length >= 2) {
        citySet.add(parts[0]);
        countrySet.add(parts[parts.length - 1]);
      } else if (parts.length === 1) {
        countrySet.add(parts[0]);
      }
    });
    return { 
      countries: Array.from(countrySet).sort(),
      cities: Array.from(citySet).sort()
    };
  }, []);

  const filteredListings = mockListings.filter(listing => {
    // Type Filter
    if (typeFilter !== 'All' && listing.type !== typeFilter) return false;
    
    // Country & City
    const parts = listing.location.split(',').map(s => s.trim());
    const city = parts.length >= 2 ? parts[0] : '';
    const country = parts.length >= 2 ? parts[parts.length - 1] : parts[0];

    if (countryFilter !== 'All' && country !== countryFilter) return false;
    if (cityFilter !== 'All' && city !== cityFilter) return false;
    
    // Price
    if (priceFilter !== 'All' && listing.price !== priceFilter) return false;

    return true;
  });

  const selectStyle = (isActive) => ({
    flex: 1,
    padding: '10px 12px',
    borderRadius: '12px',
    border: '1px solid black',
    background: isActive ? 'black' : 'white',
    color: isActive ? 'white' : 'black',
    fontSize: '0.875rem',
    fontWeight: isActive ? 600 : 400,
    outline: 'none',
    cursor: 'pointer',
  });

  const buttonStyle = (isActive) => ({
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '0.875rem',
    fontWeight: isActive ? 600 : 500,
    border: '1px solid black',
    background: isActive ? 'black' : 'white',
    color: isActive ? 'white' : 'black',
    transition: 'var(--transition)',
    cursor: 'pointer',
    whiteSpace: 'nowrap'
  });

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ margin: '-1rem -1rem 16px -1rem' }}>
        <header className="header-container">
          <img 
            src="https://www.trappetravel.com/cdn/shop/files/TRAppe_Logo.jpg" 
            alt="TRAppe Logo" 
            style={{ height: '48px', objectFit: 'contain' }} 
          />
          <nav className="header-nav">
             <a href="#about">About Us</a>
             <a href="#explore">Explore Travel Options</a>
             <a href="#newsletter">Newsletter</a>
             {user ? (
               <span style={{ fontWeight: 600, color: 'black', fontFamily: '"Poppins", sans-serif', padding: '8px 0' }}>{user.name}</span>
             ) : (
               <button 
                 onClick={() => navigate('/login')}
                 style={{
                   padding: '8px 16px',
                   background: 'black',
                   color: 'white',
                   border: 'none',
                   borderRadius: '20px',
                   fontWeight: 600,
                   cursor: 'pointer',
                   fontFamily: '"Poppins", sans-serif'
                 }}
               >
                 Login / Sign Up
               </button>
             )}
          </nav>
        </header>
        <div style={{ width: '100%', height: '350px', overflow: 'hidden', backgroundColor: 'var(--color-surface)', position: 'relative' }}>
          <img 
            src="https://www.trappetravel.com/cdn/shop/files/New_website_header_2048_x_1024_px_14.webp?v=1769224576&width=2000" 
            alt="TRAppe Hero Banner" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} 
          />
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            border: '2px solid black',
            borderRadius: '12px',
            boxShadow: '5px 5px 0px black',
            padding: '24px 40px',
            textAlign: 'center',
            maxWidth: '90%',
            width: '520px',
            color: 'black',
            boxSizing: 'border-box'
          }}>
            <h1 style={{ fontFamily: '"Poppins", sans-serif', fontWeight: 700, fontSize: '2.5rem', margin: '0 0 12px 0', letterSpacing: '-1px', lineHeight: 1 }}>EXPLORE</h1>
            <p style={{ fontSize: '0.95rem', lineHeight: '1.5', margin: '0 auto', fontWeight: 400, fontFamily: '"Poppins", sans-serif', maxWidth: '480px' }}>
              Unique travel experiences around the world that are kind to the planet and good to its people ✌🏻
            </p>
          </div>
        </div>
      </div>
      
      <div className="filters-wrapper">
        
        {/* Type Filter */}
        <div className="filters-row">
          {['All', 'Accommodation', 'Tours & Experiences'].map(t => (
            <button key={t} onClick={() => setTypeFilter(t)} style={buttonStyle(typeFilter === t)}>
              {t}
            </button>
          ))}
        </div>

        {/* Location Filters */}
        <div className="location-filters">
          <select 
            value={countryFilter} 
            onChange={e => setCountryFilter(e.target.value)}
            style={selectStyle(countryFilter !== 'All')}
          >
            {countries.map(c => <option key={c} value={c}>{c === 'All' ? 'Country' : c}</option>)}
          </select>
          
          <select 
            value={cityFilter} 
            onChange={e => setCityFilter(e.target.value)}
            style={selectStyle(cityFilter !== 'All')}
          >
            {cities.map(c => <option key={c} value={c}>{c === 'All' ? 'City' : c}</option>)}
          </select>
        </div>

        {/* Price Filter */}
        <div className="filters-row">
          {['All', '$', '$$', '$$$', '$$$$'].map(p => (
            <button key={p} onClick={() => setPriceFilter(p)} style={buttonStyle(priceFilter === p)}>
              {p === 'All' ? 'Any Price' : p}
            </button>
          ))}
        </div>
      </div>

      {/* Grid/Map Toggle */}
      <div style={{ display: 'flex', marginBottom: '24px', borderRadius: '12px', overflow: 'hidden', border: '1px solid black' }}>
        <div 
          style={{...toggleStyle(viewMode === 'Grid'), borderRight: '1px solid black'}}
          onClick={() => setViewMode('Grid')}
        >
          Grid
        </div>
        <div 
          style={{...toggleStyle(viewMode === 'Map')}}
          onClick={() => setViewMode('Map')}
        >
          Map
        </div>
      </div>

      <div>
        {filteredListings.length > 0 ? (
          viewMode === 'Grid' ? (
            <div className="listings-grid">
              {filteredListings.map(listing => (
                <ListingCard key={listing.id} listing={listing} onClick={setSelectedListing} />
              ))}
            </div>
          ) : (
             <ListingsMap listings={filteredListings} onPinClick={setSelectedListing} />
          )
        ) : (
          <div style={{ textAlign: 'center', marginTop: '48px', color: 'var(--color-text-muted)' }}>
            <p>No listings match your filters.</p>
            <button 
              onClick={() => {
                setTypeFilter('All');
                setCountryFilter('All');
                setCityFilter('All');
                setPriceFilter('All');
              }}
              style={{
                marginTop: '16px',
                padding: '8px 16px',
                background: 'var(--color-primary)',
                color: 'white',
                borderRadius: '8px',
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {selectedListing && <ListingModal listing={selectedListing} onClose={() => setSelectedListing(null)} />}
    </div>
  );
};

export default Explore;
