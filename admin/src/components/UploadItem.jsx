import { useState } from "react";
import axios from "axios";

function UploadItem() {
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("All");
  const [foundLocation, setFoundLocation] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => setImage(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!itemName || !category || !foundLocation || !description || !image) {
      alert("All fields are required!");
      return;
    }

    const formData = new FormData();
    formData.append("itemName", itemName);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("foundLocation", foundLocation);
    formData.append("image", image);

    setIsLoading(true);

    try {
      await axios.post("https://easyfind-main-demo.onrender.com/api/items/admin/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Item uploaded successfully!");
      setItemName("");
      setCategory("All");
      setFoundLocation("");
      setDescription("");
      setImage(null);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload item.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-2xl font-semibold text-gray-700 mb-4 text-center">Upload Found Item</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Item Name"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />
        <textarea
          placeholder="Description"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          rows="3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <select
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          <option value="Stationery">Stationery</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Personal belongings">Personal belongings</option>
          <option value="Academic materials">Academic materials</option>
          <option value="Accessories">Accessories</option>
          <option value="Sports equipment">Sports equipment</option>
          <option value="Food containers/Water bottles">Food containers/Water bottles</option>
          <option value="Other">Other</option>
        </select>
        <input
          type="text"
          placeholder="Found Location"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          value={foundLocation}
          onChange={(e) => setFoundLocation(e.target.value)}
        />
        <input type="file" accept="image/*" onChange={handleFileChange} className="w-full px-4 py-2 border rounded-lg" />
        <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition" disabled={isLoading}>
          {isLoading ? "Uploading..." : "Upload Item"}
        </button>
      </form>
      {isLoading && <div className="text-center mt-4">Loading...</div>}
    </div>
  );
}

export default UploadItem;
