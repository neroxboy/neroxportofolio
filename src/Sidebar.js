import React from 'react';
import './Sidebar.css';

const Sidebar = ({ isVisible, setSidebarVisible, setActivePage }) => {
  const handleNavigation = (page) => {
    setActivePage(page);
    setSidebarVisible(false);
  };

  return (
    <>
      <button className="toggle-sidebar" onClick={() => setSidebarVisible(!isVisible)}>
        <i className={`fas fa-${isVisible ? 'times' : 'bars'}`}></i>
        {isVisible ? 'Hide Menu' : 'Menu'}
      </button>
      <div className={`sidebar ${isVisible ? 'visible' : ''}`}>
        <div className="tabs">
          <button onClick={() => handleNavigation('home')}>
            <i className="fas fa-home"></i>
            Home
          </button>
          <button onClick={() => handleNavigation('profile')}>
            <i className="fas fa-user"></i>
            Profile
          </button>
          <button onClick={() => handleNavigation('spotify')}>
            <i className="fab fa-spotify"></i>
            Music Player
          </button>
          <button onClick={() => handleNavigation('chat')}>
            <i className="fas fa-comments"></i>
            Chat Room
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
