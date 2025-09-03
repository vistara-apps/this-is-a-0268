import React from 'react'
import { Upload, FileAudio, Shield, BookOpen, TrendingUp, AlertTriangle } from 'lucide-react'
import WaveformVisualization from './WaveformVisualization'
import RiskMeter from './RiskMeter'

const Dashboard = ({ user, onNavigate }) => {
  const recentProjects = [
    {
      id: 1,
      name: 'Summer Remix 2024',
      status: 'analyzed',
      riskScore: 25,
      samplesFound: 2,
      date: '2 hours ago'
    },
    {
      id: 2,
      name: 'Underground Beats',
      status: 'processing',
      riskScore: null,
      samplesFound: null,
      date: '1 day ago'
    },
    {
      id: 3,
      name: 'Classic Hip-Hop Flip',
      status: 'high-risk',
      riskScore: 85,
      samplesFound: 4,
      date: '3 days ago'
    }
  ]

  const quickActions = [
    {
      title: 'Analyze New Track',
      description: 'Upload audio file for sample identification',
      icon: Upload,
      action: () => onNavigate('upload'),
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Legal Resources',
      description: 'Access guides and sample clearance info',
      icon: BookOpen,
      action: () => onNavigate('legal'),
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Upgrade Plan',
      description: 'Get unlimited analysis credits',
      icon: TrendingUp,
      action: () => onNavigate('subscription'),
      color: 'from-green-500 to-emerald-500'
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'analyzed': return 'text-green-400'
      case 'processing': return 'text-yellow-400'
      case 'high-risk': return 'text-red-400'
      default: return 'text-dark-muted'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'analyzed': return <Shield className="w-4 h-4" />
      case 'processing': return <div className="w-4 h-4 rounded-full border-2 border-yellow-400 border-t-transparent animate-spin" />
      case 'high-risk': return <AlertTriangle className="w-4 h-4" />
      default: return <FileAudio className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="glass-card rounded-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
          <div>
            <h2 className="text-2xl font-semibold text-dark-text mb-2">
              Welcome back! 👋
            </h2>
            <p className="text-dark-muted">
              You have <span className="text-purple-300 font-medium">{user.creditsTotal - user.creditsUsed} credits</span> remaining this month.
            </p>
          </div>
          <button 
            onClick={() => onNavigate('upload')}
            className="btn-primary px-6 py-3 rounded-lg font-medium text-white flex items-center space-x-2"
          >
            <Upload className="w-5 h-5" />
            <span>Analyze New Track</span>
          </button>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            className="glass-card rounded-lg p-6 text-left hover:bg-white/10 transition-all duration-200 group"
          >
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <action.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-dark-text mb-2">{action.title}</h3>
            <p className="text-dark-muted text-sm">{action.description}</p>
          </button>
        ))}
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="glass-card rounded-lg p-6">
          <h3 className="text-lg font-semibold text-dark-text mb-4">Recent Projects</h3>
          <div className="space-y-3">
            {recentProjects.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`${getStatusColor(project.status)}`}>
                    {getStatusIcon(project.status)}
                  </div>
                  <div>
                    <p className="text-dark-text font-medium">{project.name}</p>
                    <p className="text-sm text-dark-muted">{project.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  {project.riskScore !== null && (
                    <div className="flex items-center space-x-2">
                      <RiskMeter score={project.riskScore} size="sm" />
                      <span className="text-sm text-dark-muted">{project.riskScore}%</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audio Visualization */}
        <div className="glass-card rounded-lg p-6">
          <h3 className="text-lg font-semibold text-dark-text mb-4">Audio Analysis Preview</h3>
          <div className="space-y-4">
            <WaveformVisualization />
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 rounded-lg bg-white/5">
                <p className="text-2xl font-bold text-purple-300">95.2%</p>
                <p className="text-sm text-dark-muted">Accuracy Rate</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5">
                <p className="text-2xl font-bold text-pink-300">247</p>
                <p className="text-sm text-dark-muted">Samples Identified</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard