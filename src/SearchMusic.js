import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './SearchMusic.css'; // Import CSS file for styling

const SearchMusic = ({ accessToken }) => {
  const [trackId, setTrackId] = useState('0o9zmvc5f3EFApU52PPIyW'); // ID lagu default
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [trackDetails, setTrackDetails] = useState(null);
  const [lyrics, setLyrics] = useState('');
  const [albums, setAlbums] = useState([]); // State for albums
  const lyricsRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    // Fetch albums on component mount
    const fetchAlbums = async () => {
      try {
        const response = await axios.get('https://api.spotify.com/v1/albums', {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: { limit: 10 }
        });
        setAlbums(response.data.items);
      } catch (error) {
        console.error('Error fetching albums:', error);
      }
    };

    fetchAlbums();
  }, [accessToken]);

  // Search track on Spotify
  const searchTrack = async (query) => {
    try {
      const response = await axios.get('https://api.spotify.com/v1/search', {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { q: query, type: 'track', limit: 5 }
      });
      if (response.data.tracks.items.length > 0) {
        setSuggestions(response.data.tracks.items);
      }
    } catch (error) {
      console.error('Error searching track:', error);
    }
  };

  // Get track details
  const getTrackDetails = async (id) => {
    try {
      const response = await axios.get(`https://api.spotify.com/v1/tracks/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setTrackDetails(response.data);
      setTrackId(id);
      getLyrics(response.data.name, response.data.artists[0].name);
    } catch (error) {
      console.error('Error getting track details:', error);
    }
  };

  // Get lyrics
  const getLyrics = async (trackName, artistName) => {
    try {
      const response = await axios.get(`https://api.lyrics.ovh/v1/${artistName}/${trackName}`);
      setLyrics(response.data.lyrics);
    } catch {
      setLyrics('Lyrics not found.');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchTrack(searchQuery);
  };

  const handleSuggestionClick = (id) => {
    setTrackId(id);
    setSuggestions([]);
    getTrackDetails(id);
  };

  const handleTimeUpdate = () => {
    const currentTime = audioRef.current.currentTime;
    const lyricsLines = lyricsRef.current.querySelectorAll('p');
    lyricsLines.forEach((line, index) => {
      const startTime = parseFloat(line.getAttribute('data-start'));
      const endTime = parseFloat(line.getAttribute('data-end'));
      if (currentTime >= startTime && currentTime <= endTime) {
        line.classList.add('active');
        line.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        line.classList.remove('active');
      }
    });
  };

  return (
    <div className="spotify-container">
      <div className="angular-particles">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="angular-particle" />
        ))}
      </div>
      <div className="spotify-card">
        <div className="spotify-left">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari lagu di Spotify"
              className="search-input"
            />
            <button type="submit" className="search-button">Cari</button>
          </form>

          {suggestions.length > 0 && (
            <div className="suggestions">
              <p>
                <i className="fas fa-search"></i> Hasil Pencarian
              </p>
              <ul>
                {suggestions.map((track) => (
                  <li key={track.id} onClick={() => handleSuggestionClick(track.id)}>
                    <div className="suggestion-item">
                      <img 
                        src={track.album.images[track.album.images.length - 1].url} 
                        alt={track.name}
                        className="suggestion-thumbnail"
                      />
                      <div className="suggestion-info">
                        <strong>{track.name}</strong>
                        <span>{track.artists.map(artist => artist.name).join(', ')}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="spotify-right">
          {trackDetails && (
            <div className="track-details">
              <div className="track-info">
                <img src={trackDetails.album.images[0].url} alt={trackDetails.name} className="album-art" />
                <div className="track-meta">
                  <h2>{trackDetails.name}</h2>
                  <p>Artist: {trackDetails.artists.map(artist => artist.name).join(', ')}</p>
                  <p>Album: {trackDetails.album.name}</p>
                  <p>Release Date: {trackDetails.album.release_date}</p>
                  <p>Popularity: {trackDetails.popularity}</p>
                </div>
              </div>
              
              <div className="spotify-embed">
                <iframe
                  title={`Spotify track: ${trackDetails.name}`} // Add unique title
                  src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator`}
                  width="100%"
                  height="180"
                  frameBorder="0"
                  allowFullScreen=""
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                />
                <audio
                  ref={audioRef}
                  src={`https://p.scdn.co/mp3-preview/${trackId}`}
                  onTimeUpdate={handleTimeUpdate}
                  controls
                  style={{ display: 'none' }}
                />
              </div>
              
              <div className="lyrics" ref={lyricsRef}>
                <h3>Lyrics</h3>
                {lyrics.split('\n').map((line, index) => (
                  <p key={index} data-start={index * 3} data-end={(index + 1) * 3}>{line}</p>
                ))}
              </div>
            </div>
          )}

          <div className="playlist-section">
            <iframe
              title="Spotify Embed: Recommendation Playlist"
              src={`https://open.spotify.com/embed/playlist/7cAnOh7iI97WWaIB3ma7f9?utm_source=generator&theme=0`}
              width="100%"
              height="400"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          </div>

          <div className="album-list">
            {albums.map((album) => (
              <div key={album.id} className="album-item">
                <img src={album.images[0].url} alt={album.name} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchMusic;
