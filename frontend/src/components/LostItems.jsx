import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

function LostItems() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    const getItems = async () => {
      if (!user?.email) return;

      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/items/lost-items/${user.email}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setItems(response.data);
      } catch (err) {
        setError("Failed to fetch lost items.");
      } finally {
        setLoading(false);
      }
    };

    getItems();
  }, [user.email]);

  const handleDelete = async (itemId) => {
    try {
      await axios.delete(`http://localhost:5000/api/items/lost/${itemId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setItems(items.filter((item) => item._id !== itemId));
      setConfirmDelete(null);
    } catch (err) {
      setError("Failed to delete item.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gradient-to-br from-white to-gray-100 shadow-lg rounded-2xl">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Lost Items</h2>
  
      {loading && <p className="text-gray-500 text-center animate-pulse">Loading...</p>}
      {error && <p className="text-red-500 text-center font-semibold">{error}</p>}
      {!loading && !error && items.length === 0 && (
        <p className="text-gray-500 text-center">No lost items reported yet.</p>
      )}
  
      <ul className="space-y-6">
        {items.map((item) => (
          <li key={item._id} className="border border-gray-300 bg-white p-5 rounded-lg shadow-md transition-transform transform hover:scale-105">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold text-gray-900">{item.itemName}</p>
                <p className="text-sm text-gray-600">Category: <span className="font-medium">{item.category}</span></p>
                <p className="text-sm text-gray-600">Location: <span className="font-medium">{item.location}</span></p>
              </div>
              <button
                onClick={() => setConfirmDelete(item._id)}
                className="bg-red-500 text-white px-4 py-2 text-xs font-semibold rounded-lg shadow-md hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
  
            {confirmDelete === item._id && (
              <div className="mt-4 flex flex-col space-y-3 bg-gray-100 p-4 rounded-lg shadow-inner">
                <p className="text-gray-700 text-sm">Are you sure you want to delete this item?</p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="bg-red-600 text-white px-4 py-2 text-xs font-semibold rounded-lg shadow-md hover:bg-red-800 transition"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setConfirmDelete(null)}
                    className="bg-gray-400 text-white px-4 py-2 text-xs font-semibold rounded-lg shadow-md hover:bg-gray-500 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
  
}

export default LostItems;