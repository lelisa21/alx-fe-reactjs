import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import data from '../data.json'
import { Link } from "react-router-dom";
import { ArrowLeft, Clock, Users, ChefHat } from "lucide-react";
const RecipeDetail = () => {
    const {id} = useParams();
    const [recipe , setRecipes] = useState([]);
    const [loading , setLoading] = useState(true);

    useEffect(() => {
        const foundRecipe = data.find((r) => r.id === parseInt(id));
       setRecipes(foundRecipe || null);
       setLoading(false);
    } , [id])

    if(loading) {
        return (
            <div className="fixed inset-0 z-50 bg-slate-200/65 flex items-center justify-center">
                <div className="">Loading Recipes...</div>
            </div>
        )
    }

    if(!recipe){
        return (
            <div className="max-h-screen bg-slate-100">
                <div className="">
                  <h2>Recipe not Found!</h2>  
                  <Link to = '/'>
                  Go back To Home
                  </Link>
                </div>
            </div>
        )
    }
  return (
   <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Recipes
        </Link>

        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-10">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image */}
            <div className="relative h-96 md:h-full">
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <h1 className="absolute bottom-6 left-6 text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
                {recipe.title}
              </h1>
            </div>

            {/* Info Card */}
            <div className="p-8 m-6 md:p-10 flex flex-col justify-between bg-gradient-to-br from-amber-100 to-orange-100">
              <div>
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  {recipe.summary}
                </p>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-white/80 rounded-lg p-4 shadow">
                    <Clock className="mx-auto mb-2 text-amber-600" size={28} />
                    <p className="text-sm text-gray-600">Prep Time</p>
                    <p className="font-bold text-gray-800">{recipe.prepTime || "30 min"}</p>
                  </div>
                  <div className="bg-white/80 rounded-lg p-4 shadow">
                    <Users className="mx-auto mb-2 text-amber-600" size={28} />
                    <p className="text-sm text-gray-600">Servings</p>
                    <p className="font-bold text-gray-800">{recipe.servings || 4}</p>
                  </div>
                  <div className="bg-white/80 rounded-lg p-4 shadow">
                    <ChefHat className="mx-auto mb-2 text-amber-600" size={28} />
                    <p className="text-sm text-gray-600">Difficulty</p>
                    <p className="font-bold text-gray-800 capitalize">{recipe.difficulty || "Medium"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {/* Ingredients */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <h2 className="text-2xl font-bold text-amber-800 mb-5 flex items-center gap-3">
                Ingredients
              </h2>
              <ul className="space-y-3">
                {recipe.ingredients?.map((ing, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-700">
                    <span className="text-green-600 mt-1">•</span>
                    <span>{ing}</span>
                  </li>
                )) || (
                  <li className="text-gray-500 italic">No ingredients listed.</li>
                )}
              </ul>
            </div>
          </div>

          {/* Instructions */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-amber-800 mb-6">
                Cooking Instructions
              </h2>
              <ol className="space-y-6">
                {recipe.instructions?.map((step, index) => (
                  <li key={index} className="flex gap-4">
                    <div className="flex-shrink-0 size-7 bg-cyan-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 leading-relaxed pt-1">
                      {step}
                    </p>
                  </li>
                )) || (
                  <p className="text-gray-500 italic">No instructions available.</p>
                )}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetail
