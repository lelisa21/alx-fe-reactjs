// src/store/recipeStore.js
import { create } from 'zustand';

const useRecipeStore = create((set, get) => ({
  // State with safe defaults
  recipes: [],
  searchTerm: '',
  favorites: [],
  recommendations: [],
  
  // Basic Recipe Actions
  setRecipes: (recipes) => set({ 
    recipes: Array.isArray(recipes) ? recipes : [] 
  }),
  
  addRecipe: (newRecipe) => set(state => {
    if (!newRecipe || typeof newRecipe !== 'object') {
      console.error('Invalid recipe data:', newRecipe);
      return state;
    }
    
    const recipeWithId = { 
      ...newRecipe, 
      id: newRecipe.id || Date.now() + Math.random() 
    };
    
    return { 
      recipes: [...state.recipes, recipeWithId] 
    };
  }),
  
  updateRecipe: (recipeId, updatedRecipe) => set(state => {
    if (!recipeId || !updatedRecipe) {
      console.error('Invalid update parameters:', recipeId, updatedRecipe);
      return state;
    }
    
    return {
      recipes: state.recipes.map(recipe =>
        recipe.id === recipeId ? { ...recipe, ...updatedRecipe } : recipe
      )
    };
  }),
  
  deleteRecipe: (recipeId) => set(state => ({
    recipes: state.recipes.filter(recipe => recipe.id !== recipeId),
    favorites: state.favorites.filter(id => id !== recipeId)
  })),
  
  // Search and Filtering
  setSearchTerm: (term) => set({ 
    searchTerm: typeof term === 'string' ? term : '' 
  }),
  
  getFilteredRecipes: () => {
    try {
      const { recipes, searchTerm } = get();
      
      if (!Array.isArray(recipes)) return [];
      if (!searchTerm || !searchTerm.trim()) return recipes;
      
      const searchTermLower = searchTerm.toLowerCase();
      
      return recipes.filter(recipe => {
        if (!recipe || typeof recipe !== 'object') return false;
        
        const titleMatch = recipe.title && 
          recipe.title.toLowerCase().includes(searchTermLower);
        const descriptionMatch = recipe.description && 
          recipe.description.toLowerCase().includes(searchTermLower);
        const ingredientsMatch = Array.isArray(recipe.ingredients) && 
          recipe.ingredients.some(ingredient => 
            ingredient && ingredient.toLowerCase().includes(searchTermLower)
          );
        
        return titleMatch || descriptionMatch || ingredientsMatch;
      });
    } catch (error) {
      console.error('Error in getFilteredRecipes:', error);
      return get().recipes || [];
    }
  },
  
  // Favorites
  addFavorite: (recipeId) => set(state => ({
    favorites: [...state.favorites, recipeId]
  })),
  
  removeFavorite: (recipeId) => set(state => ({
    favorites: state.favorites.filter(id => id !== recipeId)
  })),
  
  toggleFavorite: (recipeId) => set(state => {
    const isFavorite = state.favorites.includes(recipeId);
    return {
      favorites: isFavorite
        ? state.favorites.filter(id => id !== recipeId)
        : [...state.favorites, recipeId]
    };
  }),
  
  isFavorite: (recipeId) => {
    const favorites = get().favorites;
    return Array.isArray(favorites) ? favorites.includes(recipeId) : false;
  },
  
  // Recommendations
  generateRecommendations: () => set(state => {
    try {
      const { recipes, favorites } = state;
      
      if (!Array.isArray(recipes) || !Array.isArray(favorites)) {
        return { recommendations: [] };
      }
      
      const favoriteRecipes = recipes.filter(recipe =>
        recipe && favorites.includes(recipe.id)
      );
      
      const recommended = recipes.filter(recipe => {
        if (!recipe || favorites.includes(recipe.id)) return false;
        
        // Check if recipe shares categories with favorites
        const hasCommonCategories = favoriteRecipes.some(fav =>
          fav && recipe && fav.category && recipe.category && 
          fav.category === recipe.category
        );
        
        // Include some random recipes for variety
        const isRandomPick = Math.random() > 0.7;
        
        return hasCommonCategories || isRandomPick;
      });
      
      return { recommendations: recommended.slice(0, 5) };
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return { recommendations: [] };
    }
  })
}));

export default useRecipeStore;
