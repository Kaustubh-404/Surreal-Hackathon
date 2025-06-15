import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Eye,
  Heart,
  Share2,
  Download,
  Shield,
  Star,
  Tag,
  Calendar,
  User,
  ExternalLink
} from 'lucide-react'
import { useAppStore } from '../store/appStore'
import { formatDate, formatEther } from '../utils/formatters'
import type { IPAsset } from '../types/global'

// Mock data for demonstration
const mockIPAssets: IPAsset[] = [
  {
    id: '1',
    tokenId: '1',
    nftContract: '0x1234567890123456789012345678901234567890',
    metadataUri: 'https://ipfs.io/ipfs/QmExample1',
    owner: '0x1234567890123456789012345678901234567890',
    title: 'Digital Artwork Collection',
    description: 'A stunning collection of digital artworks featuring vibrant colors and abstract designs.',
    imageUrl: 'https://picsum.photos/400/300?random=1',
    category: 'Art & Design',
    tags: ['digital art', 'abstract', 'colorful', 'NFT'],
    registrationDate: new Date('2024-01-15'),
    royaltyTokens: 1000,
  },
  {
    id: '2',
    tokenId: '2',
    nftContract: '0x1234567890123456789012345678901234567890',
    metadataUri: 'https://ipfs.io/ipfs/QmExample2',
    owner: '0x2345678901234567890123456789012345678901',
    title: 'AI Music Composition',
    description: 'Original music composition created with AI assistance, featuring electronic beats.',
    imageUrl: 'https://picsum.photos/400/300?random=2',
    category: 'Music & Audio',
    tags: ['AI music', 'electronic', 'beats', 'composition'],
    registrationDate: new Date('2024-02-10'),
    royaltyTokens: 750,
  },
  {
    id: '3',
    tokenId: '3',
    nftContract: '0x1234567890123456789012345678901234567890',
    metadataUri: 'https://ipfs.io/ipfs/QmExample3',
    owner: '0x3456789012345678901234567890123456789012',
    title: 'Photography Series',
    description: 'Professional photography series capturing urban landscapes at golden hour.',
    imageUrl: 'https://picsum.photos/400/300?random=3',
    category: 'Photography',
    tags: ['photography', 'urban', 'landscape', 'golden hour'],
    registrationDate: new Date('2024-03-05'),
    royaltyTokens: 500,
  },
  {
    id: '4',
    tokenId: '4',
    nftContract: '0x1234567890123456789012345678901234567890',
    metadataUri: 'https://ipfs.io/ipfs/QmExample4',
    owner: '0x4567890123456789012345678901234567890123',
    title: 'Open Source Algorithm',
    description: 'Revolutionary sorting algorithm optimized for large datasets.',
    imageUrl: 'https://picsum.photos/400/300?random=4',
    category: 'Software & Code',
    tags: ['algorithm', 'sorting', 'open source', 'optimization'],
    registrationDate: new Date('2024-03-20'),
    royaltyTokens: 2000,
  },
]

const categories = [
  'All Categories',
  'Art & Design',
  'Music & Audio',
  'Writing & Literature',
  'Photography',
  'Video & Animation',
  'Software & Code',
  'Games',
  'Research & Data',
  'Brands & Logos',
  'Other'
]

export default function DiscoverIP() {
  const { searchQuery, setSearchQuery, selectedFilters, setFilters } = useAppStore()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('recent')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [ipAssets, setIPAssets] = useState<IPAsset[]>(mockIPAssets)
  const [filteredAssets, setFilteredAssets] = useState<IPAsset[]>(mockIPAssets)

  // Filter and search logic
  useEffect(() => {
    let filtered = ipAssets

    // Filter by category
    if (selectedCategory !== 'All Categories') {
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
        filtered.sort((a, b) => b.registrationDate.getTime() - a.registrationDate.getTime())
        break
      case 'popular':
        filtered.sort((a, b) => (b.royaltyTokens || 0) - (a.royaltyTokens || 0))
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

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold gradient-text mb-4">Discover IP Assets</h1>
        <p className="text-muted-foreground">
          Explore and discover registered intellectual property from creators worldwide
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-xl p-6 shadow-sm border mb-8"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Search IP assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="lg:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input w-full"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="lg:w-32">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input w-full"
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
                viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
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
          <p className="text-muted-foreground">
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
                className="card overflow-hidden hover:shadow-lg transition-all duration-300 group"
              >
                <div className="relative">
                  <img
                    src={asset.imageUrl}
                    alt={asset.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <span className="badge badge-secondary">
                      {asset.category}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button className="btn btn-default btn-sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-1">{asset.title}</h3>
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                    {asset.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {asset.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="inline-flex items-center text-xs bg-accent/20 text-accent-foreground px-2 py-1 rounded">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                    {asset.tags.length > 3 && (
                      <span className="text-xs text-muted-foreground">+{asset.tags.length - 3} more</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(asset.registrationDate)}
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 text-warning-500" />
                      {asset.royaltyTokens}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleLikeAsset(asset.id)}
                        className="p-1 hover:bg-accent rounded-lg transition-colors"
                      >
                        <Heart className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleShareAsset(asset.id)}
                        className="p-1 hover:bg-accent rounded-lg transition-colors"
                      >
                        <Share2 className="h-4 w-4" />
                      </button>
                      <button className="p-1 hover:bg-accent rounded-lg transition-colors">
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </div>
                    <button className="btn btn-outline btn-sm">
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
                className="card p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <img
                    src={asset.imageUrl}
                    alt={asset.title}
                    className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-xl">{asset.title}</h3>
                      <span className="badge badge-secondary">{asset.category}</span>
                    </div>
                    <p className="text-muted-foreground mb-3">{asset.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {asset.tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center text-xs bg-accent/20 text-accent-foreground px-2 py-1 rounded">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(asset.registrationDate)}
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-1 text-warning-500" />
                          {asset.royaltyTokens} tokens
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleLikeAsset(asset.id)}
                          className="btn btn-ghost btn-sm"
                        >
                          <Heart className="h-4 w-4 mr-2" />
                          Like
                        </button>
                        <button className="btn btn-outline btn-sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </button>
                        <button className="btn btn-default btn-sm">
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
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No IP assets found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or browse different categories.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  )
}