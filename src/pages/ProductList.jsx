import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const ProductList = () => {
  const navigate = useNavigate()
  const products = useSelector((state) => state.products.products)

  const handleEdit = (id) => {
    navigate(`/edit/${id}`)
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Manufacturing Inventory Management</h1>
        <p>Product Inventory List</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button className="btn btn-primary" onClick={() => navigate('/add')}>
          + Add New Product
        </button>
      </div>

      {products.length === 0 ? (
        <div className="card empty-state">
          <h2>No Products Found</h2>
          <p>Click "Add New Product" to create your first product.</p>
        </div>
      ) : (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Total Cost (₹)</th>
                <th>Number of Raw Materials</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <a
                      href="#"
                      className="link"
                      onClick={(e) => {
                        e.preventDefault()
                        handleEdit(product.id)
                      }}
                    >
                      {product.name}
                    </a>
                  </td>
                  <td>{product.category}</td>
                  <td>₹{product.totalCost.toFixed(2)}</td>
                  <td>{product.materials.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default ProductList

