
import { useEffect } from 'react';
import useRecipeStore from '../recipeStore'
import { Link } from 'react-router-dom';

const RecommendationsList = () => {
    const recommendations = useRecipeStore(state => state.recommendations);
    const generateRecommendations = useRecipeStore(state => state.generateRecommendations);

    const toggleFavorite = useRecipeStore((state) => state.toggleFavorite);
    const isFavorite = useRecipeStore((state) => state.isFavorite);
    useEffect(() => {
        generateRecommendations();
    }, [generateRecommendations]);

    if(recommendations.length === 0) {
        return <div>No recommendations available at the moment.</div>
    }

  return (
    <div className='recommendation-list'>
        <h2>Recommended for You </h2>
        <div className="recipes-grid">
        {recommendations.map((recipe) => (
          <div key={recipe.id} className="recipe-card recommendation">
            <div>
              <h3> <Link to={`/recipe/${recipe.id}`}>{recipe.title}</Link></h3>
              <button onClick={() => toggleFavorite(recipe.id)}>
                {isFavorite(recipe.id) ? '★' : '☆'}
              </button>
            </div>
            <p>{recipe.description}</p>
            {recipe.prepTime && <p>Prep Time: {recipe.prepTime} mins</p>}
          </div>
        ))}
      </div>    
    </div>
  )
}

export default RecommendationsList
