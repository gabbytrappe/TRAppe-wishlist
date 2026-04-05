import React from 'react';
import { NavLink } from 'react-router-dom';
import { Compass, Heart, User } from 'lucide-react';
import styles from './Navigation.module.css';

const Navigation = () => {
  return (
    <nav className={styles.nav}>
      <NavLink to="/" className={({isActive}) => `${styles.navItem} ${isActive ? styles.active : ''}`}>
        <Compass size={24} />
        <span>Explore</span>
      </NavLink>
      <NavLink to="/wishlist" className={({isActive}) => `${styles.navItem} ${isActive ? styles.active : ''}`}>
        <Heart size={24} />
        <span>Wishlist</span>
      </NavLink>
      <NavLink to="/profile" className={({isActive}) => `${styles.navItem} ${isActive ? styles.active : ''}`}>
        <User size={24} />
        <span>Profile</span>
      </NavLink>
    </nav>
  );
}

export default Navigation;
