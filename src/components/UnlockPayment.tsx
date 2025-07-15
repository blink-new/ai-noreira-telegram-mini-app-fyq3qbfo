import { useState, useEffect, useCallback } from 'react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { CreditCard, Wallet, ExternalLink } from 'lucide-react'
import UNLOCK_CONFIG from '../config/unlock'

interface UnlockPaymentProps {
  lockAddress: string
  lockName: string
  price: string
  onSuccess?: () => void
  onError?: (error: string) => void
}

declare global {
  interface Window {
    unlockProtocol?: any
    unlockProtocolConfig?: any
  }
}

export default function UnlockPayment({ 
  lockAddress, 
  lockName, 
  price, 
  onSuccess, 
  onError 
}: UnlockPaymentProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [hasAccess, setHasAccess] = useState(false)
  const [isUnlockReady, setIsUnlockReady] = useState(false)

  const checkAccess = useCallback(async () => {
    if (!window.unlockProtocol) return

    try {
      // Try different methods to check access status
      if (typeof window.unlockProtocol.getKeyholderStatus === 'function') {
        const hasKey = await window.unlockProtocol.getKeyholderStatus(lockAddress)
        setHasAccess(hasKey)
      } else if (typeof window.unlockProtocol.getKey === 'function') {
        // Alternative method for checking key ownership
        const key = await window.unlockProtocol.getKey(lockAddress)
        setHasAccess(!!key)
      } else {
        // Fallback: assume no access if methods are not available
        console.warn('Unlock Protocol access check methods not available')
        setHasAccess(false)
      }
    } catch (error) {
      console.error('Error checking access:', error)
      setHasAccess(false)
    }
  }, [lockAddress])

  useEffect(() => {
    let retryCount = 0
    const maxRetries = 50 // 5 seconds max wait time
    
    // Check if Unlock Protocol is already loaded
    const checkUnlockReady = () => {
      if (window.unlockProtocol && window.unlockProtocolConfig) {
        setIsUnlockReady(true)
        
        // Listen for unlock events
        const handleUnlockStatus = (e: any) => {
          try {
            const { state, locks } = e.detail
            const lockState = locks[lockAddress]
            
            if (lockState === 'locked') {
              setHasAccess(false)
            } else if (lockState === 'unlocked') {
              setHasAccess(true)
              onSuccess?.()
              
              // Telegram haptic feedback
              if (window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.notificationOccurred('success')
              }
            }
          } catch (error) {
            console.error('Error handling unlock status:', error)
          }
        }
        
        window.addEventListener('unlockProtocol.status', handleUnlockStatus)

        // Check initial access status
        checkAccess()
        
        // Cleanup function
        return () => {
          window.removeEventListener('unlockProtocol.status', handleUnlockStatus)
        }
      } else if (retryCount < maxRetries) {
        // If not ready, check again in 100ms
        retryCount++
        setTimeout(checkUnlockReady, 100)
      } else {
        console.warn('Unlock Protocol failed to load after maximum retries')
        setIsUnlockReady(false)
      }
    }

    const cleanup = checkUnlockReady()
    return cleanup
  }, [lockAddress, onSuccess, checkAccess])

  const handlePurchase = async () => {
    if (!isUnlockReady || !window.unlockProtocol) {
      onError?.('Unlock Protocol not ready')
      return
    }

    setIsLoading(true)

    try {
      // Telegram haptic feedback
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light')
      }

      // Try different methods to show checkout
      if (typeof window.unlockProtocol.loadCheckoutModal === 'function') {
        // New API method
        window.unlockProtocol.loadCheckoutModal({
          locks: {
            [lockAddress]: {
              network: UNLOCK_CONFIG.network,
              name: lockName,
            }
          },
          icon: UNLOCK_CONFIG.icon,
          callToAction: UNLOCK_CONFIG.callToAction,
          theme: UNLOCK_CONFIG.theme
        })
      } else if (typeof window.unlockProtocol.showModal === 'function') {
        // Alternative API method
        window.unlockProtocol.showModal()
      } else {
        // Fallback: redirect to Unlock Protocol checkout
        const checkoutUrl = `https://app.unlock-protocol.com/checkout?lock=${lockAddress}&network=${UNLOCK_CONFIG.network}`
        if (window.Telegram?.WebApp) {
          window.Telegram.WebApp.openLink(checkoutUrl)
        } else {
          window.open(checkoutUrl, '_blank')
        }
      }

    } catch (error) {
      console.error('Purchase error:', error)
      onError?.('Purchase failed. Please try again.')
      
      // Error haptic feedback
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('error')
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (hasAccess) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center space-x-2 text-green-700">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="font-medium">Access Granted</span>
          </div>
          <p className="text-sm text-green-600 mt-1">
            You have access to {lockName}
          </p>
        </CardContent>
      </Card>
    )
  }

  // Show fallback if Unlock Protocol fails to load
  if (!isUnlockReady && !isLoading) {
    return (
      <div className="space-y-3">
        <Button
          className="w-full h-16 text-lg font-semibold"
          onClick={() => {
            const message = `To purchase ${lockName} for €${price}, please contact @AinoReira on Telegram.`
            if (window.Telegram?.WebApp) {
              window.Telegram.WebApp.showAlert(message)
            } else {
              alert(message)
            }
          }}
        >
          <div className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5" />
            <span>€{price} / {lockName}</span>
            <span className="text-sm opacity-75">(Contact for EurC)</span>
          </div>
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          Payment system loading... Contact @AinoReira for direct EurC payment
        </p>
      </div>
    )
  }

  return (
    <Button
      className="w-full h-16 text-lg font-semibold"
      onClick={handlePurchase}
      disabled={isLoading || !isUnlockReady}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground"></div>
          <span>Processing...</span>
        </div>
      ) : !isUnlockReady ? (
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground"></div>
          <span>Loading...</span>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <Wallet className="w-5 h-5" />
          <span>€{price} / {lockName}</span>
          <span className="text-sm opacity-75">(EurC)</span>
          <ExternalLink className="w-4 h-4 ml-1" />
        </div>
      )}
    </Button>
  )
}

// Custom amount component for Unlock Protocol
interface CustomUnlockPaymentProps {
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function CustomUnlockPayment({ onSuccess, onError }: CustomUnlockPaymentProps) {
  const [customAmount, setCustomAmount] = useState<string>('')
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleCustomPayment = async () => {
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

    setIsLoading(true)

    try {
      // Telegram haptic feedback
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light')
      }

      // For custom amounts, we'll create a dynamic lock or use a flexible payment method
      // This would typically involve creating a lock with the custom price
      // For now, we'll simulate the process and show instructions
      
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const message = `Custom payment of €${amount} EurC initiated. Please contact @AinoReira on Telegram to complete the EurC transaction to Taho wallet: ${UNLOCK_CONFIG.recipientWallet}`
      
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.showAlert(message, () => {
          onSuccess?.()
        })
      } else {
        alert(message)
        onSuccess?.()
      }
      
      // Success haptic feedback
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success')
      }
      
    } catch (error) {
      console.error('Custom payment error:', error)
      onError?.('Payment failed. Please try again.')
      
      // Error haptic feedback
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('error')
      }
    } finally {
      setIsLoading(false)
    }
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
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
            <span>Processing...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5" />
            <span>Custom amount</span>
          </div>
        )}
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