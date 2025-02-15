import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";

function GiveToStudent() {
  const [items, setItems] = useState([]);
  const [searchCode, setSearchCode] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [proofImages, setProofImages] = useState([]);

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

  const handleFileChange = (event) => {
    setProofImages(event.target.files);
  };

  const handleSubmitProofs = async () => {
    if (!selectedItem || proofImages.length === 0) {
      alert("Please select an item and upload proofs.");
      return;
    }

    const formData = new FormData();
    for (let file of proofImages) {
      formData.append("proofs", file);
    }

    try {
      await axios.post(`http://localhost:5000/api/items/${selectedItem._id}/handover`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setItems(items.map(item => (item._id === selectedItem._id ? { ...item, status: "claimed" } : item)));
      setSelectedItem(null);
      setProofImages([]);
    } catch (error) {
      console.error("Error submitting proofs:", error);
    }
  };

  const filteredItems = items.filter(item =>
    (searchCode ? item.code.includes(searchCode) : true) &&
    (searchCategory ? item.category.toLowerCase().includes(searchCategory.toLowerCase()) : true)
  );

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Give Item to Student</h3>
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
            {item.status === "verified" && (
              <button
                className="bg-green-500 text-white px-3 py-1 rounded-md"
                onClick={() => setSelectedItem(item)}
              >
                Hand Over
              </button>
            )}
          </li>
        ))}
      </ul>

      {selectedItem && (
        <div className="mt-6 p-4 border rounded-md bg-gray-100">
          <h4 className="font-semibold mb-2">Upload Proofs for: {selectedItem.itemName}</h4>
          <input type="file" multiple accept="image/*" onChange={handleFileChange} />
          <button
            className="bg-blue-500 text-white px-3 py-1 mt-2 rounded-md"
            onClick={handleSubmitProofs}
          >
            Submit Proofs & Confirm Handover
          </button>
        </div>
      )}
    </div>
  );
}

export default GiveToStudent;
