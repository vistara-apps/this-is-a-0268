import React from 'react'
import { Music, User, Settings, Bell } from 'lucide-react'

const Header = ({ currentView, onNavigate, user }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: null },
    { id: 'upload', label: 'Analyze', icon: null },
    { id: 'legal', label: 'Legal Hub', icon: null },
    { id: 'subscription', label: 'Plans', icon: null },
  ]

  return (
    <header className="glass-card border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Music className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">SampleFlow</h1>
              <p className="text-xs text-dark-muted">with Stripe UI</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === item.id
                    ? 'bg-purple-600/20 text-purple-300'
                    : 'text-dark-muted hover:text-dark-text hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-2 text-sm">
              <span className="text-dark-muted">Credits:</span>
              <span className="text-purple-300 font-medium">
                {user.creditsUsed}/{user.creditsTotal}
              </span>
            </div>
            <button className="p-2 rounded-lg hover:bg-white/5 transition-colors">
              <Bell className="w-5 h-5 text-dark-muted" />
            </button>
            <button className="p-2 rounded-lg hover:bg-white/5 transition-colors">
              <Settings className="w-5 h-5 text-dark-muted" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header