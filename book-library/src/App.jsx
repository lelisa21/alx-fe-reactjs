
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import NavBar from './components/NavBar';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';

import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import CategoriesPage from './pages/CategoriesPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { BooksProvider } from './context/BooksContext';


import { ReadingListProvider } from './context/ReadingListContext';
const BookDetailPage = React.lazy(() => import('./pages/BookDetailPage'));

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <BooksProvider>
            <ReadingListProvider>
              <Router>
                <div className="min-h-screen flex flex-col bg-background text-foreground">
                  <NavBar />
                  <main className="grow">
                    <Suspense fallback={<div className="flex justify-center items-center min-h-[60vh]"><LoadingSpinner size="lg" /></div>}>
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="/book/:id" element={<BookDetailPage />} />
                        <Route path="/categories" element={<CategoriesPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="*" element={
                          <div className="container-custom py-12">
                            <div className="text-center">
                              <h1 className="text-4xl font-bold mb-4">404</h1>
                              <p className="text-gray-600 dark:text-gray-400 mb-6">Page not found</p>
                              <a href="/" className="btn-primary">Go Home</a>
                            </div>
                          </div>
                        } />
                      </Routes>
                    </Suspense>
                  </main>
                  <Footer />
                </div>
              </Router>
            </ReadingListProvider>
          </BooksProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
