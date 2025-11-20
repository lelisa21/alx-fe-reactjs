import axios from "axios";

const GITHUB_API_BASE = "https://api.github.com";

const GITHUB_API_TOKEN = import.meta.env.VITE_GITHUB_API_TOKEN;

const gethubAPI = axios.create({
  baseURL: GITHUB_API_BASE,
  headers: {
    Accept: "application/vnd.github.v3+json",
     // Add Authorization header if token exists
    ...(GITHUB_API_TOKEN && {
      'Authorization': `token ${GITHUB_API_TOKEN}`
    })
  },
});

export const fetchUserData = async (username) => {
  try {
    if (!username || username.trim() === "")
      throw new Error("Username cannot be empty");
    const response = await gethubAPI.get(`/users/${username.trim()}`);

    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error("User not found");
    } else if (error.response?.status === 403) {
      throw new Error("API rate limit exceeded. Please try again later.");
    } else {
      throw new Error(error.message || "Failed to fetch user data");
    }
  }
};
