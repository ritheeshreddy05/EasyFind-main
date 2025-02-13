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
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setItems(items.filter((item) => item._id !== id));
      setConfirmDelete(null);
    } catch (err) {
      setError("Failed to delete the item.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Reported Items</h2>
      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && items.length === 0 && (
        <p className="text-gray-500">No items reported yet.</p>
      )}
      <ul className="space-y-4">
        {items.map((item) => (
          <li
            key={item._id}
            className="border p-4 rounded-md shadow-sm flex justify-between items-center"
          >
            <div>
              <p className="text-lg font-semibold">{item.category}</p>
              <p className="text-gray-700">Location: {item.location}</p>
              <p className="text-gray-500 text-sm">
                Reported on: {new Date(item.date).toLocaleDateString()}
              </p>
              <p
                className={`text-sm ${
                  item.status === "approved"
                    ? "text-green-600"
                    : "text-yellow-600"
                }`}
              >
                Status: {item.status}
              </p>
            </div>
            {confirmDelete === item._id ? (
              <div className="flex flex-col items-end">
                <p className="text-sm text-gray-700 mb-2">
                  Are you sure you want to delete?
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setConfirmDelete(null)}
                    className="bg-gray-400 text-white px-3 py-1 rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(item._id)}
                disabled={item.status === "approved"}
                className={`px-3 py-1 rounded-md ${
                  item.status === "approved"
                    ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                    : "bg-red-500 text-white hover:bg-red-600"
                }`}
              >
                {item.status === "approved" ? "Cannot Delete" : "Delete"}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ReportedItems;
