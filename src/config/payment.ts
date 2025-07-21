// Payment Configuration for EurC payments to Taho wallet
// Simplified payment flow without Unlock Protocol integration

export const PAYMENT_CONFIG = {
  // Target wallet address for all payments (Taho wallet)
  recipientWallet: '0xfda02035c04ab66769aedabcbeb3b26654e0d787',
  
  // Currency information
  currency: 'EurC',
  currencyAddress: '0x1aBaEA1f7C830bD89Acc67eC4af516284b1bC33c', // EurC token on Ethereum
  network: 'Ethereum',
  
  // Contact information
  contactHandle: '@AinoReira',
  
  // Service pricing
  services: {
    '10-min': {
      id: '10-min',
      name: '10 Minute Session',
      price: '50',
      priceEUR: '50',
      duration: '10 minutes',
      description: 'Private 10-minute session'
    },
    'booking-fee': {
      id: 'booking-fee',
      name: 'Booking Fee',
      price: '100',
      priceEUR: '100',
      duration: 'One-time fee',
      description: 'Required booking fee for services'
    }
  },
  
  // Payment instructions
  instructions: {
    wallet: {
      title: 'Wallet Payment (EurC)',
      steps: [
        'Connect your Ethereum wallet',
        'Ensure you have EurC tokens',
        'Send payment to the provided address',
        'Contact @AinoReira with transaction hash'
      ]
    },
    contact: {
      title: 'Direct Payment',
      steps: [
        'Contact @AinoReira on Telegram',
        'Specify the service you want',
        'Receive payment instructions',
        'Complete EurC transfer to Taho wallet'
      ]
    }
  },
  
  // UI Configuration
  theme: {
    primaryColor: '#333333',
    backgroundColor: '#FCF9F4',
    accentColor: '#F0DAD0',
  }
}

export default PAYMENT_CONFIG