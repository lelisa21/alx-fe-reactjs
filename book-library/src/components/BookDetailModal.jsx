import React, { useState, useEffect } from "react";
import {
  FiX,
  FiHeart,
  FiShare2,
  FiDownload,
  FiBookOpen,
  FiStar,
  FiCalendar,
  FiUser,
  FiTag,
  FiClock,
} from "react-icons/fi";
import { useReadingList } from "../context/ReadingListContext";
import { useAuth } from "../context/AuthContext";
import {
  formatDate,
  truncateText,
  calculateReadingTime,
} from "../utils/helpers";

const BookDetailModal = ({ book, isOpen, onClose }) => {
  const [selectedTab, setSelectedTab] = useState("description");
  const {
    addToReadingList,
    removeFromReadingList,
    hasBook,
    updateReadingProgress,
    getReadingProgress,
  } = useReadingList();
  const { isAuthenticated } = useAuth();
  const [readingProgress, setReadingProgress] = useState(0);

  const isInReadingList = hasBook(book?.key);

  useEffect(() => {
    if (book?.key) {
      setReadingProgress(getReadingProgress(book.key));
    }
  }, [book, getReadingProgress]);

  if (!isOpen || !book) return null;

  const handleReadingListClick = () => {
    if (!isAuthenticated) {
      alert("Please log in to manage your reading list");
      return;
    }

    try {
      if (isInReadingList) {
        removeFromReadingList(book.key);
      } else {
        addToReadingList(book);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleProgressChange = (value) => {
    if (!isAuthenticated) {
      alert("Please log in to track your reading progress");
      return;
    }

    setReadingProgress(value);
    updateReadingProgress(book.key, value);
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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm hover:bg-white/20 dark:hover:bg-gray-800/20 transition-colors"
            aria-label="Close"
          >
            <FiX className="w-6 h-6" />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 h-full max-h-[90vh] overflow-y-auto">
            {/* Left Column - Book Cover & Actions */}
            <div className="lg:col-span-1 bg-gray-50 dark:bg-gray-800 p-8">
              <div className="sticky top-8 space-y-6">
                {/* Book Cover */}
                <div className="aspect-book rounded-xl overflow-hidden shadow-2xl">
                  {book.cover_url ? (
                    <img
                      src={book.cover_url}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <FiBookOpen className="w-24 h-24 text-primary" />
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleReadingListClick}
                    className={`btn-base flex items-center justify-center space-x-2 py-3 rounded-lg transition-colors ${
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
                      {isInReadingList ? "Remove from List" : "Add to List"}
                    </span>
                  </button>

                  <button
                    onClick={handleShare}
                    className="btn-base flex items-center justify-center space-x-2 py-3 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <FiShare2 className="w-5 h-5" />
                    <span>Share</span>
                  </button>
                </div>

                {/* Reading Progress */}
                {isAuthenticated && (
                  <div className="space-y-4 p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Reading Progress</h4>
                      <span className="text-primary font-bold">
                        {readingProgress}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-linear-to-r from-primary to-secondary rounded-full transition-all duration-300"
                        style={{ width: `${readingProgress}%` }}
                      />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={readingProgress}
                      onChange={(e) =>
                        handleProgressChange(parseInt(e.target.value))
                      }
                      className="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>
                )}

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-gray-500">
                      <FiCalendar className="w-4 h-4" />
                      <span className="text-sm">Published</span>
                    </div>
                    <p className="font-medium">
                      {formatDate(book.first_publish_date)}
                    </p>
                  </div>
                  {book.number_of_pages && (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-gray-500">
                        <FiClock className="w-4 h-4" />
                        <span className="text-sm">Reading Time</span>
                      </div>
                      <p className="font-medium">
                        {calculateReadingTime(book.number_of_pages)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Book Details */}
            <div className="lg:col-span-2 p-8 overflow-y-auto">
              <div className="space-y-6">
                {/* Title and Author */}
                <div>
                  <h2 className="heading-2">{book.title}</h2>
                  <div className="flex items-center space-x-3 mt-2">
                    <FiUser className="w-5 h-5 text-gray-400" />
                    <p className="text-xl text-gray-600 dark:text-gray-400">
                      {book.author?.name || "Unknown Author"}
                    </p>
                  </div>
                </div>

                {/* Rating */}
                {book.ratings_average && (
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <FiStar className="w-6 h-6 text-yellow-500 fill-current" />
                      <span className="ml-2 text-2xl font-bold">
                        {book.ratings_average.toFixed(1)}
                      </span>
                    </div>
                    <div className="h-4 w-px bg-gray-300 dark:bg-gray-700" />
                    <span className="text-gray-500">
                      {book.ratings_count?.toLocaleString() || 0} ratings
                    </span>
                  </div>
                )}

                {/* Tabs */}
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <nav className="flex space-x-8">
                    {["description", "details", "subjects", "excerpts"].map(
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
                          {book.publishers?.length > 0 && (
                            <div>
                              <h4 className="font-medium text-gray-500 mb-2">
                                Publisher
                              </h4>
                              <p>{book.publishers[0].name}</p>
                            </div>
                          )}
                          {book.isbn && (
                            <div>
                              <h4 className="font-medium text-gray-500 mb-2">
                                ISBN
                              </h4>
                              <p>{book.isbn}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {book.author?.bio && (
                        <div>
                          <h4 className="text-lg font-bold mb-3">
                            About the Author
                          </h4>
                          <p className="text-gray-700 dark:text-gray-300">
                            {book.author.bio}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {selectedTab === "subjects" && (
                    <div>
                      <h3 className="text-xl font-bold mb-4">
                        Subjects & Tags
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {book.subjects?.map((subject, index) => (
                          <span
                            key={index}
                            className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                          >
                            {subject}
                          </span>
                        ))}
                        {book.subject_people?.map((person, index) => (
                          <span
                            key={`person-${index}`}
                            className="px-3 py-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                          >
                            {person}
                          </span>
                        ))}
                        {book.subject_places?.map((place, index) => (
                          <span
                            key={`place-${index}`}
                            className="px-3 py-2 rounded-lg bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                          >
                            {place}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedTab === "excerpts" && (
                    <div>
                      <h3 className="text-xl font-bold mb-4">Excerpts</h3>
                      {book.excerpts?.length > 0 ? (
                        <div className="space-y-4">
                          {book.excerpts.map((excerpt, index) => (
                            <div
                              key={index}
                              className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg italic border-l-4 border-primary"
                            >
                              <p className="text-gray-700 dark:text-gray-300">
                                "{excerpt.text}"
                              </p>
                              {excerpt.pages && (
                                <p className="text-sm text-gray-500 mt-2">
                                  — Page {excerpt.pages}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">No excerpts available.</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Related Links */}
                {book.links?.length > 0 && (
                  <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-bold mb-4">Related Links</h3>
                    <div className="space-y-2">
                      {book.links.map((link, index) => (
                        <a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 text-primary hover:underline"
                        >
                          <FiExternalLink className="w-4 h-4" />
                          <span>{link.title}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailModal;
