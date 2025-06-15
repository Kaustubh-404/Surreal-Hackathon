import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { 
  Upload, 
  Shield, 
  FileText, 
  Tag,
  DollarSign,
  Zap,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react'
import { useStory } from '../hooks/useStory'
import { parseEther } from 'viem'
import toast from 'react-hot-toast'

interface RegisterForm {
  title: string
  description: string
  category: string
  tags: string
  imageUrl: string
  commercialUse: boolean
  commercialRevShare: number
  derivativesAllowed: boolean
  transferable: boolean
  mintingFee: string
}

const categories = [
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

export default function RegisterIP() {
  const { registerIP, isInitialized, isConnected } = useStory()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState(1)
  const [previewImage, setPreviewImage] = useState<string>('')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterForm>({
    defaultValues: {
      commercialUse: false,
      commercialRevShare: 0,
      derivativesAllowed: true,
      transferable: true,
      mintingFee: '0',
    },
  })

  const watchedValues = watch()

  const onSubmit = async (data: RegisterForm) => {
    if (!isConnected || !isInitialized) {
      toast.error('Please connect your wallet first')
      return
    }

    setIsSubmitting(true)
    try {
      const tags = data.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      const mintingFee = data.mintingFee ? parseEther(data.mintingFee) : undefined

      await registerIP({
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        category: data.category,
        tags,
        commercialUse: data.commercialUse,
        commercialRevShare: data.commercialRevShare,
        derivativesAllowed: data.derivativesAllowed,
        transferable: data.transferable,
        mintingFee,
      })

      toast.success('IP Asset registered successfully!')
      // Reset form or redirect
    } catch (error) {
      console.error('Registration failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setPreviewImage(result)
        setValue('imageUrl', result)
      }
      reader.readAsDataURL(file)
    }
  }

  const steps = [
    { id: 1, name: 'Basic Info', description: 'Title, description, and category' },
    { id: 2, name: 'Content', description: 'Upload your intellectual property' },
    { id: 3, name: 'License Terms', description: 'Configure usage permissions' },
    { id: 4, name: 'Review', description: 'Review and submit' },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold gradient-text mb-4">Register Your IP Asset</h1>
        <p className="text-muted-foreground">
          Protect your intellectual property on the blockchain with Story Protocol
        </p>
      </motion.div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((stepItem, index) => (
            <div
              key={stepItem.id}
              className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}
            >
              <div className={`flex items-center space-x-3 ${
                stepItem.id <= step ? 'text-primary-600' : 'text-gray-400'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  stepItem.id < step ? 'bg-primary-600 text-white' :
                  stepItem.id === step ? 'bg-primary-100 text-primary-600 border-2 border-primary-600' :
                  'bg-gray-200 text-gray-400'
                }`}>
                  {stepItem.id < step ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    stepItem.id
                  )}
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-medium">{stepItem.name}</div>
                  <div className="text-xs">{stepItem.description}</div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-px mx-4 ${
                  stepItem.id < step ? 'bg-primary-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl p-8 shadow-sm border border-gray-200"
          >
            <div className="flex items-center space-x-3 mb-6">
              <FileText className="h-6 w-6 text-primary-600" />
              <h2 className="text-xl font-semibold">Basic Information</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  {...register('title', { required: 'Title is required' })}
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter the title of your IP"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  {...register('description', { required: 'Description is required' })}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Describe your intellectual property in detail"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  {...register('category', { required: 'Category is required' })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  {...register('tags')}
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter tags separated by commas (e.g., digital art, NFT, creative)"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Tags help others discover your IP asset
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Content Upload */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl p-8 shadow-sm border border-gray-200"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Upload className="h-6 w-6 text-primary-600" />
              <h2 className="text-xl font-semibold">Upload Content</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image/Media *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors">
                  {previewImage ? (
                    <div className="space-y-4">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="max-w-xs mx-auto rounded-lg shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewImage('')
                          setValue('imageUrl', '')
                        }}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Remove image
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-lg font-medium text-gray-900">
                          Upload your intellectual property
                        </p>
                        <p className="text-sm text-gray-500">
                          Drag and drop or click to select files
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 cursor-pointer"
                      >
                        Choose File
                      </label>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Supported formats: JPG, PNG, GIF, SVG (max 10MB)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Or enter URL
                </label>
                <input
                  {...register('imageUrl')}
                  type="url"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: License Terms */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl p-8 shadow-sm border border-gray-200"
          >
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-blue-800">License Terms</h3>
                    <p className="text-sm text-blue-700 mt-1">
                      Configure how others can use your IP asset. These terms will be enforced on-chain.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Commercial Use</h4>
                    <p className="text-sm text-gray-500">Allow others to use your IP commercially</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      {...register('commercialUse')}
                      type="checkbox"
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                {watchedValues.commercialUse && (
                  <div className="ml-4 p-4 bg-gray-50 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Revenue Share (%)
                    </label>
                    <input
                      {...register('commercialRevShare', { 
                        min: 0, 
                        max: 100,
                        valueAsNumber: true 
                      })}
                      type="number"
                      min="0"
                      max="100"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="0"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Percentage of revenue that derivative works must share with you
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Derivatives Allowed</h4>
                    <p className="text-sm text-gray-500">Allow others to create derivatives of your IP</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      {...register('derivativesAllowed')}
                      type="checkbox"
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Transferable</h4>
                    <p className="text-sm text-gray-500">Allow license tokens to be transferred</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      {...register('transferable')}
                      type="checkbox"
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minting Fee (ETH)
                  </label>
                  <input
                    {...register('mintingFee')}
                    type="number"
                    step="0.001"
                    min="0"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="0.000"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Fee required to mint a license token (0 for free)
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl p-8 shadow-sm border border-gray-200"
          >
            <div className="flex items-center space-x-3 mb-6">
              <CheckCircle className="h-6 w-6 text-primary-600" />
              <h2 className="text-xl font-semibold">Review & Submit</h2>
            </div>

            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-yellow-800">Review Carefully</h3>
                    <p className="text-sm text-yellow-700 mt-1">
                      Once registered, some settings cannot be changed. Please review all information carefully.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Basic Information</h3>
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-sm text-gray-500">Title</dt>
                      <dd className="text-sm font-medium text-gray-900">{watchedValues.title || 'Not specified'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Category</dt>
                      <dd className="text-sm font-medium text-gray-900">{watchedValues.category || 'Not specified'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Tags</dt>
                      <dd className="text-sm font-medium text-gray-900">{watchedValues.tags || 'None'}</dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-4">License Terms</h3>
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-sm text-gray-500">Commercial Use</dt>
                      <dd className={`text-sm font-medium ${watchedValues.commercialUse ? 'text-green-600' : 'text-red-600'}`}>
                        {watchedValues.commercialUse ? 'Allowed' : 'Not Allowed'}
                      </dd>
                    </div>
                    {watchedValues.commercialUse && (
                      <div>
                        <dt className="text-sm text-gray-500">Revenue Share</dt>
                        <dd className="text-sm font-medium text-gray-900">{watchedValues.commercialRevShare}%</dd>
                      </div>
                    )}
                    <div>
                      <dt className="text-sm text-gray-500">Derivatives</dt>
                      <dd className={`text-sm font-medium ${watchedValues.derivativesAllowed ? 'text-green-600' : 'text-red-600'}`}>
                        {watchedValues.derivativesAllowed ? 'Allowed' : 'Not Allowed'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Minting Fee</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {watchedValues.mintingFee ? `${watchedValues.mintingFee} ETH` : 'Free'}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              {watchedValues.imageUrl && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Preview</h3>
                  <img
                    src={watchedValues.imageUrl}
                    alt="IP Preview"
                    className="max-w-sm rounded-lg shadow-md"
                  />
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              step === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Previous
          </button>

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(Math.min(4, step + 1))}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting || !isConnected || !isInitialized}
              className="px-8 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg font-medium hover:from-primary-700 hover:to-secondary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="loading-spinner" />
                  <span>Registering...</span>
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5" />
                  <span>Register IP Asset</span>
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}