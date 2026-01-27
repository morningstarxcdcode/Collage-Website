import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Globe, 
  ChevronDown, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  ArrowRight, 
  Shield, 
  Clock, 
  Download, 
  RefreshCw,
  Receipt,
  Calendar,
  BadgeIndianRupee,
  Banknote,
  Percent,
  Building2,
  FileText,
  X
} from 'lucide-react';
import { 
  SUBSCRIPTION_PLANS, 
  SubscriptionPlan, 
  BillingCycle, 
  PAYMENT_METHODS, 
  stripeService,
  PaymentReceipt
} from '../services/stripeService';
import { 
  currencyService, 
  SUPPORTED_CURRENCIES, 
  CurrencyInfo, 
  ConversionBreakdown 
} from '../services/currencyService';

interface PaymentPageProps {
  studentId: string;
  studentName: string;
  courseId?: string;
  onClose?: () => void;
  onPaymentSuccess?: (transactionId: string) => void;
}

type PaymentStep = 'SELECT_PLAN' | 'CURRENCY' | 'PAYMENT' | 'PROCESSING' | 'SUCCESS' | 'FAILED';

const PaymentPage: React.FC<PaymentPageProps> = ({
  studentId,
  studentName,
  courseId,
  onClose,
  onPaymentSuccess
}) => {
  // State
  const [step, setStep] = useState<PaymentStep>('SELECT_PLAN');
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [selectedCycle, setSelectedCycle] = useState<BillingCycle | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('INR');
  const [conversionBreakdown, setConversionBreakdown] = useState<ConversionBreakdown | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('card');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<PaymentReceipt | null>(null);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [currencySearch, setCurrencySearch] = useState('');

  // Auto-detect user's currency
  useEffect(() => {
    const detectedCurrency = currencyService.detectUserCurrency();
    setSelectedCurrency(detectedCurrency);
  }, []);

  // Update conversion when currency or plan changes
  useEffect(() => {
    const updateConversion = async () => {
      if (selectedCycle && selectedCurrency !== 'INR') {
        const breakdown = await currencyService.getConversionBreakdown(
          selectedCycle.totalAmount,
          'INR',
          selectedCurrency,
          true
        );
        setConversionBreakdown(breakdown);
      } else {
        setConversionBreakdown(null);
      }
    };
    updateConversion();
  }, [selectedCycle, selectedCurrency]);

  // Filter currencies based on search
  const filteredCurrencies = SUPPORTED_CURRENCIES.filter(currency =>
    currency.name.toLowerCase().includes(currencySearch.toLowerCase()) ||
    currency.code.toLowerCase().includes(currencySearch.toLowerCase()) ||
    currency.country.toLowerCase().includes(currencySearch.toLowerCase())
  );

  // Get current currency info
  const currentCurrencyInfo = currencyService.getCurrencyInfo(selectedCurrency);

  // Calculate display amounts
  const getDisplayAmount = (): { amount: number; formatted: string } => {
    if (!selectedCycle) return { amount: 0, formatted: '₹0' };
    
    if (selectedCurrency === 'INR') {
      return {
        amount: selectedCycle.totalAmount,
        formatted: currencyService.formatAmount(selectedCycle.totalAmount, 'INR')
      };
    }
    
    if (conversionBreakdown) {
      return {
        amount: conversionBreakdown.totalAmount,
        formatted: currencyService.formatAmount(conversionBreakdown.totalAmount, selectedCurrency)
      };
    }
    
    return { amount: selectedCycle.totalAmount, formatted: currencyService.formatAmount(selectedCycle.totalAmount, 'INR') };
  };

  // Handle plan selection
  const handlePlanSelect = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setSelectedCycle(plan.billingCycles.find(c => c.type === 'ANNUAL') || plan.billingCycles[0]);
  };

  // Handle payment submission
  const handlePayment = async () => {
    if (!selectedPlan || !selectedCycle) return;

    setIsLoading(true);
    setError(null);
    setStep('PROCESSING');

    try {
      const displayAmount = getDisplayAmount();
      
      const transaction = await stripeService.processPayment({
        studentId,
        amount: displayAmount.amount,
        currency: selectedCurrency,
        paymentMethod: selectedPaymentMethod.toUpperCase() as any,
        description: `${selectedPlan.name} - ${selectedCycle.label} Payment`
      });

      if (transaction.status === 'SUCCESS') {
        const receiptData = await stripeService.generateReceipt(transaction.id);
        setReceipt(receiptData);
        setStep('SUCCESS');
        onPaymentSuccess?.(transaction.id);
      } else {
        throw new Error('Payment failed');
      }
    } catch (err: any) {
      setError(err.message || 'Payment failed. Please try again.');
      setStep('FAILED');
    } finally {
      setIsLoading(false);
    }
  };

  // Render Plan Selection
  const renderPlanSelection = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Choose Your Plan</h2>
        <p className="text-slate-600 mt-2">Select a program that matches your academic goals</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SUBSCRIPTION_PLANS.slice(0, 6).map((plan) => (
          <div
            key={plan.id}
            onClick={() => handlePlanSelect(plan)}
            className={`relative bg-white border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-xl ${
              selectedPlan?.id === plan.id
                ? 'border-blue-600 shadow-lg shadow-blue-100'
                : 'border-slate-200 hover:border-blue-300'
            }`}
          >
            {plan.isPopular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                  MOST POPULAR
                </span>
              </div>
            )}

            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
              <p className="text-sm text-slate-500 mt-1">{plan.duration}</p>
            </div>

            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-blue-600">
                {currencyService.formatAmount(plan.priceINR, 'INR')}
              </div>
              <p className="text-sm text-slate-500">per year</p>
            </div>

            <ul className="space-y-3 mb-6">
              {plan.features.slice(0, 4).map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
              {plan.features.length > 4 && (
                <li className="text-sm text-blue-600 font-medium">
                  +{plan.features.length - 4} more features
                </li>
              )}
            </ul>

            <button
              className={`w-full py-3 rounded-xl font-semibold transition-all ${
                selectedPlan?.id === plan.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {selectedPlan?.id === plan.id ? 'Selected' : 'Select Plan'}
            </button>
          </div>
        ))}
      </div>

      {selectedPlan && (
        <div className="mt-8 bg-slate-50 rounded-2xl p-6 border border-slate-200">
          <h3 className="font-bold text-slate-900 mb-4">Select Billing Cycle</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {selectedPlan.billingCycles.map((cycle) => (
              <button
                key={cycle.type}
                onClick={() => setSelectedCycle(cycle)}
                className={`relative p-4 rounded-xl border-2 transition-all ${
                  selectedCycle?.type === cycle.type
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-slate-200 hover:border-blue-300'
                }`}
              >
                {cycle.discount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    -{cycle.discount}%
                  </span>
                )}
                <div className="text-sm font-medium text-slate-900">{cycle.label}</div>
                <div className="text-lg font-bold text-blue-600 mt-1">
                  {currencyService.formatAmount(cycle.totalAmount, 'INR')}
                </div>
                <div className="text-xs text-slate-500">
                  {currencyService.formatAmount(cycle.perMonthAmount, 'INR')}/mo
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedPlan && selectedCycle && (
        <div className="flex justify-end mt-6">
          <button
            onClick={() => setStep('CURRENCY')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg shadow-blue-200"
          >
            Continue <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );

  // Render Currency Selection
  const renderCurrencySelection = () => (
    <div className="max-w-2xl mx-auto space-y-6">
      <button
        onClick={() => setStep('SELECT_PLAN')}
        className="text-slate-600 hover:text-slate-900 flex items-center gap-2 mb-4"
      >
        ← Back to Plans
      </button>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Payment Currency</h2>
        <p className="text-slate-600 mt-2">Select your preferred currency for payment</p>
      </div>

      {/* Currency Selector */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="relative">
          <button
            onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
            className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-300 transition-all"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{currentCurrencyInfo?.flag}</span>
              <div className="text-left">
                <div className="font-semibold text-slate-900">{currentCurrencyInfo?.code}</div>
                <div className="text-sm text-slate-500">{currentCurrencyInfo?.name}</div>
              </div>
            </div>
            <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${showCurrencyDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showCurrencyDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-80 overflow-hidden">
              <div className="p-3 border-b border-slate-100">
                <input
                  type="text"
                  placeholder="Search currency..."
                  value={currencySearch}
                  onChange={(e) => setCurrencySearch(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="overflow-y-auto max-h-60">
                {filteredCurrencies.map((currency) => (
                  <button
                    key={currency.code}
                    onClick={() => {
                      setSelectedCurrency(currency.code);
                      setShowCurrencyDropdown(false);
                      setCurrencySearch('');
                    }}
                    className={`w-full flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors ${
                      selectedCurrency === currency.code ? 'bg-blue-50' : ''
                    }`}
                  >
                    <span className="text-xl">{currency.flag}</span>
                    <div className="text-left flex-1">
                      <div className="font-medium text-slate-900">{currency.code}</div>
                      <div className="text-xs text-slate-500">{currency.name}</div>
                    </div>
                    {selectedCurrency === currency.code && (
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Conversion Details */}
      {conversionBreakdown && selectedCurrency !== 'INR' && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
          <div className="flex items-center gap-2 mb-4">
            <RefreshCw className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-slate-900">Currency Conversion</h3>
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Original Amount (INR)</span>
              <span className="font-medium">{currencyService.formatAmount(conversionBreakdown.originalAmount, 'INR')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Exchange Rate</span>
              <span className="font-medium">1 INR = {conversionBreakdown.exchangeRate.toFixed(6)} {selectedCurrency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Converted Amount</span>
              <span className="font-medium">{currencyService.formatAmount(conversionBreakdown.convertedAmount, selectedCurrency)}</span>
            </div>
            <div className="flex justify-between text-amber-600">
              <span>Service Fee ({conversionBreakdown.serviceFeePercent}%)</span>
              <span className="font-medium">{currencyService.formatAmount(conversionBreakdown.serviceFee, selectedCurrency)}</span>
            </div>
            <div className="border-t border-blue-200 pt-3 flex justify-between text-base font-bold">
              <span className="text-slate-900">Total Payable</span>
              <span className="text-blue-600">{currencyService.formatAmount(conversionBreakdown.totalAmount, selectedCurrency)}</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-4 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Rate updated: {new Date(conversionBreakdown.timestamp).toLocaleString()}
          </p>
        </div>
      )}

      {/* Amount Summary */}
      <div className="bg-slate-900 text-white rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm">Total Amount</p>
            <p className="text-3xl font-bold mt-1">{getDisplayAmount().formatted}</p>
            {selectedCurrency !== 'INR' && selectedCycle && (
              <p className="text-slate-400 text-sm mt-1">
                ≈ {currencyService.formatAmount(selectedCycle.totalAmount, 'INR')}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-sm">{selectedPlan?.name}</p>
            <p className="font-medium">{selectedCycle?.label}</p>
          </div>
        </div>
      </div>

      <button
        onClick={() => setStep('PAYMENT')}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
      >
        Continue to Payment <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );

  // Render Payment Form
  const renderPaymentForm = () => (
    <div className="max-w-2xl mx-auto space-y-6">
      <button
        onClick={() => setStep('CURRENCY')}
        className="text-slate-600 hover:text-slate-900 flex items-center gap-2 mb-4"
      >
        ← Back to Currency
      </button>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Payment Method</h2>
        <p className="text-slate-600 mt-2">Choose how you'd like to pay</p>
      </div>

      {/* Payment Methods */}
      <div className="grid grid-cols-2 gap-4">
        {PAYMENT_METHODS.filter(m => 
          selectedCurrency === 'INR' || m.supportedCurrencies.includes(selectedCurrency)
        ).map((method) => (
          <button
            key={method.id}
            onClick={() => setSelectedPaymentMethod(method.id)}
            disabled={!method.isAvailable}
            className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
              selectedPaymentMethod === method.id
                ? 'border-blue-600 bg-blue-50'
                : 'border-slate-200 hover:border-blue-300'
            } ${!method.isAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span className="text-2xl">{method.icon}</span>
            <div className="text-left">
              <div className="font-medium text-slate-900">{method.name}</div>
              {!method.isAvailable && (
                <div className="text-xs text-slate-500">Coming Soon</div>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Card Form (Mock) */}
      {selectedPaymentMethod === 'card' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Card Number</label>
            <div className="relative">
              <input
                type="text"
                placeholder="4242 4242 4242 4242"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 pr-12"
                maxLength={19}
              />
              <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Expiry Date</label>
              <input
                type="text"
                placeholder="MM/YY"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                maxLength={5}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">CVV</label>
              <input
                type="text"
                placeholder="123"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                maxLength={4}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Cardholder Name</label>
            <input
              type="text"
              placeholder="Name on card"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      )}

      {/* UPI Form */}
      {selectedPaymentMethod === 'upi' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">UPI ID</label>
          <input
            type="text"
            placeholder="yourname@upi"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
          />
          <p className="text-xs text-slate-500 mt-2">Enter your UPI ID (e.g., name@paytm, name@gpay)</p>
        </div>
      )}

      {/* Order Summary */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
        <h3 className="font-bold text-slate-900 mb-4">Order Summary</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600">Plan</span>
            <span className="font-medium">{selectedPlan?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Billing</span>
            <span className="font-medium">{selectedCycle?.label}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Student</span>
            <span className="font-medium">{studentName}</span>
          </div>
          {selectedCycle && selectedCycle.discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span className="font-medium">-{selectedCycle.discount}%</span>
            </div>
          )}
          <div className="border-t border-slate-200 pt-3 flex justify-between text-base font-bold">
            <span className="text-slate-900">Total</span>
            <span className="text-blue-600">{getDisplayAmount().formatted}</span>
          </div>
        </div>
      </div>

      {/* Security Badge */}
      <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
        <div className="flex items-center gap-1">
          <Shield className="w-4 h-4" />
          <span>256-bit SSL Encrypted</span>
        </div>
        <div className="flex items-center gap-1">
          <CheckCircle className="w-4 h-4" />
          <span>PCI DSS Compliant</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      <button
        onClick={handlePayment}
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            Pay {getDisplayAmount().formatted}
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>
    </div>
  );

  // Render Processing
  const renderProcessing = () => (
    <div className="max-w-md mx-auto text-center py-12">
      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Processing Payment</h2>
      <p className="text-slate-600">Please wait while we process your payment...</p>
      <p className="text-sm text-slate-500 mt-4">Do not close this window or press back.</p>
    </div>
  );

  // Render Success
  const renderSuccess = () => (
    <div className="max-w-lg mx-auto text-center py-8">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Payment Successful!</h2>
      <p className="text-slate-600 mb-8">Your payment has been processed successfully.</p>

      {receipt && (
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-left mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900">Payment Receipt</h3>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
              {receipt.status}
            </span>
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Receipt No.</span>
              <span className="font-mono font-medium">{receipt.receiptNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Transaction ID</span>
              <span className="font-mono text-xs">{receipt.transactionId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Date</span>
              <span className="font-medium">{new Date(receipt.date).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Amount Paid</span>
              <span className="font-bold text-green-600">{currencyService.formatAmount(receipt.amount, receipt.currency)}</span>
            </div>
            {receipt.originalAmount && receipt.originalCurrency !== receipt.currency && (
              <div className="flex justify-between text-slate-400">
                <span>Original Amount</span>
                <span>{currencyService.formatAmount(receipt.originalAmount, receipt.originalCurrency!)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-500">Payment Method</span>
              <span className="font-medium capitalize">{receipt.paymentMethod.toLowerCase()}</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200 text-xs text-slate-500">
            <p className="font-medium text-slate-700">{receipt.instituteName}</p>
            <p>{receipt.instituteAddress}</p>
            <p>GSTIN: {receipt.instituteGSTIN}</p>
          </div>
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={() => window.print()}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-all"
        >
          <Download className="w-5 h-5" />
          Download Receipt
        </button>
        <button
          onClick={onClose}
          className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all"
        >
          Done
        </button>
      </div>
    </div>
  );

  // Render Failed
  const renderFailed = () => (
    <div className="max-w-md mx-auto text-center py-12">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <AlertCircle className="w-10 h-10 text-red-600" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Payment Failed</h2>
      <p className="text-slate-600 mb-2">{error || 'Your payment could not be processed.'}</p>
      <p className="text-sm text-slate-500 mb-8">Please try again or use a different payment method.</p>

      <div className="flex gap-4">
        <button
          onClick={() => {
            setError(null);
            setStep('PAYMENT');
          }}
          className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all"
        >
          Try Again
        </button>
        <button
          onClick={onClose}
          className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-all"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
              EN
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">EduNexus Payment Portal</h1>
              <p className="text-sm text-slate-500">Secure payment processing</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6 text-slate-500" />
            </button>
          )}
        </div>

        {/* Progress Steps */}
        {step !== 'PROCESSING' && step !== 'SUCCESS' && step !== 'FAILED' && (
          <div className="flex items-center justify-center gap-4 mb-8">
            {['SELECT_PLAN', 'CURRENCY', 'PAYMENT'].map((s, idx) => (
              <React.Fragment key={s}>
                <div className={`flex items-center gap-2 ${
                  ['SELECT_PLAN', 'CURRENCY', 'PAYMENT'].indexOf(step) >= idx
                    ? 'text-blue-600'
                    : 'text-slate-400'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    ['SELECT_PLAN', 'CURRENCY', 'PAYMENT'].indexOf(step) >= idx
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}>
                    {idx + 1}
                  </div>
                  <span className="hidden sm:inline font-medium">
                    {s === 'SELECT_PLAN' ? 'Select Plan' : s === 'CURRENCY' ? 'Currency' : 'Payment'}
                  </span>
                </div>
                {idx < 2 && (
                  <div className={`w-16 h-0.5 ${
                    ['SELECT_PLAN', 'CURRENCY', 'PAYMENT'].indexOf(step) > idx
                      ? 'bg-blue-600'
                      : 'bg-slate-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
          {step === 'SELECT_PLAN' && renderPlanSelection()}
          {step === 'CURRENCY' && renderCurrencySelection()}
          {step === 'PAYMENT' && renderPaymentForm()}
          {step === 'PROCESSING' && renderProcessing()}
          {step === 'SUCCESS' && renderSuccess()}
          {step === 'FAILED' && renderFailed()}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-slate-500">
          <p>Payments powered by Stripe. Your data is secure and encrypted.</p>
          <p className="mt-1">
            Need help? Contact us at <a href="mailto:payments@edunexus.ac.in" className="text-blue-600 hover:underline">payments@edunexus.ac.in</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
