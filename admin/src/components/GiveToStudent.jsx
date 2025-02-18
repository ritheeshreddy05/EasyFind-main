import { useState, useEffect } from "react";
import axios from "axios";
import ClaimedItemDetails from "./ClaimedItemDetails";

function GiveToStudent() {
  const [items, setItems] = useState([]);
  const [searchCode, setSearchCode] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [proofImage, setProofImage] = useState(null);
  const [contact, setContact] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [name, setName] = useState("");
  const [handoverDate, setHandoverDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("verified");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/items/found");
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };
    fetchItems();
  }, []);

  const handleFileChange = (event) => {
    setProofImage(event.target.files[0]);
  };

  const handleSubmitProofs = async () => {
    if (!selectedItem || !proofImage || !contact || !rollNo || !name || !handoverDate) {
      alert("Please fill all details and upload a proof image.");
      return;
    }

    const formData = new FormData();
    formData.append("image", proofImage);
    formData.append("contact", contact);
    formData.append("rollNo", rollNo);
    formData.append("name", name);
    formData.append("dateHandovered", new Date(handoverDate).toISOString()); // Store manual date

    try {
      const response = await axios.put(
        `https://easyfind-main-demo.onrender.com/api/items/admin/${selectedItem._id}/handover`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setItems(items.map(item => 
        item._id === selectedItem._id 
          ? { ...item, status: "claimed", claimerDetails: { contact, rollNo, name, dateHandovered: new Date(handoverDate).toISOString() } }
          : item
      ));

      setSelectedItem(null);
      setProofImage(null);
      setContact("");
      setRollNo("");
      setName("");
      setHandoverDate("");
      alert(response.data.message || "Handover successful!");
    } catch (error) {
      console.error("Error submitting proofs:", error);
      alert(error.response?.data?.message || "Failed to submit proof.");
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const filteredItems = items
  .filter(item =>
    (searchCode ? item.code.includes(searchCode) : true) &&
    (searchCategory ? item.category.toLowerCase().includes(searchCategory.toLowerCase()) : true) &&
    item.status === filterStatus
  )
  .sort((a, b) => {
    if (a.status === "claimed" && b.status === "claimed") {
      return new Date(b.DateHandovered) - new Date(a.DateHandovered);
    }
    return 0;
  });
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

      <div className="flex space-x-4 mb-4">
        <button
          className={`px-4 py-2 rounded-md ${filterStatus === "verified" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setFilterStatus("verified")}
        >
          Show Verified
        </button>
        <button
          className={`px-4 py-2 rounded-md ${filterStatus === "pending" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setFilterStatus("pending")}
        >
          Show Pending
        </button>
        <button
          className={`px-4 py-2 rounded-md ${filterStatus === "claimed" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setFilterStatus("claimed")}
        >
          Show Claimed
        </button>
      </div>

      <ul>
        {filteredItems.map(item => (
          <li key={item._id} className="p-4 border rounded-md flex justify-between items-center">
            <div>
              <p className="font-semibold">{item.itemName} (Code: {item.code})</p>
              <p className="text-sm">Category: {item.category}</p>
              <p className={`text-xs font-bold ${item.status === "verified" ? "text-blue-500" : item.status === "claimed" ? "text-green-500" : "text-yellow-500"}`}>
                Status: {item.status}
              </p>
              {item.status === "claimed" && (
                <p className="text-sm text-gray-500">Handover Date: {formatDate(item.claimerDetails.dateHandovered)}</p>
              )}
              {item.status === "claimed" && <ClaimedItemDetails item={item} />}
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

      {selectedItem && selectedItem.status === "verified" && (
        <div className="mt-6 p-4 border rounded-md bg-gray-100">
          <h4 className="font-semibold mb-2">Upload Proof & Details for: {selectedItem.itemName}</h4>
          <input 
            type="text" 
            placeholder="Student Name" 
            className="border px-3 py-2 w-full mb-2 rounded-md" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
          />
          <input 
            type="text" 
            placeholder="Roll Number" 
            className="border px-3 py-2 w-full mb-2 rounded-md" 
            value={rollNo} 
            onChange={(e) => setRollNo(e.target.value)} 
          />
          <input 
            type="text" 
            placeholder="Contact Number" 
            className="border px-3 py-2 w-full mb-2 rounded-md" 
            value={contact} 
            onChange={(e) => setContact(e.target.value)} 
          />
          <input 
            type="date" 
            className="border px-3 py-2 w-full mb-2 rounded-md" 
            value={handoverDate} 
            onChange={(e) => setHandoverDate(e.target.value)} 
          />
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange} 
          />
          <button className="bg-blue-500 text-white px-3 py-1 mt-2 rounded-md" onClick={handleSubmitProofs}>
            Submit Proof & Confirm Handover
          </button>
        </div>
      )}
    </div>
  );
}

export default GiveToStudent;
