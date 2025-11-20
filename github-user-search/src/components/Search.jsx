import { useState } from 'react';
import { fetchUserData } from '../services/githubService';

const Search = () => {
  const [username, setUsername] = useState('');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('Please enter a GitHub username');
      return;
    }

    setLoading(true);
    setError(null);
    setUserData(null);

    try {
      const data = await fetchUserData(username);
      setUserData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setUsername(e.target.value);
    // Clear error when user starts typing again
    if (error) {
      setError(null);
    }
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="input-group">
          <input
            type="text"
            value={username}
            onChange={handleInputChange}
            placeholder="Enter GitHub username..."
            className="search-input"
            disabled={loading}
          />
          <button 
            type="submit" 
            disabled={loading || !username.trim()}
            className="bg-[#2ea44f] px-4 py-2 rounded-lg text-white text-2xl disabled:bg-[#94d3a2] disabled:cursor-not-allowed"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {/* Loading State */}
      {loading && (
        <div className="state-message loading">
          <p>Loading...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="state-message error">
          <p>Looks like we cant find the user</p>
          <p className="error-detail">Error: {error}</p>
        </div>
      )}

      {/* Success State - User Data Display */}
      {userData && !loading && !error && (
        <div className="user-card">
          <div className="user-avatar">
            <img 
              src={userData.avatar_url} 
              alt={`${userData.login}'s avatar`}
              className="avatar"
            />
          </div>
          <div className="user-info">
            <h2 className="user-name">
              {userData.name || userData.login}
            </h2>
            <p className="user-login">@{userData.login}</p>
            {userData.bio && (
              <p className="user-bio">{userData.bio}</p>
            )}
            <div className="user-stats">
              <span className="stat">
                <strong>{userData.public_repos}</strong> Repos
              </span>
              <span className="stat">
                <strong>{userData.followers}</strong> Followers
              </span>
              <span className="stat">
                <strong>{userData.following}</strong> Following
              </span>
            </div>
            <a 
              href={userData.html_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="profile-link"
            >
              View GitHub Profile →
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
