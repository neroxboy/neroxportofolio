import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="angular-particles">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="angular-particle" />
        ))}
      </div>
      <div className="home-card">
        <div className="home-left">
          <img 
            src="https://files.catbox.moe/ndhji6.jpg" 
            alt="Profile" 
            className="home-image"
          />
          <h1>Welcome to My Portfolio</h1>
          <p className="tagline">NEROX STILL LEARNING</p>
          
          <div className="social-links">
            <a href="https://github.com/neroxkira" target="_blank" rel="noopener noreferrer" className="social-button github">
              <i className="fab fa-github"></i>
              Github
            </a>
            <a href="https://instagram.com/heavenpyre" target="_blank" rel="noopener noreferrer" className="social-button instagram">
              <i className="fab fa-instagram"></i>
              Instagram
            </a>
          </div>
        </div>

        <div className="home-right">
          <div className="welcome-section">
            <h2>Welcome!</h2>
            <p>Hi! I'm Sky, a passionate web developer focusing on creating modern and interactive web applications.</p>
          </div>

          <div className="navigation-section">
            <h2>Quick Links</h2>
            <div className="quick-links">
              <a href="#profile" className="quick-link-button">
                <i className="fas fa-user"></i>
                View Profile
              </a>
              <a href="#spotify" className="quick-link-button">
                <i className="fab fa-spotify"></i>
                Music Player
              </a>
              <a href="#contact" className="quick-link-button">
                <i className="fas fa-envelope"></i>
                Contact Me
              </a>
            </div>
          </div>

          <div className="featured-section">
            <h2>Featured Skills</h2>
            <div className="skills-grid">
              <span className="skill-tag">React</span>
              <span className="skill-tag">JavaScript</span>
              <span className="skill-tag">CSS</span>
              <span className="skill-tag">Node.js</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
