import { useState, useEffect } from "react";
import axios from "axios";

function ManageItems() {
  const [items, setItems] = useState([]);
  const [searchCode, setSearchCode] = useState("");
  const [searchCategory, setSearchCategory] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/items");
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };
    fetchItems();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/items/${id}`, { status: newStatus });
      setItems(items.map(item => (item._id === id ? { ...item, status: newStatus } : item)));
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const filteredItems = items.filter(item =>
    (searchCode ? item.code.includes(searchCode) : true) &&
    (searchCategory ? item.category.toLowerCase().includes(searchCategory.toLowerCase()) : true)
  );

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Manage Found Items</h3>
      <div className="flex space-x-4 mb-4">
        <input
          type="text"
          placeholder="Search by Code"
          className="border px-3 py-2 rounded-md"
          onChange={(e) => setSearchCode(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by Category"
          className="border px-3 py-2 rounded-md"
          onChange={(e) => setSearchCategory(e.target.value)}
        />
      </div>
      <ul>
        {filteredItems.map((item) => (
          <li key={item._id} className="p-4 border rounded-md flex justify-between items-center">
            <div>
              <p className="font-semibold">{item.itemName} (Code: {item.code})</p>
              <p className="text-sm">Category: {item.category}</p>
              <p className={`text-xs font-bold ${item.status === "pending" ? "text-yellow-500" : item.status === "verified" ? "text-blue-500" : "text-green-500"}`}>
                Status: {item.status}
              </p>
            </div>
            <div className="flex space-x-2">
              {item.status !== "verified" && (
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded-md"
                  onClick={() => handleStatusChange(item._id, "verified")}
                >
                  Verify
                </button>
              )}
              {item.status !== "claimed" && (
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded-md"
                  onClick={() => handleStatusChange(item._id, "claimed")}
                >
                  Mark as Claimed
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManageItems;
