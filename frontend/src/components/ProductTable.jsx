import { Link } from "react-router-dom";
import StockBadge from "./StockBadge";

export default function ProductTable({ products, onDelete }) {
  if (products.length === 0) {
    return <p className="text-gray-500 text-sm py-6 text-center">No products found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
          <tr>
            {["Name", "SKU", "Category", "Qty", "Price", "Supplier", "Status", "Actions"].map((h) => (
              <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {products.map((p) => (
            <tr key={p.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-800">{p.productName}</td>
              <td className="px-4 py-3 text-gray-500">{p.sku}</td>
              <td className="px-4 py-3">{p.category}</td>
              <td className="px-4 py-3">{p.quantity}</td>
              <td className="px-4 py-3">${p.price.toFixed(2)}</td>
              <td className="px-4 py-3">{p.supplier || "—"}</td>
              <td className="px-4 py-3"><StockBadge status={p.stockStatus} /></td>
              <td className="px-4 py-3">
                <div className="flex gap-3">
                  <Link to={`/products/${p.id}/edit`} className="text-blue-600 hover:underline">Edit</Link>
                  <Link to={`/products/${p.id}/stock`} className="text-green-600 hover:underline">Stock</Link>
                  <button
                    onClick={() => onDelete(p)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
