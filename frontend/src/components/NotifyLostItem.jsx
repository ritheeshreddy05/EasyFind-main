import { useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import LostItems from "./LostItems"; // Import LostItems component

function NotifyLostItems() {
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [itemName, setItemName] = useState("");
  const [message, setMessage] = useState("");
  const { user } = useAuth();
  const email = user?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!category || !location || !itemName) {
      setMessage("Please fill in all the fields.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/items/lost",
        { category, location, email, itemName },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      setMessage("Item reported successfully! You will be notified via email if a matching item is found.");
      setTimeout(() => setMessage(""), 4000);
    } catch (error) {
      setMessage("Failed to report the item.");
      setTimeout(() => setMessage(""), 4000);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 p-6 max-w-lg mx-auto bg-white shadow-md rounded-xl"
      >
        <label htmlFor="category" className="text-lg font-semibold text-gray-700">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
        >
          <option value="">Select category</option>
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

        <label htmlFor="location" className="text-lg font-semibold text-gray-700">
          Location
        </label>
        <input
          type="text"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter the location where you lost the item"
          className="border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />

        <label htmlFor="itemName" className="text-lg font-semibold text-gray-700">
          Item Name
        </label>
        <input
          type="text"
          id="itemName"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          placeholder="Enter the item name"
          className="border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
        >
          Submit
        </button>
      </form>

      {message && (
        <div className="mt-4 p-3 text-center bg-gray-100 text-gray-700 rounded-md">
          {message}
        </div>
      )}

      {/* Notification message for users */}
      <div className="mt-6 p-4 bg-blue-100 text-blue-800 rounded-md text-center max-w-lg">
        <p>
          You will receive an email notification when a matching item is found.
        </p>
      </div>

      {/* Display lost items below */}
      <div className="mt-8 w-full">
        <LostItems />
      </div>
    </div>
  );
}

export default NotifyLostItems;
