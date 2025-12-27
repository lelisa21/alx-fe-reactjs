import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { FiSearch, FiFilter, FiX, FiBook, FiAlertCircle } from "react-icons/fi";
import BookList from "../components/BookList";
import SearchBar from "../components/SearchBar";
import LoadingSpinner from "../components/LoadingSpinner";
import { useBooks } from "../context/BooksContext";
import { SORT_OPTIONS } from "../utils/constants";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(query);
  const [sortBy, setSortBy] = useState("relevance");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    yearFrom: "",
    yearTo: "",
    language: "",
    hasCover: false,
  });
  const [isSearching, setIsSearching] = useState(false);

  const { searchBooksByQuery, searchResults, isLoading, error } = useBooks();

  // Fixed: Use useCallback to prevent infinite re-renders
  const handleSearch = useCallback((e) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
    }
  }, [searchQuery, setSearchParams]);

  // Fixed: Only run when query changes, not searchBooksByQuery
  useEffect(() => {
    if (query && query.trim()) {
      const performSearch = async () => {
        setIsSearching(true);
        await searchBooksByQuery(query);
        setIsSearching(false);
      };
      performSearch();
    }
  }, [query]); // Only depend on query, not searchBooksByQuery

  // Handle search on mount if there's a query in URL
  useEffect(() => {
    if (query && query.trim() && searchResults.length === 0) {
      const initialSearch = async () => {
        setIsSearching(true);
        await searchBooksByQuery(query);
        setIsSearching(false);
      };
      initialSearch();
    }
  }, []); // Empty dependency - only run once on mount

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      yearFrom: "",
      yearTo: "",
      language: "",
      hasCover: false,
    });
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchParams({});
  };

  const filteredBooks = searchResults.filter((book) => {
    if (
      filters.yearFrom &&
      book.first_publish_year < parseInt(filters.yearFrom)
    ) {
      return false;
    }
    if (filters.yearTo && book.first_publish_year > parseInt(filters.yearTo)) {
      return false;
    }
    if (filters.hasCover && !book.cover_i) {
      return false;
    }
    if (filters.language && filters.language !== "all") {
      // Note: OpenLibrary API doesn't always provide language in search results
      // You might need to adjust this based on your actual data structure
      return true;
    }
    return true;
  });

  return (
    <div className="container-custom py-8">
      <div className="space-y-8">
        {/* Search Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="heading-2">Search Books</h1>
            {query && (
              <button
                onClick={clearSearch}
                className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Clear Search
              </button>
            )}
          </div>
          <form onSubmit={handleSearch} className="relative max-w-3xl">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for books, authors, or topics..."
              className="input-base text-lg py-4 pl-12 pr-24 w-full"
              autoFocus
            />
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
            <button
              type="submit"
              disabled={isSearching || !searchQuery.trim()}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSearching ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Searching...
                </div>
              ) : (
                "Search"
              )}
            </button>
          </form>

          {query && (
            <div className="flex items-center justify-between">
              <p className="text-gray-600 dark:text-gray-400">
                Found {searchResults.length} results for "{query}"
                {isSearching && " (searching...)"}
              </p>
              {searchResults.length > 0 && (
                <div className="flex items-center space-x-4">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="input-base text-sm"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <FiFilter className="w-5 h-5" />
                    <span>Filters</span>
                    {Object.values(filters).some(val => val !== "" && val !== false) && (
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 space-y-6 animate-slideDown">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Filters</h3>
              <button
                onClick={clearFilters}
                className="flex items-center space-x-2 text-sm text-red-500 hover:text-red-600"
              >
                <FiX className="w-4 h-4" />
                <span>Clear all</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="label-base block mb-2">
                  Publication Year
                </label>
                <div className="flex space-x-4">
                  <input
                    type="number"
                    placeholder="From"
                    value={filters.yearFrom}
                    onChange={(e) =>
                      handleFilterChange("yearFrom", e.target.value)
                    }
                    className="input-base"
                    min="1000"
                    max="2100"
                  />
                  <input
                    type="number"
                    placeholder="To"
                    value={filters.yearTo}
                    onChange={(e) =>
                      handleFilterChange("yearTo", e.target.value)
                    }
                    className="input-base"
                    min="1000"
                    max="2100"
                  />
                </div>
              </div>

              <div>
                <label className="label-base block mb-2">Language</label>
                <select
                  value={filters.language}
                  onChange={(e) =>
                    handleFilterChange("language", e.target.value)
                  }
                  className="input-base"
                >
                  <option value="">All Languages</option>
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>

              <div>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.hasCover}
                    onChange={(e) =>
                      handleFilterChange("hasCover", e.target.checked)
                    }
                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="label-base">Has Cover Image</span>
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  Only show books with cover images
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Search Results */}
        {isLoading || isSearching ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <LoadingSpinner size="lg" text={isSearching ? "Searching books..." : "Loading..."} />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 text-red-500 mb-4">
              <FiAlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Search Error</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <button
              onClick={() => searchBooksByQuery(query)}
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        ) : query ? (
          <>
            {filteredBooks.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-bold mb-2">No Results Found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  No books found for "{query}" with current filters
                </p>
                <button
                  onClick={clearFilters}
                  className="btn-outline mr-4"
                >
                  Clear Filters
                </button>
                <button
                  onClick={clearSearch}
                  className="btn-primary"
                >
                  New Search
                </button>
              </div>
            ) : (
              <BookList
                books={filteredBooks}
                title={`Results for "${query}"`}
              />
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-bold mb-2">Start Searching</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Enter a book title, author name, or topic to begin your search
            </p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              {[
                { icon: "📖", text: "Search by book title", example: "Harry Potter" },
                { icon: "✍️", text: "Search by author name", example: "Stephen King" },
                { icon: "🏷️", text: "Search by genre or topic", example: "Science Fiction" },
              ].map((tip, index) => (
                <div
                  key={index}
                  className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl hover:shadow-md transition-shadow"
                >
                  <div className="text-3xl mb-3">{tip.icon}</div>
                  <p className="text-sm font-medium mb-2">{tip.text}</p>
                  <p className="text-xs text-gray-500">e.g., {tip.example}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search Tips */}
        {!query && (
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-8">
            <h3 className="text-xl font-bold mb-4">Search Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold mb-2">📚 Try These Searches</h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Harry Potter",
                    "Stephen King",
                    "Science Fiction",
                    "Biography",
                    "Classic Novels",
                  ].map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setSearchQuery(term);
                        setSearchParams({ q: term });
                      }}
                      className="px-3 py-1.5 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-bold mb-2">💡 Advanced Search</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Use quotes for exact phrases: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">"To Kill a Mockingbird"</code></span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Search by ISBN: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">9780451524935</code></span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Combine terms: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">mystery AND thriller</code></span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Exclude terms: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">fantasy -romance</code></span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
