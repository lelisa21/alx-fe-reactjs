import { useState } from 'react';
import { fetchUserData, fetchUserRepos } from '../services/githubService';

const Search = () => {
  const [username, setUsername] = useState('');
  const [userData, setUserData] = useState(null);
  const [repos, setRepos] = useState([]);
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
    setRepos([]);

    try {
      const data = await fetchUserData(username);
      const repoList = await fetchUserRepos(username);

      setUserData(data);
      setRepos(repoList);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setUsername(e.target.value);
    if (error) setError(null);
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
            className="search-button"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {loading && <p>Loading...</p>}

      {error && !loading && (
        <div className="state-message error">
          <p>Looks like we can't find the user</p>
          <p className="error-detail">Error: {error}</p>
        </div>
      )}

      {/* USER CARD */}
      {userData && !loading && !error && (
        <div className="flex flex-col gap-3 ">
          <img src={userData.avatar_url} className="avatar" alt="" />
          <h2>{userData.name || userData.login}</h2>
          <p>@{userData.login}</p>

          <h3>User Repositories</h3>
          <ul className="">
            {repos.map((repo) => (
              <li key={repo.id} className="user-card">
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {repo.name}
                </a>
                <p>{repo.description || 'No description'}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Search;
