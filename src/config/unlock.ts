// Unlock Protocol Configuration
// Configured to send all payments in EurC to specified Taho wallet

export const UNLOCK_CONFIG = {
  // Network configuration - Using Ethereum mainnet for EurC payments
  network: 1, // Ethereum mainnet
  
  // Target wallet address for all payments (Taho wallet)
  recipientWallet: '0xfda02035c04ab66769aedabcbeb3b26654e0d787',
  
  // Lock addresses - These will be configured to send EurC to the recipient wallet
  locks: {
    '10-min': {
      address: '0x1234567890123456789012345678901234567890', // Will be replaced with actual lock address
      name: '10 Minute Session',
      price: '50', // Price in EurC (direct EUR equivalent)
      priceEUR: '50', // EUR equivalent for display
      duration: 600, // 10 minutes in seconds
    },
    'booking-fee': {
      address: '0x0987654321098765432109876543210987654321', // Will be replaced with actual lock address
      name: 'Booking Fee',
      price: '100', // Price in EurC (direct EUR equivalent)
      priceEUR: '100', // EUR equivalent for display
      duration: 31536000, // 1 year in seconds (for one-time fees)
    }
  },
  
  // UI Configuration
  icon: 'https://unlock-protocol.com/static/images/svg/unlock-word-mark.svg',
  callToAction: {
    default: 'Purchase access to continue',
    expired: 'Your access has expired. Please purchase again.',
    pending: 'Please complete your purchase...',
    confirmed: 'Access granted! You can now proceed.',
  },
  
  // Theme configuration to match your app
  theme: {
    primaryColor: '#333333',
    backgroundColor: '#FCF9F4',
    accentColor: '#F0DAD0',
  }
}

// Instructions for setting up Unlock Protocol locks with EurC:
/*
CRITICAL SETUP STEPS FOR PRODUCTION:

1. CREATE LOCKS ON UNLOCK PROTOCOL:
   - Go to https://app.unlock-protocol.com/
   - Connect your wallet (0xfda02035c04ab66769aedabcbeb3b26654e0d787)
   - Click "Create a Lock"
   - Configure each lock:
     * 10 Minute Session: Price 50 EurC, Duration 600 seconds
     * Booking Fee: Price 100 EurC, Duration 31536000 seconds (1 year)
   - Set recipient to your Taho wallet: 0xfda02035c04ab66769aedabcbeb3b26654e0d787
   - Deploy locks and replace placeholder addresses in this config

2. EURC TOKEN SETUP:
   - EurC contract address on Ethereum: 0x1aBaEA1f7C830bD89Acc67eC4af516284b1bC33c
   - Ensure your locks accept EurC as payment currency
   - 1 EurC = 1 EUR (stable pricing)

3. PAYMENT FLOW SECURITY:
   - Wallet payments: Direct EurC transfer to your Taho wallet
   - Credit card payments: Unlock Protocol converts EUR to EurC automatically
   - All payments go directly to: 0xfda02035c04ab66769aedabcbeb3b26654e0d787
   - No intermediary wallets or escrow

4. WEBHOOK SETUP (RECOMMENDED):
   - Set up webhooks in Unlock Protocol dashboard
   - Monitor successful payments in real-time
   - Automatically grant access/send confirmations

5. TESTING:
   - Test with small amounts first
   - Verify EurC arrives in your Taho wallet
   - Test both wallet and credit card payment flows
   - Ensure proper error handling

6. PRODUCTION CHECKLIST:
   ✓ Real lock addresses deployed
   ✓ EurC token configured correctly
   ✓ Recipient wallet verified
   ✓ Payment flows tested
   ✓ Webhooks configured
   ✓ Error handling implemented
   ✓ Customer support contact ready (@AinoReira)
*/

export default UNLOCK_CONFIG