/**
 * Stripe Payment Service
 * EduNexus - Indian College ERP & Portal
 * 
 * Features:
 * - Subscription-based fee payments
 * - One-time payments
 * - Currency conversion with live rates
 * - International payment support
 * - Payment history & receipts
 */

import { db, generateId, formatCurrency, PaymentTransaction, Subscription } from './firebase';
import { currencyService, ConvertedAmount } from './currencyService';

// Stripe Configuration (Mock for frontend demo)
export const STRIPE_CONFIG = {
  publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_demo_key',
  webhookSecret: import.meta.env.VITE_STRIPE_WEBHOOK_SECRET || 'whsec_demo'
};

// Subscription Plans for Indian Private Colleges
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  degreeType: string;
  duration: string;
  features: string[];
  priceINR: number;
  priceUSD: number;
  priceEUR: number;
  priceGBP: number;
  billingCycles: BillingCycle[];
  isPopular?: boolean;
}

export interface BillingCycle {
  type: 'MONTHLY' | 'QUARTERLY' | 'SEMI_ANNUAL' | 'ANNUAL';
  label: string;
  multiplier: number;
  discount: number; // percentage discount
  totalAmount: number;
  perMonthAmount: number;
}

// Comprehensive subscription plans for various degree programs
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  // B.Tech Plans
  {
    id: 'plan-btech-standard',
    name: 'B.Tech Standard',
    description: 'Complete Bachelor of Technology program',
    degreeType: 'B.Tech',
    duration: '4 Years',
    features: [
      'Full curriculum access',
      'Library & Lab facilities',
      'Online learning portal',
      'Industry workshops',
      'Campus placement support',
      'Career counseling'
    ],
    priceINR: 175000,
    priceUSD: 2100,
    priceEUR: 1950,
    priceGBP: 1680,
    billingCycles: [
      { type: 'MONTHLY', label: 'Monthly', multiplier: 1, discount: 0, totalAmount: 14583, perMonthAmount: 14583 },
      { type: 'QUARTERLY', label: 'Quarterly', multiplier: 3, discount: 5, totalAmount: 41562, perMonthAmount: 13854 },
      { type: 'SEMI_ANNUAL', label: '6 Months', multiplier: 6, discount: 10, totalAmount: 78750, perMonthAmount: 13125 },
      { type: 'ANNUAL', label: 'Yearly', multiplier: 12, discount: 15, totalAmount: 148750, perMonthAmount: 12396 }
    ],
    isPopular: true
  },
  {
    id: 'plan-btech-premium',
    name: 'B.Tech Premium (AI/ML)',
    description: 'Specialized B.Tech in AI/ML with advanced facilities',
    degreeType: 'B.Tech AI/ML',
    duration: '4 Years',
    features: [
      'All Standard features',
      'GPU Computing Lab access',
      'Industry certifications (AWS, Google)',
      'Internship guarantee',
      'Research project funding',
      'International conference participation',
      'Premium placement support'
    ],
    priceINR: 225000,
    priceUSD: 2700,
    priceEUR: 2500,
    priceGBP: 2150,
    billingCycles: [
      { type: 'MONTHLY', label: 'Monthly', multiplier: 1, discount: 0, totalAmount: 18750, perMonthAmount: 18750 },
      { type: 'QUARTERLY', label: 'Quarterly', multiplier: 3, discount: 5, totalAmount: 53437, perMonthAmount: 17812 },
      { type: 'SEMI_ANNUAL', label: '6 Months', multiplier: 6, discount: 10, totalAmount: 101250, perMonthAmount: 16875 },
      { type: 'ANNUAL', label: 'Yearly', multiplier: 12, discount: 15, totalAmount: 191250, perMonthAmount: 15937 }
    ]
  },
  // M.Tech Plans
  {
    id: 'plan-mtech-standard',
    name: 'M.Tech Standard',
    description: 'Master of Technology program',
    degreeType: 'M.Tech',
    duration: '2 Years',
    features: [
      'Advanced curriculum',
      'Research facilities',
      'Teaching assistantship opportunity',
      'Industry collaboration projects',
      'Publication support',
      'Placement assistance'
    ],
    priceINR: 145000,
    priceUSD: 1750,
    priceEUR: 1620,
    priceGBP: 1400,
    billingCycles: [
      { type: 'MONTHLY', label: 'Monthly', multiplier: 1, discount: 0, totalAmount: 12083, perMonthAmount: 12083 },
      { type: 'QUARTERLY', label: 'Quarterly', multiplier: 3, discount: 5, totalAmount: 34437, perMonthAmount: 11479 },
      { type: 'SEMI_ANNUAL', label: '6 Months', multiplier: 6, discount: 10, totalAmount: 65250, perMonthAmount: 10875 },
      { type: 'ANNUAL', label: 'Yearly', multiplier: 12, discount: 15, totalAmount: 123250, perMonthAmount: 10271 }
    ]
  },
  // MBA Plans
  {
    id: 'plan-mba-standard',
    name: 'MBA Standard',
    description: 'Master of Business Administration',
    degreeType: 'MBA',
    duration: '2 Years',
    features: [
      'Dual specialization',
      'Industry internship',
      'Case study methodology',
      'Guest lectures from CXOs',
      'Business simulations',
      'Global exchange program eligibility',
      'Premium placements'
    ],
    priceINR: 285000,
    priceUSD: 3400,
    priceEUR: 3150,
    priceGBP: 2720,
    billingCycles: [
      { type: 'MONTHLY', label: 'Monthly', multiplier: 1, discount: 0, totalAmount: 23750, perMonthAmount: 23750 },
      { type: 'QUARTERLY', label: 'Quarterly', multiplier: 3, discount: 5, totalAmount: 67687, perMonthAmount: 22562 },
      { type: 'SEMI_ANNUAL', label: '6 Months', multiplier: 6, discount: 10, totalAmount: 128250, perMonthAmount: 21375 },
      { type: 'ANNUAL', label: 'Yearly', multiplier: 12, discount: 15, totalAmount: 242250, perMonthAmount: 20187 }
    ],
    isPopular: true
  },
  {
    id: 'plan-mba-executive',
    name: 'Executive MBA',
    description: 'Weekend MBA for working professionals',
    degreeType: 'Executive MBA',
    duration: '2 Years',
    features: [
      'Weekend classes only',
      'Executive networking events',
      'Leadership development program',
      'International study tour',
      'CXO mentorship',
      'Flexible scheduling'
    ],
    priceINR: 345000,
    priceUSD: 4150,
    priceEUR: 3840,
    priceGBP: 3300,
    billingCycles: [
      { type: 'MONTHLY', label: 'Monthly', multiplier: 1, discount: 0, totalAmount: 28750, perMonthAmount: 28750 },
      { type: 'QUARTERLY', label: 'Quarterly', multiplier: 3, discount: 5, totalAmount: 81937, perMonthAmount: 27312 },
      { type: 'SEMI_ANNUAL', label: '6 Months', multiplier: 6, discount: 10, totalAmount: 155250, perMonthAmount: 25875 },
      { type: 'ANNUAL', label: 'Yearly', multiplier: 12, discount: 15, totalAmount: 293250, perMonthAmount: 24437 }
    ]
  },
  // BCA/MCA Plans
  {
    id: 'plan-bca',
    name: 'BCA Standard',
    description: 'Bachelor of Computer Applications',
    degreeType: 'BCA',
    duration: '3 Years',
    features: [
      'Programming fundamentals',
      'Software development training',
      'Industry certifications',
      'Project-based learning',
      'Internship support',
      'Placement assistance'
    ],
    priceINR: 85000,
    priceUSD: 1020,
    priceEUR: 945,
    priceGBP: 815,
    billingCycles: [
      { type: 'MONTHLY', label: 'Monthly', multiplier: 1, discount: 0, totalAmount: 7083, perMonthAmount: 7083 },
      { type: 'QUARTERLY', label: 'Quarterly', multiplier: 3, discount: 5, totalAmount: 20187, perMonthAmount: 6729 },
      { type: 'SEMI_ANNUAL', label: '6 Months', multiplier: 6, discount: 10, totalAmount: 38250, perMonthAmount: 6375 },
      { type: 'ANNUAL', label: 'Yearly', multiplier: 12, discount: 15, totalAmount: 72250, perMonthAmount: 6021 }
    ]
  },
  {
    id: 'plan-mca',
    name: 'MCA Standard',
    description: 'Master of Computer Applications',
    degreeType: 'MCA',
    duration: '2 Years',
    features: [
      'Advanced programming',
      'Full-stack development',
      'Cloud computing',
      'Industry projects',
      'Certifications included',
      'Guaranteed interviews'
    ],
    priceINR: 125000,
    priceUSD: 1500,
    priceEUR: 1390,
    priceGBP: 1200,
    billingCycles: [
      { type: 'MONTHLY', label: 'Monthly', multiplier: 1, discount: 0, totalAmount: 10416, perMonthAmount: 10416 },
      { type: 'QUARTERLY', label: 'Quarterly', multiplier: 3, discount: 5, totalAmount: 29687, perMonthAmount: 9896 },
      { type: 'SEMI_ANNUAL', label: '6 Months', multiplier: 6, discount: 10, totalAmount: 56250, perMonthAmount: 9375 },
      { type: 'ANNUAL', label: 'Yearly', multiplier: 12, discount: 15, totalAmount: 106250, perMonthAmount: 8854 }
    ]
  },
  // Diploma Plans
  {
    id: 'plan-diploma',
    name: 'Diploma in Engineering',
    description: '3-Year Diploma program',
    degreeType: 'Diploma',
    duration: '3 Years',
    features: [
      'Practical training',
      'Workshop experience',
      'Industry visits',
      'Apprenticeship opportunity',
      'Direct entry to B.Tech possible'
    ],
    priceINR: 45000,
    priceUSD: 540,
    priceEUR: 500,
    priceGBP: 430,
    billingCycles: [
      { type: 'MONTHLY', label: 'Monthly', multiplier: 1, discount: 0, totalAmount: 3750, perMonthAmount: 3750 },
      { type: 'QUARTERLY', label: 'Quarterly', multiplier: 3, discount: 5, totalAmount: 10687, perMonthAmount: 3562 },
      { type: 'SEMI_ANNUAL', label: '6 Months', multiplier: 6, discount: 10, totalAmount: 20250, perMonthAmount: 3375 },
      { type: 'ANNUAL', label: 'Yearly', multiplier: 12, discount: 15, totalAmount: 38250, perMonthAmount: 3187 }
    ]
  },
  // PhD Plans
  {
    id: 'plan-phd',
    name: 'Ph.D. Research',
    description: 'Doctoral research program',
    degreeType: 'Ph.D.',
    duration: '3-5 Years',
    features: [
      'Research fellowship',
      'Publication support',
      'Conference funding',
      'Teaching opportunity',
      'Industry collaboration',
      'Patent support'
    ],
    priceINR: 95000,
    priceUSD: 1140,
    priceEUR: 1055,
    priceGBP: 910,
    billingCycles: [
      { type: 'MONTHLY', label: 'Monthly', multiplier: 1, discount: 0, totalAmount: 7916, perMonthAmount: 7916 },
      { type: 'QUARTERLY', label: 'Quarterly', multiplier: 3, discount: 5, totalAmount: 22562, perMonthAmount: 7521 },
      { type: 'SEMI_ANNUAL', label: '6 Months', multiplier: 6, discount: 10, totalAmount: 42750, perMonthAmount: 7125 },
      { type: 'ANNUAL', label: 'Yearly', multiplier: 12, discount: 15, totalAmount: 80750, perMonthAmount: 6729 }
    ]
  }
];

