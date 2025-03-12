import { useState, useEffect } from "react";
import axios from "axios";
import ClaimedItemDetails from "./ClaimedItemDetails";

function GiveToStudent() {
  const [items, setItems] = useState([]);
  const [searchCode, setSearchCode] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [proofImage, setProofImage] = useState(null);
  const [proofImagePreview, setProofImagePreview] = useState(null);
  const [contact, setContact] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [name, setName] = useState("");
  const [handoverDate, setHandoverDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("verified");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [backendError, setBackendError] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/items/found");
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching items:", error);
        setBackendError("Failed to load items. Please try again later.");
      }
    };
    fetchItems();
  }, []);

  const validatePhoneNumber = (number) => /^\d{10}$/.test(number);
  const validateFile = (file) => file && file.size <= 5 * 1024 * 1024;

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!validateFile(file)) {
        setErrorMessage("File size too large (max 5MB)");
        return;
      }
      setProofImage(file);
      setProofImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmitProofs = async () => {
    setErrorMessage("");
    setBackendError("");

    if (!selectedItem || !proofImage || !contact || !rollNo || !name || !handoverDate) {
      setErrorMessage("Please fill all details and upload a proof image.");
      return;
    }

    if (!validatePhoneNumber(contact)) {
      setErrorMessage("Please enter a valid 10-digit phone number");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("image", proofImage);
    formData.append("contact", contact);
    formData.append("rollNo", rollNo);
    formData.append("name", name);
    formData.append("dateHandovered", new Date(handoverDate).toISOString());

    try {
      await axios.put(
        `http://localhost:5000/api/items/admin/${selectedItem._id}/handover`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setItems(items.map(item => 
        item._id === selectedItem._id ? { 
          ...item, 
          status: "claimed", 
          claimerDetails: { 
            contact, 
            rollNo, 
            name, 
            dateHandovered: new Date(handoverDate).toISOString() 
          } 
        } : item
      ));

      // Reset form
      setSelectedItem(null);
      setProofImage(null);
      setProofImagePreview(null);
      setContact("");
      setRollNo("");
      setName("");
      setHandoverDate("");
      setIsSuccess(true);
    } catch (error) {
      const errorMsg = error.response?.data?.message || "An unexpected error occurred";
      setBackendError(errorMsg);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setIsSuccess(false);
        setBackendError("");
      }, 5000);
    }
  };

  const toggleHandoverForm = (item) => {
    setSelectedItem(prev => prev?._id === item._id ? null : item);
    setErrorMessage("");
    setBackendError("");
    setName("");
    setRollNo("");
    setContact("");
    setHandoverDate("");
    setProofImage(null);
    setProofImagePreview(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const filteredItems = items
    .filter(item =>
      (searchCode ? item.code.includes(searchCode) : true) &&
      (searchCategory ? item.category.toLowerCase().includes(searchCategory.toLowerCase()) : true) &&
      item.status === filterStatus
    )
    .sort((a, b) => new Date(b.reportedDate) - new Date(a.reportedDate));

  const LoadingSpinner = () => (
    <span className="flex items-center justify-center">
      <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      Processing...
    </span>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Give To Student</h1>

      {/* Status Messages */}
      {isSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md mb-4">
          ✅ Handover successful!
        </div>
      )}
      {errorMessage && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-md mb-4">
          ⚠️ {errorMessage}
        </div>
      )}
      {backendError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4">
          ❌ Error: {backendError}
        </div>
      )}

      {/* Controls Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-wrap gap-4 mb-4">
          <input
            type="text"
            placeholder="Search by Item Code"
            className="border px-3 py-2 rounded-md flex-1 min-w-[200px]"
            onChange={(e) => setSearchCode(e.target.value)}
          />
          <input
            type="text"
            placeholder="Search by Category"
            className="border px-3 py-2 rounded-md flex-1 min-w-[200px]"
            onChange={(e) => setSearchCategory(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {["verified", "claimed"].map((status) => (
            <button
              key={status}
              className={`px-4 py-2 rounded-md capitalize ${
                filterStatus === status
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
              onClick={() => setFilterStatus(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Items List */}
      <ul className="space-y-4">
        {filteredItems.map(item => (
          <li key={item._id} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`inline-block w-3 h-3 rounded-full ${
                    item.status === 'verified' ? 'bg-blue-500' : 'bg-green-500'
                  }`}></span>
                  <h3 className="text-lg font-semibold">{item.itemName}</h3>
                  <span className="text-sm text-gray-500">(Code: {item.code})</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <label className="text-gray-500">Category:</label>
                    <p className="font-medium">{item.category}</p>
                  </div>
                  <div>
                    <label className="text-gray-500">Status:</label>
                    <p className="capitalize font-medium">{item.status}</p>
                  </div>
                  <div>
                    <label className="text-gray-500">Reported Date:</label>
                    <p className="font-medium">{formatDate(item.reportedDate)}</p>
                  </div>
                  <div>
                    <label className="text-gray-500">foundLocation:</label>
                    <p className="capitalize font-medium">{item.foundLocation}</p>
                  </div>
                  {item.status === "claimed" && (
                    <div>
                      <label className="text-gray-500">Handover Date:</label>
                      <p className="font-medium">{formatDate(item.claimerDetails?.dateHandovered)}</p>
                    </div>
                  )}
                </div>
                {item.status === "claimed" && <ClaimedItemDetails item={item} />}
              </div>

              <div className="flex flex-col gap-2 ml-4">
                {item.status === "verified" && (
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm"
                    onClick={() => toggleHandoverForm(item)}
                  >
                    {selectedItem?._id === item._id ? "Close" : "Handover"}
                  </button>
                )}
              </div>
            </div>

            {/* Handover Form */}
            {selectedItem?._id === item._id && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="text-lg font-semibold mb-4">Handover Details</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Student Name</label>
                    <input
                      type="text"
                      className="border px-3 py-2 rounded-md w-full"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Roll Number</label>
                    <input
                      type="text"
                      className="border px-3 py-2 rounded-md w-full"
                      value={rollNo}
                      onChange={(e) => setRollNo(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Contact Number</label>
                    <input
                      type="tel"
                      className="border px-3 py-2 rounded-md w-full"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Handover Date</label>
                    <input
                      type="date"
                      className="border px-3 py-2 rounded-md w-full"
                      value={handoverDate}
                      onChange={(e) => setHandoverDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Handover Proof</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                  />
                  {proofImagePreview && (
                    <div className="mt-2">
                      <img
                        src={proofImagePreview}
                        alt="Proof preview"
                        className="w-32 h-32 object-contain rounded-md border"
                      />
                      <p className="text-sm text-gray-500 mt-1">Preview</p>
                    </div>
                  )}
                </div>

                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50"
                  onClick={handleSubmitProofs}
                  disabled={isLoading}
                >
                  {isLoading ? <LoadingSpinner /> : "Confirm Handover"}
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GiveToStudent;