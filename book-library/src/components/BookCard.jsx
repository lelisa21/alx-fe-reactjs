import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiBook, FiHeart, FiStar, FiClock, FiEye } from 'react-icons/fi';
import { useReadingList } from '../context/ReadingListContext';
import { useAuth } from '../context/AuthContext';
import { truncateText, getRatingColor } from '../utils/helpers';

const BookCard = ({ book }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToReadingList, removeFromReadingList, hasBook } = useReadingList();
  const { isAuthenticated } = useAuth();
  const isInReadingList = hasBook(book.key);

  const handleReadingListClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      alert('Please log in to add books to your reading list');
      return;
    }

    try {
      if (isInReadingList) {
        removeFromReadingList(book.key);
      } else {
        await addToReadingList(book);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const coverUrl = book.cover_i 
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
    : book.cover_url 
    ? book.cover_url
    : null;

  return (
    <Link to={`/book/${book.key.replace('/works/', '')}`}>
      <div
        className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 hover-lift"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Action Button */}
        <button
          onClick={handleReadingListClick}
          className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-all duration-300 ${
            isInReadingList
              ? 'bg-red-500 text-white'
              : 'bg-white/90 dark:bg-gray-900/90 text-gray-600 dark:text-gray-300 hover:bg-red-500 hover:text-white'
          } ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}
          aria-label={isInReadingList ? 'Remove from reading list' : 'Add to reading list'}
        >
          <FiHeart className={`w-5 h-5 ${isInReadingList ? 'fill-current' : ''}`} />
        </button>

        {/* Book Cover */}
        <div className="aspect-book overflow-hidden bg-gray-100 dark:bg-gray-900 relative">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={book.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FiBook className="w-16 h-16 text-gray-400" />
            </div>
          )}
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="space-y-3">
            {/* Title */}
            <h3 className="font-bold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {book.title}
            </h3>

            {/* Author */}
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-xs">👤</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                {book.author_name?.join(', ') || book.author?.name || 'Unknown Author'}
              </p>
            </div>

            {/* Rating */}
            {book.ratings_average && (
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  <FiStar className={`w-4 h-4 ${getRatingColor(book.ratings_average)}`} />
                  <span className="ml-1 font-medium">{book.ratings_average.toFixed(1)}</span>
                </div>
                <span className="text-sm text-gray-500">
                  ({book.ratings_count || 0} ratings)
                </span>
              </div>
            )}

            {/* Publication Year */}
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <FiClock className="w-4 h-4" />
              <span>{book.first_publish_year || book.first_publish_date || 'Unknown year'}</span>
            </div>

            {/* Description Preview */}
            {book.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                {truncateText(
                  typeof book.description === 'string' 
                    ? book.description 
                    : book.description.value || '',
                  100
                )}
              </p>
            )}

            {/* Tags */}
            {book.subject && book.subject.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {book.subject.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* View Details Button */}
            <div className={`pt-4 transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
              <div className="flex items-center justify-center space-x-2 text-primary font-medium">
                <FiEye className="w-4 h-4" />
                <span>View Details</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reading List Status */}
        {isInReadingList && (
          <div className="absolute bottom-4 left-4">
            <span className="px-2 py-1 text-xs rounded-full bg-primary text-white">
              In Your List
            </span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default BookCard;
