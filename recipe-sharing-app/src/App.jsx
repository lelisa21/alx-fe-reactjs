
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useEffect } from 'react';
import useRecipeStore from './recipeStore';
import RecipeList from './components/RecipeList';
import AddRecipeForm from './components/AddRecipeForm';
import RecipeDetails from './components/RecipeDetails';
import EditRecipeForm from './components/EditRecipeForm';
import SearchBar from './components/SearchBar';
import FavoritesList from './components/FavoritesList';
import RecommendationsList from './components/RecommendationsList';
import './App.css';

// Mock initial data
const initialRecipes = [
  {
    id: 1,
    title: 'Spaghetti Carbonara',
    description: 'A classic Italian pasta dish with eggs, cheese, and pancetta.',
    ingredients: ['Spaghetti', 'Eggs', 'Parmesan cheese', 'Pancetta', 'Black pepper'],
    instructions: 'Cook spaghetti. Fry pancetta. Mix eggs and cheese. Combine everything while hot.',
    prepTime: 20,
    category: 'Italian',
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    title: 'Chocolate Chip Cookies',
    description: 'Soft and chewy cookies with melted chocolate chips.',
    ingredients: ['Flour', 'Butter', 'Sugar', 'Chocolate chips', 'Vanilla extract'],
    instructions: 'Cream butter and sugar. Add flour and chocolate chips. Bake at 350°F for 10-12 minutes.',
    prepTime: 15,
    category: 'Dessert',
    createdAt: '2024-01-10'
  }
];

function App() {
  const setRecipes = useRecipeStore(state => state.setRecipes);

  useEffect(() => {
    // Initialize with mock data
    setRecipes(initialRecipes);
  }, [setRecipes]);

  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <h1>
            <Link to="/">🍳 Recipe Sharing App</Link>
          </h1>
          <nav className="main-nav">
            <Link to="/">All Recipes</Link>
            <Link to="/add">Add Recipe</Link>
            <Link to="/favorites">Favorites</Link>
          </nav>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={
              <div className="home-page">
                <SearchBar />
                <RecommendationsList />
                <RecipeList />
              </div>
            } />
            <Route path="/add" element={<AddRecipeForm />} />
            <Route path="/recipe/:recipeId" element={<RecipeDetails />} />
            <Route path="/edit/:recipeId" element={<EditRecipeForm />} />
            <Route path="/favorites" element={<FavoritesList />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
