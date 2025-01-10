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
  const [isCopied, setIsCopied] = useState(false);
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

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const CopyButton = ({ text }) => (
    <button
      className={`copy-button ${isCopied ? 'copied' : ''}`}
      onClick={() => handleCopy(text)}
      aria-label="Copy text"
    >
      {isCopied ? (
        <span className="check-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
          </svg>
          Copied
        </span>
      ) : (
        <span className="copy-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
          </svg>
          Copy
        </span>
      )}
    </button>
  );

  const LyricsSection = ({ lyrics }) => (
    <div className="lyrics" ref={lyricsRef}>
      <div className="content-wrapper">
        <h3>Lyrics</h3>
        <CopyButton text={lyrics} />
        <div className="message-container">
          <div className="message-header">
            <div className="message-avatar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
              </svg>
            </div>
            <span className="message-name">Lyrics Bot</span>
          </div>
          <div className="message-content">
            {lyrics.split('\n').map((line, index) => (
              <p key={index} data-start={index * 3} data-end={(index + 1) * 3}>
                {line || "\u00A0"}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="spotify-container">
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
          {!trackDetails && !suggestions.length > 0 && (
            <div className="top-tracks-section">
              <h2>Global Top 10 This Week</h2>
              <div className="top-tracks-grid">
                <div className="track-embed-container">
                  <div className="track-rank">1</div>
                  <iframe
                    title="Top Track 1: Rich Flex"
                    src="https://open.spotify.com/embed/track/1bDbXMyjaUIooNwFE9wn0N?utm_source=generator&theme=0"
                    width="100%"
                    height="80"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                  />
                </div>
                <div className="track-embed-container">
                  <div className="track-rank">2</div>
                  <iframe
                    title="Top Track 2: Anti-Hero"
                    src="https://open.spotify.com/embed/track/0V3wPSX9ygBnCm8psDIegu?utm_source=generator&theme=0"
                    width="100%"
                    height="80"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                  />
                </div>
                <div className="track-embed-container">
                  <div className="track-rank">3</div>
                  <iframe
                    title="Top Track 3: Unholy"
                    src="https://open.spotify.com/embed/track/3nqQXoyQOWXiESFLlDF1hG?utm_source=generator&theme=0"
                    width="100%"
                    height="80"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                  />
                </div>
                <div className="track-embed-container">
                  <div className="track-rank">4</div>
                  <iframe
                    title="Top Track 4: Lift Me Up"
                    src="https://open.spotify.com/embed/track/2D4dV2KXDTszzJ3p3cFqhA?utm_source=generator&theme=0"
                    width="100%"
                    height="80"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                  />
                </div>
                <div className="track-embed-container">
                  <div className="track-rank">5</div>
                  <iframe
                    title="Top Track 5: Miss You"
                    src="https://open.spotify.com/embed/track/1xK59OXxi2TAAAbmZK0kBL?utm_source=generator&theme=0"
                    width="100%"
                    height="80"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                  />
                </div>
                <div className="track-embed-container">
                  <div className="track-rank">6</div>
                  <iframe
                    title="Top Track 6: Creepin'"
                    src="https://open.spotify.com/embed/track/2dHHgzDwk4BJdRwy9uXhTO?utm_source=generator&theme=0"
                    width="100%"
                    height="80"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                  />
                </div>
                <div className="track-embed-container">
                  <div className="track-rank">7</div>
                  <iframe
                    title="Top Track 7: Made You Look"
                    src="https://open.spotify.com/embed/track/6n9yCXvLhnYMgJIiB8C8yV?utm_source=generator&theme=0"
                    width="100%"
                    height="80"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                  />
                </div>
                <div className="track-embed-container">
                  <div className="track-rank">8</div>
                  <iframe
                    title="Top Track 8: Lavender Haze"
                    src="https://open.spotify.com/embed/track/5jQI2r1RdgtuT8S3iG8zFC?utm_source=generator&theme=0"
                    width="100%"
                    height="80"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                  />
                </div>
                <div className="track-embed-container">
                  <div className="track-rank">9</div>
                  <iframe
                    title="Top Track 9: As It Was"
                    src="https://open.spotify.com/embed/track/4LRPiXqCikLlN15c3yImP7?utm_source=generator&theme=0"
                    width="100%"
                    height="80"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                  />
                </div>
                <div className="track-embed-container">
                  <div className="track-rank">10</div>
                  <iframe
                    title="Top Track 10: Rich Flex"
                    src="https://open.spotify.com/embed/track/1rDQ4oMwGJI7B4tovsBOxc?utm_source=generator&theme=0"
                    width="100%"
                    height="80"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          )}

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
                  title={`Spotify track: ${trackDetails.name}`}
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
              
              <LyricsSection lyrics={lyrics} />
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
