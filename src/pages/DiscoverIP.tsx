import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Grid, 
  List, 
  Eye,
  Heart,
  Share2,
  Star,
  Tag,
  Calendar,
  ExternalLink
} from 'lucide-react'
import { useAppStore, type IPAsset } from '../store/appStore'
import { formatDate } from '../utils/formatters'

// Mock data for demonstration
const mockIPAssets: IPAsset[] = [
  {
    id: '1',
    tokenId: '1',
    title: 'Digital Artwork Collection',
    description: 'A stunning collection of digital artworks featuring vibrant colors and abstract designs.',
    category: 'art',
    ipfsHash: 'QmExample1',
    metadataURI: 'https://ipfs.io/ipfs/QmExample1',
    owner: '0x1234567890123456789012345678901234567890',
    creator: '0x1234567890123456789012345678901234567890',
    licenseTerms: {
      commercial: true,
      derivatives: true,
      attribution: true,
      shareAlike: false,
    },
    royaltyPolicy: '0x1234567890123456789012345678901234567890',
    registeredAt: new Date('2024-01-15'),
    lastUpdated: new Date('2024-01-15'),
    status: 'active',
    tags: ['digital art', 'abstract', 'colorful', 'NFT'],
    earnings: BigInt(1000),
    views: 1250,
    likes: 45,
  },
  {
    id: '2',
    tokenId: '2',
    title: 'AI Music Composition',
    description: 'Original music composition created with AI assistance, featuring electronic beats.',
    category: 'music',
    ipfsHash: 'QmExample2',
    metadataURI: 'https://ipfs.io/ipfs/QmExample2',
    owner: '0x2345678901234567890123456789012345678901',
    creator: '0x2345678901234567890123456789012345678901',
    licenseTerms: {
      commercial: false,
      derivatives: true,
      attribution: true,
      shareAlike: true,
    },
    royaltyPolicy: '0x2345678901234567890123456789012345678901',
    registeredAt: new Date('2024-02-10'),
    lastUpdated: new Date('2024-02-10'),
    status: 'active',
    tags: ['AI music', 'electronic', 'beats', 'composition'],
    earnings: BigInt(750),
    views: 980,
    likes: 32,
  },
  {
    id: '3',
    tokenId: '3',
    title: 'Photography Series',
    description: 'Professional photography series capturing urban landscapes at golden hour.',
    category: 'photo',
    ipfsHash: 'QmExample3',
    metadataURI: 'https://ipfs.io/ipfs/QmExample3',
    owner: '0x3456789012345678901234567890123456789012',
    creator: '0x3456789012345678901234567890123456789012',
    licenseTerms: {
      commercial: true,
      derivatives: false,
      attribution: true,
      shareAlike: false,
    },
    royaltyPolicy: '0x3456789012345678901234567890123456789012',
    registeredAt: new Date('2024-03-05'),
    lastUpdated: new Date('2024-03-05'),
    status: 'active',
    tags: ['photography', 'urban', 'landscape', 'golden hour'],
    earnings: BigInt(500),
    views: 2100,
    likes: 78,
  },
  {
    id: '4',
    tokenId: '4',
    title: 'Open Source Algorithm',
    description: 'Revolutionary sorting algorithm optimized for large datasets.',
    category: 'code',
    ipfsHash: 'QmExample4',
    metadataURI: 'https://ipfs.io/ipfs/QmExample4',
    owner: '0x4567890123456789012345678901234567890123',
    creator: '0x4567890123456789012345678901234567890123',
    licenseTerms: {
      commercial: true,
      derivatives: true,
      attribution: true,
      shareAlike: true,
    },
    royaltyPolicy: '0x4567890123456789012345678901234567890123',
    registeredAt: new Date('2024-03-20'),
    lastUpdated: new Date('2024-03-20'),
    status: 'active',
    tags: ['algorithm', 'sorting', 'open source', 'optimization'],
    earnings: BigInt(2000),
    views: 850,
    likes: 67,
  },
]

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'art', label: 'Art & Design' },
  { value: 'music', label: 'Music & Audio' },
  { value: 'document', label: 'Writing & Literature' },
  { value: 'photo', label: 'Photography' },
  { value: 'video', label: 'Video & Animation' },
  { value: 'code', label: 'Software & Code' },
  { value: 'other', label: 'Other' }
]

