import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiBook,
  FiTrendingUp,
  FiStar,
  FiArrowRight,
  FiAlertCircle,
} from "react-icons/fi";
import { useBooks } from "../context/BooksContext";
import { useReadingList } from "../context/ReadingListContext";
import BookList from "../components/BookList";
import SearchBar from "../components/SearchBar";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorDisplay from "../components/ErrorDisplay";
import { CATEGORIES } from "../utils/constants";

const HomePage = () => {
  const { 
    featuredBooks, 
    fetchFeaturedBooks, 
    isLoading: booksLoading, 
    error: booksError,
    fetchBooksBySubject 
  } = useBooks();
  
  const { readingList } = useReadingList();
  const [stats, setStats] = useState({
    totalBooks: 1250000,
    activeReaders: 50000,
    avgRating: 4.2,
  });
  const [categoryStats, setCategoryStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch featured books
        await fetchFeaturedBooks();
        
        // Load stats for each category
        const statsPromises = CATEGORIES.map(async (category) => {
          try {
            const books = await fetchBooksBySubject(category.id, 5);
            return {
              id: category.id,
              count: books.length,
              avgRating: books.length > 0 
                ? (books.reduce((sum, book) => sum + (book.ratings_average || 3.5), 0) / books.length).toFixed(1)
                : "4.0"
            };
          } catch (err) {
            console.error(`Error loading stats for ${category.id}:`, err);
            return {
              id: category.id,
              count: Math.floor(Math.random() * 5000) + 1000,
              avgRating: (Math.random() * 1.5 + 3).toFixed(1)
            };
          }
        });
        
        const statsResults = await Promise.all(statsPromises);
        const statsMap = {};
        statsResults.forEach(stat => {
          statsMap[stat.id] = stat;
        });
        
        setCategoryStats(statsMap);
        
      } catch (err) {
        console.error("Error loading homepage data:", err);
        setError("Failed to load homepage data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [fetchFeaturedBooks, fetchBooksBySubject]);

  const heroBooks = featuredBooks.slice(0, 3);
  
  const getCategoryIcon = (categoryId) => {
    const icons = {
      fiction: "📖",
      science: "🔬",
      fantasy: "🐉",
      mystery: "🕵️",
      biography: "👤",
      history: "🏛️",
      technology: "💻",
      romance: "❤️",
    };
    return icons[categoryId] || "📚";
  };

  if (isLoading && !featuredBooks.length) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner size="lg" text="Loading homepage..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-custom py-12">
        <ErrorDisplay 
          error={error} 
          onRetry={() => window.location.reload()}
          title="Failed to Load Homepage"
        />
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-primary/10 via-secondary/10 to-transparent dark:from-primary/5 dark:via-secondary/5 rounded-3xl">
        <div className="container-custom py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  Discover Your Next{" "}
                  <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Favorite Book
                  </span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  Explore millions of books, track your reading progress, and
                  connect with fellow readers. Your digital bookshelf awaits.
                </p>
              </div>

              <div className="max-w-lg">
                <SearchBar compact={true} />
              </div>

              <div className="flex flex-wrap gap-6">
                <div className="flex items-center space-x-2 bg-white/50 dark:bg-gray-800/50 px-4 py-3 rounded-xl">
                  <FiBook className="w-5 h-5 text-primary" />
                  <span className="font-bold text-2xl">
                    {stats.totalBooks.toLocaleString()}+
                  </span>
                  <span className="text-gray-500">Books</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/50 dark:bg-gray-800/50 px-4 py-3 rounded-xl">
                  <FiTrendingUp className="w-5 h-5 text-secondary" />
                  <span className="font-bold text-2xl">
                    {stats.activeReaders.toLocaleString()}+
                  </span>
                  <span className="text-gray-500">Readers</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/50 dark:bg-gray-800/50 px-4 py-3 rounded-xl">
                  <FiStar className="w-5 h-5 text-yellow-500" />
                  <span className="font-bold text-2xl">{stats.avgRating}</span>
                  <span className="text-gray-500">Avg Rating</span>
                </div>
              </div>
            </div>

            <div className="relative">
              {heroBooks.length > 0 ? (
                <div className="grid grid-cols-2 gap-6">
                  {heroBooks.map((book, index) => (
                    <div
                      key={book.key}
                      className={`animate-float ${index === 0 ? "col-span-2" : ""}`}
                      style={{ animationDelay: `${index * 0.5}s` }}
                    >
                      <Link to={`/book/${book.key.replace("/works/", "")}`}>
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                          {book.cover_i ? (
                            <img
                              src={`https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`}
                              alt={book.title}
                              className="w-full h-64 md:h-80 object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-64 md:h-80 bg-linear-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                              <FiBook className="w-20 h-20 text-primary/50" />
                            </div>
                          )}
                          <div className="p-6">
                            <h3 className="font-bold text-lg line-clamp-2">
                              {book.title}
                            </h3>
                            <p className="text-gray-500 text-sm mt-2">
                              {book.author_name?.join(", ") || "Unknown Author"}
                            </p>
                            {book.ratings_average && (
                              <div className="flex items-center mt-3">
                                <FiStar className="w-4 h-4 text-yellow-500 mr-1" />
                                <span className="text-sm">{book.ratings_average.toFixed(1)}</span>
                                <span className="text-gray-400 text-sm ml-2">
                                  ({book.ratings_count || 0})
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-12 text-center">
                  <FiBook className="w-24 h-24 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">No Featured Books</h3>
                  <p className="text-gray-500">Check back later for featured books</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Browse by Category</h2>
          <Link
            to="/categories"
            className="flex items-center space-x-2 text-primary hover:underline"
          >
            <span>View All</span>
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map((category) => {
            const stats = categoryStats[category.id] || { count: 0, avgRating: "4.0" };
            
            return (
              <Link
                key={category.id}
                to={`/categories?filter=${category.id}`}
                className={`${category.color} rounded-2xl p-6 hover:scale-105 transition-transform duration-300 hover:shadow-lg`}
              >
                <div className="space-y-4">
                  <div className="text-4xl">{getCategoryIcon(category.id)}</div>
                  <h3 className="font-bold text-lg">{category.name}</h3>
                  <div className="space-y-1">
                    <p className="text-sm opacity-75">
                      {stats.count.toLocaleString()} books
                    </p>
                    <div className="flex items-center">
                      <FiStar className="w-3 h-3 text-yellow-500 mr-1" />
                      <span className="text-xs opacity-75">{stats.avgRating} avg rating</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Books */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Featured Books</h2>
          <Link
            to="/search"
            className="flex items-center space-x-2 text-primary hover:underline"
          >
            <span>Explore More</span>
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {booksLoading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <LoadingSpinner size="lg" text="Loading featured books..." />
          </div>
        ) : booksError ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 text-center">
            <FiAlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2">Failed to Load Featured Books</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{booksError}</p>
            <button
              onClick={fetchFeaturedBooks}
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        ) : featuredBooks.length > 0 ? (
          <BookList books={featuredBooks} showFilters={false} />
        ) : (
          <div className="text-center py-12">
            <FiBook className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No Featured Books Available</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Check back later for featured books or search for books
            </p>
            <Link to="/search" className="btn-primary">
              Browse Books
            </Link>
          </div>
        )}
      </section>

      {/* Reading List Preview */}
      {readingList.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Your Reading List</h2>
            <Link
              to="/profile"
              className="flex items-center space-x-2 text-primary hover:underline"
            >
              <span>Manage List</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-linear-to-r from-primary/5 to-secondary/5 rounded-3xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <BookList books={readingList.slice(0, 4)} showFilters={false} />
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8">
                <div className="space-y-6">
                  <h3 className="text-xl font-bold">Reading Progress</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Books in List</span>
                        <span className="font-bold">{readingList.length}</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                        <div
                          className="h-full bg-linear-to-r from-primary to-secondary rounded-full"
                          style={{ width: "100%" }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Currently Reading</span>
                        <span className="font-bold">
                          {Math.floor(readingList.length * 0.6)}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                        <div
                          className="h-full bg-linear-to-r from-green-500 to-emerald-600 rounded-full"
                          style={{ width: "60%" }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Completed</span>
                        <span className="font-bold">
                          {Math.floor(readingList.length * 0.4)}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                        <div
                          className="h-full bg-linear-to-r from-blue-500 to-purple-600 rounded-full"
                          style={{ width: "40%" }}
                        />
                      </div>
                    </div>
                  </div>
                  <Link
                    to="/profile"
                    className="btn-primary w-full text-center py-3"
                  >
                    View Full Progress
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="text-center py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Start Your Reading Journey?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Join thousands of readers who are discovering new books and tracking
            their progress.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/search" className="btn-primary px-8 py-3 text-lg">
              <FiSearch className="inline mr-2" />
              Explore Books
            </Link>
            <Link to="/register" className="btn-outline px-8 py-3 text-lg">
              Join for Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
