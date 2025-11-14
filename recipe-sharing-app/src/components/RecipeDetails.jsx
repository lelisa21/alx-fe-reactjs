// src/components/RecipeDetails.jsx
import { useParams, Link } from 'react-router-dom';
import { useRecipeStore } from '../store/recipeStore';
import DeleteRecipeButton from './DeleteRecipeButton';

const RecipeDetails = ({ recipeId }) => {
  const { recipeId: paramRecipeId } = useParams();
  const actualRecipeId = recipeId || parseInt(paramRecipeId);
  
  const recipe = useRecipeStore(state =>
    state.recipes.find(recipe => recipe.id === actualRecipeId)
  );

  if (!recipe) {
    return (
      <div>
        <h2>Recipe not found</h2>
        <Link to="/">Back to recipes</Link>
      </div>
    );
  }

  return (
    <div>
      <h1>{recipe.title}</h1>
      <p>{recipe.description}</p>
      
      {recipe.ingredients && (
        <div>
          <h3>Ingredients</h3>
          <ul>
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>
      )}
      
      {recipe.instructions && (
        <div>
          <h3>Instructions</h3>
          <p>{recipe.instructions}</p>
        </div>
      )}
      
      <div>
        <Link to={`/edit/${recipe.id}`}>Edit Recipe</Link>
        <DeleteRecipeButton recipeId={recipe.id} />
      </div>
    </div>
  );
};

export default RecipeDetails;
