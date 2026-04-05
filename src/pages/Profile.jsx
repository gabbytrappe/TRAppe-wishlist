import React, { useState } from 'react';

const Profile = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <h2 style={{ marginBottom: '24px' }}>Profile</h2>
      
      {isLoggedIn ? (
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '50%', 
            background: 'var(--color-primary)', 
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            margin: '0 auto 16px'
          }}>
            T
          </div>
          <h3 style={{ marginBottom: '4px' }}>Conscious Traveler</h3>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '32px' }}>traveler@trappe.com</p>
          <button 
            onClick={() => setIsLoggedIn(false)}
            style={{
              padding: '12px 24px',
              background: 'transparent',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--border-radius)',
              fontWeight: 600
            }}
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div style={{ marginTop: '32px' }}>
          <p style={{ marginBottom: '24px', color: 'var(--color-text-muted)' }}>
            Sign in to persist your wishlist across devices and manage your bookings.
          </p>
          <button 
            onClick={() => setIsLoggedIn(true)}
            style={{
              width: '100%',
              padding: '14px',
              background: 'var(--color-primary)',
              color: 'white',
              borderRadius: 'var(--border-radius)',
              fontWeight: 600,
              fontSize: '1rem',
              marginBottom: '12px'
            }}
          >
            Continue with Email
          </button>
          <button 
            onClick={() => setIsLoggedIn(true)}
            style={{
              width: '100%',
              padding: '14px',
              background: 'white',
              color: 'var(--color-text-main)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--border-radius)',
              fontWeight: 600,
              fontSize: '1rem'
            }}
          >
            Continue with Google
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
