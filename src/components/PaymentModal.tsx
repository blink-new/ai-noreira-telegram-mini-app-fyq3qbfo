import { useState, useEffect, useCallback } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { CreditCard, Wallet, X, Shield, CheckCircle } from 'lucide-react'
import UNLOCK_CONFIG from '../config/unlock'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  lockAddress: string
  lockName: string
  price: string
  customAmount?: string
  onSuccess?: () => void
  onError?: (error: string) => void
}

declare global {
  interface Window {
    unlockProtocol?: any
    unlockProtocolConfig?: any
  }
}

export default function PaymentModal({ 
  isOpen, 
  onClose, 
  lockAddress, 
  lockName, 
  price, 
  customAmount,
  onSuccess, 
  onError 
}: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'card' | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isUnlockReady, setIsUnlockReady] = useState(false)
  const [hasAccess, setHasAccess] = useState(false)

  const finalPrice = customAmount || price
  const finalLockName = customAmount ? `Custom Payment (€${customAmount})` : lockName

  const checkAccess = useCallback(async () => {
    if (!window.unlockProtocol || !lockAddress) return

    try {
      if (typeof window.unlockProtocol.getKeyholderStatus === 'function') {
        const hasKey = await window.unlockProtocol.getKeyholderStatus(lockAddress)
        setHasAccess(hasKey)
      }
    } catch (error) {
      console.error('Error checking access:', error)
      setHasAccess(false)
    }
  }, [lockAddress])

  useEffect(() => {
    if (!isOpen) {
      setPaymentMethod(null)
      setIsProcessing(false)
      return
    }

    // Check if Unlock Protocol is ready
    let retryCount = 0
    const maxRetries = 50

    const checkUnlockReady = () => {
      if (window.unlockProtocol && window.unlockProtocolConfig) {
        setIsUnlockReady(true)
        checkAccess()
      } else if (retryCount < maxRetries) {
        retryCount++
        setTimeout(checkUnlockReady, 100)
      } else {
        console.warn('Unlock Protocol failed to load')
        setIsUnlockReady(false)
      }
    }

    checkUnlockReady()
  }, [isOpen, lockAddress, checkAccess])

  const handleWalletPayment = async () => {
    if (!isUnlockReady || !window.unlockProtocol) {
      onError?.('Payment system not ready')
      return
    }

    setIsProcessing(true)

    try {
      // Telegram haptic feedback
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light')
      }

      // Configure checkout for wallet payment (EurC)
      const checkoutConfig = {
        locks: {
          [lockAddress]: {
            network: UNLOCK_CONFIG.network,
            name: finalLockName,
          }
        },
        icon: UNLOCK_CONFIG.icon,
        callToAction: UNLOCK_CONFIG.callToAction,
        theme: UNLOCK_CONFIG.theme,
        paymentMethods: ['crypto'], // Only crypto wallet payments
        title: `Pay with Wallet - €${finalPrice} EurC`,
        skipRecipient: false,
        recipient: UNLOCK_CONFIG.recipientWallet
      }

      if (typeof window.unlockProtocol.loadCheckoutModal === 'function') {
        window.unlockProtocol.loadCheckoutModal(checkoutConfig)
      } else {
        // Fallback to direct checkout URL
        const checkoutUrl = `https://app.unlock-protocol.com/checkout?lock=${lockAddress}&network=${UNLOCK_CONFIG.network}&recipient=${UNLOCK_CONFIG.recipientWallet}`
        if (window.Telegram?.WebApp) {
          window.Telegram.WebApp.openLink(checkoutUrl)
        } else {
          window.open(checkoutUrl, '_blank')
        }
      }

      // Listen for successful payment
      const handleUnlockStatus = (e: any) => {
        try {
          const { state, locks } = e.detail
          const lockState = locks[lockAddress]
          
          if (lockState === 'unlocked') {
            setHasAccess(true)
            onSuccess?.()
            onClose()
            
            if (window.Telegram?.WebApp?.HapticFeedback) {
              window.Telegram.WebApp.HapticFeedback.notificationOccurred('success')
            }
          }
        } catch (error) {
          console.error('Error handling unlock status:', error)
        }
      }

      window.addEventListener('unlockProtocol.status', handleUnlockStatus)

      // Cleanup listener after 5 minutes
      setTimeout(() => {
        window.removeEventListener('unlockProtocol.status', handleUnlockStatus)
      }, 300000)

    } catch (error) {
      console.error('Wallet payment error:', error)
      onError?.('Wallet payment failed. Please try again.')
      
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('error')
      }
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCardPayment = async () => {
    setIsProcessing(true)

    try {
      // Telegram haptic feedback
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light')
      }

      // Configure checkout for credit card payment (purchases EurC automatically)
      const checkoutConfig = {
        locks: {
          [lockAddress]: {
            network: UNLOCK_CONFIG.network,
            name: finalLockName,
          }
        },
        icon: UNLOCK_CONFIG.icon,
        callToAction: {
          ...UNLOCK_CONFIG.callToAction,
          default: `Pay €${finalPrice} with Credit Card`
        },
        theme: UNLOCK_CONFIG.theme,
        paymentMethods: ['card'], // Only credit card payments
        title: `Credit Card Payment - €${finalPrice}`,
        skipRecipient: false,
        recipient: UNLOCK_CONFIG.recipientWallet,
        creditCard: {
          enabled: true,
          autoConvert: true, // Automatically convert EUR to EurC
          currency: 'EUR'
        }
      }

      if (typeof window.unlockProtocol.loadCheckoutModal === 'function') {
        window.unlockProtocol.loadCheckoutModal(checkoutConfig)
      } else {
        // Fallback: Show instructions for manual payment
        const message = `To pay €${finalPrice} with credit card:\n\n1. The payment will automatically purchase EurC tokens\n2. EurC will be sent to: ${UNLOCK_CONFIG.recipientWallet}\n3. Contact @AinoReira on Telegram for assistance`
        
        if (window.Telegram?.WebApp) {
          window.Telegram.WebApp.showAlert(message)
        } else {
          alert(message)
        }
      }

      // Listen for successful payment
      const handleUnlockStatus = (e: any) => {
        try {
          const { state, locks } = e.detail
          const lockState = locks[lockAddress]
          
          if (lockState === 'unlocked') {
            setHasAccess(true)
            onSuccess?.()
            onClose()
            
            if (window.Telegram?.WebApp?.HapticFeedback) {
              window.Telegram.WebApp.HapticFeedback.notificationOccurred('success')
            }
          }
        } catch (error) {
          console.error('Error handling unlock status:', error)
        }
      }

      window.addEventListener('unlockProtocol.status', handleUnlockStatus)

      // Cleanup listener after 5 minutes
      setTimeout(() => {
        window.removeEventListener('unlockProtocol.status', handleUnlockStatus)
      }, 300000)

    } catch (error) {
      console.error('Card payment error:', error)
      onError?.('Credit card payment failed. Please try again.')
      
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('error')
      }
    } finally {
      setIsProcessing(false)
    }
  }

  if (!isOpen) return null

  if (hasAccess) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md bg-green-50 border-green-200">
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-800 mb-2">Payment Successful!</h3>
            <p className="text-green-700 mb-4">
              You now have access to {finalLockName}
            </p>
            <Button onClick={onClose} className="w-full">
              Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold">
            {finalLockName}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Price Display */}
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">€{finalPrice}</div>
            <div className="text-sm text-muted-foreground">
              {customAmount ? 'Custom amount' : 'Fixed price'} • Paid in EurC
            </div>
          </div>

          {/* Payment Method Selection */}
          {!paymentMethod && (
            <div className="space-y-3">
              <h3 className="font-medium text-center">Choose Payment Method</h3>
              
              <Button
                className="w-full h-16 text-left"
                variant="outline"
                onClick={() => setPaymentMethod('wallet')}
                disabled={!isUnlockReady}
              >
                <div className="flex items-center space-x-3">
                  <Wallet className="w-6 h-6 text-primary" />
                  <div>
                    <div className="font-medium">Connect Wallet</div>
                    <div className="text-sm text-muted-foreground">
                      Pay with EurC from your wallet
                    </div>
                  </div>
                </div>
              </Button>

              <Button
                className="w-full h-16 text-left"
                variant="outline"
                onClick={() => setPaymentMethod('card')}
                disabled={!isUnlockReady}
              >
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-6 h-6 text-primary" />
                  <div>
                    <div className="font-medium">Credit Card</div>
                    <div className="text-sm text-muted-foreground">
                      Auto-converts EUR to EurC
                    </div>
                  </div>
                </div>
              </Button>

              {!isUnlockReady && (
                <div className="text-center text-sm text-muted-foreground">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mx-auto mb-2"></div>
                  Loading payment system...
                </div>
              )}
            </div>
          )}

          {/* Wallet Payment Flow */}
          {paymentMethod === 'wallet' && (
            <div className="space-y-4">
              <div className="text-center">
                <Wallet className="w-12 h-12 text-primary mx-auto mb-3" />
                <h3 className="font-medium mb-2">Wallet Payment</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Connect your Ethereum wallet to pay with EurC tokens
                </p>
              </div>

              <Button
                className="w-full h-12"
                onClick={handleWalletPayment}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                    <span>Connecting...</span>
                  </div>
                ) : (
                  `Pay €${finalPrice} with Wallet`
                )}
              </Button>

              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setPaymentMethod(null)}
              >
                Back to payment methods
              </Button>
            </div>
          )}

          {/* Credit Card Payment Flow */}
          {paymentMethod === 'card' && (
            <div className="space-y-4">
              <div className="text-center">
                <CreditCard className="w-12 h-12 text-primary mx-auto mb-3" />
                <h3 className="font-medium mb-2">Credit Card Payment</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Pay with your credit card. EUR will be automatically converted to EurC.
                </p>
              </div>

              <Button
                className="w-full h-12"
                onClick={handleCardPayment}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  `Pay €${finalPrice} with Card`
                )}
              </Button>

              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setPaymentMethod(null)}
              >
                Back to payment methods
              </Button>
            </div>
          )}

          {/* Security Info */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Secure Payment</span>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• All payments processed through Unlock Protocol</p>
              <p>• EurC sent directly to: {UNLOCK_CONFIG.recipientWallet.slice(0, 10)}...</p>
              <p>• 1 EurC = 1 EUR (stable pricing)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}