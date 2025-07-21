import { useState } from 'react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import PaymentModal from './PaymentModal'
import { CreditCard, Clock, Calendar } from 'lucide-react'
import UNLOCK_CONFIG from '../config/unlock'

interface PricingOption {
  id: string
  label: string
  price: number
  currency: string
  description: string
  lockAddress?: string
}

const pricingOptions: PricingOption[] = [
  {
    id: '10-min',
    label: UNLOCK_CONFIG.locks['10-min'].name,
    price: parseFloat(UNLOCK_CONFIG.locks['10-min'].priceEUR),
    currency: 'EUR',
    description: `10 minute session (${UNLOCK_CONFIG.locks['10-min'].price} EurC)`,
    lockAddress: UNLOCK_CONFIG.locks['10-min'].address
  },
  {
    id: 'booking-fee',
    label: UNLOCK_CONFIG.locks['booking-fee'].name,
    price: parseFloat(UNLOCK_CONFIG.locks['booking-fee'].priceEUR),
    currency: 'EUR',
    description: `Booking fee for appointment (${UNLOCK_CONFIG.locks['booking-fee'].price} EurC)`,
    lockAddress: UNLOCK_CONFIG.locks['booking-fee'].address
  },
  {
    id: 'custom',
    label: 'Custom amount',
    price: 0,
    currency: 'EUR',
    description: 'Enter your own amount in EurC'
  }
]

export default function ServicesMenu() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [selectedOption, setSelectedOption] = useState<PricingOption | null>(null)
  const [customAmount, setCustomAmount] = useState<string>('')
  const [showCustomInput, setShowCustomInput] = useState(false)

  const handlePaymentSuccess = (optionLabel: string) => {
    setSuccessMessage(`Payment for ${optionLabel} completed successfully!`)
    setSelectedOption(null)
    setCustomAmount('')
    setShowCustomInput(false)
    
    // Clear success message after 5 seconds
    setTimeout(() => {
      setSuccessMessage(null)
    }, 5000)
  }

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error)
    
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.showAlert(`Payment failed: ${error}`)
    } else {
      alert(`Payment failed: ${error}`)
    }
  }

  const handleOptionClick = (option: PricingOption) => {
    if (option.id === 'custom') {
      setShowCustomInput(true)
    } else {
      setSelectedOption(option)
    }
  }

  const handleCustomPayment = () => {
    const amount = parseFloat(customAmount) || 0
    if (amount <= 0) {
      const message = 'Please enter a valid amount.'
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.showAlert(message)
      } else {
        alert(message)
      }
      return
    }

    // Create a custom option for the modal
    const customOption: PricingOption = {
      id: 'custom',
      label: 'Custom Payment',
      price: amount,
      currency: 'EUR',
      description: `Custom payment of €${amount}`,
      lockAddress: UNLOCK_CONFIG.locks['10-min'].address // Use existing lock for custom amounts
    }

    setSelectedOption(customOption)
  }

  return (
    <section className="py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        {/* Success Message */}
        {successMessage && (
          <Card className="mb-6 bg-green-50 border-green-200">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center space-x-2 text-green-700">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-medium">{successMessage}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment Options */}
        <div className="space-y-4 mb-8">
          {pricingOptions.map((option) => (
            <Card key={option.id} className="border border-border hover:border-primary/50 transition-colors">
              <CardContent className="p-0">
                <Button
                  className="w-full h-auto p-6 text-left justify-start"
                  variant="ghost"
                  onClick={() => handleOptionClick(option)}
                >
                  <div className="flex items-center space-x-4 w-full">
                    <div className="flex-shrink-0">
                      {option.id === '10-min' && <Clock className="w-8 h-8 text-primary" />}
                      {option.id === 'booking-fee' && <Calendar className="w-8 h-8 text-primary" />}
                      {option.id === 'custom' && <CreditCard className="w-8 h-8 text-primary" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">{option.label}</h3>
                        {option.price > 0 && (
                          <span className="text-2xl font-bold text-primary">€{option.price}</span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
                    </div>
                  </div>
                </Button>
              </CardContent>
            </Card>
          ))}

          {/* Custom Amount Input */}
          {showCustomInput && (
            <Card className="border-primary/50">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Enter Custom Amount</h3>
                <div className="flex space-x-3">
                  <input
                    type="number"
                    placeholder="Amount in EUR"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="flex-1 px-4 py-3 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    min="1"
                    step="1"
                    autoFocus
                  />
                  <Button onClick={handleCustomPayment} disabled={!customAmount || parseFloat(customAmount) <= 0}>
                    Continue
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Amount will be converted 1:1 to EurC and sent to the Taho wallet
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowCustomInput(false)
                    setCustomAmount('')
                  }}
                  className="mt-3"
                >
                  Cancel
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Payment Modal */}
        {selectedOption && (
          <PaymentModal
            isOpen={!!selectedOption}
            onClose={() => setSelectedOption(null)}
            lockAddress={selectedOption.lockAddress!}
            lockName={selectedOption.label}
            price={selectedOption.price.toString()}
            customAmount={selectedOption.id === 'custom' ? customAmount : undefined}
            onSuccess={() => handlePaymentSuccess(selectedOption.label)}
            onError={handlePaymentError}
          />
        )}

        {/* Payment Info */}
        <Card className="bg-card border border-border mb-6">
          <CardContent className="p-6 text-center">
            <h3 className="font-semibold text-foreground mb-2">EurC Payments</h3>
            <p className="text-sm text-muted-foreground mb-4">
              All payments are processed in EurC (Euro Coin) and sent directly to the secure Taho wallet address. 1 EurC = 1 EUR.
            </p>
            <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground mb-3">
              <span>⚡ Ethereum Network</span>
              <span>🔐 Taho Wallet</span>
              <span>💰 EurC Payments</span>
            </div>
            <div className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
              <p className="font-mono">Recipient: 0xfda02035c04ab66769aedabcbeb3b26654e0d787</p>
            </div>
          </CardContent>
        </Card>

        {/* Secure Payment Info */}
        <Card className="bg-card border border-border">
          <CardContent className="p-6 text-center">
            <h3 className="font-semibold text-foreground mb-2">How EurC Payments Work</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">1</span>
                <p className="text-left">Click on a payment option to initiate EurC payment process</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">2</span>
                <p className="text-left">Connect your Ethereum wallet (MetaMask, Taho, WalletConnect, etc.)</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">3</span>
                <p className="text-left">Confirm the EurC transaction - funds go directly to the Taho wallet</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">4</span>
                <p className="text-left">After confirmation, you'll receive access and instructions via Telegram</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}