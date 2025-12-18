export const CATEGORIES = [
  { id: 'fiction', name: 'Fiction', color: 'bg-blue-100 dark:bg-blue-900' },
  { id: 'science', name: 'Science', color: 'bg-green-100 dark:bg-green-900' },
  { id: 'fantasy', name: 'Fantasy', color: 'bg-purple-100 dark:bg-purple-900' },
  { id: 'mystery', name: 'Mystery', color: 'bg-yellow-100 dark:bg-yellow-900' },
  { id: 'biography', name: 'Biography', color: 'bg-red-100 dark:bg-red-900' },
  { id: 'history', name: 'History', color: 'bg-orange-100 dark:bg-orange-900' },
  { id: 'technology', name: 'Technology', color: 'bg-indigo-100 dark:bg-indigo-900' },
  { id: 'romance', name: 'Romance', color: 'bg-pink-100 dark:bg-pink-900' },
];

export const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'title_asc', label: 'Title (A-Z)' },
  { value: 'title_desc', label: 'Title (Z-A)' },
  { value: 'rating', label: 'Highest Rated' },
];

export const NAV_LINKS = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/search', label: 'Search', icon: '🔍' },
  { path: '/categories', label: 'Categories', icon: '📚' },
  { path: '/profile', label: 'Profile', icon: '👤' },
];

export const API_CONFIG = {
  baseUrl: 'https://openlibrary.org',
  defaultLimit: 20,
  maxLimit: 100,
};

export const STORAGE_KEYS = {
  USER: 'bookLibraryUser',
  THEME: 'theme',
  READING_LIST: 'readingList',
  READING_PROGRESS: 'readingProgress',
};
