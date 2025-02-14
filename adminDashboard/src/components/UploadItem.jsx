import { useState } from "react";
import axios from "axios";

function UploadItem() {
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [foundLocation, setFoundLocation] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

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

    try {
      await axios.post("http://localhost:5000/api/items/admin/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Item uploaded successfully!");
      setItemName("");
      setCategory("");
      setFoundLocation("");
      setDescription("");
      setImage(null);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload item.");
    }
  };

  return (
    <div className="p-6 border rounded-md bg-white shadow-md">
      <h3 className="text-lg font-semibold mb-4">Upload Found Item</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Item Name"
          className="border px-3 py-2 rounded-md w-full"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          className="border px-3 py-2 rounded-md w-full"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="text"
          placeholder="Category"
          className="border px-3 py-2 rounded-md w-full"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          type="text"
          placeholder="Found Location"
          className="border px-3 py-2 rounded-md w-full"
          value={foundLocation}
          onChange={(e) => setFoundLocation(e.target.value)}
        />
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md w-full">
          Upload Item
        </button>
      </form>
    </div>
  );
}

export default UploadItem;
