import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FiSearch, FiFilter, FiX, FiBook } from "react-icons/fi";
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

  const { searchBooksByQuery, searchResults, isLoading, error } = useBooks();

  useEffect(() => {
    if (query) {
      searchBooksByQuery(query);
      setSearchQuery(query);
    }
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
    }
  };

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
    return true;
  });

  return (
    <div className="container-custom py-8">
      <div className="space-y-8">
        {/* Search Header */}
        <div className="space-y-4">
          <h1 className="heading-2">Search Books</h1>
          <form onSubmit={handleSearch} className="relative max-w-3xl">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for books, authors, or topics..."
              className="input-base text-lg py-4 pl-12 pr-24"
              autoFocus
            />
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-primary px-6"
            >
              Search
            </button>
          </form>

          {query && (
            <div className="flex items-center justify-between">
              <p className="text-gray-600 dark:text-gray-400">
                Found {searchResults.length} results for "{query}"
              </p>
              <div className="flex items-center space-x-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input-base"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      Sort by: {option.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <FiFilter className="w-5 h-5" />
                  <span>Filters</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 space-y-6">
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
                  />
                  <input
                    type="number"
                    placeholder="To"
                    value={filters.yearTo}
                    onChange={(e) =>
                      handleFilterChange("yearTo", e.target.value)
                    }
                    className="input-base"
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
              </div>
            </div>
          </div>
        )}

        {/* Search Results */}
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <LoadingSpinner size="lg" text="Searching books..." />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold mb-2">Search Error</h3>
            <p className="text-gray-600 dark:text-gray-400">{error}</p>
            <button
              onClick={() => searchBooksByQuery(query)}
              className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Try Again
            </button>
          </div>
        ) : query ? (
          <BookList
            books={filteredBooks}
            title={`Results for "${query}"`}
            isLoading={isLoading}
          />
        ) : (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-bold mb-2">Start Searching</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Enter a book title, author name, or topic to begin your search
            </p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              {[
                { icon: "📖", text: "Search by book title" },
                { icon: "✍️", text: "Search by author name" },
                { icon: "🏷️", text: "Search by genre or topic" },
              ].map((tip, index) => (
                <div
                  key={index}
                  className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl"
                >
                  <div className="text-3xl mb-3">{tip.icon}</div>
                  <p className="text-sm">{tip.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search Tips */}
        {!query && (
          <div className="bg-linear-to-r from-primary/5 to-secondary/5 rounded-2xl p-8">
            <h3 className="text-xl font-bold mb-4">Search Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold mb-2">📚 Try These Searches</h4>
                <ul className="space-y-2">
                  {[
                    "Harry Potter",
                    "Stephen King",
                    "Science Fiction",
                    "Biography",
                    "Classic Novels",
                  ].map((term) => (
                    <li key={term}>
                      <button
                        onClick={() => {
                          setSearchQuery(term);
                          setSearchParams({ q: term });
                        }}
                        className="text-primary hover:underline"
                      >
                        {term}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-2">💡 Advanced Search</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>Use quotes for exact phrases: "To Kill a Mockingbird"</li>
                  <li>Search by ISBN: 9780451524935</li>
                  <li>Combine terms: mystery AND thriller</li>
                  <li>Exclude terms: fantasy -romance</li>
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
