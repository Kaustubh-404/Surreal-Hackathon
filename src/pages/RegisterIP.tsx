
import React, { useState, useCallback } from 'react';
import { useStory } from '../hooks/useStory';
import { useAppStore } from '../store/appStore';
import { uploadImageToIPFS, createIPMetadata } from '../utils/uploadToIpfs';
import toast from 'react-hot-toast';

const RegisterIP: React.FC = () => {
  const { registerIP, isConnected, isInitialized, isLoading } = useStory();
  const { setLoading, setError } = useAppStore();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'art',
    tags: '',
    imageFile: null as File | null,
    commercialUse: false,
    commercialRevShare: 0,
    derivativesAllowed: false,
    transferable: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, imageFile: e.target.files![0] }));
    }
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !isInitialized) {
      setError('Please connect your wallet and initialize the Story client.');
      return;
    }

    try {
      setLoading(true);
      let imageUrl = '';
      if (formData.imageFile) {
        const imageHash = await uploadImageToIPFS(formData.imageFile);
        imageUrl = `https://gateway.pinata.cloud/ipfs/${imageHash}`;
      }

      const tags = formData.tags.split(',').map((tag) => tag.trim()).filter((tag) => tag.length > 0);

      const metadata = createIPMetadata({
        name: formData.title,
        description: formData.description,
        imageHash: imageUrl ? imageUrl.split('/ipfs/')[1] : undefined,
        attributes: [
          { trait_type: 'Category', value: formData.category },
          { trait_type: 'Tags', value: tags.join(', ') },
        ],
      });

      await registerIP({
        title: formData.title,
        description: formData.description,
        imageUrl,
        category: formData.category,
        tags,
        commercialUse: formData.commercialUse,
        commercialRevShare: formData.commercialRevShare,
        derivativesAllowed: formData.derivativesAllowed,
        transferable: formData.transferable,
      });

      setFormData({
        title: '',
        description: '',
        category: 'art',
        tags: '',
        imageFile: null,
        commercialUse: false,
        commercialRevShare: 0,
        derivativesAllowed: false,
        transferable: true,
      });
      toast.success('IP Asset registered successfully!');
    } catch (error) {
      console.error('Error registering IP:', error);
      setError('Failed to register IP asset.');
      toast.error('Failed to register IP asset.');
    } finally {
      setLoading(false);
    }
  }, [formData, isConnected, isInitialized, registerIP, setLoading, setError]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Register New IP Asset</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow max-w-2xl">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            rows={4}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          >
            <option value="art">Art</option>
            <option value="music">Music</option>
            <option value="photo">Photo</option>
            <option value="video">Video</option>
            <option value="document">Document</option>
            <option value="code">Code</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            placeholder="e.g., digital, abstract, modern"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="commercialUse"
              checked={formData.commercialUse}
              onChange={handleInputChange}
              className="mr-2"
            />
            Allow Commercial Use
          </label>
        </div>
        {formData.commercialUse && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Commercial Revenue Share (%)</label>
            <input
              type="number"
              name="commercialRevShare"
              value={formData.commercialRevShare}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              min="0"
              max="100"
            />
          </div>
        )}
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="derivativesAllowed"
              checked={formData.derivativesAllowed}
              onChange={handleInputChange}
              className="mr-2"
            />
            Allow Derivatives
          </label>
        </div>
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="transferable"
              checked={formData.transferable}
              onChange={handleInputChange}
              className="mr-2"
            />
            License Transferable
          </label>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          disabled={!isConnected || !isInitialized}
        >
          Register IP
        </button>
      </form>
    </div>
  );
};

export default RegisterIP;

