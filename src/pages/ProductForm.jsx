import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addProduct } from '../store/slices/productsSlice'

const ProductForm = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [formData, setFormData] = useState({
    name: '',
    unitOfMeasure: 'units',
    category: 'Finished',
    expiry: '',
    materials: [],
  })

  const [materialForm, setMaterialForm] = useState({
    materialId: '',
    name: '',
    unitOfMeasure: 'units',
    quantity: '',
    price: '',
  })

  const calculateMaterialTotal = (qty, price) => {
    return parseFloat(qty || 0) * parseFloat(price || 0)
  }

  const calculateTax = (totalPrice) => {
    return totalPrice * 0.1 
  }

  const calculateMaterialTotalAmount = (qty, price) => {
    const totalPrice = calculateMaterialTotal(qty, price)
    const tax = calculateTax(totalPrice)
    return totalPrice + tax
  }

  const handleProductChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleMaterialChange = (e) => {
    const { name, value } = e.target
    setMaterialForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddMaterial = () => {
    if (
      !materialForm.name ||
      !materialForm.quantity ||
      !materialForm.price ||
      !materialForm.materialId
    ) {
      alert('Please fill all material fields')
      return
    }

    const quantity = parseFloat(materialForm.quantity)
    const price = parseFloat(materialForm.price)
    const totalPrice = calculateMaterialTotal(quantity, price)
    const taxAmount = calculateTax(totalPrice)
    const totalAmount = calculateMaterialTotalAmount(quantity, price)

    const newMaterial = {
      materialId: materialForm.materialId,
      name: materialForm.name,
      unitOfMeasure: materialForm.unitOfMeasure,
      quantity: quantity,
      price: price,
      totalPrice: totalPrice,
      taxAmount: taxAmount,
      totalAmount: totalAmount,
    }

    setFormData((prev) => ({
      ...prev,
      materials: [...prev.materials, newMaterial],
    }))

   
    setMaterialForm({
      materialId: '',
      name: '',
      unitOfMeasure: 'units',
      quantity: '',
      price: '',
    })
  }

  const handleRemoveMaterial = (index) => {
    setFormData((prev) => ({
      ...prev,
      materials: prev.materials.filter((_, i) => i !== index),
    }))
  }

  const calculateSubtotal = () => {
    return formData.materials.reduce((sum, material) => sum + material.totalAmount, 0)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.name || !formData.expiry || formData.materials.length === 0) {
      alert('Please fill all required fields and add at least one material')
      return
    }

    const expiryDate = new Date(formData.expiry)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (expiryDate <= today) {
      alert('Expiry date must be a future date')
      return
    }

    const productData = {
      ...formData,
      totalCost: calculateSubtotal(),
    }

    dispatch(addProduct(productData))
    navigate('/')
  }

  const units = ['ml', 'ltr', 'gm', 'kg', 'mtr', 'mm', 'box', 'units']
  const categories = ['Finished', 'Semi finished', 'Subsidiary']

  return (
    <div className="container">
      <div className="header">
        <h1>Add New Product</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card">
          <h2 style={{ marginBottom: '20px', color: '#007bff' }}>
            Product Information
          </h2>

          <div className="form-group">
            <label>Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleProductChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Unit of Measure *</label>
            <select
              name="unitOfMeasure"
              value={formData.unitOfMeasure}
              onChange={handleProductChange}
              required
            >
              {units.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleProductChange}
              required
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Expiry Date *</label>
            <input
              type="date"
              name="expiry"
              value={formData.expiry}
              onChange={handleProductChange}
              required
            />
          </div>
        </div>

        <div className="card">
          <h2 style={{ marginBottom: '20px', color: '#007bff' }}>
            Raw Materials
          </h2>

          <div className="material-item">
            <div className="material-row">
              <div className="form-group">
                <label>Material ID *</label>
                <input
                  type="text"
                  name="materialId"
                  value={materialForm.materialId}
                  onChange={handleMaterialChange}
                />
              </div>

              <div className="form-group">
                <label>Material Name *</label>
                <input
                  type="text"
                  name="name"
                  value={materialForm.name}
                  onChange={handleMaterialChange}
                />
              </div>

              <div className="form-group">
                <label>Unit of Measure *</label>
                <select
                  name="unitOfMeasure"
                  value={materialForm.unitOfMeasure}
                  onChange={handleMaterialChange}
                >
                  {units.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Quantity *</label>
                <input
                  type="number"
                  name="quantity"
                  step="0.01"
                  min="0"
                  value={materialForm.quantity}
                  onChange={handleMaterialChange}
                />
              </div>

              <div className="form-group">
                <label>Price (₹) *</label>
                <input
                  type="number"
                  name="price"
                  step="0.01"
                  min="0"
                  value={materialForm.price}
                  onChange={handleMaterialChange}
                />
              </div>
            </div>

            <div style={{ marginTop: '10px', padding: '10px', background: '#fff', borderRadius: '5px' }}>
              <strong>Calculated Values:</strong>
              <div style={{ marginTop: '5px' }}>
                Total Price: ₹
                {calculateMaterialTotal(
                  materialForm.quantity,
                  materialForm.price
                ).toFixed(2)}
              </div>
              <div>
                Tax (10%): ₹
                {calculateTax(
                  calculateMaterialTotal(
                    materialForm.quantity,
                    materialForm.price
                  )
                ).toFixed(2)}
              </div>
              <div>
                Total Amount: ₹
                {calculateMaterialTotalAmount(
                  materialForm.quantity,
                  materialForm.price
                ).toFixed(2)}
              </div>
            </div>

            <div className="material-actions">
              <button
                type="button"
                className="btn btn-success"
                onClick={handleAddMaterial}
              >
                + Add Material
              </button>
            </div>
          </div>

          {formData.materials.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <h3 style={{ marginBottom: '15px' }}>Added Materials:</h3>
              {formData.materials.map((material, index) => (
                <div key={index} className="material-item">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong>{material.name}</strong> (ID: {material.materialId})
                      <div style={{ marginTop: '5px', fontSize: '14px', color: '#666' }}>
                        Qty: {material.quantity} {material.unitOfMeasure} × ₹{material.price} = ₹{material.totalPrice.toFixed(2)} | 
                        Tax: ₹{material.taxAmount.toFixed(2)} | 
                        Total: ₹{material.totalAmount.toFixed(2)}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => handleRemoveMaterial(index)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card subtotal-section">
          <h3>Product Subtotal</h3>
          <div className="subtotal-row">
            <span>Total Cost of All Materials:</span>
            <span>₹{calculateSubtotal().toFixed(2)}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button type="submit" className="btn btn-primary">
            Save Product
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProductForm

