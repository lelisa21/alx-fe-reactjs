
import { useState } from 'react';
import { useRecipeStore } from '../store/recipeStore';

const AddRecipeForm = () => {
  const addRecipe = useRecipeStore(state => state.addRecipe);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState(['']);
  const [instructions, setInstructions] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    
    const newRecipe = {
      id: Date.now(),
      title,
      description,
      ingredients: ingredients.filter(ing => ing.trim() !== ''),
      instructions,
      prepTime: prepTime ? parseInt(prepTime) : 0,
      category,
      createdAt: new Date().toISOString()
    };
    
    addRecipe(newRecipe);
    
    // Reset form
    setTitle('');
    setDescription('');
    setIngredients(['']);
    setInstructions('');
    setPrepTime('');
    setCategory('');
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const addIngredientField = () => {
    setIngredients([...ingredients, '']);
  };

  const removeIngredientField = (index) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  return (
    <form onSubmit={handleSubmit} className="add-recipe-form">
      <h2>Add New Recipe</h2>
      
      <div className="form-group">
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Recipe title"
          required
        />
      </div>

      <div className="form-group">
        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Recipe description"
          required
        />
      </div>

      <div className="form-group">
        <label>Ingredients:</label>
        {ingredients.map((ingredient, index) => (
          <div key={index} className="ingredient-row">
            <input
              type="text"
              value={ingredient}
              onChange={(e) => handleIngredientChange(index, e.target.value)}
              placeholder={`Ingredient ${index + 1}`}
            />
            {ingredients.length > 1 && (
              <button
                type="button"
                onClick={() => removeIngredientField(index)}
                className="remove-btn"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={addIngredientField} className="add-btn">
          Add Ingredient
        </button>
      </div>

      <div className="form-group">
        <label>Instructions:</label>
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="Cooking instructions"
          rows="4"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Prep Time (mins):</label>
          <input
            type="number"
            value={prepTime}
            onChange={(e) => setPrepTime(e.target.value)}
            placeholder="Preparation time"
          />
        </div>

        <div className="form-group">
          <label>Category:</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g., Italian, Dessert"
          />
        </div>
      </div>

      <button type="submit" className="submit-btn">Add Recipe</button>
    </form>
  );
};

export default AddRecipeForm;
