import React, { createContext, useState, useContext, useCallback } from 'react';
import { searchBooks, getBookDetails } from '../utils/api';

const BooksContext = createContext();

export const useBooks = () => {
  const context = useContext(BooksContext);
  if (!context) {
    throw new Error('useBooks must be used within a BooksProvider');
  }
  return context;
};

export const BooksProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchBooksByQuery = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const results = await searchBooks(query);
      setSearchResults(results);
    } catch (err) {
      setError(err.message);
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchFeaturedBooks = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch popular books for featured section
      const popularTitles = ['Harry Potter', 'The Hobbit', '1984', 'Pride and Prejudice', 'To Kill a Mockingbird'];
      const allBooks = [];
      
      for (const title of popularTitles.slice(0, 3)) {
        const books = await searchBooks(title);
        if (books.length > 0) {
          allBooks.push(books[0]);
        }
      }
      
      setFeaturedBooks(allBooks);
    } catch (err) {
      console.error('Error fetching featured books:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getBookById = useCallback(async (bookId) => {
    setIsLoading(true);
    setError(null);
    try {
      const book = await getBookDetails(bookId);
      return book;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearSearchResults = () => {
    setSearchResults([]);
    setError(null);
  };

  const value = {
    books,
    searchResults,
    featuredBooks,
    isLoading,
    error,
    searchBooksByQuery,
    fetchFeaturedBooks,
    getBookById,
    clearSearchResults,
    setBooks,
  };

  return (
    <BooksContext.Provider value={value}>
      {children}
    </BooksContext.Provider>
  );
};
