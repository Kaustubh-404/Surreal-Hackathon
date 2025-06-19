import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Shield, Upload, X, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { useStory } from '../hooks/useStory';
import { useAppStore } from '../store/appStore';
import { uploadImageToIPFS, createIPMetadata } from '../utils/uploadToIpfs';
import toast from 'react-hot-toast';

const RegisterIP: React.FC = () => {
  const { registerIP, isConnected, isInitialized, isLoading: storyLoading, initError } = useStory();
  const { setLoading, setError } = useAppStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'art',
    tags: '',
    imageFile: null as File | null,
    imageUrl: '',
    commercialUse: false,
    commercialRevShare: 0,
    derivativesAllowed: false,
    transferable: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.imageFile && !formData.imageUrl) {
      newErrors.image = 'Either upload an image or provide an image URL';
    }
    if (formData.commercialRevShare < 0 || formData.commercialRevShare > 100) {
      newErrors.commercialRevShare = 'Revenue share must be between 0 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({ 
        ...prev, 
        [name]: (e.target as HTMLInputElement).checked 
      }));
    } else if (type === 'number') {
      setFormData((prev) => ({ 
        ...prev, 
        [name]: parseFloat(value) || 0 
      }));
    } else {
      setFormData((prev) => ({ 
        ...prev, 
        [name]: value 
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image file must be less than 10MB');
      return;
    }

    setFormData(prev => ({ ...prev, imageFile: file }));
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Clear image URL if file is selected
    if (formData.imageUrl) {
      setFormData(prev => ({ ...prev, imageUrl: '' }));
    }
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFormData(prev => ({ ...prev, imageUrl: url }));
    
    if (url) {
      setImagePreview(url);
      // Clear file if URL is provided
      if (formData.imageFile) {
        setFormData(prev => ({ ...prev, imageFile: null }));
      }
    } else {
      setImagePreview(null);
    }
  };

  const clearImage = () => {
    setFormData(prev => ({ 
      ...prev, 
      imageFile: null, 
      imageUrl: '' 
    }));
    setImagePreview(null);
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    if (!isConnected || !isInitialized) {
      toast.error('Please connect your wallet and wait for initialization');
      return;
    }

    if (initError) {
      toast.error(`Story client error: ${initError}`);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      let imageUrl = formData.imageUrl;
      
      // Upload image to IPFS if file is provided
      if (formData.imageFile) {
        setUploadingImage(true);
        try {
          const imageHash = await uploadImageToIPFS(formData.imageFile);
          imageUrl = `https://gateway.pinata.cloud/ipfs/${imageHash}`;
          console.log('Image uploaded to IPFS:', imageUrl);
        } catch (uploadError) {
          console.error('Failed to upload image:', uploadError);
          throw new Error('Failed to upload image to IPFS');
        } finally {
          setUploadingImage(false);
        }
      }

      // Process tags
      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      console.log('Registering IP with data:', {
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

      // Register IP Asset
      const result = await registerIP({
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

      console.log('IP registration result:', result);

      // Reset form on success
      setFormData({
        title: '',
        description: '',
        category: 'art',
        tags: '',
        imageFile: null,
        imageUrl: '',
        commercialUse: false,
        commercialRevShare: 0,
        derivativesAllowed: false,
        transferable: true,
      });
      setImagePreview(null);
      setErrors({});

      toast.success(
        <div>
          <div className="font-medium">IP Asset registered successfully!</div>
          <div className="text-sm opacity-75">Token ID: {result.tokenId}</div>
        </div>
      );

    } catch (error) {
      console.error('Error registering IP:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to register IP asset';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    formData, 
    isConnected, 
    isInitialized, 
    initError, 
    registerIP, 
    setError
  ]);

  const isProcessing = isSubmitting || storyLoading || uploadingImage;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Register IP Asset
          </h1>
        </div>
        <p className="text-gray-600">
          Protect your intellectual property on the Story Protocol blockchain
        </p>
      </motion.div>

      {/* Connection Status */}
      {!isConnected && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6"
        >
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <div>
              <h3 className="font-medium text-yellow-800">Wallet Not Connected</h3>
              <p className="text-sm text-yellow-700 mt-1">
                Please connect your wallet to register IP assets.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Initialization Status */}
      {isConnected && !isInitialized && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
        >
          <div className="flex items-center space-x-3">
            <Loader className="h-5 w-5 text-blue-600 animate-spin" />
            <div>
              <h3 className="font-medium text-blue-800">Initializing Story Protocol</h3>
              <p className="text-sm text-blue-700 mt-1">
                Please wait while we connect to the Story Protocol network...
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Error Display */}
      {initError && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
        >
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <div>
              <h3 className="font-medium text-red-800">Initialization Error</h3>
              <p className="text-sm text-red-700 mt-1">{initError}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter a descriptive title"
                  required
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="art">Art & Design</option>
                  <option value="music">Music & Audio</option>
                  <option value="photo">Photography</option>
                  <option value="video">Video & Film</option>
                  <option value="document">Documents & Text</option>
                  <option value="code">Software & Code</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                rows={4}
                placeholder="Provide a detailed description of your IP asset"
                required
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., digital, abstract, modern, original"
              />
              <p className="text-sm text-gray-500 mt-1">
                Add relevant tags to help others discover your IP
              </p>
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Media Asset
            </h2>
            
            <div className="space-y-4">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Image
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 cursor-pointer transition-colors"
                  >
                    <div className="text-center">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* URL Input */}
              <div className="text-center text-gray-500">or</div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleImageUrlChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {errors.image && (
                <p className="text-red-500 text-sm">{errors.image}</p>
              )}

              {/* Image Preview */}
              {imagePreview && (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-w-full h-64 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={clearImage}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* License Terms */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
              License Terms
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="commercialUse"
                  name="commercialUse"
                  checked={formData.commercialUse}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="commercialUse" className="text-sm font-medium text-gray-700">
                  Allow Commercial Use
                </label>
              </div>

              {formData.commercialUse && (
                <div className="ml-7">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Commercial Revenue Share (%)
                  </label>
                  <input
                    type="number"
                    name="commercialRevShare"
                    value={formData.commercialRevShare}
                    onChange={handleInputChange}
                    className={`w-32 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.commercialRevShare ? 'border-red-500' : 'border-gray-300'
                    }`}
                    min="0"
                    max="100"
                    step="0.1"
                  />
                  {errors.commercialRevShare && (
                    <p className="text-red-500 text-sm mt-1">{errors.commercialRevShare}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    Percentage of revenue to be shared with you
                  </p>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="derivativesAllowed"
                  name="derivativesAllowed"
                  checked={formData.derivativesAllowed}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="derivativesAllowed" className="text-sm font-medium text-gray-700">
                  Allow Derivative Works
                </label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="transferable"
                  name="transferable"
                  checked={formData.transferable}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="transferable" className="text-sm font-medium text-gray-700">
                  License Transferable
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              {isConnected && isInitialized ? (
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Ready to register</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                  <span>Wallet connection required</span>
                </div>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    title: '',
                    description: '',
                    category: 'art',
                    tags: '',
                    imageFile: null,
                    imageUrl: '',
                    commercialUse: false,
                    commercialRevShare: 0,
                    derivativesAllowed: false,
                    transferable: true,
                  });
                  setImagePreview(null);
                  setErrors({});
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isProcessing}
              >
                Clear Form
              </button>

              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                disabled={!isConnected || !isInitialized || isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    <span>
                      {uploadingImage ? 'Uploading Image...' : 
                       isSubmitting ? 'Registering IP...' : 
                       'Processing...'}
                    </span>
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4" />
                    <span>Register IP Asset</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </motion.div>

      {/* Information Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-3">
            <Shield className="h-6 w-6 text-blue-600" />
            <h3 className="font-semibold text-blue-800">IP Protection</h3>
          </div>
          <p className="text-sm text-blue-700">
            Your intellectual property will be permanently recorded on the Story Protocol blockchain, 
            providing immutable proof of ownership and creation timestamp.
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-3">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <h3 className="font-semibold text-green-800">Automated Licensing</h3>
          </div>
          <p className="text-sm text-green-700">
            Set your licensing terms once and automatically manage permissions, 
            royalties, and derivative works through smart contracts.
          </p>
        </div>
      </motion.div>

      {/* Processing Status */}
      {isProcessing && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <div className="bg-white rounded-xl p-8 max-w-sm w-full mx-4">
            <div className="text-center">
              <Loader className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {uploadingImage ? 'Uploading to IPFS' : 
                 isSubmitting ? 'Registering IP Asset' : 
                 'Processing'}
              </h3>
              <p className="text-sm text-gray-600">
                {uploadingImage ? 'Uploading your image to IPFS for decentralized storage...' :
                 isSubmitting ? 'Creating your IP asset on the Story Protocol blockchain...' :
                 'Please wait while we process your request...'}
              </p>
              <div className="mt-4 bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default RegisterIP;




