
import React from 'react'
import HomePage from './components/HomePage'
import RecipeDetail from './components/RecipeDetail'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AddRecipeForm from './components/AddRecipeForm'

const App = () => {
  return (
    <div className=' bg-gray-900 m-0 min-h-screen'>
        <BrowserRouter>
        <Routes>
            <Route path='/' element = {<HomePage />}/>
            <Route path='/recipe/:id' element = {<RecipeDetail /> } />
            <Route path='/add' element = {<AddRecipeForm />} />
        </Routes>
        
        </BrowserRouter>
        </div>
  )
}

export default App
