import React, { useState } from 'react';
import axios from 'axios';

const SpotifyPlayer = ({ clientId, clientSecret }) => {
  const [trackId, setTrackId] = useState('0o9zmvc5f3EFApU52PPIyW'); // ID lagu default
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

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
        console.log('Access Token:', token); // Debug log
        localStorage.setItem('spotifyAccessToken', token);
        return token;
    } catch (error) {
        console.error('Error fetching access token:', error);
        alert('Gagal mendapatkan akses token Spotify. Periksa pengaturan.');
        throw error;
    }
};

  const searchTrack = async (query) => {
    const token = await getAccessToken();
    const response = await axios.get('https://api.spotify.com/v1/search', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      params: {
        q: query,
        type: 'track',
        limit: 10
      }
    });
    if (response.data.tracks.items.length > 0) {
      setSuggestions(response.data.tracks.items);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchTrack(searchQuery);
  };

  const handleSuggestionClick = (id) => {
    setTrackId(id);
    setSuggestions([]);
  };

  return (
    <div className="spotify-player">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari lagu di Spotify"
        />
        <button type="submit">Cari</button>
      </form>
      {suggestions.length > 0 && (
        <div className="suggestions">
          <p>Did you mean:</p>
          <ul>
            {suggestions.map((track) => (
              <li key={track.id} onClick={() => handleSuggestionClick(track.id)}>
                {track.name} - {track.artists.map(artist => artist.name).join(', ')}
              </li>
            ))}
          </ul>
        </div>
      )}
      <iframe
        src={`https://open.spotify.com/embed/track/${trackId}?autoplay=true`}
        width="300"
        height="80"
        frameBorder="0"
        allow="encrypted-media"
        title="Spotify Player"
      ></iframe>
    </div>
  );
};

export default SpotifyPlayer;
