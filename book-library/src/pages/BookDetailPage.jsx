import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiHeart,
  FiShare2,
  FiBookOpen,
  FiStar,
  FiCalendar,
  FiUser,
  FiTag,
  FiClock,
  FiExternalLink,
} from "react-icons/fi";
import { useBooks } from "../context/BooksContext";
import { useReadingList } from "../context/ReadingListContext";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import ReviewSection from "../components/ReviewSection";
import {
  formatDate,
  truncateText,
  calculateReadingTime,
} from "../utils/helpers";

const BookDetailPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState("description");
  const { getBookById } = useBooks();
  const { addToReadingList, removeFromReadingList, hasBook } = useReadingList();
  const { isAuthenticated } = useAuth();

  const isInReadingList = hasBook(`/works/${id}`);

  useEffect(() => {
    const fetchBookDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const bookData = await getBookById(`/works/${id}`);
        setBook(bookData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookDetails();
  }, [id, getBookById]);

  const handleReadingListClick = async () => {
    if (!isAuthenticated) {
      alert("Please log in to add books to your reading list");
      return;
    }

    try {
      if (isInReadingList) {
        removeFromReadingList(`/works/${id}`);
      } else {
        await addToReadingList({
          key: `/works/${id}`,
          title: book.title,
          author_name: [book.author?.name || "Unknown Author"],
          cover_i: book.covers?.[0],
          first_publish_year: new Date(book.first_publish_date).getFullYear(),
          number_of_pages: book.number_of_pages,
        });
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: book.title,
      text: `Check out "${book.title}" by ${
        book.author?.name || "Unknown Author"
      }`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="container-custom py-12">
        <div className="flex justify-center items-center min-h-[60vh]">
          <LoadingSpinner size="lg" text="Loading book details..." />
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="container-custom py-12">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">📚</div>
          <h2 className="text-2xl font-bold mb-2">Book Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || "The book you are looking for does not exist."}
          </p>
          <Link to="/" className="btn-primary inline-flex items-center">
            <FiArrowLeft className="mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      {/* Back Button */}
      <Link
        to="/"
        className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary mb-8"
      >
        <FiArrowLeft className="w-5 h-5" />
        <span>Back to Home</span>
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Book Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Book Header */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Book Cover */}
              <div className="shrink-0">
                {book.cover_url ? (
                  <img
                    src={book.cover_url}
                    alt={book.title}
                    className="w-64 h-80 object-cover rounded-xl shadow-lg"
                  />
                ) : (
                  <div className="w-64 h-80 bg-linear-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center">
                    <FiBookOpen className="w-24 h-24 text-primary" />
                  </div>
                )}
              </div>

              {/* Book Info */}
              <div className="grow space-y-6">
                <div>
                  <h1 className="heading-2 mb-2">{book.title}</h1>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <FiUser className="w-5 h-5" />
                      <span className="text-lg">
                        {book.author?.name || "Unknown Author"}
                      </span>
                    </div>
                    <div className="h-4 w-px bg-gray-300 dark:bg-gray-700" />
                    <div className="flex items-center space-x-2">
                      <FiCalendar className="w-5 h-5 text-gray-400" />
                      <span>{formatDate(book.first_publish_date)}</span>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <FiStar className="w-6 h-6 text-yellow-500 fill-current" />
                    <span className="ml-2 text-2xl font-bold">4.5</span>
                  </div>
                  <span className="text-gray-500">(1,234 ratings)</span>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={handleReadingListClick}
                    className={`btn-base px-6 py-3 rounded-lg flex items-center space-x-2 ${
                      isInReadingList
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "bg-primary text-white hover:bg-primary/90"
                    }`}
                  >
                    <FiHeart
                      className={`w-5 h-5 ${
                        isInReadingList ? "fill-current" : ""
                      }`}
                    />
                    <span>
                      {isInReadingList
                        ? "Remove from List"
                        : "Add to Reading List"}
                    </span>
                  </button>

                  <button
                    onClick={handleShare}
                    className="btn-base px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center space-x-2"
                  >
                    <FiShare2 className="w-5 h-5" />
                    <span>Share</span>
                  </button>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-gray-500">
                      <FiBookOpen className="w-4 h-4" />
                      <span className="text-sm">Pages</span>
                    </div>
                    <p className="font-medium">
                      {book.number_of_pages || "Unknown"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-gray-500">
                      <FiClock className="w-4 h-4" />
                      <span className="text-sm">Reading Time</span>
                    </div>
                    <p className="font-medium">
                      {calculateReadingTime(book.number_of_pages)}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-gray-500">
                      <FiTag className="w-4 h-4" />
                      <span className="text-sm">Genre</span>
                    </div>
                    <p className="font-medium">
                      {book.subjects?.[0] || "Unknown"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm">
            <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
              <nav className="flex space-x-8">
                {["description", "details", "subjects", "reviews"].map(
                  (tab) => (
                    <button
                      key={tab}
                      onClick={() => setSelectedTab(tab)}
                      className={`py-3 px-1 font-medium text-sm border-b-2 transition-colors ${
                        selectedTab === tab
                          ? "border-primary text-primary"
                          : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  )
                )}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="prose dark:prose-invert max-w-none">
              {selectedTab === "description" && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Description</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {book.description || "No description available."}
                  </p>
                </div>
              )}

              {selectedTab === "details" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold mb-4">Book Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-500 mb-2">
                          First Published
                        </h4>
                        <p>{formatDate(book.first_publish_date)}</p>
                      </div>
                      {book.number_of_pages && (
                        <div>
                          <h4 className="font-medium text-gray-500 mb-2">
                            Pages
                          </h4>
                          <p>{book.number_of_pages.toLocaleString()}</p>
                        </div>
                      )}
                      {book.author?.bio && (
                        <div className="col-span-2">
                          <h4 className="text-lg font-bold mb-3">
                            About the Author
                          </h4>
                          <p className="text-gray-700 dark:text-gray-300">
                            {book.author.bio}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {selectedTab === "subjects" && (
                <div>
                  <h3 className="text-xl font-bold mb-4">Subjects & Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {book.subjects?.map((subject, index) => (
                      <span
                        key={index}
                        className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedTab === "reviews" && <ReviewSection bookId={id} />}
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Subjects */}
          {book.subjects && book.subjects.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold mb-4 flex items-center space-x-2">
                <FiTag className="w-5 h-5" />
                <span>Related Subjects</span>
              </h3>
              <div className="space-y-3">
                {book.subjects.slice(0, 8).map((subject, index) => (
                  <Link
                    key={index}
                    to={`/search?q=${encodeURIComponent(subject)}`}
                    className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <span className="font-medium">{subject}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* External Links */}
          {book.links && book.links.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold mb-4">External Links</h3>
              <div className="space-y-3">
                {book.links.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <FiExternalLink className="w-5 h-5 text-primary" />
                    <span className="font-medium">{link.title}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Excerpts */}
          {book.excerpts && book.excerpts.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold mb-4">Excerpts</h3>
              <div className="space-y-4">
                {book.excerpts.slice(0, 2).map((excerpt, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg italic border-l-4 border-primary"
                  >
                    <p className="text-gray-700 dark:text-gray-300">
                      "{truncateText(excerpt.text, 150)}"
                    </p>
                    {excerpt.pages && (
                      <p className="text-sm text-gray-500 mt-2">
                        — Page {excerpt.pages}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Similar Books (Placeholder) */}
          <div className="bg-linear-to-br from-primary/5 to-secondary/5 rounded-2xl p-6">
            <h3 className="font-bold mb-4">You Might Also Like</h3>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Sign in to get personalized book recommendations based on your
                reading history.
              </p>
              <Link to="/login" className="btn-primary w-full text-center">
                Sign In for Recommendations
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;
