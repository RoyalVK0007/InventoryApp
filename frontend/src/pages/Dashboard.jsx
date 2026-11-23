import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDashboardSummary, getRecentProducts } from "../services/api";
import StockBadge from "../components/StockBadge";

function SummaryCard({ label, value, color }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm p-5 border-l-4 ${color}`}>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
    </div>
  );
}

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [recent, setRecent] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getDashboardSummary(), getRecentProducts()])
      .then(([s, r]) => {
        setSummary(s.data);
        setRecent(r.data);
      })
      .catch(() => setError("Failed to load dashboard data."));
  }, []);

  if (error) return <p className="text-red-500 p-6">{error}</p>;
  if (!summary) return <p className="p-6 text-gray-500">Loading...</p>;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-700">Dashboard</h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard label="Total Products" value={summary.totalProducts} color="border-blue-500" />
        <SummaryCard label="Total Stock" value={summary.totalStockQuantity} color="border-green-500" />
        <SummaryCard label="Low Stock" value={summary.lowStockCount} color="border-yellow-500" />
        <SummaryCard label="Out of Stock" value={summary.outOfStockCount} color="border-red-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recently Added */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-semibold text-gray-700 mb-3">Recently Added</h3>
          {recent.length === 0 ? (
            <p className="text-gray-400 text-sm">No products yet.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {recent.map((p) => (
                <li key={p.id} className="py-2 flex justify-between items-center text-sm">
                  <div>
                    <p className="font-medium text-gray-800">{p.productName}</p>
                    <p className="text-gray-400 text-xs">{p.sku}</p>
                  </div>
                  <StockBadge status={p.stockStatus} />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-semibold text-gray-700 mb-3">Low Stock Alerts</h3>
          {summary.lowStockProducts.length === 0 ? (
            <p className="text-gray-400 text-sm">All products are well stocked.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {summary.lowStockProducts.map((p) => (
                <li key={p.id} className="py-2 flex justify-between items-center text-sm">
                  <div>
                    <p className="font-medium text-gray-800">{p.productName}</p>
                    <p className="text-gray-400 text-xs">{p.category}</p>
                  </div>
                  <span className="text-yellow-600 font-semibold">{p.quantity} left</span>
                </li>
              ))}
            </ul>
          )}
          <Link to="/products" className="text-blue-600 text-xs mt-3 inline-block hover:underline">
            View all products →
          </Link>
        </div>
      </div>
    </div>
  );
}
