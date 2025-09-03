import React, { useState } from 'react'
import { Book, FileText, Scale, HelpCircle, ChevronDown, ChevronRight, ExternalLink } from 'lucide-react'

const LegalHub = () => {
  const [expandedSection, setExpandedSection] = useState(null)

  const legalSections = [
    {
      id: 'basics',
      title: 'Sample Clearance Basics',
      icon: Book,
      description: 'Understanding the fundamentals of music sampling and copyright',
      content: [
        {
          question: 'What is sample clearance?',
          answer: 'Sample clearance is the process of obtaining legal permission to use portions of existing copyrighted recordings in your new musical work. This typically involves two types of rights: mechanical rights (for the underlying composition) and master recording rights (for the actual recorded performance).'
        },
        {
          question: 'When do I need sample clearance?',
          answer: 'You need sample clearance whenever you use any identifiable portion of a copyrighted recording, regardless of length. Even a few seconds can require clearance. The only exceptions are fair use (very limited in music) or if the original work is in the public domain.'
        },
        {
          question: 'What happens if I don\'t clear samples?',
          answer: 'Using uncleared samples can result in copyright infringement claims, DMCA takedowns, legal action, financial penalties, and removal of your music from platforms. The original rights holders can claim ownership of your new work and its profits.'
        }
      ]
    },
    {
      id: 'costs',
      title: 'Licensing Costs & Pricing',
      icon: Scale,
      description: 'Understanding how sample licensing fees are determined',
      content: [
        {
          question: 'How much does sample clearance typically cost?',
          answer: 'Costs vary widely from $150 for basic uses to $50,000+ for major hits. Factors include the popularity of the original song, intended use, distribution scale, and negotiating power. Independent artists often pay $150-$2,500 per sample.'
        },
        {
          question: 'What factors affect licensing costs?',
          answer: 'Key factors include: popularity of the original track, length of sample used, prominence in your song, intended distribution (local vs. global), commercial vs. non-commercial use, your artist status, and the rights holder\'s willingness to license.'
        },
        {
          question: 'Can I negotiate licensing fees?',
          answer: 'Yes, licensing fees are often negotiable, especially for independent artists or smaller-scale releases. Consider offering a percentage of royalties instead of upfront fees, limiting territorial rights, or proposing a stepped payment structure based on sales milestones.'
        }
      ]
    },
    {
      id: 'dmca',
      title: 'DMCA & Takedowns',
      icon: FileText,
      description: 'Protecting yourself from content removal and legal issues',
      content: [
        {
          question: 'What is a DMCA takedown?',
          answer: 'The Digital Millennium Copyright Act (DMCA) allows copyright holders to request removal of infringing content from online platforms. For musicians, this often means your tracks can be removed from streaming services, YouTube, or other platforms if they contain uncleared samples.'
        },
        {
          question: 'How can I avoid DMCA takedowns?',
          answer: 'Clear all samples before release, use original compositions, purchase royalty-free samples, or use samples from public domain works. Implement content ID management if you\'re a label, and always document your clearances.'
        },
        {
          question: 'What should I do if I receive a takedown notice?',
          answer: 'Don\'t ignore it. Review the claim\'s validity, gather documentation of any clearances, consider filing a counter-notice if the claim is invalid, or work directly with the claimant to resolve the issue. Consult an entertainment lawyer for complex cases.'
        }
      ]
    },
    {
      id: 'process',
      title: 'Clearance Process',
      icon: HelpCircle,
      description: 'Step-by-step guide to obtaining sample clearances',
      content: [
        {
          question: 'How do I identify who owns a sample?',
          answer: 'Use music recognition services, check performing rights organizations (ASCAP, BMI, SESAC), search music databases like AllMusic or Discogs, contact the record label, or use professional clearance services. Always verify ownership with multiple sources.'
        },
        {
          question: 'What information do I need for clearance requests?',
          answer: 'You\'ll need: details of the sample (song title, artist, specific portion used), your project information (artist name, album/single title, expected release date), intended use and distribution, proposed licensing terms, and your contact information.'
        },
        {
          question: 'How long does the clearance process take?',
          answer: 'Clearance can take anywhere from 2-12 weeks, sometimes longer for complex cases. Factors affecting timeline include rights holder responsiveness, licensing complexity, and negotiation requirements. Always start the process early in your production cycle.'
        }
      ]
    }
  ]

  const resources = [
    {
      title: 'Sample Clearance Template Letter',
      description: 'Professional template for reaching out to rights holders',
      type: 'Template',
      action: 'Download'
    },
    {
      title: 'Rights Holder Contact Database',
      description: 'Searchable database of music publisher and label contacts',
      type: 'Database',
      action: 'Access'
    },
    {
      title: 'Fair Use Guidelines for Musicians',
      description: 'Understanding when sampling might qualify as fair use',
      type: 'Guide',
      action: 'Read'
    },
    {
      title: 'Pre-Cleared Sample Libraries',
      description: 'Curated list of royalty-free and pre-cleared sample sources',
      type: 'Directory',
      action: 'Browse'
    }
  ]

  const toggleSection = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold gradient-text">Legal Clarity Hub</h2>
        <p className="text-dark-muted">Everything you need to know about sample clearance and music copyright</p>
      </div>

      {/* Quick Resources */}
      <div className="glass-card rounded-lg p-6">
        <h3 className="text-lg font-semibold text-dark-text mb-4">Quick Resources</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resources.map((resource, index) => (
            <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <div className="flex-1">
                <h4 className="font-medium text-dark-text">{resource.title}</h4>
                <p className="text-sm text-dark-muted">{resource.description}</p>
                <span className="inline-block mt-1 px-2 py-1 text-xs rounded-full bg-purple-600/20 text-purple-300">
                  {resource.type}
                </span>
              </div>
              <button className="ml-4 px-3 py-1 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center space-x-1">
                <span>{resource.action}</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Legal Sections */}
      <div className="space-y-4">
        {legalSections.map((section) => (
          <div key={section.id} className="glass-card rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full p-6 text-left hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <section.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-dark-text">{section.title}</h3>
                    <p className="text-dark-muted">{section.description}</p>
                  </div>
                </div>
                {expandedSection === section.id ? (
                  <ChevronDown className="w-5 h-5 text-dark-muted" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-dark-muted" />
                )}
              </div>
            </button>

            {expandedSection === section.id && (
              <div className="px-6 pb-6 space-y-4">
                {section.content.map((item, index) => (
                  <div key={index} className="border-l-2 border-purple-500 pl-4 py-2">
                    <h4 className="font-medium text-dark-text mb-2">{item.question}</h4>
                    <p className="text-dark-muted leading-relaxed">{item.answer}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Contact Section */}
      <div className="glass-card rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-dark-text mb-2">Need Personalized Help?</h3>
        <p className="text-dark-muted mb-4">
          Our legal experts can provide personalized guidance for your specific situation
        </p>
        <button className="btn-primary px-6 py-3 rounded-lg font-medium text-white">
          Contact Legal Team
        </button>
      </div>
    </div>
  )
}

export default LegalHub