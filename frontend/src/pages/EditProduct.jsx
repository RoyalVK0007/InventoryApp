import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProduct, updateProduct } from "../services/api";
import ProductForm from "../components/ProductForm";

export default function EditProduct() {
  const { id } = useParams();
  const [initial, setInitial] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getProduct(id)
      .then((res) => setInitial(res.data))
      .catch(() => setError("Failed to load product."));
  }, [id]);

  const handleSubmit = async (data) => {
    setLoading(true);
    setError("");
    try {
      await updateProduct(id, data);
      navigate("/products");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update product.");
    } finally {
      setLoading(false);
    }
  };

  if (error && !initial) return <p className="p-6 text-red-500">{error}</p>;
  if (!initial) return <p className="p-6 text-gray-500">Loading...</p>;

  return (
    <div className="p-6 max-w-2xl">
      <h2 className="text-xl font-semibold text-gray-700 mb-5">Edit Product</h2>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <ProductForm initialData={initial} onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
}
