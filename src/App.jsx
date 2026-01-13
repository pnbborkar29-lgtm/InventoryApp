import React from 'react'
import { Routes, Route } from 'react-router-dom'
import ProductList from './pages/ProductList'
import ProductForm from './pages/ProductForm'
import ProductEdit from './pages/ProductEdit'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/add" element={<ProductForm />} />
        <Route path="/edit/:id" element={<ProductEdit />} />
      </Routes>
    </div>
  )
}

export default App

