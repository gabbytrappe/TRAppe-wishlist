import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WishlistProvider } from './context/WishlistContext';
import Navigation from './components/Navigation';
import Explore from './pages/Explore';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';

function App() {
  return (
    <WishlistProvider>
      <BrowserRouter>
        <div className="app-container">
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Explore />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
          <Navigation />
        </div>
      </BrowserRouter>
    </WishlistProvider>
  );
}

export default App;
