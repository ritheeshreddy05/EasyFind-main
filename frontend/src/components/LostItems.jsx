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
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Lost Items</h2>
      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && items.length === 0 && (
        <p className="text-gray-500">No lost items reported yet.</p>
      )}
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item._id} className="border p-4 rounded-md shadow-sm flex flex-col">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold">{item.itemName}</p>
                <p className="text-lg font-semibold">{item.category}</p>
                <p className="text-gray-700">Location: {item.location}</p>
              </div>
              <button
                onClick={() => setConfirmDelete(item._id)}
                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
            {confirmDelete === item._id && (
              <div className="mt-2 flex justify-between items-center bg-gray-100 p-3 rounded-md">
                <p className="text-gray-700">Are you sure you want to delete this item?</p>
                <div className="space-x-2">
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setConfirmDelete(null)}
                    className="bg-gray-400 text-white px-3 py-1 rounded-md hover:bg-gray-500"
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