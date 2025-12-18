import React, { useState } from 'react';
import { FiFilter, FiChevronDown, FiChevronUp, FiX } from 'react-icons/fi';
import { CATEGORIES } from '../utils/constants';

const CategoryFilter = ({ selectedCategories, onChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = CATEGORIES.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCategoryToggle = (categoryId) => {
    if (selectedCategories.includes(categoryId)) {
      onChange(selectedCategories.filter(id => id !== categoryId));
    } else {
      onChange([...selectedCategories, categoryId]);
    }
  };

  const clearAll = () => {
    onChange([]);
    setSearchTerm('');
  };

  const selectAll = () => {
    onChange(CATEGORIES.map(category => category.id));
  };

  return (
    <div className="space-y-4">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
        >
          <FiFilter className="w-5 h-5" />
          <span className="font-medium">Filter by Category</span>
          {isExpanded ? (
            <FiChevronUp className="w-5 h-5" />
          ) : (
            <FiChevronDown className="w-5 h-5" />
          )}
        </button>
        
        {selectedCategories.length > 0 && (
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              {selectedCategories.length} selected
            </span>
            <button
              onClick={clearAll}
              className="text-sm text-red-500 hover:text-red-600 transition-colors"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 space-y-4">
          {/* Search and Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative grow">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search categories..."
                className="input-base pl-10"
              />
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                >
                  <FiX className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={selectAll}
                className="px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary hover:text-white transition-colors text-sm"
              >
                Select All
              </button>
              <button
                onClick={clearAll}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {filteredCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryToggle(category.id)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedCategories.includes(category.id)
                    ? `${category.color} border-primary scale-105`
                    : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-primary'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex justify-center">
                    <span className="text-2xl">
                      {category.id === 'fiction' && '📖'}
                      {category.id === 'science' && '🔬'}
                      {category.id === 'fantasy' && '🐉'}
                      {category.id === 'mystery' && '🕵️'}
                      {category.id === 'biography' && '👤'}
                      {category.id === 'history' && '🏛️'}
                      {category.id === 'technology' && '💻'}
                      {category.id === 'romance' && '❤️'}
                    </span>
                  </div>
                  <div className="text-center">
                    <h4 className="font-medium">{category.name}</h4>
                    {selectedCategories.includes(category.id) && (
                      <div className="mt-1">
                        <div className="w-3 h-3 rounded-full bg-primary mx-auto"></div>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Selected Categories */}
          {selectedCategories.length > 0 && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="font-medium mb-3">Selected Categories</h4>
              <div className="flex flex-wrap gap-2">
                {selectedCategories.map((categoryId) => {
                  const category = CATEGORIES.find(c => c.id === categoryId);
                  if (!category) return null;
                  
                  return (
                    <div
                      key={categoryId}
                      className="flex items-center space-x-2 px-3 py-2 rounded-full bg-primary/10 dark:bg-primary/20 text-primary"
                    >
                      <span>{category.name}</span>
                      <button
                        onClick={() => handleCategoryToggle(categoryId)}
                        className="p-1 hover:bg-primary/20 rounded-full"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;