export default function DiscoverIP() {
  const { ipAssets: storeAssets } = useAppStore()
  
  // Local state for search and filters
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('recent')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [ipAssets] = useState<IPAsset[]>(storeAssets.length > 0 ? storeAssets : mockIPAssets)
  const [filteredAssets, setFilteredAssets] = useState<IPAsset[]>(ipAssets)

  // Filter and search logic
  useEffect(() => {
    let filtered = ipAssets

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(asset => asset.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(asset =>
        asset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Sort assets
    switch (sortBy) {
      case 'recent':
        filtered.sort((a, b) => b.registeredAt.getTime() - a.registeredAt.getTime())
        break
      case 'popular':
        filtered.sort((a, b) => b.views - a.views)
        break
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
    }

    setFilteredAssets(filtered)
  }, [ipAssets, selectedCategory, searchQuery, sortBy])

  const handleLikeAsset = (assetId: string) => {
    // In a real app, this would update the backend
    console.log('Liked asset:', assetId)
  }

  const handleShareAsset = (assetId: string) => {
    // In a real app, this would open share dialog
    navigator.clipboard.writeText(`${window.location.origin}/asset/${assetId}`)
    console.log('Shared asset:', assetId)
  }

  const getCategoryDisplayName = (category: string) => {
    const cat = categories.find(c => c.value === category)
    return cat?.label || category
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Discover IP Assets
        </h1>
        <p className="text-gray-600">
          Explore and discover registered intellectual property from creators worldwide
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search IP assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="lg:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="lg:w-32">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            >
              <option value="recent">Recent</option>
              <option value="popular">Popular</option>
              <option value="title">Title</option>
            </select>
          </div>

          {/* View Mode */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Results */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Found {filteredAssets.length} IP assets
          </p>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAssets.map((asset, index) => (
              <motion.div
                key={asset.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group"
              >
                <div className="relative">
                  <img
                    src={`https://picsum.photos/400/300?random=${asset.id}`}
                    alt={asset.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-800">
                      {getCategoryDisplayName(asset.category)}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button className="bg-blue-600 text-white px-3 py-2 text-sm rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 truncate">{asset.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {asset.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {asset.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="inline-flex items-center text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                    {asset.tags.length > 3 && (
                      <span className="text-xs text-gray-500">+{asset.tags.length - 3} more</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(asset.registeredAt)}
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 text-yellow-500" />
                      {asset.views}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleLikeAsset(asset.id)}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Heart className="h-4 w-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleShareAsset(asset.id)}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Share2 className="h-4 w-4 text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                        <ExternalLink className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                    <button className="border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 px-3 py-2 text-sm rounded-lg transition-colors">
                      License
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAssets.map((asset, index) => (
              <motion.div
                key={asset.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <img
                    src={`https://picsum.photos/400/300?random=${asset.id}`}
                    alt={asset.title}
                    className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-xl text-gray-900">{asset.title}</h3>
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-800">
                        {getCategoryDisplayName(asset.category)}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{asset.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {asset.tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(asset.registeredAt)}
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-1 text-yellow-500" />
                          {asset.views} views
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleLikeAsset(asset.id)}
                          className="text-gray-600 hover:text-gray-800 px-3 py-2 text-sm rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center"
                        >
                          <Heart className="h-4 w-4 mr-2" />
                          Like
                        </button>
                        <button className="border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 px-3 py-2 text-sm rounded-lg transition-colors inline-flex items-center">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </button>
                        <button className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 text-sm rounded-lg transition-colors">
                          License
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {filteredAssets.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No IP assets found</h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or browse different categories.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  )
}