import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';
import Particles from 'react-particles';
import { loadFull } from "tsparticles";
import Sidebar from './Sidebar';
import Home from './Home';
import Profile from './Profile';
import SearchMusic from './SearchMusic';
import ChatRoom from './ChatRoom';

function App() {
  const clientId = 'e6f3c22f29a64e41a9d7183964127db2';  // Ganti dengan Client ID Spotify Anda
  const clientSecret = 'e8f6d5d48a0645aa8b29149dcfa50401';  // Ganti dengan Client Secret Spotify Anda
  const [isSidebarVisible, setSidebarVisible] = useState(true);  // Set default to true
  const [activePage, setActivePage] = useState('home');  // Set default to home
  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    const getAccessToken = async () => {
      try {
        const response = await axios.post('https://accounts.spotify.com/api/token', null, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(`${clientId}:${clientSecret}`)
          },
          params: {
            grant_type: 'client_credentials'
          }
        });
        const token = response.data.access_token;
        localStorage.setItem('spotifyAccessToken', token);
        setAccessToken(token);
      } catch (error) {
        console.error('Error fetching access token:', error);
        alert('Gagal mendapatkan token akses.');
      }
    };

    getAccessToken();
  }, [clientId, clientSecret]);

  const getAvailableDevices = async () => {
    try {
        const response = await axios.get('https://api.spotify.com/v1/me/player/devices', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        console.log('Available Devices:', response.data.devices); // Debug log
    } catch (error) {
        console.error('Error fetching devices:', error); // Debug log
    }
};

useEffect(() => {
    getAvailableDevices();
}, [accessToken, getAvailableDevices]);

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const particlesConfig = {
    fullScreen: { enable: false },
    particles: {
      number: { value: 80, density: { enable: true, value_area: 800 } },
      color: { value: "#61dafb" },
      shape: {
        type: "polygon",
        polygon: { nb_sides: 6 },
        stroke: { width: 0 }
      },
      opacity: { value: 0.5 },
      size: { value: 3, random: true },
      links: {
        enable: true,
        color: "#61dafb",
        opacity: 0.4,
        width: 1,
        distance: 150
      },
      move: {
        enable: true,
        speed: 2,
        direction: "none",
        outMode: "bounce",
        attract: { enable: true, rotateX: 600, rotateY: 1200 }
      }
    },
    interactivity: {
      events: {
        onHover: { enable: true, mode: "repulse" },
        onClick: { enable: true, mode: "push" }
      }
    }
  };

  return (
    <div className="App">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesConfig}
        className="particles-bg"
      />
      <div className="angular-particles">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="angular-particle" />
        ))}
      </div>
      <button className="toggle-sidebar" onClick={() => setSidebarVisible(!isSidebarVisible)}>
        <i className={`fas fa-${isSidebarVisible ? 'times' : 'bars'}`}></i>
        {isSidebarVisible ? 'Hide Menu' : 'Menu'}
      </button>
      <Sidebar
        isVisible={isSidebarVisible}
        setSidebarVisible={setSidebarVisible}
        setActivePage={setActivePage}
      />
      <div className={`content ${isSidebarVisible ? 'sidebar-visible' : ''}`}>
        {activePage === 'home' && <Home />}
        {activePage === 'profile' && <Profile />}
        {activePage === 'spotify' && <SearchMusic accessToken={accessToken} />}
        {activePage === 'chat' && <ChatRoom />}
      </div>
    </div>
  );
}

export default App;
