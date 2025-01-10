import React, { useEffect, useState } from 'react';
import './Home.css';

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    return () => setIsVisible(false);
  }, []);

  return (
    <div className={`home-container ${isVisible ? 'fade-in' : ''}`}>
      <div className="angular-particles">
        {[...Array(3)].map((_, i) => ( // Reduced from 5 to 3 particles
          <div 
            key={i} 
            className="angular-particle" 
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s` // Slower animation
            }}
          />
        ))}
      </div>
      <div className="home-card">
        <div className="home-content">
          <div className="text-section">
            <h1>Welcome to My Portfolio</h1>
            <p>Hi! I'm Sky, a passionate web developer focusing on modern web technologies. 
               I love creating beautiful and functional websites using React and other cutting-edge tools.</p>
          </div>
          <div className="image-section">
            <img src="https://files.catbox.moe/ndhji6.jpg" alt="Portfolio" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
