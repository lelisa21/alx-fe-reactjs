import { useState } from "react";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const AddRecipeForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    prepTime: "",
    servings: "",
    image: "", 
  });

  const [ingredients, setIngredients] = useState(["", ""]);
  const [instructions, setInstructions] = useState(["", ""]);

  const [errors, setErrors] = useState({});

  // Handle text inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add new ingredient/step field
  const addField = (type) => {
    if (type === "ingredient") {
      setIngredients([...ingredients, ""]);
    } else {
      setInstructions([...instructions, ""]);
    }
  };

  // Update ingredient/step
  const updateField = (index, value, type) => {
    if (type === "ingredient") {
      const newIngredients = [...ingredients];
      newIngredients[index] = value;
      setIngredients(newIngredients);
    } else {
      const newInstructions = [...instructions];
      newInstructions[index] = value;
      setInstructions(newInstructions);
    }
  };

  // Remove ingredient/step
  const removeField = (index, type) => {
    if (type === "ingredient" && ingredients.length > 2) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    } else if (type === "instruction" && instructions.length > 2) {
      setInstructions(instructions.filter((_, i) => i !== index));
    }
  };

  // Validation
  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Recipe title is required";
    if (!formData.summary.trim()) newErrors.summary = "Summary is required";

    const filledIngredients = ingredients.filter((i) => i.trim());
    if (filledIngredients.length < 2)
      newErrors.ingredients = "Please add at least 2 ingredients";

    const filledInstructions = instructions.filter((i) => i.trim());
    if (filledInstructions.length < 2)
      newErrors.instructions = "Please add at least 2 preparation steps";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    // Create new recipe object
    const newRecipe = {
      id: Date.now(), // simple ID (good enough for demo)
      title: formData.title,
      summary: formData.summary,
      prepTime: formData.prepTime || "30 min",
      servings: formData.servings || 4,
      image:
        formData.image ||
        `https://source.unsplash.com/random/800x600/?${encodeURIComponent(
          formData.title
        )},food`,
      ingredients: ingredients.filter((i) => i.trim()),
      instructions: instructions.filter((i) => i.trim()),
      difficulty: "medium",
    };


    const existing = JSON.parse(localStorage.getItem("userRecipes") || "[]");
    existing.push(newRecipe);
    localStorage.setItem("userRecipes", JSON.stringify(existing));

    alert("Recipe added successfully!");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">

        <Link
          to="/"
          className="inline-flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-medium mb-8"
        >
          <ArrowLeft size={20} />
          Back to Recipes
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
          <h1 className="text-3xl md:text-4xl font-bold text-cyan-800 mb-8 text-center">
            Add New Recipe
          </h1>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title & Summary */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipe Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="e.g., Grandma's Apple Pie"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Summary <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                  placeholder="Brief description of your recipe"
                />
                {errors.summary && <p className="text-red-500 text-sm mt-1">{errors.summary}</p>}
              </div>
            </div>

            {/* Optional fields */}
            <div className="grid md:grid-cols-2 gap-6">
              <input
                type="text"
                name="prepTime"
                value={formData.prepTime}
                onChange={handleChange}
                placeholder="Prep Time (e.g., 20 min)"
                className="px-4 py-3 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                name="servings"
                value={formData.servings}
                onChange={handleChange}
                placeholder="Servings (e.g., 6)"
                className="px-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Ingredients */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Ingredients <span className="text-red-500">*</span> (at least 2)
              </label>
              {ingredients.map((ing, index) => (
                <div key={index} className="flex gap-3 mb-3">
                  <input
                    type="text"
                    value={ing}
                    onChange={(e) => updateField(index, e.target.value, "ingredient")}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg"
                    placeholder="e.g., 2 cups flour"
                  />
                  {ingredients.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeField(index, "ingredient")}
                      className="text-red-600 hover:bg-red-50 p-3 rounded-lg transition"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addField("ingredient")}
                className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-medium"
              >
                <Plus size={20} />
                Add Ingredient
              </button>
              {errors.ingredients && <p className="text-red-500 text-sm mt-2">{errors.ingredients}</p>}
            </div>

            {/* Instructions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Preparation Steps <span className="text-red-500">*</span> (at least 2)
              </label>
              {instructions.map((step, index) => (
                <div key={index} className="flex gap-3 mb-4">
                  <span className="text-cyan-600 font-bold text-lg w-8">{index + 1}.</span>
                  <textarea
                    value={step}
                    onChange={(e) => updateField(index, e.target.value, "instruction")}
                    rows="3"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg resize-none"
                    placeholder="Describe this step clearly..."
                  />
                  {instructions.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeField(index, "instruction")}
                      className="text-red-600 hover:bg-red-50 p-3 rounded-lg transition self-start"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addField("instruction")}
                className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-medium"
              >
                <Plus size={20} />
                Add Step
              </button>
              {errors.instructions && <p className="text-red-500 text-sm mt-2">{errors.instructions}</p>}
            </div>

            {/* Submit Button */}
            <div className="text-center pt-6">
              <button
                type="submit"
                className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-4 px-12 rounded-full text-lg transition transform hover:scale-105 shadow-lg"
              >
                Publish Recipe
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddRecipeForm;
