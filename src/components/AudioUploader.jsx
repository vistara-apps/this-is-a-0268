import React, { useState, useRef } from 'react'
import { Upload, FileAudio, X, Play, Pause, Loader } from 'lucide-react'

const AudioUploader = ({ onAnalysisComplete }) => {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [audioUrl, setAudioUrl] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const fileInputRef = useRef(null)
  const audioRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFileSelect(files[0])
    }
  }

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('audio/')) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setAudioUrl(url)
    } else {
      alert('Please select a valid audio file')
    }
  }

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    setAudioUrl('')
    setIsPlaying(false)
    if (audioRef.current) {
      audioRef.current.pause()
    }
  }

  const startAnalysis = async () => {
    if (!selectedFile) return

    setIsAnalyzing(true)
    setAnalysisProgress(0)

    // Simulate analysis progress
    const steps = [
      { progress: 20, message: 'Uploading audio file...' },
      { progress: 40, message: 'Extracting audio fingerprint...' },
      { progress: 60, message: 'Searching sample database...' },
      { progress: 80, message: 'Analyzing licensing status...' },
      { progress: 90, message: 'Calculating risk assessment...' },
      { progress: 100, message: 'Analysis complete!' }
    ]

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setAnalysisProgress(step.progress)
    }

    // Mock analysis results
    const mockResults = {
      fileName: selectedFile.name,
      duration: '3:42',
      samplesFound: [
        {
          id: 1,
          originalTrack: 'Funky Drummer - James Brown',
          confidence: 95,
          timestamp: '0:15 - 0:22',
          status: 'cleared',
          license: 'Available for $150',
          rightsHolder: 'Universal Music Group'
        },
        {
          id: 2,
          originalTrack: 'Apache - The Incredible Bongo Band',
          confidence: 87,
          timestamp: '1:30 - 1:45',
          status: 'uncleared',
          license: 'Contact required',
          rightsHolder: 'Shadow Music'
        }
      ],
      riskScore: 65,
      legalAdvice: 'Medium risk: One cleared sample detected, one requires licensing. Recommend obtaining clearance for Apache sample before release.',
      estimatedCost: '$150 - $500'
    }

    setTimeout(() => {
      setIsAnalyzing(false)
      onAnalysisComplete(mockResults)
    }, 500)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold gradient-text">Analyze Your Track</h2>
        <p className="text-dark-muted">Upload an audio file to identify samples and assess clearance risk</p>
      </div>

      {/* File Upload Area */}
      <div className="glass-card rounded-lg p-8">
        {!selectedFile ? (
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
              dragActive 
                ? 'border-purple-500 bg-purple-500/10' 
                : 'border-white/20 hover:border-white/40'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-dark-text mb-2">
                  Drop your audio file here
                </h3>
                <p className="text-dark-muted mb-4">
                  Supports MP3, WAV, FLAC, M4A files up to 50MB
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-primary px-6 py-3 rounded-lg font-medium text-white"
                >
                  Choose File
                </button>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Selected File */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
              <div className="flex items-center space-x-3">
                <FileAudio className="w-8 h-8 text-purple-300" />
                <div>
                  <p className="font-medium text-dark-text">{selectedFile.name}</p>
                  <p className="text-sm text-dark-muted">
                    {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {audioUrl && (
                  <button
                    onClick={togglePlayback}
                    className="p-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4 text-white" />
                    ) : (
                      <Play className="w-4 h-4 text-white" />
                    )}
                  </button>
                )}
                <button
                  onClick={removeFile}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4 text-dark-muted" />
                </button>
              </div>
            </div>

            {/* Audio Element */}
            {audioUrl && (
              <audio
                ref={audioRef}
                src={audioUrl}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />
            )}

            {/* Analysis Controls */}
            {!isAnalyzing ? (
              <div className="text-center">
                <button
                  onClick={startAnalysis}
                  className="btn-primary px-8 py-4 rounded-lg font-medium text-white text-lg"
                >
                  Start Analysis
                </button>
                <p className="text-sm text-dark-muted mt-2">
                  This will use 1 credit from your plan
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-dark-text">Analyzing...</span>
                    <span className="text-purple-300">{analysisProgress}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${analysisProgress}%` }}
                    />
                  </div>
                </div>

                {/* Loading State */}
                <div className="flex items-center justify-center space-x-3 py-8">
                  <Loader className="w-6 h-6 text-purple-300 animate-spin" />
                  <span className="text-dark-text">Processing your audio file...</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card rounded-lg p-4 text-center">
          <h4 className="font-semibold text-dark-text mb-2">Fast Analysis</h4>
          <p className="text-sm text-dark-muted">Results in under 60 seconds</p>
        </div>
        <div className="glass-card rounded-lg p-4 text-center">
          <h4 className="font-semibold text-dark-text mb-2">95%+ Accuracy</h4>
          <p className="text-sm text-dark-muted">Industry-leading identification</p>
        </div>
        <div className="glass-card rounded-lg p-4 text-center">
          <h4 className="font-semibold text-dark-text mb-2">Legal Guidance</h4>
          <p className="text-sm text-dark-muted">Clear next steps provided</p>
        </div>
      </div>
    </div>
  )
}

export default AudioUploader