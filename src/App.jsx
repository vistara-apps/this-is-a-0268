import React, { useState } from 'react'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import AudioUploader from './components/AudioUploader'
import SampleAnalysis from './components/SampleAnalysis'
import LegalHub from './components/LegalHub'
import SubscriptionPlans from './components/SubscriptionPlans'

function App() {
  const [currentView, setCurrentView] = useState('dashboard')
  const [analysisData, setAnalysisData] = useState(null)
  const [user, setUser] = useState({
    email: 'demo@sampleflow.com',
    subscriptionPlan: 'pro',
    creditsUsed: 3,
    creditsTotal: 25
  })

  const handleAnalysisComplete = (data) => {
    setAnalysisData(data)
    setCurrentView('analysis')
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard user={user} onNavigate={setCurrentView} />
      case 'upload':
        return <AudioUploader onAnalysisComplete={handleAnalysisComplete} />
      case 'analysis':
        return <SampleAnalysis data={analysisData} onBack={() => setCurrentView('dashboard')} />
      case 'legal':
        return <LegalHub />
      case 'subscription':
        return <SubscriptionPlans user={user} onBack={() => setCurrentView('dashboard')} />
      default:
        return <Dashboard user={user} onNavigate={setCurrentView} />
    }
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <Header currentView={currentView} onNavigate={setCurrentView} user={user} />
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        {renderCurrentView()}
      </main>
    </div>
  )
}

export default App