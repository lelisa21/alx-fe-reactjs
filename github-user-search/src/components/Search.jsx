import { useState } from "react";
import {
  fetchUserData,
  fetchUserRepos,
  advancedUserSearch, 
} from "../services/githubService";

const Search = () => {
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState(null);
  const [repos, setRepos] = useState([]);
  const [searchResults, setSearchResults] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isAdvanced, setIsAdvanced] = useState(false);
  const [location, setLocation] = useState("");
  const [minRepos, setMinRepos] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() && !isAdvanced) {
      setError("Please enter a GitHub username");
      return;
    }

    setLoading(true);
    setError(null);
    setUserData(null);
    setRepos([]);
    setSearchResults([]);

    try {
      if (isAdvanced) {
        
        const q = username.trim() || ""; 
        const results = await advancedUserSearch({
          query: q,
          location: location.trim(),
          minRepos: Number(minRepos) || 0,
        });

     
        setSearchResults(results);
      } else {

        const data = await fetchUserData(username.trim());
        const repoList = await fetchUserRepos(username.trim());

        setUserData(data);
        setRepos(repoList);
      }
    } catch (err) {

      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    if (error) setError(null);
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="input-group">
          <input
            type="text"
            value={username}
            onChange={handleInputChange(setUsername)}
            placeholder={isAdvanced ? "Search term (optional)..." : "Enter GitHub username..."}
            className="search-input"
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => {
             
              setIsAdvanced((v) => !v);
              setSearchResults([]);
              setUserData(null);
              setRepos([]);
              setError(null);
            }}
            className="toggle-advanced-btn"
            style={{ marginLeft: 8 }}
          >
            {isAdvanced ? "Use Basic Search" : "Use Advanced Search"}
          </button>
          <button
            type="submit"
            disabled={loading || (!isAdvanced && !username.trim())}
            className="search-button"
            style={{ marginLeft: 8 }}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

    
        {isAdvanced && (
          <div className="advanced-options" style={{ marginTop: 12 }}>
            <label style={{ display: "block", marginBottom: 6 }}>
              Location
              <input
                type="text"
                value={location}
                onChange={handleInputChange(setLocation)}
                placeholder="e.g. Ethiopia, Nairobi, Berlin"
                className="search-input"
                disabled={loading}
              />
            </label>

            <label style={{ display: "block", marginBottom: 6 }}>
              Minimum repos
              <input
                type="number"
                min="0"
                value={minRepos}
                onChange={handleInputChange(setMinRepos)}
                placeholder="e.g. 5"
                className="search-input"
                disabled={loading}
              />
            </label>

            <p style={{ fontSize: 12, color: "#666" }}>
              Tip: leave the main search term blank to search by location/minRepos only.
            </p>
          </div>
        )}
      </form>

      {loading && <p>Loading...</p>}

      {error && !loading && (
        <div className="state-message error">
          <p>Looks like we can't complete the search</p>
          <p className="error-detail">Error: {error}</p>
        </div>
      )}

      
      {userData && !loading && !error && (
        <div className="flex flex-col gap-3">
          <img src={userData.avatar_url} className="avatar" alt={`${userData.login} avatar`} />
          <h2>{userData.name || userData.login}</h2>
          <p>@{userData.login}</p>

          <h3>User Repositories</h3>
          <ul className="">
            {repos.length === 0 && <li>No repositories found</li>}
            {repos.map((repo) => (
              <li key={repo.id} className="user-card">
                <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                  {repo.name}
                </a>
                <p>{repo.description || "No description"}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ADVANCED SEARCH RESULTS (list of users) */}
      {isAdvanced && searchResults && searchResults.length > 0 && !loading && !error && (
        <div className="advanced-results">
          <h3>Search Results</h3>
          <ul className="user-card">
            {searchResults.map((user) => (
              <li key={user.id} className="result-item" style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                <img src={user.avatar_url} alt="" style={{ width: 48, height: 48, borderRadius: 6 }} />
                <div>
                  <a href={user.html_url} target="_blank" rel="noopener noreferrer">
                    <strong>{user.login}</strong>
                  </a>
                  <div style={{ fontSize: 13, color: "#555" }}>
                    <span>Score: {user.score?.toFixed ? user.score.toFixed(2) : user.score}</span>
                   
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

     
      {isAdvanced && searchResults && searchResults.length === 0 && !loading && !error && (
        <div className="state-message empty">
          <p>No users found for that query.</p>
        </div>
      )}
    </div>
  );
};

export default Search;
