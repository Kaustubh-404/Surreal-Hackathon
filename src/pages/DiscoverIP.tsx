
import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import { useStory } from '../hooks/useStory';
import { Link } from 'react-router-dom';

const DiscoverIP: React.FC = () => {
  const { ipAssets, setError } = useAppStore();
  const { isConnected, isInitialized, isLoading } = useStory();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [filteredAssets, setFilteredAssets] = useState(ipAssets);

  useEffect(() => {
    if (!isConnected) {
      setError('Please connect your wallet to discover IP assets.');
    } else {
      setError(null);
    }

    const filtered = ipAssets.filter((asset) => {
      const matchesSearch = asset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = categoryFilter ? asset.category === categoryFilter : true;
      return matchesSearch && matchesCategory;
    });
    setFilteredAssets(filtered);
  }, [isConnected, searchTerm, categoryFilter, ipAssets, setError]);

  if (isLoading || !isInitialized) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Discover IP Assets</h1>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by title, description, or tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow border border-gray-300 rounded-md p-2"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border border-gray-300 rounded-md p-2"
        >
          <option value="">All Categories</option>
          <option value="art">Art</option>
          <option value="music">Music</option>
          <option value="photo">Photo</option>
          <option value="video">Video</option>
          <option value="document">Document</option>
          <option value="code">Code</option>
          <option value="other">Other</option>
        </select>
      </div>

      {filteredAssets.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500">No IP assets found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssets.map((asset) => (
            <div key={asset.id} className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-2">{asset.title}</h2>
              <p className="text-gray-600 mb-2">{asset.description}</p>
              <p className="text-sm">Category: {asset.category}</p>
              <p className="text-sm">Owner: {asset.owner.slice(0, 6)}...{asset.owner.slice(-4)}</p>
              <p className="text-sm">Status: {asset.status}</p>
              <div className="mt-4">
                <Link to={`/ip/${asset.id}`} className="text-blue-500 hover:underline">View Details</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DiscoverIP;


