
import useRecipeStore from './recipeStore'
import { Link } from 'react-router-dom';

const FavoritesList = () => {
    const favorites = useRecipeStore(state => state.favorites.map(id => state.recipes.find(recipe  => recipe.id === id)))
  const toggleFavorites = useRecipeStore(state => state.toggleFavorite);

  const validFavorites = favorites.filter(recipe => recipe !== undefined);

  if(validFavorites.length === 0) {
    return (<div>
        <h2>My Favorites</h2>
       <p>No favorite recipes yet.</p> 
        </div>)
  }
    return (
    <div className='favorite-list'>
      
      <h2>My Favorites {validFavorites.length}</h2>
     
      <div className="recipes-grid">
        {validFavorites.map((recipe) => (
          <div key={recipe.id} className="recipe-card favorite">
            <div>
            <h3> <Link to={`/recipes/${recipe.id}`}>{recipe.title}</Link></h3>
            <button onClick={() => toggleFavorites(recipe.id)}> ★</button>
            </div>
            
    <p>{recipe.description}</p>
    {recipe.prepTime && <p>Prep Time: {recipe.prepTime} mins</p>}
     </div>
      )) }
      </div>
  
 </div>
  )
}

export default FavoritesList
