import { useState } from 'react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import SimplePayment, { CustomPayment } from './SimplePayment'
import { CreditCard, Clock, Calendar } from 'lucide-react'
import PAYMENT_CONFIG from '../config/payment'

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
    label: PAYMENT_CONFIG.services['10-min'].name,
    price: parseFloat(PAYMENT_CONFIG.services['10-min'].priceEUR),
    currency: 'EUR',
    description: `10 minute session (${PAYMENT_CONFIG.services['10-min'].price} EurC)`,
    lockAddress: '10-min'
  },
  {
    id: 'booking-fee',
    label: PAYMENT_CONFIG.services['booking-fee'].name,
    price: parseFloat(PAYMENT_CONFIG.services['booking-fee'].priceEUR),
    currency: 'EUR',
    description: `Booking fee for appointment (${PAYMENT_CONFIG.services['booking-fee'].price} EurC)`,
    lockAddress: 'booking-fee'
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
  const [showCustomPayment, setShowCustomPayment] = useState(false)

  const handlePaymentSuccess = (optionLabel: string) => {
    setSuccessMessage(`Payment for ${optionLabel} completed successfully!`)
    setSelectedOption(null)
    setShowCustomPayment(false)
    
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
      setShowCustomPayment(true)
    } else {
      setSelectedOption(option)
    }
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

        </div>

        {/* Payment Components */}
        {selectedOption && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-center">{selectedOption.label}</h3>
            <SimplePayment
              serviceId={selectedOption.lockAddress!}
              onSuccess={() => handlePaymentSuccess(selectedOption.label)}
              onError={handlePaymentError}
            />
            <Button
              variant="ghost"
              className="w-full mt-4"
              onClick={() => setSelectedOption(null)}
            >
              Back to Services
            </Button>
          </div>
        )}

        {showCustomPayment && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-center">Custom Payment</h3>
            <CustomPayment
              onSuccess={() => handlePaymentSuccess('Custom Payment')}
              onError={handlePaymentError}
            />
            <Button
              variant="ghost"
              className="w-full mt-4"
              onClick={() => setShowCustomPayment(false)}
            >
              Back to Services
            </Button>
          </div>
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
              <p className="font-mono">Recipient: {PAYMENT_CONFIG.recipientWallet}</p>
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