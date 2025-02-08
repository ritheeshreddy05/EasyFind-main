
import React, { useState, useEffect, useCallback } from 'react';
import {fetchFoundItems} from '../services/api';

const SearchItem = () => {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('pending');
  const [activeCategory, setActiveCategory] = useState('All');


  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchFoundItems();
      setItems(response || []);
      setError('');
    } catch (error) {
      setError('Error fetching items. Please try again.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Handle Search Input
  const handleSearch = (e) => setSearchQuery(e.target.value.toLowerCase());

  // Badge Colors for Status
  const getStatusBadgeClass = (status) => {
    return {
      pending: 'bg-yellow-500',
      claimed: 'bg-blue-500',
      handovered: 'bg-green-500',
    }[status] || 'bg-gray-500';
  };

  // Filter Items
  const filteredItems = items.filter(item => {
    const matchesSearch = [item.title, item.description, item.foundLocation]
      .filter(Boolean) // Ensure no null/undefined values
      .some(text => text.toLowerCase().includes(searchQuery));

    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    
    return matchesSearch && matchesCategory && item.status === activeTab;
  });

  return (
    <div className="container mx-auto py-6 px-4">
      {error && <p className="text-red-600 text-center mb-3">{error}</p>}
      
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Search Lost Items</h2>
      </div>
      
        <div className="flex flex-col items-center">
            
      <input
        type="text"
        className="w-5/6 p-2 border rounded mb-3"
        placeholder="Search by title, description or location..."
        value={searchQuery}
        onChange={handleSearch}
      />

      <select
        className="w-5/6 p-2 border rounded mb-3"
        value={activeCategory}
        onChange={(e) => setActiveCategory(e.target.value)}
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


        </div>

      <div className="flex justify-center gap-4 mb-4">
        <button
          className={`p-4 pt-2 pb-2 rounded ${activeTab === 'pending' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending
        </button>
        <button
          className={`p-4 pt-2 pb-2 rounded ${activeTab === 'claimed' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
          onClick={() => setActiveTab('claimed')}
        >
          Claimed
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div>
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div key={item._id} className="border rounded p-3 mb-3">
                <h5 className="font-bold">{item.title}</h5>
                <p className="text-sm text-gray-600">{item.description}</p>
                <p className="text-sm text-gray-500">Found at: {item.foundLocation}</p>
                <span className={`px-2 py-1 text-white rounded ${getStatusBadgeClass(item.status)}`}>
                  {item.status}
                </span>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No items found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchItem;
