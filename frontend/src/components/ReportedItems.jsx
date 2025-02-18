import { useState, useEffect } from "react";
import axios from "axios";
import { fetchReportedItems } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

function ReportedItems() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    const getItems = async () => {
      try {
        const response = await fetchReportedItems(user);
        setItems(response);
      } catch (err) {
        setError("Failed to fetch reported items.");
      } finally {
        setLoading(false);
      }
    };
    getItems();
  }, [user.email]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/items/reported/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setItems(items.filter((item) => item._id !== id));
      setConfirmDelete(null);
    } catch (err) {
      setError("Failed to delete the item.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gradient-to-br from-white to-gray-100 shadow-lg rounded-2xl">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Reported Items</h2>
  
      {loading && <p className="text-gray-500 text-center animate-pulse">Loading...</p>}
      {error && <p className="text-red-500 text-center font-semibold">{error}</p>}
      {!loading && !error && items.length === 0 && (
        <p className="text-gray-500 text-center">No items reported yet.</p>
      )}
  
      <ul className="space-y-6">
        {items.map((item) => (
          <li key={item._id} className="border border-gray-300 bg-white p-5 rounded-lg shadow-md flex items-center space-x-6 transition-transform transform hover:scale-105">
            {item.image?.url && (
              <img src={item.image.url} alt={item.title} className="w-20 h-20 object-cover rounded-lg shadow-md" />
            )}
            <div className="flex-1">
              <p className="text-lg font-semibold text-gray-900">{item.itemName}</p>
              <p className="text-lg font-semibold text-gray-900">Code: {item.code}</p>
              <p className="text-sm text-gray-600">Category: <span className="font-medium">{item.category}</span></p>
              <p className="text-sm text-gray-600">Location: <span className="font-medium">{item.foundLocation}</span></p>
              <p className={`text-sm font-bold ${item.status === "verified" ? "text-green-600" : "text-yellow-600"}`}>
                Status: {item.status}
              </p>
            </div>
            {confirmDelete === item._id ? (
              <div className="flex flex-col items-end space-y-2">
                <p className="text-xs text-gray-700">Are you sure?</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="bg-red-500 text-white px-4 py-2 text-xs rounded-lg shadow-md hover:bg-red-700 transition"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setConfirmDelete(null)}
                    className="bg-gray-400 text-white px-4 py-2 text-xs rounded-lg shadow-md hover:bg-gray-500 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(item._id)}
                disabled={item.status === "verified"}
                className={`px-4 py-2 text-xs font-semibold rounded-lg shadow-md transition ${
                  item.status === "verified"
                    ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                    : "bg-red-500 text-white hover:bg-red-700"
                }`}
              >
                {item.status === "verified" ? "Cannot Delete" : "Delete"}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ReportedItems;