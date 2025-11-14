
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useRecipeStore } from './components/srecipeStore';
import RecipeList from './components/RecipeList';
import AddRecipeForm from './components/AddRecipeForm';
import RecipeDetails from './components/RecipeDetails';
import EditRecipeForm from './components/EditRecipeForm';
import FavoritesList from './components/FavoritesList';
import SearchBar from './components/SearchBar';


const initialRecipes = [
  {
    id: 1,
    title: 'Spaghetti Carbonara',
    description: 'A classic Italian pasta dish with eggs, cheese, and pancetta.',
    ingredients: ['Spaghetti', 'Eggs', 'Parmesan cheese', 'Pancetta', 'Black pepper'],
    instructions: 'Cook spaghetti. Fry pancetta. Mix eggs and cheese. Combine everything while hot.',
    prepTime: 20,
    category: 'Italian'
  },
  {
    id: 2,
    title: 'Chocolate Chip Cookies',
    description: 'Soft and chewy cookies with melted chocolate chips.',
    ingredients: ['Flour', 'Butter', 'Sugar', 'Chocolate chips', 'Vanilla extract'],
    instructions: 'Cream butter and sugar. Add flour and chocolate chips. Bake at 350°F for 10-12 minutes.',
    prepTime: 15,
    category: 'Dessert'
  }
];

function App() {
  const setRecipes = useRecipeStore(state => state.setRecipes);

  React.useEffect(() => {
    setRecipes(initialRecipes);
  }, [setRecipes]);

  return (
    <Router>
      <div className="app">
        <header>
          <h1>
            <Link to="/">Recipe Sharing App</Link>
          </h1>
          <nav>
            <Link to="/">All Recipes</Link>
            <Link to="/add">Add Recipe</Link>
            <Link to="/favorites">Favorites</Link>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={
              <div>
                <SearchBar />
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
