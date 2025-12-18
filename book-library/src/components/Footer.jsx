import React from "react";
import { Link } from "react-router-dom";
import { FiBook, FiGithub, FiTwitter, FiMail, FiHeart } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";

const Footer = () => {
  const { isDarkMode } = useTheme();

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-linear-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <FiBook className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold gradient-primary-text">
                  BookLibrary
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Your digital bookshelf
                </p>
              </div>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Discover, read, and manage your favorite books all in one place.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
              >
                <FiGithub className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
              >
                <FiTwitter className="w-5 h-5" />
              </a>
              <a
                href="mailto:contact@booklibrary.com"
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
              >
                <FiMail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/search"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                >
                  Search Books
                </Link>
              </li>
              <li>
                <Link
                  to="/categories"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                >
                  My Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-lg mb-4">Popular Categories</h4>
            <ul className="space-y-2">
              {[
                "Fiction",
                "Science",
                "Fantasy",
                "Mystery",
                "Biography",
                "History",
              ].map((category) => (
                <li key={category}>
                  <Link
                    to={`/categories?filter=${category.toLowerCase()}`}
                    className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold text-lg mb-4">Stay Updated</h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Subscribe to our newsletter for the latest book recommendations
              and updates.
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Your email"
                className="input-base w-full"
                required
              />
              <button type="submit" className="btn-primary w-full">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <FiHeart className="w-4 h-4 text-red-500" />
              <span>Made with love for book lovers</span>
            </div>

            <div className="text-center text-gray-600 dark:text-gray-400 text-sm">
              <p>
                Powered by{" "}
                <a
                  href="https://openlibrary.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Open Library API
                </a>
              </p>
            </div>

            <div className="text-gray-600 dark:text-gray-400 text-sm">
              <p>&copy; {currentYear} BookLibrary. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
