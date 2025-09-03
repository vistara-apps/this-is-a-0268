import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserSubscription, SUBSCRIPTION_PLANS, PLAN_DETAILS } from '../api/stripe';
import { useAuth } from './AuthContext';

// Create context
const SubscriptionContext = createContext(null);

export const SubscriptionProvider = ({ children }) => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuth();

  // Fetch user subscription when authenticated
  useEffect(() => {
    const fetchSubscription = async () => {
      if (!isAuthenticated || !user) {
        setSubscription({
          planId: SUBSCRIPTION_PLANS.FREE,
          status: 'active',
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          cancelAtPeriodEnd: false
        });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const { success, data, error } = await getUserSubscription(user.id);
        
        if (success && data) {
          setSubscription(data);
        } else if (error) {
          console.error('Error fetching subscription:', error);
          setError(error.message || 'Failed to load subscription');
          
          // Set default free plan
          setSubscription({
            planId: SUBSCRIPTION_PLANS.FREE,
            status: 'active',
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            cancelAtPeriodEnd: false
          });
        }
      } catch (err) {
        console.error('Subscription fetch error:', err);
        setError('An unexpected error occurred while loading subscription');
        
        // Set default free plan
        setSubscription({
          planId: SUBSCRIPTION_PLANS.FREE,
          status: 'active',
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          cancelAtPeriodEnd: false
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user, isAuthenticated]);

  // Get current plan details
  const getCurrentPlan = () => {
    if (!subscription) return PLAN_DETAILS[SUBSCRIPTION_PLANS.FREE];
    return PLAN_DETAILS[subscription.planId] || PLAN_DETAILS[SUBSCRIPTION_PLANS.FREE];
  };

  // Check if user has access to a feature
  const hasFeatureAccess = (featureName) => {
    const currentPlan = getCurrentPlan();
    const feature = currentPlan.features.find(f => f.name === featureName);
    return feature?.included || false;
  };

  // Check if user has unlimited credits
  const hasUnlimitedCredits = () => {
    const currentPlan = getCurrentPlan();
    return currentPlan.credits === null;
  };

  // Get available credits
  const getAvailableCredits = () => {
    if (hasUnlimitedCredits()) return Infinity;
    return subscription?.creditsRemaining || getCurrentPlan().credits || 0;
  };

  // Update subscription in context
  const updateSubscription = (newSubscription) => {
    setSubscription(newSubscription);
  };

  // Context value
  const value = {
    subscription,
    loading,
    error,
    currentPlan: getCurrentPlan(),
    hasFeatureAccess,
    hasUnlimitedCredits,
    getAvailableCredits,
    updateSubscription
  };

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
};

// Custom hook to use subscription context
export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export default SubscriptionContext;
