import React, { useState } from 'react';
import { FiStar, FiUser, FiCalendar, FiThumbsUp, FiSend } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/helpers';

const ReviewSection = ({ bookId }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    content: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please log in to submit a review');
      return;
    }

    if (!newReview.content.trim()) {
      alert('Please write your review');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const review = {
      id: Date.now().toString(),
      user: {
        name: user.name,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`,
      },
      rating: newReview.rating,
      title: newReview.title,
      content: newReview.content,
      date: new Date().toISOString(),
      likes: 0,
      helpful: 0,
    };

    setReviews([review, ...reviews]);
    setNewReview({
      rating: 5,
      title: '',
      content: '',
    });
    setIsSubmitting(false);
  };

  const handleLikeReview = (reviewId) => {
    setReviews(reviews.map(review =>
      review.id === reviewId
        ? { ...review, likes: review.likes + 1 }
        : review
    ));
  };

  const handleMarkHelpful = (reviewId) => {
    setReviews(reviews.map(review =>
      review.id === reviewId
        ? { ...review, helpful: review.helpful + 1 }
        : review
    ));
  };

  return (
    <div className="space-y-8">
      {/* Review Form */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6">
        <h3 className="text-xl font-bold mb-6">Write a Review</h3>
        
        <form onSubmit={handleSubmitReview} className="space-y-6">
          {/* Rating */}
          <div>
            <label className="label-base block mb-3">Your Rating</label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewReview({ ...newReview, rating: star })}
                  className="p-1 hover:scale-110 transition-transform"
                  aria-label={`Rate ${star} stars`}
                >
                  <FiStar
                    className={`w-8 h-8 ${
                      star <= newReview.rating
                        ? 'text-yellow-500 fill-current'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-4 text-lg font-bold">
                {newReview.rating}.0 stars
              </span>
            </div>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="reviewTitle" className="label-base block mb-3">
              Review Title
            </label>
            <input
              id="reviewTitle"
              type="text"
              value={newReview.title}
              onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
              placeholder="Summarize your review"
              className="input-base"
            />
          </div>

          {/* Content */}
          <div>
            <label htmlFor="reviewContent" className="label-base block mb-3">
              Your Review
            </label>
            <textarea
              id="reviewContent"
              value={newReview.content}
              onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
              placeholder="Share your thoughts about this book..."
              rows={6}
              className="input-base resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !user}
              className="btn-primary px-8"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Submitting...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <FiSend className="w-4 h-4" />
                  <span>Submit Review</span>
                </div>
              )}
            </button>
          </div>

          {!user && (
            <p className="text-sm text-gray-500 text-center">
              Please log in to write a review
            </p>
          )}
        </form>
      </div>

      {/* Reviews List */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">Reviews ({reviews.length})</h3>
          <div className="flex items-center space-x-4">
            <select className="input-base text-sm">
              <option>Sort by: Most Recent</option>
              <option>Sort by: Highest Rated</option>
              <option>Sort by: Most Helpful</option>
            </select>
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📝</div>
            <h4 className="text-lg font-bold mb-2">No Reviews Yet</h4>
            <p className="text-gray-600 dark:text-gray-400">
              Be the first to share your thoughts about this book!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                {/* Review Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={review.user.avatar}
                      alt={review.user.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h4 className="font-bold">{review.user.name}</h4>
                      <div className="flex items-center space-x-3 text-sm text-gray-500">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FiStar
                              key={star}
                              className={`w-4 h-4 ${
                                star <= review.rating
                                  ? 'text-yellow-500 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                          <span className="ml-2 font-medium">{review.rating}.0</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FiCalendar className="w-3 h-3" />
                          <span>{formatDate(review.date)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Review Content */}
                <div className="space-y-4">
                  {review.title && (
                    <h5 className="font-bold text-lg">{review.title}</h5>
                  )}
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {review.content}
                  </p>
                </div>

                {/* Review Actions */}
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleLikeReview(review.id)}
                      className="flex items-center space-x-2 text-gray-500 hover:text-primary transition-colors"
                    >
                      <FiThumbsUp className="w-4 h-4" />
                      <span>{review.likes}</span>
                    </button>
                    <button
                      onClick={() => handleMarkHelpful(review.id)}
                      className="text-sm text-primary hover:underline"
                    >
                      Helpful ({review.helpful})
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
