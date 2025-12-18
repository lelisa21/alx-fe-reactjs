import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiCalendar,
  FiBook,
  FiTrendingUp,
  FiAward,
  FiSettings,
  FiLogOut,
  FiEdit2,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useReadingList } from "../context/ReadingListContext";
import BookList from "../components/BookList";
import ReadingProgress from "../components/ReadingProgress";
import LoadingSpinner from "../components/LoadingSpinner";

const ProfilePage = () => {
  const { user, logout, updateUser } = useAuth();
  const { readingList, clearReadingList } = useReadingList();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: user?.bio || "",
  });

  if (!user) {
    return (
      <div className="container-custom py-12">
        <div className="text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold mb-2">Please Sign In</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You need to be logged in to view your profile.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/login" className="btn-primary">
              Sign In
            </Link>
            <Link to="/register" className="btn-outline">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    updateUser(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({
      name: user.name,
      email: user.email,
      bio: user.bio || "",
    });
    setIsEditing(false);
  };

  const stats = {
    totalBooks: readingList.length,
    completedBooks: Math.floor(readingList.length * 0.4),
    readingStreak: 7,
    readingTime: "2h 30m",
    favoriteGenre: "Fiction",
  };

  return (
    <div className="container-custom py-8">
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Left Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <div className="text-center mb-6">
              <div className="relative inline-block mb-4">
                <div className="w-32 h-32 rounded-full bg-linear-to-r from-primary to-secondary flex items-center justify-center text-white text-4xl font-bold">
                  {user.name.charAt(0)}
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="absolute bottom-2 right-2 p-2 bg-white dark:bg-gray-700 rounded-full shadow-md hover:shadow-lg transition-shadow"
                >
                  <FiEdit2 className="w-4 h-4" />
                </button>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    className="input-base text-center font-bold text-lg"
                  />
                  <textarea
                    value={editForm.bio}
                    onChange={(e) =>
                      setEditForm({ ...editForm, bio: e.target.value })
                    }
                    placeholder="Write a short bio..."
                    className="input-base resize-none"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <button onClick={handleSave} className="btn-primary flex-1">
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="btn-outline flex-1"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold">{user.name}</h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    {user.bio || "Book enthusiast and avid reader"}
                  </p>
                </>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                <FiMail className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                <FiCalendar className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Member since</p>
                  <p className="font-medium">
                    {new Date().toLocaleDateString("default", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-linear-to-br from-primary/10 to-secondary/10 rounded-2xl p-6">
            <h3 className="font-bold mb-4 flex items-center space-x-2">
              <FiTrendingUp className="w-5 h-5" />
              <span>Quick Stats</span>
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">
                  Books in List
                </span>
                <span className="font-bold">{stats.totalBooks}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">
                  Completed
                </span>
                <span className="font-bold">{stats.completedBooks}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">
                  Reading Streak
                </span>
                <span className="font-bold">{stats.readingStreak} days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">
                  Reading Time
                </span>
                <span className="font-bold">{stats.readingTime}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              to="/settings"
              className="flex items-center space-x-3 p-4 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <FiSettings className="w-5 h-5" />
              <span>Settings</span>
            </Link>
            <button
              onClick={logout}
              className="w-full flex items-center space-x-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              <FiLogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          {/* Reading Progress */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="heading-3">Reading Progress</h2>
              <button
                onClick={clearReadingList}
                className="text-sm text-red-500 hover:text-red-600"
                disabled={readingList.length === 0}
              >
                Clear Reading List
              </button>
            </div>
            <ReadingProgress />
          </div>

          {/* Reading List */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="heading-3">Your Reading List</h2>
              <Link to="/search" className="text-primary hover:underline">
                Add More Books
              </Link>
            </div>

            {readingList.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-xl font-bold mb-2">
                  Your Reading List is Empty
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Start adding books to track your reading progress
                </p>
                <Link to="/search" className="btn-primary">
                  Explore Books
                </Link>
              </div>
            ) : (
              <BookList books={readingList} showFilters={false} />
            )}
          </div>

          {/* Achievements */}
          <div className="bg-linear-to-r from-primary/5 to-secondary/5 rounded-2xl p-8">
            <h2 className="heading-3 mb-6 flex items-center space-x-3">
              <FiAward className="w-8 h-8" />
              <span>Achievements</span>
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                {
                  icon: "📖",
                  title: "Bookworm",
                  description: "Read 10 books",
                  progress: 60,
                },
                {
                  icon: "🔥",
                  title: "Streak Master",
                  description: "7-day reading streak",
                  progress: 100,
                },
                {
                  icon: "🏆",
                  title: "Completionist",
                  description: "Finish 5 books",
                  progress: 40,
                },
                {
                  icon: "🌟",
                  title: "Reviewer",
                  description: "Write 3 reviews",
                  progress: 33,
                },
              ].map((achievement, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center"
                >
                  <div className="text-4xl mb-4">{achievement.icon}</div>
                  <h4 className="font-bold mb-2">{achievement.title}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {achievement.description}
                  </p>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-primary to-secondary rounded-full"
                      style={{ width: `${achievement.progress}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    {achievement.progress}% Complete
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reading Goals */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm">
            <h2 className="heading-3 mb-6">Reading Goals</h2>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Books this Year</span>
                  <span className="font-bold">4/12</span>
                </div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-green-500 to-emerald-600 rounded-full"
                    style={{ width: "33%" }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Pages per Day</span>
                  <span className="font-bold">25/50</span>
                </div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-blue-500 to-purple-600 rounded-full"
                    style={{ width: "50%" }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Reading Streak</span>
                  <span className="font-bold">7/30 days</span>
                </div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-orange-500 to-red-600 rounded-full"
                    style={{ width: "23%" }}
                  />
                </div>
              </div>
            </div>
            <button className="btn-primary w-full mt-6">Set New Goals</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
