import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiBook,
  FiTrendingUp,
  FiStar,
  FiArrowRight,
} from "react-icons/fi";
import { useBooks } from "../context/BooksContext";
import { useReadingList } from "../context/ReadingListContext";
import BookList from "../components/BookList";
import SearchBar from "../components/SearchBar";
import LoadingSpinner from "../components/LoadingSpinner";
import { CATEGORIES } from "../utils/constants";

const HomePage = () => {
  const { featuredBooks, fetchFeaturedBooks, isLoading } = useBooks();
  const { readingList } = useReadingList();
  const [stats, setStats] = useState({
    totalBooks: 1250000,
    activeReaders: 50000,
    avgRating: 4.2,
  });

  useEffect(() => {
    fetchFeaturedBooks();
  }, [fetchFeaturedBooks]);

  const heroBooks = featuredBooks.slice(0, 3);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-primary/10 via-secondary/10 to-transparent dark:from-primary/5 dark:via-secondary/5 rounded-3xl">
        <div className="container-custom py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h1 className="heading-1 mb-6">
                  Discover Your Next{" "}
                  <span className="gradient-primary-text">Favorite Book</span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  Explore millions of books, track your reading progress, and
                  connect with fellow readers. Your digital bookshelf awaits.
                </p>
              </div>

              <SearchBar compact={true} />

              <div className="flex flex-wrap gap-6">
                <div className="flex items-center space-x-2">
                  <FiBook className="w-5 h-5 text-primary" />
                  <span className="font-bold text-2xl">
                    {stats.totalBooks.toLocaleString()}+
                  </span>
                  <span className="text-gray-500">Books</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiTrendingUp className="w-5 h-5 text-secondary" />
                  <span className="font-bold text-2xl">
                    {stats.activeReaders.toLocaleString()}+
                  </span>
                  <span className="text-gray-500">Readers</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiStar className="w-5 h-5 text-yellow-500" />
                  <span className="font-bold text-2xl">{stats.avgRating}</span>
                  <span className="text-gray-500">Avg Rating</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-6">
                {heroBooks.map((book, index) => (
                  <div
                    key={book.key}
                    className={`animate-float ${
                      index === 0 ? "col-span-2" : ""
                    }`}
                    style={{ animationDelay: `${index * 1}s` }}
                  >
                    <Link to={`/book/${book.key.replace("/works/", "")}`}>
                      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden hover:shadow-3xl transition-shadow">
                        {book.cover_i ? (
                          <img
                            src={`https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`}
                            alt={book.title}
                            className="w-full h-64 md:h-80 object-cover"
                          />
                        ) : (
                          <div className="w-full h-64 md:h-80 bg-linear-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                            <FiBook className="w-20 h-20 text-primary" />
                          </div>
                        )}
                        <div className="p-6">
                          <h3 className="font-bold line-clamp-2">
                            {book.title}
                          </h3>
                          <p className="text-gray-500 text-sm mt-2">
                            {book.author_name?.join(", ")}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="heading-2">Browse by Category</h2>
          <Link
            to="/categories"
            className="flex items-center space-x-2 text-primary hover:underline"
          >
            <span>View All</span>
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map((category) => (
            <Link
              key={category.id}
              to={`/categories?filter=${category.id}`}
              className={`${category.color} rounded-2xl p-6 hover:scale-105 transition-transform duration-300`}
            >
              <div className="space-y-4">
                <div className="text-4xl">
                  {category.id === "fiction" && "📖"}
                  {category.id === "science" && "🔬"}
                  {category.id === "fantasy" && "🐉"}
                  {category.id === "mystery" && "🕵️"}
                  {category.id === "biography" && "👤"}
                  {category.id === "history" && "🏛️"}
                  {category.id === "technology" && "💻"}
                  {category.id === "romance" && "❤️"}
                </div>
                <h3 className="font-bold text-lg">{category.name}</h3>
                <p className="text-sm opacity-75">
                  {Math.floor(Math.random() * 5000) + 1000} books
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Books */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="heading-2">Featured Books</h2>
          <Link
            to="/search"
            className="flex items-center space-x-2 text-primary hover:underline"
          >
            <span>Explore More</span>
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <LoadingSpinner size="lg" text="Loading featured books..." />
          </div>
        ) : (
          <BookList books={featuredBooks} showFilters={false} />
        )}
      </section>

      {/* Reading List Preview */}
      {readingList.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="heading-2">Your Reading List</h2>
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
                    className="btn-primary w-full text-center"
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
          <h2 className="heading-2 mb-6">
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
