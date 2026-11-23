import { useState } from "react";

const INITIAL = {
  productName: "", sku: "", category: "", description: "",
  quantity: "", price: "", supplier: "",
};

export default function ProductForm({ initialData, onSubmit, loading }) {
  const [form, setForm] = useState(initialData || INITIAL);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.productName.trim()) e.productName = "Required";
    if (!form.sku.trim()) e.sku = "Required";
    if (!form.category.trim()) e.category = "Required";
    if (form.quantity === "" || Number(form.quantity) < 0) e.quantity = "Must be ≥ 0";
    if (form.price === "" || Number(form.price) < 0) e.price = "Must be ≥ 0";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ ...form, quantity: Number(form.quantity), price: Number(form.price) });
  };

  const field = (name, label, type = "text", extra = {}) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={form[name]}
        onChange={handleChange}
        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[name] ? "border-red-400" : "border-gray-300"}`}
        {...extra}
      />
      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {field("productName", "Product Name")}
      {field("sku", "SKU")}
      {field("category", "Category")}
      {field("supplier", "Supplier")}
      {field("quantity", "Quantity", "number", { min: 0 })}
      {field("price", "Price ($)", "number", { min: 0, step: "0.01" })}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Product"}
        </button>
      </div>
    </form>
  );
}
