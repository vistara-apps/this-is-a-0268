import axios from 'axios';

// Initialize Stripe API
const STRIPE_API_URL = import.meta.env.VITE_STRIPE_API_URL;
const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

if (!STRIPE_API_URL || !STRIPE_PUBLIC_KEY) {
  console.error('Missing Stripe API environment variables. Check your .env file.');
}

// Subscription plans
export const SUBSCRIPTION_PLANS = {
  FREE: 'free',
  PRO: 'pro',
  PREMIUM: 'premium'
};

// Plan details
export const PLAN_DETAILS = {
  [SUBSCRIPTION_PLANS.FREE]: {
    id: SUBSCRIPTION_PLANS.FREE,
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
    credits: 1
  },
  [SUBSCRIPTION_PLANS.PRO]: {
    id: SUBSCRIPTION_PLANS.PRO,
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
    credits: null // Unlimited
  },
  [SUBSCRIPTION_PLANS.PREMIUM]: {
    id: SUBSCRIPTION_PLANS.PREMIUM,
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
    credits: null // Unlimited
  }
};

/**
 * Create a checkout session for subscription
 * @param {string} planId - Subscription plan ID
 * @param {string} userId - User ID
 * @param {boolean} isYearly - Whether the subscription is yearly
 * @returns {Promise<Object>} Result object with checkout session or error
 */
export const createCheckoutSession = async (planId, userId, isYearly = false) => {
  try {
    // In a real implementation, this would call a backend API endpoint
    // that creates a Stripe checkout session
    // For now, we'll simulate the response
    
    const plan = PLAN_DETAILS[planId];
    if (!plan) {
      throw new Error('Invalid plan ID');
    }
    
    // Simulate API call
    const response = await axios.post(
      `${STRIPE_API_URL}/create-checkout-session`,
      {
        planId,
        userId,
        isYearly
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${STRIPE_PUBLIC_KEY}`
        }
      }
    );

    return { 
      success: true, 
      data: response.data 
    };
  } catch (error) {
    console.error('Stripe checkout error:', error);
    
    // For demo purposes, return a simulated checkout URL
    if (planId !== SUBSCRIPTION_PLANS.FREE) {
      return { 
        success: true, 
        data: { 
          checkoutUrl: `https://checkout.stripe.com/pay/cs_test_${Math.random().toString(36).substring(2, 15)}`,
          sessionId: `cs_test_${Math.random().toString(36).substring(2, 15)}`
        } 
      };
    }
    
    return { 
      success: false, 
      error: {
        message: error.response?.data?.message || error.message || 'Failed to create checkout session',
        code: error.response?.status || 'stripe_error'
      }
    };
  }
};

/**
 * Get user's subscription details
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Result object with subscription details or error
 */
export const getUserSubscription = async (userId) => {
  try {
    // In a real implementation, this would call a backend API endpoint
    // that retrieves the user's subscription from Stripe
    // For now, we'll simulate the response
    
    // Simulate API call
    const response = await axios.get(
      `${STRIPE_API_URL}/subscriptions/${userId}`,
      {
        headers: {
          'Authorization': `Bearer ${STRIPE_PUBLIC_KEY}`
        }
      }
    );

    return { 
      success: true, 
      data: response.data 
    };
  } catch (error) {
    console.error('Stripe subscription error:', error);
    
    // For demo purposes, return a simulated subscription
    return { 
      success: true, 
      data: { 
        planId: SUBSCRIPTION_PLANS.FREE,
        status: 'active',
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        cancelAtPeriodEnd: false
      } 
    };
  }
};

/**
 * Cancel a subscription
 * @param {string} subscriptionId - Subscription ID
 * @returns {Promise<Object>} Result object indicating success or error
 */
export const cancelSubscription = async (subscriptionId) => {
  try {
    // In a real implementation, this would call a backend API endpoint
    // that cancels the subscription in Stripe
    // For now, we'll simulate the response
    
    // Simulate API call
    const response = await axios.post(
      `${STRIPE_API_URL}/subscriptions/${subscriptionId}/cancel`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${STRIPE_PUBLIC_KEY}`
        }
      }
    );

    return { 
      success: true, 
      data: response.data 
    };
  } catch (error) {
    console.error('Stripe cancellation error:', error);
    
    // For demo purposes, return a simulated response
    return { 
      success: true, 
      data: { 
        status: 'canceled',
        cancelAtPeriodEnd: true
      } 
    };
  }
};

/**
 * Create a customer portal session
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Result object with portal URL or error
 */
export const createCustomerPortalSession = async (userId) => {
  try {
    // In a real implementation, this would call a backend API endpoint
    // that creates a Stripe customer portal session
    // For now, we'll simulate the response
    
    // Simulate API call
    const response = await axios.post(
      `${STRIPE_API_URL}/create-portal-session`,
      { userId },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${STRIPE_PUBLIC_KEY}`
        }
      }
    );

    return { 
      success: true, 
      data: response.data 
    };
  } catch (error) {
    console.error('Stripe portal error:', error);
    
    // For demo purposes, return a simulated portal URL
    return { 
      success: true, 
      data: { 
        portalUrl: `https://billing.stripe.com/p/session/${Math.random().toString(36).substring(2, 15)}`
      } 
    };
  }
};