// Payment Methods
export interface PaymentMethod {
  id: string;
  type: 'CARD' | 'UPI' | 'NETBANKING' | 'WALLET';
  name: string;
  icon: string;
  isAvailable: boolean;
  supportedCurrencies: string[];
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'card', type: 'CARD', name: 'Credit/Debit Card', icon: '💳', isAvailable: true, supportedCurrencies: ['INR', 'USD', 'EUR', 'GBP', 'AUD', 'CAD', 'SGD', 'AED'] },
  { id: 'upi', type: 'UPI', name: 'UPI', icon: '📱', isAvailable: true, supportedCurrencies: ['INR'] },
  { id: 'netbanking', type: 'NETBANKING', name: 'Net Banking', icon: '🏦', isAvailable: true, supportedCurrencies: ['INR'] },
  { id: 'wallet', type: 'WALLET', name: 'Wallets (Paytm/PhonePe)', icon: '👛', isAvailable: true, supportedCurrencies: ['INR'] }
];

// ============================================
// STRIPE PAYMENT SERVICE
// ============================================

class StripePaymentService {
  private sessionStorage: Map<string, any> = new Map();

  /**
   * Create a checkout session for one-time payment
   */
  async createCheckoutSession(params: {
    studentId: string;
    amount: number;
    currency: string;
    description: string;
    metadata?: Record<string, string>;
    successUrl?: string;
    cancelUrl?: string;
  }): Promise<{ sessionId: string; sessionUrl: string }> {
    await this.simulateApiCall();

    const sessionId = `cs_${generateId()}`;
    
    // Convert to INR if needed
    let finalAmount = params.amount;
    let exchangeRate = 1;
    let originalAmount = params.amount;
    let originalCurrency = params.currency;

    if (params.currency !== 'INR') {
      const converted = await currencyService.convertToINR(params.amount, params.currency);
      finalAmount = converted.amountInINR;
      exchangeRate = converted.exchangeRate;
    }

    const session = {
      id: sessionId,
      ...params,
      finalAmountINR: finalAmount,
      exchangeRate,
      originalAmount,
      originalCurrency,
      status: 'open',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutes
    };

    this.sessionStorage.set(sessionId, session);

    return {
      sessionId,
      sessionUrl: `https://checkout.stripe.com/pay/${sessionId}#demo`
    };
  }

