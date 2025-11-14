
import {useEffect, useState} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useRecipeStore from './recipeStore';

const EditRecipeFrom = () => {
    const {recipeId} = useParams();
    const navigate = useNavigate();
    const recipe = useRecipeStore(state => state.recipes.find(recipe => recipe.id === parseInt(recipeId)))
    const updateRecipe = useRecipeStore(state => state.updateRecipe);

    const [formData, setFormData] = useState({
        title:  "",
        description:  "",
        ingredients: [""],
        instructions:  "",
        prepTime:  "",
        category:  "",
    });
   useEffect(() => {
    if (recipe) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormData({
            title: recipe.title || "",
            description: recipe.description || "",
            ingredients: recipe.ingredients && recipe.ingredients.length > 0 ? recipe.ingredients : [""],
            instructions: recipe.instructions || "",
            prepTime: recipe.prepTime || "",
            category: recipe.category || "",
        });
    }
   }, [recipe]);

   const handleSubmit = (event) => {
    event.preventDefault();
    const updatedData = {   
        ...formData,
        ingredients: formData.ingredients.filter((ing) => ing.trim() !== ""),
        prepTime: parseInt(formData.prepTime) || 0,
    };
    updateRecipe(recipe.id, updatedData);
    navigate('/');
  };

    const handleIngredientChange = (index, value) => {
        const newIngredients = [...formData.ingredients];
        newIngredients[index] = value;
        setFormData({ ...formData, ingredients: newIngredients });
    }
    const addIngredientField = () => {
        setFormData({ ...formData, ingredients: [...formData.ingredients, ""] });
    };
    const removeIngredientField = (index) => {
        const newIngredients = formData.ingredients.filter((_, i) => i !== index);
        setFormData({ ...formData, ingredients: newIngredients });
    };
    if (!recipe) {
    return <div>Recipe not found</div>;
  }
    return (
        <form action="" onSubmit={handleSubmit} className="edit-recipe-form">
        <h2>Edit Recipe</h2>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
            <label htmlFor="description">Description: </label>
            <input
              type="text"
              value={formData.description}      
                onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                }
                required
            />
        </div>
        <div className="form-group">
          <label>Ingredients:</label>
          {formData.ingredients.map((ingredient, index) => (                    
            <div key={index} className="ingredient-field">
              <input
                type="text"     
                value={ingredient}
                onChange={(e) =>
                  handleIngredientChange(index, e.target.value)
                }
                placeholder={`Ingredient ${index + 1}`}
              />
                <button type="button" onClick={() => removeIngredientField(index)}>
                    Remove
                </button>
            </div>
          ))}
            <button type="button" onClick={addIngredientField}>
                Add Ingredient
            </button>
        </div>

        <div className="form-group">
            <label htmlFor="instructions">Instructions: </label>    
            <textarea
              value={formData.instructions}
              onChange={(e) =>
                setFormData({ ...formData, instructions: e.target.value })
                }
            ></textarea>
        </div>
        <div className="form-group">
            <label htmlFor="prepTime">Prep Time (mins): </label>
            <input
                type="number"   
                value={formData.prepTime}
                onChange={(e) =>
                    setFormData({ ...formData, prepTime: e.target.value })}
            />
        </div>
        <div className="form-group">
            <label htmlFor="category">Category: </label>
            <input
                type="text"
                value={formData.category}
                onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })}
            />
        </div>
        <div className="form-group">
            <button type="submit">Save Changes</button>
            <button type="button" onClick={() => navigate('/')}>
                Cancel
            </button>
        </div>
      </form>
    )
}   


export default EditRecipeFrom
