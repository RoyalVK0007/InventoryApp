import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <h1 className="text-lg font-semibold text-gray-700">Inventory Management</h1>
      <div className="flex items-center gap-4">
        {user?.pictureUrl && (
          <img
            src={user.pictureUrl}
            alt={user.name}
            className="w-8 h-8 rounded-full"
          />
        )}
        <div className="text-sm">
          <p className="font-medium text-gray-800">{user?.name}</p>
          <p className="text-gray-500 text-xs">{user?.email}</p>
        </div>
        <button
          onClick={logout}
          className="text-sm text-red-500 hover:text-red-700 font-medium"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
