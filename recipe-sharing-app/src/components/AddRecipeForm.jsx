import React from "react";
import useRecipeStore from "../recipeStore";
import { useState } from "react";

const AddRecipeForm = () => {
  const addRecipe = useRecipeStore((state) => state.addRecipe);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    ingredients: [""],
    instructions: "",
    prepTime: "",
    category: "",
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    const recipeData = {
      ...formData,
      ingredients: formData.ingredients.filter((ing) => ing.trim() !== ""),
      prepTime: parseInt(formData.prepTime) || 0,
      createdAt: new Date().toISOString(),
    };
    addRecipe(recipeData);
    setFormData({
      title: "",
      description: "",
      ingredients: [""],
      prepTime: "",
      category: "",
    });
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = value;
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const addIngredientField = () => {
    setFormData({ ...formData, ingredients: [...formData.ingredients, ""] });
  };
  const removeIngredientField = (index) => {
    const newIngredients = formData.ingredients.filter((_, i) => i !== index);
    setFormData({ ...formData, ingredients: newIngredients });
  };

  return (
    <form action="" onSubmit={handleSubmit} className="add-recipe-form">
      <h2>Add New Recipe</h2>
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
        <label htmlFor="ingredients">Ingredients: </label>
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

            {formData.ingredients.length > 1 && (
              <button
                type="button"
                onClick={() => removeIngredientField(index)}
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={addIngredientField}>
          Add Ingredient
        </button>
      </div>

      <div className="form-group">
        <label htmlFor="instruction">Instruction: </label>
        <textarea  value={formData.instructions}
        onChange={e => setFormData({...formData , instructions : e.target.value})}  rows={"4"}/>
      </div>

      <div className="form-group">
        <label htmlFor="prepTime">Preparation Time (mins): </label>
        <input
          type="number"
            value={formData.prepTime}
            onChange={(e) =>
                setFormData({ ...formData, prepTime: e.target.value })
            }
        />
      </div>
        <div className="form-group">
        <label htmlFor="category">Category: </label>
        <input
          type="text"
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
        />
      </div>
      <button type="submit">Add Recipe</button>
    </form>
  );
};

export default AddRecipeForm;
