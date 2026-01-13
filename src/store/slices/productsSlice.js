import { createSlice } from '@reduxjs/toolkit'

const loadProductsFromStorage = () => {
  try {
    const stored = localStorage.getItem('products')
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    return []
  }
}

const saveProductsToStorage = (products) => {
  try {
    localStorage.setItem('products', JSON.stringify(products))
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

const initialState = {
  products: loadProductsFromStorage(),
  nextMaterialId: parseInt(localStorage.getItem('nextMaterialId') || '1', 10),
  nextProductId: parseInt(localStorage.getItem('nextProductId') || '1', 10),
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProduct: (state, action) => {
      const newProduct = {
        ...action.payload,
        id: state.nextProductId,
      }
      state.products.push(newProduct)
      state.nextProductId += 1
      saveProductsToStorage(state.products)
      localStorage.setItem('nextProductId', state.nextProductId.toString())
    },
    updateProduct: (state, action) => {
      const { id, ...updatedData } = action.payload
      const index = state.products.findIndex((p) => p.id === id)
      if (index !== -1) {
        state.products[index] = { ...state.products[index], ...updatedData }
        saveProductsToStorage(state.products)
      }
    },
    deleteProduct: (state, action) => {
      state.products = state.products.filter((p) => p.id !== action.payload)
      saveProductsToStorage(state.products)
    },
  },
})

export const { addProduct, updateProduct, deleteProduct } =
  productsSlice.actions

export default productsSlice.reducer

