import React, { useState, useEffect } from "react";
import Modal from "../../shared/Modal";
import api from "../../../services/api";
import "./AddProductModal.css";

const AddProductModal = ({ open, onClose, onProductAdded, initialData }) => {
  const emptyForm = {
    name: "",
    description: "",
    price: "",
    stock_quantity: "",
    sku: "",
    image_url: "",
    category_id: "",
    supplier_id: "",
    weight: "",
    length: "",
    width: "",
    height: "",
    is_featured: false,
    tags: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  // Fetch categories and suppliers
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catResponse, supResponse] = await Promise.all([
          api.get("/categories"),
          api.get("/suppliers")
        ]);
        setCategories(catResponse.data || []);
        setSuppliers(supResponse.data || []);
      } catch (err) {
        console.error("Failed to fetch dropdown data:", err);
      }
    };
    
    if (open) {
      fetchData();
    }
  }, [open]);

  // Populate form when editing or reset when modal closes
  useEffect(() => {
    if (open && initialData) {
      setForm({
        name: initialData.name || "",
        description: initialData.description || "",
        price: initialData.price || "",
        stock_quantity: initialData.stock_quantity || "",
        sku: initialData.sku || "",
        image_url: initialData.image_url || "",
        category_id: initialData.category_id || "",
        supplier_id: initialData.supplier_id || "",
        weight: initialData.weight || "",
        length: initialData.dimensions?.length || "",
        width: initialData.dimensions?.width || "",
        height: initialData.dimensions?.height || "",
        is_featured: !!initialData.is_featured,
        tags: Array.isArray(initialData.tags) ? initialData.tags.join(", ") : "",
      });
    } else if (open && !initialData) {
      setForm(emptyForm);
      setErrors({});
    }
  }, [initialData, open]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.name.trim()) newErrors.name = "Product name is required";
    if (!form.price || form.price <= 0) newErrors.price = "Valid price is required";
    if (form.stock_quantity && form.stock_quantity < 0) newErrors.stock_quantity = "Stock cannot be negative";
    if (form.image_url && !/^https?:\/\/.+\..+/.test(form.image_url)) {
      newErrors.image_url = "Please enter a valid URL";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm({ ...form, [name]: checked });
    } else {
      setForm({ ...form, [name]: value });
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        stock_quantity: Number(form.stock_quantity),
        sku: form.sku,
        image_url: form.image_url,
        category_id: form.category_id || undefined,
        supplier_id: form.supplier_id || undefined,
        weight: form.weight ? Number(form.weight) : undefined,
        dimensions: {
          length: form.length ? Number(form.length) : undefined,
          width: form.width ? Number(form.width) : undefined,
          height: form.height ? Number(form.height) : undefined,
        },
        is_featured: !!form.is_featured,
        tags: form.tags
          ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
          : [],
      };
      
      // Remove empty fields and empty dimensions
      Object.keys(payload).forEach(
        (key) =>
          (payload[key] === "" ||
            payload[key] === undefined ||
            (key === "dimensions" &&
              Object.values(payload.dimensions).every((v) => !v && v !== 0))) &&
          delete payload[key]
      );
      
      if (initialData && initialData._id) {
        await api.put(`/products/${initialData._id}`, payload);
      } else {
        await api.post("/products", payload);
      }
      onProductAdded();
      onClose();
    } catch (err) {
      alert(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to save product"
      );
    }
    setLoading(false);
  };

  return (
    <Modal 
      open={open} 
      onClose={onClose} 
      title={initialData ? "Edit Product" : "Add New Product"}
      size="large"
    >
      <form className="add-product-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-section">
            <h3>Basic Information</h3>
            
            <div className="form-group">
              <label htmlFor="name">
                Product Name <span className="required">*</span>
              </label>
              <input 
                id="name"
                name="name" 
                placeholder="Enter product name" 
                value={form.name} 
                onChange={handleChange} 
                className={errors.name ? "error" : ""}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea 
                id="description"
                name="description" 
                placeholder="Product description" 
                value={form.description} 
                onChange={handleChange} 
                rows="3"
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">
                  Price ($) <span className="required">*</span>
                </label>
                <input 
                  id="price"
                  name="price" 
                  type="number" 
                  placeholder="0.00" 
                  value={form.price} 
                  onChange={handleChange} 
                  min="0" 
                  step="0.01"
                  className={errors.price ? "error" : ""}
                />
                {errors.price && <span className="error-text">{errors.price}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="stock_quantity">Stock Quantity</label>
                <input 
                  id="stock_quantity"
                  name="stock_quantity" 
                  type="number" 
                  placeholder="0" 
                  value={form.stock_quantity} 
                  onChange={handleChange} 
                  min="0"
                  className={errors.stock_quantity ? "error" : ""}
                />
                {errors.stock_quantity && <span className="error-text">{errors.stock_quantity}</span>}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="sku">SKU (Stock Keeping Unit)</label>
              <input 
                id="sku"
                name="sku" 
                placeholder="e.g., PROD-001" 
                value={form.sku} 
                onChange={handleChange} 
              />
            </div>
          </div>
          
          <div className="form-section">
            <h3>Media & Categorization</h3>
            
            <div className="form-group">
              <label htmlFor="image_url">Image URL</label>
              <input 
                id="image_url"
                name="image_url" 
                placeholder="https://example.com/image.jpg" 
                value={form.image_url} 
                onChange={handleChange} 
                className={errors.image_url ? "error" : ""}
              />
              {errors.image_url && <span className="error-text">{errors.image_url}</span>}
              {form.image_url && (
                <div className="image-preview">
                  <img src={form.image_url} alt="Preview" onError={(e) => e.target.style.display = 'none'} />
                </div>
              )}
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category_id">Category</label>
                <select 
                  id="category_id"
                  name="category_id" 
                  value={form.category_id} 
                  onChange={handleChange}
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="supplier_id">Supplier</label>
                <select 
                  id="supplier_id"
                  name="supplier_id" 
                  value={form.supplier_id} 
                  onChange={handleChange}
                >
                  <option value="">Select a supplier</option>
                  {suppliers.map(supplier => (
                    <option key={supplier._id} value={supplier._id}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="tags">Tags</label>
              <input 
                id="tags"
                name="tags" 
                placeholder="tag1, tag2, tag3" 
                value={form.tags} 
                onChange={handleChange} 
              />
              <div className="input-hint">Separate tags with commas</div>
            </div>
          </div>
          
          <div className="form-section">
            <h3>Shipping Details</h3>
            
            <div className="form-group">
              <label htmlFor="weight">Weight (kg)</label>
              <input 
                id="weight"
                name="weight" 
                type="number" 
                placeholder="0.0" 
                value={form.weight} 
                onChange={handleChange} 
                min="0" 
                step="0.1"
              />
            </div>
            
            <div className="form-group">
              <label>Dimensions (cm)</label>
              <div className="dimensions-input">
                <div className="dimension-field">
                  <input
                    name="length"
                    type="number"
                    placeholder="Length"
                    value={form.length}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
                <div className="dimension-field">
                  <input
                    name="width"
                    type="number"
                    placeholder="Width"
                    value={form.width}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
                <div className="dimension-field">
                  <input
                    name="height"
                    type="number"
                    placeholder="Height"
                    value={form.height}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="form-section featured-toggle">
          <label className="checkbox-label">
            <input
              name="is_featured"
              type="checkbox"
              checked={!!form.is_featured}
              onChange={handleChange}
            />
            <span className="checkmark"></span>
            Feature this product
          </label>
          <div className="input-hint">Featured products will be highlighted on the homepage</div>
        </div>
        
        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                {initialData ? "Updating..." : "Adding..."}
              </>
            ) : (
              initialData ? "Update Product" : "Add Product"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddProductModal;