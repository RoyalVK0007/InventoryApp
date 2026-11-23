import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProduct, getStockHistory, stockIn, stockOut } from "../services/api";

export default function StockHistory() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [history, setHistory] = useState([]);
  const [qty, setQty] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const [p, h] = await Promise.all([getProduct(id), getStockHistory(id)]);
      setProduct(p.data);
      setHistory(h.data);
    } catch {
      setError("Failed to load stock data.");
    }
  };

  useEffect(() => { load(); }, [id]);

  const handleStock = async (type) => {
    if (!qty || Number(qty) < 1) return setError("Enter a valid quantity.");
    setLoading(true);
    setError("");
    try {
      if (type === "in") await stockIn(id, { quantity: Number(qty), note });
      else await stockOut(id, { quantity: Number(qty), note });
      setQty("");
      setNote("");
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Stock operation failed.");
    } finally {
      setLoading(false);
    }
  };

  if (error && !product) return <p className="p-6 text-red-500">{error}</p>;
  if (!product) return <p className="p-6 text-gray-500">Loading...</p>;

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link to="/products" className="text-blue-600 text-sm hover:underline">← Products</Link>
        <h2 className="text-xl font-semibold text-gray-700">
          Stock — {product.productName}
        </h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-5">
        <p className="text-sm text-gray-500 mb-1">Current Quantity</p>
        <p className="text-4xl font-bold text-gray-800">{product.quantity}</p>
        {product.quantity === 0 && (
          <p className="text-red-500 text-sm mt-1">Out of stock</p>
        )}
        {product.quantity > 0 && product.quantity < 10 && (
          <p className="text-yellow-600 text-sm mt-1">Low stock warning</p>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-5 space-y-3">
        <h3 className="font-semibold text-gray-700">Update Stock</h3>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex gap-3 flex-wrap">
          <input
            type="number"
            min={1}
            placeholder="Quantity"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => handleStock("in")}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 disabled:opacity-50"
          >
            + Stock In
          </button>
          <button
            onClick={() => handleStock("out")}
            disabled={loading}
            className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 disabled:opacity-50"
          >
            − Stock Out
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-semibold text-gray-700 mb-3">Movement History</h3>
        {history.length === 0 ? (
          <p className="text-gray-400 text-sm">No movements recorded yet.</p>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50">
              <tr>
                {["Type", "Qty", "Note", "Date"].map((h) => (
                  <th key={h} className="px-4 py-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {history.map((m) => (
                <tr key={m.id}>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${m.movementType === "IN" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {m.movementType}
                    </span>
                  </td>
                  <td className="px-4 py-2">{m.quantity}</td>
                  <td className="px-4 py-2 text-gray-500">{m.note || "—"}</td>
                  <td className="px-4 py-2 text-gray-400">
                    {new Date(m.movedAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
