import React from 'react'
import useRecipeStore from '../recipeStore'

const DeleteRecipeButton = ({id}) => {
    const recipes = useRecipeStore(state => state.recipes.filter(stateId => stateId.id !== id));
  return (
    <button onClick={recipes}>Remove</button>
  )
}

export default DeleteRecipeButton
