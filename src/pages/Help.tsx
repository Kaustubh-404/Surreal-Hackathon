import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  HelpCircle, 
  Search,
  Book,
  MessageCircle,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Mail,
  FileText,
  Video,
  Users,
  Zap,
  Shield
} from 'lucide-react'

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
}

const faqs: FAQItem[] = [
  {
    id: '1',
    question: 'How do I register my intellectual property on the platform?',
    answer: 'To register your IP, go to the "Register IP" page, upload your content, fill in the metadata including title, description, and category, then configure your license terms. The system will mint an NFT representing your IP ownership and register it on the Story Protocol.',
    category: 'Getting Started'
  },
  {
    id: '2',
    question: 'What happens when I report a violation?',
    answer: 'When you submit a violation report, it enters our community validation system. Other users can vote on the validity of your report by staking tokens. If the report is validated as legitimate, appropriate actions are taken and you earn rewards for the successful report.',
    category: 'Reports & Violations'
  },
  {
    id: '3',
    question: 'How do cross-chain payments work?',
    answer: 'Our platform uses deBridge technology to enable seamless payments across different blockchain networks. You can send royalties, pay for AI agent services, or transfer tokens between Ethereum, Polygon, BSC, and other supported chains with just a few clicks.',
    category: 'Cross-Chain Features'
  },
  {
    id: '4',
    question: 'What are AI agents and how do I use them?',
    answer: 'AI agents are automated services that help with IP protection tasks like detecting violations, verifying authenticity, or calculating royalties. You can browse available agents in the AI marketplace, pay for services using tokens, and receive results automatically.',
    category: 'AI Agents'
  },
  {
    id: '5',
    question: 'How does the staking system work?',
    answer: 'You can stake tokens in various pools to earn rewards. Validator pools reward accurate voting on reports, Guardian pools provide enhanced monitoring capabilities, and Creator pools support the IP registration process. Rewards are distributed based on your contribution and accuracy.',
    category: 'Staking & Rewards'
  },
  {
    id: '6',
    question: 'Can I edit my IP asset after registration?',
    answer: 'Once registered on the blockchain, the core ownership and metadata cannot be changed to maintain integrity. However, you can update certain elements like descriptions, add license terms, or modify royalty settings through the platform interface.',
    category: 'IP Management'
  }
]

const helpCategories = [
  { name: 'Getting Started', icon: Zap, count: 8 },
  { name: 'IP Management', icon: Shield, count: 12 },
  { name: 'Reports & Violations', icon: FileText, count: 6 },
  { name: 'Staking & Rewards', icon: Users, count: 9 },
  { name: 'Cross-Chain Features', icon: ExternalLink, count: 5 },
  { name: 'AI Agents', icon: MessageCircle, count: 7 },
]

const resources = [
  {
    title: 'Platform Documentation',
    description: 'Comprehensive guides and technical documentation',
    icon: Book,
    link: 'https://docs.ipguardian.com',
    type: 'external'
  },
  {
    title: 'Video Tutorials',
    description: 'Step-by-step video guides for all platform features',
    icon: Video,
    link: '/tutorials',
    type: 'internal'
  },
  {
    title: 'Community Discord',
    description: 'Join our community for real-time support and discussions',
    icon: MessageCircle,
    link: 'https://discord.gg/ipguardian',
    type: 'external'
  },
  {
    title: 'API Reference',
    description: 'Technical documentation for developers and integrators',
    icon: FileText,
    link: 'https://api.ipguardian.com',
    type: 'external'
  }
]

