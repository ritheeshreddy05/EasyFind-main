import { useState, useEffect } from "react";
import axios from "axios";

function ManageItems() {
  const [items, setItems] = useState([]);
  const [searchCode, setSearchCode] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [view, setView] = useState("pending"); // Default view is "pending"
  const [expandedItem, setExpandedItem] = useState(null); // Track clicked item

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get("https://easyfind-main-demo.onrender.com/api/items/found");
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };
    fetchItems();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch("https://easyfind-main-demo.onrender.com/api/items/admin/updatestatus", { id, status: newStatus });
      setItems(items.map(item => (item._id === id ? { ...item, status: newStatus } : item)));
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const filteredItems = items.filter(item =>
    (searchCode ? item.code.includes(searchCode) : true) &&
    (searchCategory ? item.category.toLowerCase().includes(searchCategory.toLowerCase()) : true) &&
    (view === "pending" ? item.status === "pending" : item.status === "verified") // Show only pending or verified items
  );

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Manage Found Items</h3>

      {/* Navigation Buttons */}
      <div className="flex space-x-4 mb-4">
        <button 
          className={`px-4 py-2 rounded-md ${view === "pending" ? "bg-blue-500 text-white" : "bg-gray-300"}`} 
          onClick={() => setView("pending")}
        >
          Pending Items
        </button>
        <button 
          className={`px-4 py-2 rounded-md ${view === "verified" ? "bg-blue-500 text-white" : "bg-gray-300"}`} 
          onClick={() => setView("verified")}
        >
          Verified Items
        </button>
      </div>

      {/* Search Filters */}
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

      {/* Items List */}
      <ul>
        {filteredItems.map((item) => (
          <li 
            key={item._id} 
            className="p-4 border rounded-md flex flex-col space-y-2 cursor-pointer"
            onClick={() => setExpandedItem(expandedItem === item._id ? null : item._id)} // Toggle details
          >
            {/* Compact View */}
            <div>
              <p className="font-semibold">{item.itemName} (Code: {item.code})</p>
              <p className="text-sm">Category: {item.category}</p>
              <p className={`text-xs font-bold ${item.status === "pending" ? "text-yellow-500" : "text-blue-500"}`}>
                Status: {item.status}
              </p>
            </div>

            {/* Full Details (Only if clicked) */}
            {expandedItem === item._id && (
              <div className="bg-gray-100 p-3 rounded-md">
                <p>Description: {item.description}</p>
                <p>Location Found: {item.foundLocation}</p>
                <p>Reported Date: {item.reportedDate}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-2">
              {item.status === "pending" && (
                <button 
                  className="bg-blue-500 text-white px-3 py-1 rounded-md" 
                  onClick={(e) => { e.stopPropagation(); handleStatusChange(item._id, "verified"); }}
                >
                  Verify
                </button>
              )}
              {item.status === "verified" && (
                <button 
                  className="bg-gray-500 text-white px-3 py-1 rounded-md" 
                  onClick={(e) => { e.stopPropagation(); handleStatusChange(item._id, "pending"); }}
                >
                  Undo (Pending)
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
