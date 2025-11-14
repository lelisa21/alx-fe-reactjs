
import { useParams, Link, useNavigate } from 'react-router-dom';
import useRecipeStore from '../recipeStore';

const RecipeDetails = () => {
  const { recipeId } = useParams();
  const navigate = useNavigate();
  const recipe = useRecipeStore(state => 
    state.recipes.find(recipe => recipe.id === parseInt(recipeId))
  );
  const deleteRecipe = useRecipeStore(state => state.deleteRecipe);
  const toggleFavorite = useRecipeStore(state => state.toggleFavorite);
  const isFavorite = useRecipeStore(state => state.isFavorite);

  if (!recipe) {
    return (
      <div className="recipe-details">
        <h2>Recipe not found</h2>
        <Link to="/">Back to recipes</Link>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      deleteRecipe(recipe.id);
      navigate('/');
    }
  };

  return (
    <div className="recipe-details">
      <div className="recipe-actions">
        <Link to="/" className="back-btn">← Back to Recipes</Link>
        <div className="action-buttons">
          <Link to={`/edit/${recipe.id}`} className="edit-btn">Edit</Link>
          <button onClick={handleDelete} className="delete-btn">Delete</button>
          <button 
            onClick={() => toggleFavorite(recipe.id)}
            className={`favorite-btn ${isFavorite(recipe.id) ? 'favorited' : ''}`}
          >
            {isFavorite(recipe.id) ? '★ Favorited' : '☆ Add to Favorites'}
          </button>
        </div>
      </div>

      <div className="recipe-content">
        <h1>{recipe.title}</h1>
        
        <div className="recipe-meta">
          {recipe.category && <span className="category">{recipe.category}</span>}
          {recipe.prepTime && <span className="prep-time">⏱️ {recipe.prepTime} mins</span>}
          {recipe.createdAt && (
            <span className="created-at">
              Added on {new Date(recipe.createdAt).toLocaleDateString()}
            </span>
          )}
        </div>

        <p className="description">{recipe.description}</p>

        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <div className="ingredients-section">
            <h3>Ingredients</h3>
            <ul>
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>
        )}

        {recipe.instructions && (
          <div className="instructions-section">
            <h3>Instructions</h3>
            <p>{recipe.instructions}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeDetails;