  /**
   * Create subscription for recurring payments
   */
  async createSubscription(params: {
    studentId: string;
    planId: string;
    billingCycle: 'MONTHLY' | 'QUARTERLY' | 'SEMI_ANNUAL' | 'ANNUAL';
    currency: string;
    paymentMethodId: string;
  }): Promise<{ subscriptionId: string; subscription: Subscription }> {
    await this.simulateApiCall();

    const plan = SUBSCRIPTION_PLANS.find(p => p.id === params.planId);
    if (!plan) {
      throw new Error('Invalid plan ID');
    }

    const cycle = plan.billingCycles.find(c => c.type === params.billingCycle);
    if (!cycle) {
      throw new Error('Invalid billing cycle');
    }

    // Get amount in requested currency
    let amount = cycle.totalAmount;
    if (params.currency !== 'INR') {
      const converted = await currencyService.convertFromINR(amount, params.currency);
      amount = converted.amount;
    }

    const subscriptionId = `sub_${generateId()}`;
    const now = new Date();
    const periodEnd = this.calculatePeriodEnd(now, params.billingCycle);

    const subscription: Subscription = {
      id: subscriptionId,
      studentId: params.studentId,
      courseId: plan.id,
      planId: params.planId,
      stripeSubscriptionId: subscriptionId,
      stripeCustomerId: `cus_${params.studentId}`,
      status: 'ACTIVE',
      currentPeriodStart: now.toISOString(),
      currentPeriodEnd: periodEnd.toISOString(),
      billingCycle: params.billingCycle,
      amountPerCycle: amount,
      currency: params.currency,
      totalPaid: 0,
      totalDue: amount,
      autoRenew: true,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };

    // Save to database
    await db.setDocument('subscriptions', subscriptionId, subscription);

    return { subscriptionId, subscription };
  }

