import React, { useState, useEffect, useCallback } from 'react';
import { fetchFoundItems } from '../services/api';

const SearchItem = () => {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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

  const handleSearch = (e) => setSearchQuery(e.target.value.toLowerCase());

  const getStatusBadgeClass = (status) => {
    return {
      verified: 'bg-green-500',
    }[status] || 'bg-gray-500';
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = [item.title, item.description, item.foundLocation]
      .filter(Boolean)
      .some(text => text.toLowerCase().includes(searchQuery));

    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;

    return matchesSearch && matchesCategory && item.status === 'verified';
  });

  return (
    <div className="container mx-auto py-6 px-4">
      {error && <p className="text-red-600 text-center mb-3">{error}</p>}

      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Search Verified Items</h2>
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

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div key={item._id} className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                <img src={item.image.url} alt={item.title} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h5 className="text-lg font-bold text-gray-900">{item.title}</h5>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <p className="text-sm text-gray-500">Found at: {item.foundLocation}</p>
                  <p className="text-sm font-semibold text-blue-700">Code: {item.code}</p>
                  <span className={`px-3 py-1 text-white rounded text-xs mt-2 inline-block ${getStatusBadgeClass(item.status)}`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">No verified items found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchItem;
