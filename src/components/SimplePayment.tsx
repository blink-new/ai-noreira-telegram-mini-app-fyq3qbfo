import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { CreditCard, MessageCircle, Copy, ExternalLink, CheckCircle } from 'lucide-react'
import PAYMENT_CONFIG from '../config/payment'

interface SimplePaymentProps {
  serviceId: string
  onSuccess?: () => void
  onError?: (error: string) => void
}

export default function SimplePayment({ serviceId, onSuccess, onError }: SimplePaymentProps) {
  const [showPaymentDetails, setShowPaymentDetails] = useState(false)
  const [copiedAddress, setCopiedAddress] = useState(false)
  
  const service = PAYMENT_CONFIG.services[serviceId as keyof typeof PAYMENT_CONFIG.services]
  
  if (!service) {
    return (
      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-4 text-center">
          <p className="text-red-700">Service not found</p>
        </CardContent>
      </Card>
    )
  }

  const handleContactPayment = () => {
    const message = `Hi! I'd like to purchase: ${service.name} (€${service.price} EurC)\n\nPlease provide payment instructions for your Taho wallet.`
    
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('light')
    }
    
    if (window.Telegram?.WebApp) {
      const telegramUrl = `https://t.me/AinoReira?text=${encodeURIComponent(message)}`
      window.Telegram.WebApp.openTelegramLink(telegramUrl)
    } else {
      const telegramUrl = `https://t.me/AinoReira?text=${encodeURIComponent(message)}`
      window.open(telegramUrl, '_blank')
    }
  }

  const handleWalletPayment = () => {
    setShowPaymentDetails(true)
    
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('light')
    }
  }

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(PAYMENT_CONFIG.recipientWallet)
      setCopiedAddress(true)
      
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success')
      }
      
      setTimeout(() => setCopiedAddress(false), 2000)
    } catch (error) {
      console.error('Failed to copy address:', error)
      onError?.('Failed to copy wallet address')
    }
  }

  const openEtherscan = () => {
    const etherscanUrl = `https://etherscan.io/address/${PAYMENT_CONFIG.recipientWallet}`
    
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openLink(etherscanUrl)
    } else {
      window.open(etherscanUrl, '_blank')
    }
  }

  if (showPaymentDetails) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{service.name}</CardTitle>
            <div className="text-2xl font-bold text-primary">€{service.price} EurC</div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Send EurC to this address:</label>
              <div className="flex items-center space-x-2">
                <div className="flex-1 p-3 bg-muted rounded-lg font-mono text-sm break-all">
                  {PAYMENT_CONFIG.recipientWallet}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={copyAddress}
                  className="shrink-0"
                >
                  {copiedAddress ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Payment Instructions:</h4>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Send exactly €{service.price} EurC to the address above</li>
                <li>Use Ethereum network (not other chains)</li>
                <li>Contact {PAYMENT_CONFIG.contactHandle} with your transaction hash</li>
                <li>Wait for confirmation before accessing service</li>
              </ol>
            </div>

            <div className="space-y-3">
              <Button
                className="w-full"
                onClick={handleContactPayment}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact {PAYMENT_CONFIG.contactHandle}
              </Button>
              
              <Button
                variant="outline"
                className="w-full"
                onClick={openEtherscan}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Wallet on Etherscan
              </Button>
              
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setShowPaymentDetails(false)}
              >
                Back to Payment Options
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <Button
        className="w-full h-16 text-lg font-semibold"
        onClick={handleContactPayment}
      >
        <div className="flex items-center space-x-2">
          <MessageCircle className="w-5 h-5" />
          <span>€{service.price} / {service.name}</span>
          <span className="text-sm opacity-75">(Contact for EurC)</span>
        </div>
      </Button>

      <Button
        className="w-full h-16 text-lg font-semibold"
        variant="outline"
        onClick={handleWalletPayment}
      >
        <div className="flex items-center space-x-2">
          <CreditCard className="w-5 h-5" />
          <span>€{service.price} / {service.name}</span>
          <span className="text-sm opacity-75">(Direct EurC)</span>
        </div>
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Secure EurC payments to Taho wallet • Contact {PAYMENT_CONFIG.contactHandle} for support
      </p>
    </div>
  )
}

// Custom amount component
interface CustomPaymentProps {
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function CustomPayment({ onSuccess, onError }: CustomPaymentProps) {
  const [customAmount, setCustomAmount] = useState<string>('')
  const [showCustomInput, setShowCustomInput] = useState(false)

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

    const message = `Hi! I'd like to make a custom payment of €${amount} EurC.\n\nPlease provide payment instructions for your Taho wallet.`

    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('light')
    }

    if (window.Telegram?.WebApp) {
      const telegramUrl = `https://t.me/AinoReira?text=${encodeURIComponent(message)}`
      window.Telegram.WebApp.openTelegramLink(telegramUrl)
    } else {
      const telegramUrl = `https://t.me/AinoReira?text=${encodeURIComponent(message)}`
      window.open(telegramUrl, '_blank')
    }

    onSuccess?.()
  }

  const handleCustomClick = () => {
    if (!showCustomInput) {
      setShowCustomInput(true)
    } else {
      handleCustomPayment()
    }
  }

  return (
    <div className="space-y-3">
      <Button
        className="w-full h-16 text-lg font-semibold"
        variant="outline"
        onClick={handleCustomClick}
      >
        <div className="flex items-center space-x-2">
          <CreditCard className="w-5 h-5" />
          <span>Custom amount</span>
        </div>
      </Button>

      {showCustomInput && (
        <div className="flex space-x-2">
          <input
            type="number"
            placeholder="Enter amount in EUR (1:1 with EurC)"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            className="flex-1 px-4 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            min="1"
            step="1"
          />
          <span className="flex items-center px-3 text-muted-foreground">€=EurC</span>
        </div>
      )}
    </div>
  )
}