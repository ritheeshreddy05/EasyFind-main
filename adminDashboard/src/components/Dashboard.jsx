import { useNavigate, useLocation } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const getButtonClass = (path) =>
    `px-4 py-2 rounded-md ${location.pathname === path ? "bg-blue-600 text-white" : "bg-gray-300"}`;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Admin Dashboard</h2>
      
      {/* Navigation Buttons */}
      <div className="flex space-x-4 mb-4">
        <button className={getButtonClass("/admin/approve")} onClick={() => navigate("/admin/approve")}>
          Approve Found Items
        </button>
        <button className={getButtonClass("/admin/give")} onClick={() => navigate("/admin/give")}>
          Give to Student
        </button>
        <button className={getButtonClass("/admin/upload")} onClick={() => navigate("/admin/upload")}>
          Upload Item
        </button>
        <button className={getButtonClass("/admin/edit")} onClick={() => navigate("/admin/edit")}>
          Edit Documents
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
