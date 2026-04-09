import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (signup(name, email, password)) {
      navigate('/explore');
    } else {
      setError('Email already exists');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', fontFamily: '"Poppins", sans-serif', padding: '24px' }}>
      <img 
        src="https://www.trappetravel.com/cdn/shop/files/TRAppe_Logo.jpg" 
        alt="TRAppe Logo" 
        style={{ height: '60px', marginBottom: '24px', objectFit: 'contain' }} 
      />
      
      <h2 style={{ fontSize: '1.75rem', fontWeight: 600, marginBottom: '32px', textAlign: 'center' }}>
        Join TRAppe ✌🏻
      </h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '350px', gap: '16px' }}>
        <input 
          type="text" 
          placeholder="Your Name" 
          value={name}
          onChange={e => setName(e.target.value)}
          required
          style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '1rem', fontFamily: '"Poppins", sans-serif' }}
        />
        <input 
          type="email" 
          placeholder="Email Address" 
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '1rem', fontFamily: '"Poppins", sans-serif' }}
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '1rem', fontFamily: '"Poppins", sans-serif' }}
        />
        
        {error && <div style={{ color: 'red', fontSize: '0.875rem' }}>{error}</div>}
        
        <button 
          type="submit"
          style={{
            padding: '14px',
            background: 'black',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '1rem',
            cursor: 'pointer',
            marginTop: '8px',
            fontFamily: '"Poppins", sans-serif'
          }}
        >
          Create Account
        </button>
      </form>
      
      <div style={{ marginTop: '24px', fontSize: '0.9rem' }}>
        Already have an account? <Link to="/login" style={{ color: 'black', fontWeight: 600 }}>Log In</Link>
      </div>
    </div>
  );
};

export default Signup;
