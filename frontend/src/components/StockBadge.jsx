const STATUS_STYLES = {
  IN_STOCK: "bg-green-100 text-green-700",
  LOW_STOCK: "bg-yellow-100 text-yellow-700",
  OUT_OF_STOCK: "bg-red-100 text-red-700",
};

const STATUS_LABELS = {
  IN_STOCK: "In Stock",
  LOW_STOCK: "Low Stock",
  OUT_OF_STOCK: "Out of Stock",
};

export default function StockBadge({ status }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[status] || "bg-gray-100 text-gray-600"}`}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}
