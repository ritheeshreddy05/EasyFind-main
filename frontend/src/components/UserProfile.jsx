import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ReportedItems from './ReportedItems'; // Import the component

const StudentProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showReported, setShowReported] = useState(false); // State to toggle the component

  if (!user) {
    return <div className="text-center text-red-500">Please log in to view your profile</div>;
  }

  const extractRollNumber = (email) => {
    const atIndex = email?.indexOf('@');
    if (atIndex === -1) return 'Invalid email';
    return email?.substring(0, atIndex)?.toUpperCase();
  };

  const rollNumber = extractRollNumber(user?.email);

  return (
    <div className="max-w-md mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Student Profile</h2>
      <div className="space-y-4">
        <div className="flex items-center">
          <label className="w-32 font-medium text-gray-700">Name:</label>
          <span className="text-gray-600">{user?.name || 'N/A'}</span>
        </div>
        <div className="flex items-center">
          <label className="w-32 font-medium text-gray-700">Roll Number:</label>
          <span className="text-gray-600">{rollNumber}</span>
        </div>
        <div className="flex items-center">
          <label className="w-64 font-medium text-gray-700">Need to check Reported Items? Click here:</label>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            onClick={() => setShowReported(true)}
          >
            Show Reported Items
          </button>
        </div>
      </div>

      {/* Conditionally render ReportedItems component */}
      {showReported && <ReportedItems userEmail={user?.email} />}
    </div>
  );
};

export default StudentProfile;
