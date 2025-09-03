import React, { useState } from 'react'
import { Check, X, Star, ArrowLeft } from 'lucide-react'

const SubscriptionPlans = ({ user, onBack }) => {
  const [billingCycle, setBillingCycle] = useState('monthly')

  const plans = [
    {
      id: 'free',
      name: 'Free',
      description: 'Perfect for trying out the platform',
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        { name: '1 sample analysis per month', included: true },
        { name: 'Basic risk assessment', included: true },
        { name: 'Legal resource access', included: true },
        { name: 'Email support', included: true },
        { name: 'Advanced AI analysis', included: false },
        { name: 'Unlimited analyses', included: false },
        { name: 'Priority support', included: false },
        { name: 'Export detailed reports', included: false }
      ],
      popular: false,
      cta: user.subscriptionPlan === 'free' ? 'Current Plan' : 'Downgrade'
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'For serious remix artists and producers',
      monthlyPrice: 29,
      yearlyPrice: 290,
      features: [
        { name: 'Unlimited sample analyses', included: true },
        { name: 'Advanced risk assessment', included: true },
        { name: 'Full legal resource library', included: true },
        { name: 'Email support', included: true },
        { name: 'Advanced AI analysis', included: true },
        { name: 'Export detailed reports', included: true },
        { name: 'Licensing assistance', included: true },
        { name: 'Priority support', included: false }
      ],
      popular: true,
      cta: user.subscriptionPlan === 'pro' ? 'Current Plan' : 'Upgrade to Pro'
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'For labels and high-volume producers',
      monthlyPrice: 59,
      yearlyPrice: 590,
      features: [
        { name: 'Everything in Pro', included: true },
        { name: 'Priority processing', included: true },
        { name: 'Custom legal templates', included: true },
        { name: 'Direct rights holder contacts', included: true },
        { name: 'Batch processing', included: true },
        { name: 'API access', included: true },
        { name: 'Dedicated account manager', included: true },
        { name: 'Phone support', included: true }
      ],
      popular: false,
      cta: user.subscriptionPlan === 'premium' ? 'Current Plan' : 'Upgrade to Premium'
    }
  ]

  const getPrice = (plan) => {
    if (plan.monthlyPrice === 0) return 'Free'
    const price = billingCycle === 'monthly' ? plan.monthlyPrice : Math.round(plan.yearlyPrice / 12)
    return `$${price}`
  }

  const getSavings = (plan) => {
    if (plan.monthlyPrice === 0) return null
    const monthlyCost = plan.monthlyPrice * 12
    const savings = monthlyCost - plan.yearlyPrice
    return billingCycle === 'yearly' ? `Save $${savings}/year` : null
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
            <h2 className="text-3xl font-bold gradient-text">Choose Your Plan</h2>
            <p className="text-dark-muted">Select the perfect plan for your music production needs</p>
          </div>
        </div>
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center">
        <div className="glass-card rounded-lg p-1 flex">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              billingCycle === 'monthly'
                ? 'bg-purple-600 text-white'
                : 'text-dark-muted hover:text-dark-text'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              billingCycle === 'yearly'
                ? 'bg-purple-600 text-white'
                : 'text-dark-muted hover:text-dark-text'
            }`}
          >
            Yearly
            <span className="ml-2 px-2 py-1 text-xs bg-green-500 text-white rounded-full">
              Save 17%
            </span>
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`glass-card rounded-lg p-6 relative ${
              plan.popular ? 'ring-2 ring-purple-500 ring-opacity-50' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                  <Star className="w-4 h-4" />
                  <span>Most Popular</span>
                </span>
              </div>
            )}

            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-dark-text mb-2">{plan.name}</h3>
              <p className="text-dark-muted text-sm mb-4">{plan.description}</p>
              <div className="space-y-1">
                <div className="flex items-baseline justify-center space-x-1">
                  <span className="text-3xl font-bold text-dark-text">{getPrice(plan)}</span>
                  {plan.monthlyPrice > 0 && (
                    <span className="text-dark-muted">/{billingCycle === 'monthly' ? 'month' : 'month'}</span>
                  )}
                </div>
                {getSavings(plan) && (
                  <p className="text-green-400 text-sm">{getSavings(plan)}</p>
                )}
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  {feature.included ? (
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                  ) : (
                    <X className="w-5 h-5 text-red-400 flex-shrink-0" />
                  )}
                  <span className={`text-sm ${feature.included ? 'text-dark-text' : 'text-dark-muted'}`}>
                    {feature.name}
                  </span>
                </div>
              ))}
            </div>

            <button
              disabled={user.subscriptionPlan === plan.id}
              className={`w-full py-3 rounded-lg font-medium transition-colors ${
                user.subscriptionPlan === plan.id
                  ? 'bg-white/10 text-dark-muted cursor-not-allowed'
                  : plan.popular
                  ? 'btn-primary text-white'
                  : 'bg-white/5 text-dark-text hover:bg-white/10'
              }`}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      {/* Features Comparison */}
      <div className="glass-card rounded-lg p-6">
        <h3 className="text-lg font-semibold text-dark-text mb-4">Why Choose SampleFlow?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">95%</span>
            </div>
            <h4 className="font-semibold text-dark-text mb-2">Accuracy Rate</h4>
            <p className="text-dark-muted text-sm">Industry-leading sample identification technology</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">&lt;60s</span>
            </div>
            <h4 className="font-semibold text-dark-text mb-2">Fast Analysis</h4>
            <p className="text-dark-muted text-sm">Get results in under 60 seconds</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">24/7</span>
            </div>
            <h4 className="font-semibold text-dark-text mb-2">Support</h4>
            <p className="text-dark-muted text-sm">Expert guidance when you need it</p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="glass-card rounded-lg p-6">
        <h3 className="text-lg font-semibold text-dark-text mb-4">Frequently Asked Questions</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-dark-text mb-1">Can I change plans anytime?</h4>
            <p className="text-dark-muted text-sm">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
          </div>
          <div>
            <h4 className="font-medium text-dark-text mb-1">Do credits roll over?</h4>
            <p className="text-dark-muted text-sm">Pro and Premium plans include unlimited analyses. Free plan credits reset monthly.</p>
          </div>
          <div>
            <h4 className="font-medium text-dark-text mb-1">Is there a free trial?</h4>
            <p className="text-dark-muted text-sm">Yes, all new users start with our Free plan. No credit card required.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionPlans