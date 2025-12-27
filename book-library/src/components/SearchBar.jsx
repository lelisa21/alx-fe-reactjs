import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiX, FiBook } from "react-icons/fi";
import { useBooks } from "../context/BooksContext";
import { useDebounce } from "../hooks/useDebounce";

const SearchBar = ({ onClose, compact = false }) => {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const { searchBooksByQuery, searchResults, isLoading, clearSearchResults } =
    useBooks();
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery.trim()) {
      searchBooksByQuery(debouncedQuery);
      setShowSuggestions(true);
    } else {
      clearSearchResults();
      setShowSuggestions(false);
    }
  }, [debouncedQuery, searchBooksByQuery, clearSearchResults]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setShowSuggestions(false);
      onClose?.();
    }
  };

  const handleSuggestionClick = (book) => {
    navigate(`/book/${book.key.replace("/works/", "")}`);
    setShowSuggestions(false);
    setQuery("");
    onClose?.();
  };

  const clearSearch = () => {
    setQuery("");
    clearSearchResults();
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className={`relative ${compact ? "" : "max-w-2xl mx-auto"}`}>
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for books, authors, or topics..."
            className="input-base pl-12 pr-12 text-lg py-3 w-full"
            autoFocus={!compact}
            onFocus={() => query && setShowSuggestions(true)}
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
            >
              <FiX className="w-5 h-5 text-gray-400" />
            </button>
          )}
        </div>
        {!compact && (
          <div className="mt-4 flex justify-center">
            <button
              type="submit"
              className="btn-primary px-8"
              disabled={!query.trim()}
            >
              Search Books
            </button>
          </div>
        )}
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && query && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl max-h-96 overflow-y-auto z-50">
          {isLoading ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-gray-500">Searching...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="py-2">
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-800">
                <p className="text-sm text-gray-500">
                  Found {searchResults.length} results for "{query}"
                </p>
              </div>
              {searchResults.slice(0, 8).map((book) => (
                <button
                  key={book.key}
                  onClick={() => handleSuggestionClick(book)}
                  className="w-full text-left p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-start space-x-3"
                >
                  <div className="shrink-0">
                    {book.cover_i ? (
                      <img
                        src={`https://covers.openlibrary.org/b/id/${book.cover_i}-S.jpg`}
                        alt={book.title}
                        className="w-12 h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-16 bg-gray-200 dark:bg-gray-800 rounded flex items-center justify-center">
                        <FiBook className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="grow">
                    <h4 className="font-medium line-clamp-1">{book.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {book.author_name?.join(", ")}
                    </p>
                    {book.first_publish_year && (
                      <p className="text-xs text-gray-400 mt-1">
                        Published: {book.first_publish_year}
                      </p>
                    )}
                  </div>
                </button>
              ))}
              <div className="border-t border-gray-200 dark:border-gray-800">
                <button
                  onClick={handleSubmit}
                  className="w-full p-4 text-primary hover:bg-gray-100 dark:hover:bg-gray-800 text-center font-medium"
                >
                  View all results →
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center">
              <FiBook className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No books found for "{query}"</p>
              <p className="text-sm text-gray-400 mt-2">
                Try different keywords or check the spelling
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