export default function Help() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  })

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would submit to support system
    console.log('Contact form submitted:', contactForm)
    alert('Thank you for contacting us! We\'ll get back to you within 24 hours.')
    setContactForm({ name: '', email: '', subject: '', message: '', category: 'general' })
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
          <HelpCircle className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold gradient-text mb-4">How can we help?</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Find answers, get support, and learn how to make the most of IP Guardian
        </p>
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <input
              type="text"
              placeholder="Search for help articles, FAQs, and guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-12 pr-4 py-4 w-full text-lg"
            />
          </div>
        </div>
      </motion.div>

      {/* Quick Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
      >
        {resources.map((resource, index) => (
          <motion.div
            key={resource.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card p-6 hover:shadow-lg transition-all duration-300 group cursor-pointer"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                <resource.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">{resource.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{resource.description}</p>
            <div className="flex items-center text-primary text-sm font-medium">
              <span>Learn more</span>
              <ExternalLink className="h-4 w-4 ml-1" />
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Categories Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1"
        >
          <div className="card p-6">
            <h3 className="font-semibold mb-4">Browse by Category</h3>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                  selectedCategory === 'all' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                }`}
              >
                <span>All Topics</span>
                <span className="text-sm opacity-75">{faqs.length}</span>
              </button>
              {helpCategories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                    selectedCategory === category.name ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <category.icon className="h-4 w-4" />
                    <span>{category.name}</span>
                  </div>
                  <span className="text-sm opacity-75">{category.count}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* FAQ Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3"
        >
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
              <span className="text-sm text-muted-foreground">
                {filteredFAQs.length} {filteredFAQs.length === 1 ? 'result' : 'results'}
              </span>
            </div>

            <div className="space-y-4">
              {filteredFAQs.map((faq) => (
                <div key={faq.id} className="border border-border rounded-lg">
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium">{faq.question}</h3>
                      <span className="text-xs text-muted-foreground mt-1">{faq.category}</span>
                    </div>
                    {expandedFAQ === faq.id ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                  {expandedFAQ === faq.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-4 pb-4"
                    >
                      <div className="pt-4 border-t border-border">
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>

            {filteredFAQs.length === 0 && (
              <div className="text-center py-12">
                <Search className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-medium text-foreground mb-2">No results found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or browse by category
                </p>
              </div>
            )}
          </div>

          {/* Contact Support */}
          <div className="card p-6 mt-8">
            <h2 className="text-xl font-semibold mb-6">Still need help?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-4">Contact Support</h3>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Your name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="input"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Your email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="input"
                      required
                    />
                  </div>
                  <select
                    value={contactForm.category}
                    onChange={(e) => setContactForm({ ...contactForm, category: e.target.value })}
                    className="input w-full"
                  >
                    <option value="general">General Question</option>
                    <option value="technical">Technical Issue</option>
                    <option value="billing">Billing Question</option>
                    <option value="feature">Feature Request</option>
                    <option value="bug">Bug Report</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Subject"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    className="input"
                    required
                  />
                  <textarea
                    placeholder="Describe your question or issue..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="textarea"
                    rows={4}
                    required
                  />
                  <button type="submit" className="btn btn-default w-full">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Message
                  </button>
                </form>
              </div>
              
              <div>
                <h3 className="font-medium mb-4">Other Ways to Get Help</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-4 bg-muted/50 rounded-lg">
                    <MessageCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium">Live Chat</h4>
                      <p className="text-sm text-muted-foreground">
                        Get instant help from our support team
                      </p>
                      <button className="text-primary text-sm font-medium mt-1 hover:underline">
                        Start chat
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 bg-muted/50 rounded-lg">
                    <Users className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium">Community Forum</h4>
                      <p className="text-sm text-muted-foreground">
                        Ask questions and get help from the community
                      </p>
                      <button className="text-primary text-sm font-medium mt-1 hover:underline">
                        Visit forum
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 bg-muted/50 rounded-lg">
                    <Book className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium">Documentation</h4>
                      <p className="text-sm text-muted-foreground">
                        Comprehensive guides and API documentation
                      </p>
                      <button className="text-primary text-sm font-medium mt-1 hover:underline">
                        View docs
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <h4 className="font-medium text-primary mb-2">Response Times</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>General inquiries:</span>
                      <span className="font-medium">24 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Technical issues:</span>
                      <span className="font-medium">12 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Urgent issues:</span>
                      <span className="font-medium">4 hours</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}