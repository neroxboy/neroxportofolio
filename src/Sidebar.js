import React from 'react';

const Sidebar = ({ isVisible, setSidebarVisible, setActivePage }) => {
  const handleTabClick = (tab) => {
    setActivePage(tab);
    setSidebarVisible(false);
  };

  return (
    <div className={`sidebar ${isVisible ? 'visible' : ''}`}>
      <div className="tabs">
        <button onClick={() => handleTabClick('home')}>
          <i className="fas fa-home"></i>
          <span>Home</span>
        </button>
        <button onClick={() => handleTabClick('profile')}>
          <i className="fas fa-user"></i>
          <span>Profile</span>
        </button>
        <button onClick={() => handleTabClick('spotify')}>
          <i className="fab fa-spotify"></i>
          <span>Music Player</span>
        </button>
        <button onClick={() => handleTabClick('chat')}>
          <i className="fas fa-comments"></i>
          <span>AI Chat</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