  /**
   * Process payment (simulate Stripe payment)
   */
  async processPayment(params: {
    studentId: string;
    sessionId?: string;
    subscriptionId?: string;
    amount: number;
    currency: string;
    paymentMethod: PaymentMethod['type'];
    description: string;
  }): Promise<PaymentTransaction> {
    await this.simulateApiCall(1500); // Simulate payment processing time

    // Simulate success/failure (95% success rate for demo)
    const isSuccess = Math.random() < 0.95;

    // Convert currency if needed
    let amountINR = params.amount;
    let exchangeRate = 1;
    
    if (params.currency !== 'INR') {
      const converted = await currencyService.convertToINR(params.amount, params.currency);
      amountINR = converted.amountInINR;
      exchangeRate = converted.exchangeRate;
    }

    const transactionId = `txn_${generateId()}`;
    const receiptNumber = `RCP-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const transaction: PaymentTransaction = {
      id: transactionId,
      transactionId: `pi_${generateId()}`,
      studentId: params.studentId,
      feeStructureId: params.sessionId || '',
      amount: amountINR,
      currency: 'INR',
      originalAmount: params.currency !== 'INR' ? params.amount : undefined,
      originalCurrency: params.currency !== 'INR' ? params.currency : undefined,
      exchangeRate: params.currency !== 'INR' ? exchangeRate : undefined,
      paymentMethod: params.paymentMethod === 'CARD' ? 'STRIPE' : params.paymentMethod,
      stripePaymentId: `pi_${generateId()}`,
      stripeSessionId: params.sessionId,
      status: isSuccess ? 'SUCCESS' : 'FAILED',
      description: params.description,
      receiptNumber: isSuccess ? receiptNumber : undefined,
      receiptUrl: isSuccess ? `https://receipts.edunexus.ac.in/${receiptNumber}` : undefined,
      paidAt: isSuccess ? new Date().toISOString() : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save transaction
    await db.setDocument('payments', transactionId, transaction);

    // Update subscription if applicable
    if (params.subscriptionId && isSuccess) {
      await db.updateDocument('subscriptions', params.subscriptionId, {
        totalPaid: amountINR,
        totalDue: 0,
        status: 'ACTIVE'
      });
    }

    if (!isSuccess) {
      throw new Error('Payment failed. Please try again or use a different payment method.');
    }

    return transaction;
  }

