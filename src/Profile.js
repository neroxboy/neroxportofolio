import React from 'react';
import './Profile.css';

const Profile = () => {
  return (
    <div className="profile-container">
      <div className="angular-particles">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="angular-particle" />
        ))}
      </div>
      <div className="profile-card">
        <div className="profile-left">
          <img 
            src="https://files.catbox.moe/ndhji6.jpg" 
            alt="Profile" 
            className="profile-image"
          />
          <h1>Neroxz - Sky</h1>
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
            <a href="https://wa.me/6287782360817" target="_blank" rel="noopener noreferrer" className="social-button whatsapp">
              <i className="fab fa-whatsapp"></i>
              WhatsApp
            </a>
            <a href="mailto:neroxboys@gmail.com" className="social-button email">
              <i className="fas fa-envelope"></i>
              Email
            </a>
          </div>
        </div>

        <div className="profile-right">
          <div className="bio-section">
            <div className="bio-item">
              <span className="label">Nama:</span>
              <span className="value">Sky</span>
            </div>
            <div className="bio-item">
              <span className="label">Umur:</span>
              <span className="value">20</span>
            </div>
            <div className="bio-item">
              <span className="label">Status:</span>
              <span className="value">Mahasiswa</span>
            </div>
            <div className="bio-item">
              <span className="label">Hobi:</span>
              <span className="value">Coding, Gaming, Music</span>
            </div>
          </div>

          <div className="about-section">
            <h2>About Me</h2>
            <p>Saya adalah mahasiswa yang sedang belajar programming. Saat ini fokus pada pengembangan web menggunakan React JS dan teknologi modern lainnya.</p>
          </div>

          <div className="skills-section">
            <h2>Skills</h2>
            <div className="skills-grid">
              <span className="skill-tag">HTML</span>
              <span className="skill-tag">CSS</span>
              <span className="skill-tag">JavaScript</span>
              <span className="skill-tag">React</span>
              <span className="skill-tag">Node.js</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
