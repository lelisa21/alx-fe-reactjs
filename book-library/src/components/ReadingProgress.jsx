import React, { useState, useEffect } from "react";
import {
  FiBookOpen,
  FiTarget,
  FiTrendingUp,
  FiAward,
  FiCalendar,
} from "react-icons/fi";
import { useReadingList } from "../context/ReadingListContext";
import { calculateReadingTime, formatDate } from "../utils/helpers";

const ReadingProgress = () => {
  const { readingList, readingProgress } = useReadingList();
  const [stats, setStats] = useState({
    totalBooks: 0,
    completedBooks: 0,
    totalProgress: 0,
    averageProgress: 0,
    readingStreak: 0,
    estimatedTime: 0,
  });

  useEffect(() => {
    if (readingList.length === 0) {
      setStats({
        totalBooks: 0,
        completedBooks: 0,
        totalProgress: 0,
        averageProgress: 0,
        readingStreak: 0,
        estimatedTime: 0,
      });
      return;
    }

    const completedBooks = readingList.filter((book) => {
      const progress = readingProgress[book.key] || 0;
      return progress >= 100;
    }).length;

    const totalProgress = Object.values(readingProgress).reduce(
      (sum, progress) => sum + progress,
      0
    );
    const averageProgress = totalProgress / readingList.length;

    // Calculate estimated reading time (assuming 300 words per page, 200 words per minute)
    const estimatedTime = readingList.reduce((time, book) => {
      const progress = readingProgress[book.key] || 0;
      const pages = book.number_of_pages || 300;
      const wordsPerPage = 300;
      const readingSpeed = 200; // words per minute

      const remainingWords = (pages * wordsPerPage * (100 - progress)) / 100;
      return time + remainingWords / readingSpeed;
    }, 0);

    setStats({
      totalBooks: readingList.length,
      completedBooks,
      totalProgress,
      averageProgress: Math.round(averageProgress),
      readingStreak: Math.floor(Math.random() * 30) + 1, // Mock streak
      estimatedTime: Math.round(estimatedTime),
    });
  }, [readingList, readingProgress]);

  const getProgressColor = (progress) => {
    if (progress >= 75) return "from-green-500 to-emerald-600";
    if (progress >= 50) return "from-yellow-500 to-amber-600";
    if (progress >= 25) return "from-orange-500 to-red-600";
    return "from-red-500 to-pink-600";
  };

  const getBookProgress = (book) => {
    const progress = readingProgress[book.key] || 0;
    return {
      progress,
      color: getProgressColor(progress),
      status:
        progress >= 100
          ? "Completed"
          : progress >= 75
          ? "Almost Done"
          : progress >= 50
          ? "Halfway"
          : "Started",
    };
  };

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <FiBookOpen className="w-8 h-8" />
            <span className="text-3xl font-bold">{stats.totalBooks}</span>
          </div>
          <h3 className="font-bold">Total Books</h3>
          <p className="text-blue-100 text-sm mt-1">In your reading list</p>
        </div>

        <div className="bg-linear-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <FiAward className="w-8 h-8" />
            <span className="text-3xl font-bold">{stats.completedBooks}</span>
          </div>
          <h3 className="font-bold">Completed</h3>
          <p className="text-green-100 text-sm mt-1">Books finished</p>
        </div>

        <div className="bg-linear-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <FiTrendingUp className="w-8 h-8" />
            <span className="text-3xl font-bold">{stats.averageProgress}%</span>
          </div>
          <h3 className="font-bold">Avg Progress</h3>
          <p className="text-purple-100 text-sm mt-1">Across all books</p>
        </div>

        <div className="bg-linear-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <FiTarget className="w-8 h-8" />
            <span className="text-3xl font-bold">{stats.readingStreak}</span>
          </div>
          <h3 className="font-bold">Day Streak</h3>
          <p className="text-orange-100 text-sm mt-1">Consistent reading</p>
        </div>
      </div>

      {/* Estimated Time */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900">
              <FiCalendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold">Estimated Time to Complete</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Based on your reading speed
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold">
              {stats.estimatedTime > 60
                ? `${Math.floor(stats.estimatedTime / 60)}h ${
                    stats.estimatedTime % 60
                  }m`
                : `${stats.estimatedTime}m`}
            </span>
          </div>
        </div>
        <div className="mt-6">
          <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
              style={{
                width: `${
                  (stats.completedBooks / Math.max(stats.totalBooks, 1)) * 100
                }%`,
              }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>Start</span>
            <span>
              {(
                (stats.completedBooks / Math.max(stats.totalBooks, 1)) *
                100
              ).toFixed(0)}
              % Complete
            </span>
            <span>Finish</span>
          </div>
        </div>
      </div>

      {/* Book Progress List */}
      <div>
        <h3 className="text-xl font-bold mb-6">Book Progress</h3>
        {readingList.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📚</div>
            <h4 className="text-lg font-bold mb-2">No Books in Progress</h4>
            <p className="text-gray-600 dark:text-gray-400">
              Add books to your reading list to track your progress
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {readingList.map((book) => {
              const bookProgress = getBookProgress(book);
              return (
                <div
                  key={book.key}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start space-x-4">
                    {/* Book Cover */}
                    <div className="shrink-0">
                      {book.cover_i ? (
                        <img
                          src={`https://covers.openlibrary.org/b/id/${book.cover_i}-S.jpg`}
                          alt={book.title}
                          className="w-16 h-20 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-16 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">📚</span>
                        </div>
                      )}
                    </div>

                    {/* Book Info */}
                    <div className="grow">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-bold line-clamp-1">
                            {book.title}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {book.author_name?.join(", ") ||
                              book.author?.name ||
                              "Unknown Author"}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            bookProgress.status === "Completed"
                              ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300"
                              : bookProgress.status === "Almost Done"
                              ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300"
                              : bookProgress.status === "Halfway"
                              ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300"
                              : "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-300"
                          }`}
                        >
                          {bookProgress.status}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span className="font-bold">
                            {bookProgress.progress}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-linear-to-r ${bookProgress.color} rounded-full transition-all duration-300`}
                            style={{ width: `${bookProgress.progress}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>0%</span>
                          <span>50%</span>
                          <span>100%</span>
                        </div>
                      </div>

                      {/* Reading Time */}
                      {book.number_of_pages && (
                        <div className="flex items-center space-x-4 mt-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <FiBookOpen className="w-4 h-4" />
                            <span>{book.number_of_pages} pages</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FiCalendar className="w-4 h-4" />
                            <span>
                              {calculateReadingTime(
                                book.number_of_pages,
                                300,
                                200
                              )}{" "}
                              remaining
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadingProgress;
