import axios from "axios";

const GITHUB_API_BASE = "https://api.github.com";
const GITHUB_API_TOKEN = import.meta.env.VITE_GITHUB_API_TOKEN;

const githubAPI = axios.create({
  baseURL: GITHUB_API_BASE,
  headers: {
    Accept: "application/vnd.github.v3+json",
    ...(GITHUB_API_TOKEN && {
      Authorization: `token ${GITHUB_API_TOKEN}`,
    }),
  },
});


export const fetchUserData = async (username) => {
  try {
    if (!username.trim()) throw new Error("Username cannot be empty");

    const response = await githubAPI.get(`/users/${username.trim()}`);
    return response.data;

  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error("User not found");
    } else if (error.response?.status === 403) {
      throw new Error("API rate limit exceeded.");
    }
    throw new Error("Failed to fetch user data");
  }
};


export const fetchUserRepos = async (username) => {
  try {
    if (!username.trim()) throw new Error("Username cannot be empty");

    const response = await githubAPI.get(
      `/users/${username.trim()}/repos?sort=created&per_page=50`
    );

    return response.data;

  } catch (error) {
    throw new Error("Failed to fetch repositories" , error);
  }
};


export const searchAdvancedUsers = async ({ query, location, minRepos }) => {
  try {
    if (!query.trim()) throw new Error("Search query cannot be empty");

    let searchQuery = `${query} in:login`;

    if (location) searchQuery += ` location:${location}`;
    if (minRepos) searchQuery += ` repos:>${minRepos}`;

    const response = await githubAPI.get(
      `/search/users?q=${encodeURIComponent(searchQuery)}`
    );

    return response.data.items;

  } catch (error) {
    throw new Error("Advanced search failed" , error);
  }
};
