import React, { useState } from 'react';
import { submitFoundItem } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const ReportItem = ({ onItemReported }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    foundLocation: '',
    category: '',
    handoverLocation: ''
  });
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const resetForm = () => {
    setFormData({ itemName: '', description: '', foundLocation: '', category: '' });
    setImage(null);
    setStatus('');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setImage(file);
      setStatus('');
    } else {
      setStatus('Image must be less than 5MB');
      e.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      setStatus('Please upload an image.');
      return;
    }
    setLoading(true);
    try {
      const index = user.email?.indexOf('@');
      const rollNo = user.email.substring(0, index);
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      data.append('reporterRollNo', rollNo);
      if (image) data.append('image', image);
      else console.log("there is no image")

      const response = await submitFoundItem(data);
      if (response.success) {
        resetForm();
        setSuccessMessage('Item successfully reported!');
        setTimeout(() => {
          setSuccessMessage('');
          onItemReported?.(response.item);
          navigate('/');
        }, 2000); // Wait 2 seconds before navigating
      } else {
        throw new Error(response.message || 'Failed to report item');
      }
    } catch (error) {
      setStatus(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      {status && <p className="text-red-600 mb-3">{status}</p>}
      {successMessage && <p className="text-green-600 mb-3">{successMessage}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="itemName"
          value={formData.itemName}
          onChange={handleChange}
          placeholder="Item title"
          className="w-full p-2 border rounded mb-3"
          required
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full p-2 border rounded mb-3"
          required
        />
        <input
          type="text"
          name="foundLocation"
          value={formData.foundLocation}
          onChange={handleChange}
          placeholder="Found location"
          className="w-full p-2 border rounded mb-3"
          required
        />
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-3"
          required
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

        <input
          type="file"
          onChange={handleImageChange}
          className="w-full p-2 border rounded mb-3"
          accept="image/jpeg,image/jpg,image/png"
          required
        />
        <button
          type="submit"
          className={`w-full p-2 bg-blue-500 text-white rounded ${loading ? 'opacity-50' : ''}`}
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default ReportItem;