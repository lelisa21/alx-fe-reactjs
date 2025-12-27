import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { FiGrid, FiList, FiTrendingUp, FiStar, FiClock } from "react-icons/fi";
import BookList from "../components/BookList";
import LoadingSpinner from "../components/LoadingSpinner";
import { useBooks } from "../context/BooksContext";
import { CATEGORIES } from "../utils/constants";

const CategoriesPage = () => {
  const [searchParams] = useSearchParams();
  const filter = searchParams.get("filter") || "";
  const [selectedCategory, setSelectedCategory] = useState(filter || "all");
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { fetchBooksBySubject } = useBooks();
useEffect(() => {
  const loadBooks = async () => {
    setIsLoading(true);
    try {
      if (selectedCategory === "all") {
        const fictionBooks = await fetchBooksBySubject("fiction", 5);
        const fantasyBooks = await fetchBooksBySubject("fantasy", 5);
        const mysteryBooks = await fetchBooksBySubject("mystery", 5);
        setBooks([...fictionBooks, ...fantasyBooks, ...mysteryBooks]);
      } else {
        const categoryBooks = await fetchBooksBySubject(selectedCategory, 20);
        setBooks(categoryBooks);
      }
    } catch (error) {
      console.error("Error loading books:", error);
      setBooks([]); 
    } finally {
      setIsLoading(false);
    }
  };

  loadBooks();
}, [selectedCategory]); 

  const getCategoryInfo = (categoryId) => {
    if (categoryId === "all") {
      return {
        name: "All Categories",
        description: "Browse books from all categories",
        icon: "📚",
        color: "bg-linear-to-r from-primary/10 to-secondary/10",
        stats: {
          totalBooks: 1250000,
          avgRating: 4.2,
          trending: "Fiction",
        },
      };
    }
    const category = CATEGORIES.find((c) => c.id === categoryId);
    if (!category) return null;

    const descriptions = {
      fiction: "Explore imaginary worlds and compelling narratives.",
      science: "Discover scientific knowledge and breakthroughs.",
      fantasy: "Journey through magical realms and epic adventures.",
      mystery: "Solve puzzles and uncover hidden secrets.",
      biography: "Learn from the lives of remarkable individuals.",
      history: "Understand the past through historical accounts.",
      technology: "Stay updated with tech innovations and trends.",
      romance: "Experience love stories and emotional journeys.",
    };

    return {
      ...category,
      description: descriptions[categoryId] || "Explore books in this category",
      icon: {
        fiction: "📖",
        science: "🔬",
        fantasy: "🐉",
        mystery: "🕵️",
        biography: "👤",
        history: "🏛️",
        technology: "💻",
        romance: "❤️",
      }[categoryId],
      color: category.color,
      stats: {
        totalBooks: Math.floor(Math.random() * 50000) + 10000,
        avgRating: (Math.random() * 2 + 3).toFixed(1),
        trending: "Popular this month",
      },
    };
  };

  const categoryInfo = getCategoryInfo(selectedCategory);

  return (
    <div className="container-custom py-8">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="heading-2 mb-4">Browse Categories</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Explore books by category to find your next great read
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`p-4 rounded-xl border-2 transition-all ${
              selectedCategory === "all"
                ? "bg-linear-to-r from-primary to-secondary border-primary text-white"
                : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-primary"
            }`}
          >
            <div className="space-y-2 text-center">
              <div className="text-2xl">📚</div>
              <div className="text-sm font-medium">All</div>
            </div>
          </button>

          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`p-4 rounded-xl border-2 transition-all ${
                selectedCategory === category.id
                  ? `${category.color} border-primary scale-105`
                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-primary"
              }`}
            >
              <div className="space-y-2 text-center">
                <div className="text-2xl">
                  {
                    {
                      fiction: "📖",
                      science: "🔬",
                      fantasy: "🐉",
                      mystery: "🕵️",
                      biography: "👤",
                      history: "🏛️",
                      technology: "💻",
                      romance: "❤️",
                    }[category.id]
                  }
                </div>
                <div className="text-sm text-white font-medium">{category.name}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Category Info */}
        {categoryInfo && (
          <div className={`${categoryInfo.color} rounded-2xl p-8`}>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="text-6xl">{categoryInfo.icon}</div>
                  <div>
                    <h2 className="heading-3">{categoryInfo.name}</h2>
                    <p className="text-gray-900 dark:text-gray-300 mt-2">
                      {categoryInfo.description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white/80 dark:bg-black/50 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <FiGrid className="w-5 h-5" />
                      <span className="font-bold">Books</span>
                    </div>
                    <div className="text-2xl font-bold">
                      {categoryInfo.stats.totalBooks.toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-white/50 dark:bg-black/50 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <FiStar className="w-5 h-5" />
                      <span className="font-bold">Avg Rating</span>
                    </div>
                    <div className="text-2xl font-bold">
                      {categoryInfo.stats.avgRating}
                    </div>
                  </div>
                  <div className="bg-white/50 dark:bg-black/50 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <FiTrendingUp className="w-5 h-5" />
                      <span className="font-bold">Trending</span>
                    </div>
                    <div className="text-lg font-bold">
                      {categoryInfo.stats.trending}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-6">
                <h3 className="font-bold mb-4">
                  Popular in {categoryInfo.name}
                </h3>
                <ul className="space-y-3">
                  {[
                    "Top Rated Books",
                    "New Releases",
                    "Most Read This Month",
                    "Editor Picks",
                    "Award Winners",
                  ].map((item, index) => (
                    <li key={index}>
                      <Link
                        to={`/search?q=${encodeURIComponent(
                          item.toLowerCase()
                        )}&category=${selectedCategory}`}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-primary"
                      >
                        <span>{item}</span>
                        <FiClock className="w-4 h-4 text-gray-400" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Books */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">
              {selectedCategory === "all"
                ? "All Books"
                : `${categoryInfo?.name} Books`}
            </h3>
            <p className="text-gray-500">
              {isLoading ? "Loading..." : `${books.length} books found`}
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <LoadingSpinner size="lg" text="Loading books..." />
            </div>
          ) : (
            <BookList books={books} showFilters={true} />
          )}
        </div>

        {/* Category Description */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8">
          <h3 className="text-xl font-bold mb-4">About {categoryInfo?.name}</h3>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {categoryInfo?.description}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold mb-3">What You'll Find</h4>
                <ul className="space-y-2">
                  <li className="flex items-start space-x-2">
                    <span className="text-primary">•</span>
                    <span>Classic and contemporary works</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary">•</span>
                    <span>Award-winning titles</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary">•</span>
                    <span>Critically acclaimed authors</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary">•</span>
                    <span>Reader favorites and recommendations</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-3">Tips for Discovery</h4>
                <ul className="space-y-2">
                  <li className="flex items-start space-x-2">
                    <span className="text-primary">•</span>
                    <span>Filter by publication year</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary">•</span>
                    <span>Sort by rating or popularity</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary">•</span>
                    <span>Look for award winners</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary">•</span>
                    <span>Check out editor picks</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
