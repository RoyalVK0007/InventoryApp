import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getProducts, searchProducts, getProductsByCategory, deleteProduct,
} from "../services/api";
import ProductTable from "../components/ProductTable";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      let res;
      if (keyword.trim()) res = await searchProducts(keyword.trim());
      else if (category.trim()) res = await getProductsByCategory(category.trim());
      else res = await getProducts();
      setProducts(res.data);
    } catch {
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch {
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleDelete = async () => {
    try {
      await deleteProduct(confirmDelete.id);
      setConfirmDelete(null);
      fetchProducts();
    } catch {
      alert("Failed to delete product.");
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-700">Products</h2>
        <Link
          to="/products/add"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          + Add Product
        </Link>
      </div>

      {/* Filters */}
      <form onSubmit={handleSearch} className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search by name or SKU..."
          value={keyword}
          onChange={(e) => { setKeyword(e.target.value); setCategory(""); }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Filter by category..."
          value={category}
          onChange={(e) => { setCategory(e.target.value); setKeyword(""); }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-gray-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800"
        >
          Search
        </button>
        <button
          type="button"
          onClick={() => { setKeyword(""); setCategory(""); fetchAllProducts(); }}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Clear
        </button>
      </form>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="bg-white rounded-xl shadow-sm">
        {loading ? (
          <p className="p-6 text-gray-500 text-sm">Loading...</p>
        ) : (
          <ProductTable products={products} onDelete={setConfirmDelete} />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="font-semibold text-gray-800 mb-2">Delete Product</h3>
            <p className="text-sm text-gray-600 mb-5">
              Are you sure you want to delete <strong>{confirmDelete.productName}</strong>? This cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
