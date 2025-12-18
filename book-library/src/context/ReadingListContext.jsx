import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ReadingListContext = createContext();

export const useReadingList = () => {
  const context = useContext(ReadingListContext);
  if (!context) {
    throw new Error('useReadingList must be used within a ReadingListProvider');
  }
  return context;
};

export const ReadingListProvider = ({ children }) => {
  const { user } = useAuth();
  const [readingList, setReadingList] = useState([]);
  const [readingProgress, setReadingProgress] = useState({});

  useEffect(() => {
    if (user) {
      const storedReadingList = localStorage.getItem(`readingList_${user.id}`);
      const storedProgress = localStorage.getItem(`readingProgress_${user.id}`);
      
      if (storedReadingList) {
        setReadingList(JSON.parse(storedReadingList));
      }
      if (storedProgress) {
        setReadingProgress(JSON.parse(storedProgress));
      }
    }
  }, [user]);

  const addToReadingList = (book) => {
    if (!user) {
      throw new Error('You must be logged in to add books to your reading list');
    }

    const isAlreadyInList = readingList.some(item => item.key === book.key);
    if (isAlreadyInList) {
      throw new Error('Book is already in your reading list');
    }

    const newReadingList = [...readingList, { ...book, addedAt: new Date().toISOString() }];
    setReadingList(newReadingList);
    
    if (user) {
      localStorage.setItem(`readingList_${user.id}`, JSON.stringify(newReadingList));
    }
  };

  const removeFromReadingList = (bookId) => {
    const newReadingList = readingList.filter(book => book.key !== bookId);
    setReadingList(newReadingList);
    
    if (user) {
      localStorage.setItem(`readingList_${user.id}`, JSON.stringify(newReadingList));
    }
  };

  const updateReadingProgress = (bookId, progress) => {
    const newProgress = { ...readingProgress, [bookId]: progress };
    setReadingProgress(newProgress);
    
    if (user) {
      localStorage.setItem(`readingProgress_${user.id}`, JSON.stringify(newProgress));
    }
  };

  const getReadingProgress = (bookId) => {
    return readingProgress[bookId] || 0;
  };

  const clearReadingList = () => {
    setReadingList([]);
    setReadingProgress({});
    
    if (user) {
      localStorage.removeItem(`readingList_${user.id}`);
      localStorage.removeItem(`readingProgress_${user.id}`);
    }
  };

  const value = {
    readingList,
    readingProgress,
    addToReadingList,
    removeFromReadingList,
    updateReadingProgress,
    getReadingProgress,
    clearReadingList,
    hasBook: (bookId) => readingList.some(book => book.key === bookId),
  };

  return (
    <ReadingListContext.Provider value={value}>
      {children}
    </ReadingListContext.Provider>
  );
};
