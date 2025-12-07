import { useEffect, useState } from "react";
import data from "../data.json";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
const HomePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setRecipes(data);
    setLoading(false);
  }, []);

  if (loading)
    return (
      <div className="inset-0 flex items-center justify-center">
        Loading recipes
      </div>
    );
  return (
    <div >
      <h2>Wecome To Recipe Page</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:grid-cols-3 m-5">
        {recipes.map((recipe) => (
          <Link to={`/recipe/${recipe.id}`} className="block h-full">
          <div key={recipe.id} className="flex flex-col items-center justify-center bg-slate-300 p-8 rounded-xl text-center hover:scale-105 transition-all duration-300">
              <img src={recipe.image} alt={recipe.title} className="size-60 p-2"/>
              <h2 className="p-2 mb-2">{recipe.title}</h2>
              <p>{recipe.summary}</p>
            </div>
        </Link>
        ))}
      </div>
      <div className="text-center">
      <Link to = '/add' 
          className="inline-flex items-center gap-3 bg-lime-600/60 hover:bg-lime-700 text-white font-bold py-2 px-4 mb-4 rounded-lg text-lg shadow-lg transition text-center"
>
      <Plus size={24} />
      Add New Recipe
      </Link>
      </div>
    </div>
  );
}

export default HomePage;
