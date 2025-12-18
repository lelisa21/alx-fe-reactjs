import { useState, useCallback } from 'react';
import { searchBooks, getBookDetails, getBooksBySubject } from '../utils/api';

export const useBooks = () => {
  const [books, setBooks] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchBooksByQuery = useCallback(async (query, page = 1) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const results = await searchBooks(query, page);
      setSearchResults(results);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchBookDetails = useCallback(async (bookId) => {
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

  const fetchBooksBySubject = useCallback(async (subject, limit = 20) => {
    setIsLoading(true);
    setError(null);
    try {
      const books = await getBooksBySubject(subject, limit);
      setBooks(books);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearSearchResults = useCallback(() => {
    setSearchResults([]);
    setError(null);
  }, []);

  return {
    books,
    searchResults,
    isLoading,
    error,
    searchBooksByQuery,
    fetchBookDetails,
    fetchBooksBySubject,
    clearSearchResults,
    setBooks,
  };
};
