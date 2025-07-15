import { useState } from 'react'
import { Card, CardContent } from './ui/card'
import UnlockPayment, { CustomUnlockPayment } from './UnlockPayment'
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

  const handlePaymentSuccess = (optionLabel: string) => {
    setSuccessMessage(`Payment for ${optionLabel} completed successfully!`)
    
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
            <div key={option.id}>
              {option.id === 'custom' ? (
                <CustomUnlockPayment
                  onSuccess={() => handlePaymentSuccess(option.label)}
                  onError={handlePaymentError}
                />
              ) : (
                <UnlockPayment
                  lockAddress={option.lockAddress!}
                  lockName={option.label}
                  price={option.price.toString()}
                  onSuccess={() => handlePaymentSuccess(option.label)}
                  onError={handlePaymentError}
                />
              )}
            </div>
          ))}
        </div>

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