  /**
   * Get payment history for a student
   */
  async getPaymentHistory(studentId: string): Promise<PaymentTransaction[]> {
    const payments = await db.query<PaymentTransaction>('payments', 'studentId', '==', studentId);
    return payments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * Get active subscriptions for a student
   */
  async getSubscriptions(studentId: string): Promise<Subscription[]> {
    return db.query<Subscription>('subscriptions', 'studentId', '==', studentId);
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(subscriptionId: string): Promise<void> {
    await db.updateDocument('subscriptions', subscriptionId, {
      status: 'CANCELLED',
      autoRenew: false,
      updatedAt: new Date().toISOString()
    });
  }

  /**
   * Generate payment receipt
   */
  async generateReceipt(transactionId: string): Promise<PaymentReceipt> {
    const transaction = await db.getDocument<PaymentTransaction>('payments', transactionId);
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    return {
      receiptNumber: transaction.receiptNumber || '',
      transactionId: transaction.transactionId,
      studentId: transaction.studentId,
      date: transaction.paidAt || transaction.createdAt,
      amount: transaction.amount,
      currency: transaction.currency,
      originalAmount: transaction.originalAmount,
      originalCurrency: transaction.originalCurrency,
      exchangeRate: transaction.exchangeRate,
      paymentMethod: transaction.paymentMethod,
      description: transaction.description,
      status: transaction.status,
      instituteName: 'EduNexus Institute of Technology',
      instituteAddress: 'Knowledge Park III, Greater Noida, UP - 201306',
      instituteGSTIN: '09AABCU9603R1ZM',
      institutePAN: 'AABCU9603R'
    };
  }

  /**
   * Get pricing in user's currency
   */
  async getPlanPricing(planId: string, currency: string): Promise<{
    plan: SubscriptionPlan;
    convertedPrices: {
      annual: ConvertedAmount;
      perMonth: ConvertedAmount;
    };
    billingCycles: {
      type: string;
      label: string;
      amount: ConvertedAmount;
      perMonth: ConvertedAmount;
      discount: number;
    }[];
  }> {
    const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
    if (!plan) {
      throw new Error('Plan not found');
    }

    const convertedPrices = {
      annual: await currencyService.convertFromINR(plan.priceINR, currency),
      perMonth: await currencyService.convertFromINR(Math.round(plan.priceINR / 12), currency)
    };

    const billingCycles = await Promise.all(
      plan.billingCycles.map(async (cycle) => ({
        type: cycle.type,
        label: cycle.label,
        amount: await currencyService.convertFromINR(cycle.totalAmount, currency),
        perMonth: await currencyService.convertFromINR(cycle.perMonthAmount, currency),
        discount: cycle.discount
      }))
    );

    return { plan, convertedPrices, billingCycles };
  }

  private calculatePeriodEnd(startDate: Date, billingCycle: string): Date {
    const endDate = new Date(startDate);
    switch (billingCycle) {
      case 'MONTHLY':
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case 'QUARTERLY':
        endDate.setMonth(endDate.getMonth() + 3);
        break;
      case 'SEMI_ANNUAL':
        endDate.setMonth(endDate.getMonth() + 6);
        break;
      case 'ANNUAL':
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
    }
    return endDate;
  }

  private async simulateApiCall(delay: number = 500): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, delay + Math.random() * 300));
  }
}

// Payment Receipt interface
export interface PaymentReceipt {
  receiptNumber: string;
  transactionId: string;
  studentId: string;
  date: string;
  amount: number;
  currency: string;
  originalAmount?: number;
  originalCurrency?: string;
  exchangeRate?: number;
  paymentMethod: string;
  description: string;
  status: string;
  instituteName: string;
  instituteAddress: string;
  instituteGSTIN: string;
  institutePAN: string;
}

// Export singleton instance
export const stripeService = new StripePaymentService();

// Helper function to get plan by course
export const getPlanByCourse = (courseCode: string): SubscriptionPlan | undefined => {
  const normalizedCode = courseCode.toLowerCase();
  return SUBSCRIPTION_PLANS.find(plan => 
    plan.degreeType.toLowerCase().includes(normalizedCode) ||
    plan.id.toLowerCase().includes(normalizedCode)
  );
};

// Helper to format billing cycle display
export const formatBillingCycle = (cycle: BillingCycle, currency: string): string => {
  if (currency === 'INR') {
    return `₹${cycle.totalAmount.toLocaleString('en-IN')} / ${cycle.label}`;
  }
  return formatCurrency(cycle.totalAmount, currency) + ` / ${cycle.label}`;
};
