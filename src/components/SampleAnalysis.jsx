import React, { useState } from 'react'
import { ArrowLeft, Play, Pause, ExternalLink, Download, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import RiskMeter from './RiskMeter'
import WaveformVisualization from './WaveformVisualization'

const SampleAnalysis = ({ data, onBack }) => {
  const [activeTab, setActiveTab] = useState('samples')

  if (!data) return null

  const getStatusIcon = (status) => {
    switch (status) {
      case 'cleared':
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'uncleared':
        return <AlertTriangle className="w-5 h-5 text-red-400" />
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-400" />
      default:
        return null
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'cleared': return 'text-green-400 bg-green-400/10'
      case 'uncleared': return 'text-red-400 bg-red-400/10'
      case 'pending': return 'text-yellow-400 bg-yellow-400/10'
      default: return 'text-dark-muted bg-white/5'
    }
  }

  const getRiskColor = (score) => {
    if (score < 30) return 'text-green-400'
    if (score < 70) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-dark-muted" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-dark-text">Analysis Results</h2>
            <p className="text-dark-muted">{data.fileName}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="btn-primary px-4 py-2 rounded-lg font-medium text-white flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-lg p-4">
          <h3 className="text-sm font-medium text-dark-muted mb-1">Samples Found</h3>
          <p className="text-2xl font-bold text-dark-text">{data.samplesFound.length}</p>
        </div>
        <div className="glass-card rounded-lg p-4">
          <h3 className="text-sm font-medium text-dark-muted mb-1">Risk Score</h3>
          <div className="flex items-center space-x-2">
            <p className={`text-2xl font-bold ${getRiskColor(data.riskScore)}`}>
              {data.riskScore}%
            </p>
            <RiskMeter score={data.riskScore} size="sm" />
          </div>
        </div>
        <div className="glass-card rounded-lg p-4">
          <h3 className="text-sm font-medium text-dark-muted mb-1">Duration</h3>
          <p className="text-2xl font-bold text-dark-text">{data.duration}</p>
        </div>
        <div className="glass-card rounded-lg p-4">
          <h3 className="text-sm font-medium text-dark-muted mb-1">Est. Cost</h3>
          <p className="text-2xl font-bold text-purple-300">{data.estimatedCost}</p>
        </div>
      </div>

      {/* Audio Visualization */}
      <div className="glass-card rounded-lg p-6">
        <h3 className="text-lg font-semibold text-dark-text mb-4">Audio Waveform</h3>
        <WaveformVisualization showSampleMarkers={true} />
      </div>

      {/* Tabs */}
      <div className="glass-card rounded-lg">
        <div className="border-b border-white/10">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'samples', label: 'Identified Samples', count: data.samplesFound.length },
              { id: 'legal', label: 'Legal Analysis', count: null },
              { id: 'licensing', label: 'Licensing Options', count: null }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-300'
                    : 'border-transparent text-dark-muted hover:text-dark-text'
                }`}
              >
                {tab.label} {tab.count && `(${tab.count})`}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'samples' && (
            <div className="space-y-4">
              {data.samplesFound.map((sample) => (
                <div key={sample.id} className="glass-card rounded-lg p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getStatusIcon(sample.status)}
                        <h4 className="text-lg font-semibold text-dark-text">
                          {sample.originalTrack}
                        </h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(sample.status)}`}>
                          {sample.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-dark-muted">Confidence:</span>
                          <span className="text-dark-text font-medium ml-2">{sample.confidence}%</span>
                        </div>
                        <div>
                          <span className="text-dark-muted">Timestamp:</span>
                          <span className="text-dark-text font-medium ml-2">{sample.timestamp}</span>
                        </div>
                        <div>
                          <span className="text-dark-muted">Rights Holder:</span>
                          <span className="text-dark-text font-medium ml-2">{sample.rightsHolder}</span>
                        </div>
                        <div>
                          <span className="text-dark-muted">License:</span>
                          <span className="text-purple-300 font-medium ml-2">{sample.license}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors">
                        <Play className="w-4 h-4 text-white" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                        <ExternalLink className="w-4 h-4 text-dark-muted" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'legal' && (
            <div className="space-y-6">
              <div className="glass-card rounded-lg p-6">
                <h4 className="text-lg font-semibold text-dark-text mb-4">Risk Assessment</h4>
                <div className="flex items-center space-x-4 mb-4">
                  <RiskMeter score={data.riskScore} size="lg" />
                  <div>
                    <p className={`text-2xl font-bold ${getRiskColor(data.riskScore)}`}>
                      {data.riskScore}% Risk
                    </p>
                    <p className="text-dark-muted">Medium Risk Level</p>
                  </div>
                </div>
                <p className="text-dark-text leading-relaxed">{data.legalAdvice}</p>
              </div>

              <div className="glass-card rounded-lg p-6">
                <h4 className="text-lg font-semibold text-dark-text mb-4">Recommendations</h4>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <p className="text-dark-text">Obtain clearance for Apache sample before commercial release</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <p className="text-dark-text">James Brown sample is pre-cleared and ready to use</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                    <p className="text-dark-text">Consider alternative samples if licensing costs exceed budget</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'licensing' && (
            <div className="space-y-6">
              <div className="glass-card rounded-lg p-6">
                <h4 className="text-lg font-semibold text-dark-text mb-4">Licensing Options</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-white/10 rounded-lg p-4">
                    <h5 className="font-semibold text-dark-text mb-2">Standard License</h5>
                    <p className="text-2xl font-bold text-purple-300 mb-2">$150</p>
                    <ul className="text-sm text-dark-muted space-y-1">
                      <li>• Digital streaming rights</li>
                      <li>• Up to 10,000 physical copies</li>
                      <li>• Non-exclusive license</li>
                    </ul>
                    <button className="w-full mt-4 btn-primary py-2 rounded-lg font-medium text-white">
                      Request License
                    </button>
                  </div>
                  <div className="border border-white/10 rounded-lg p-4">
                    <h5 className="font-semibold text-dark-text mb-2">Extended License</h5>
                    <p className="text-2xl font-bold text-purple-300 mb-2">$500</p>
                    <ul className="text-sm text-dark-muted space-y-1">
                      <li>• All digital rights</li>
                      <li>• Unlimited physical copies</li>
                      <li>• Sync/placement rights</li>
                    </ul>
                    <button className="w-full mt-4 btn-primary py-2 rounded-lg font-medium text-white">
                      Request License
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SampleAnalysis