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
1. Go to https://app.unlock-protocol.com/
2. Connect your wallet
3. Click "Create a Lock"
4. Configure your lock:
   - Name: "10 Minute Session" or "Booking Fee"
   - Duration: Set appropriate duration
   - Price: Set price in EurC (1:1 with EUR)
   - Currency: Select EurC token
   - Recipient: Set to 0xfda02035c04ab66769aedabcbeb3b26654e0d787 (Taho wallet)
   - Max number of keys: Set as needed
5. Deploy the lock
6. Copy the lock address and replace the placeholder addresses above
7. Test the integration in your app

For production, consider:
- EurC provides stable EUR pricing without conversion
- Setting up proper lock durations
- Setting up webhooks for payment notifications
- Ensuring EurC token is available on the selected network
*/

export default UNLOCK_CONFIG