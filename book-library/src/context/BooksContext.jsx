import React, { createContext, useState, useContext, useCallback } from 'react';
import { searchBooks, getBookDetails, getBooksBySubject } from '../utils/api'; 

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
  
      const books = await getBooksBySubject('fiction', 10);
      setFeaturedBooks(books);
    } catch (err) {
      console.error('Error fetching featured books:', err);

      setFeaturedBooks([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchBooksBySubject = useCallback(async (subject, limit = 20) => {
    setIsLoading(true);
    setError(null);
    try {
      const books = await getBooksBySubject(subject, limit);
      return books; 
    } catch (err) {
      setError(err.message);
      return []; 
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
    fetchBooksBySubject, 
    clearSearchResults,
    setBooks,
  };

  return (
    <BooksContext.Provider value={value}>
      {children}
    </BooksContext.Provider>
  );
};
