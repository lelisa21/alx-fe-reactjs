export const GITHUB_SEARCH_URL = "https://api.github.com/search/users?q";

// Basic user fetch
export async function fetchUserData(username) {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    if (!response.ok) throw new Error("User not found");
    return await response.json();
  } catch (err) {
    console.error("fetchUserData Error:", err);
    throw err;
  }
}

// Fetch repositories
export async function fetchUserRepos(username) {
  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated`
    );
    if (!response.ok) throw new Error("Failed to fetch repositories");
    return await response.json();
  } catch (err) {
    console.error("fetchUserRepos Error:", err);
    throw err;
  }
}


export async function advancedUserSearch({
  query = "",
  location = "",     
  minRepos = 0       
}) {
  try {
    let searchQuery = query;

    if (location) {
      searchQuery += `+location:${location}`;
    }

    if (minRepos > 0) {
      searchQuery += `+repos:>=${minRepos}`;
    }

    const url = `${GITHUB_SEARCH_URL}=${encodeURIComponent(searchQuery)}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Advanced search failed");

    const data = await response.json();
    return data.items || [];
  } catch (err) {
    console.error("advancedUserSearch Error:", err);
    return [];
  }
}
