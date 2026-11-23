import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../services/api";
import ProductForm from "../components/ProductForm";

export default function AddProduct() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    setLoading(true);
    setError("");
    try {
      await createProduct(data);
      navigate("/products");
    } catch (err) {
      let msg;
      if (err.response?.data?.message) {
        msg = err.response.data.message;
      } else if (err.response?.data?.fieldErrors) {
        msg = JSON.stringify(err.response.data.fieldErrors);
      } else {
        msg = "Failed to create product.";
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl">
      <h2 className="text-xl font-semibold text-gray-700 mb-5">Add Product</h2>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <ProductForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
}
