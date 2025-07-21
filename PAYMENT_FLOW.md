# Payment Flow Documentation

## Overview
This Telegram mini-app implements a secure payment system using Unlock Protocol with EurC (Euro Coin) payments sent directly to your Taho wallet.

## Payment Flow Architecture

### 1. Customer Journey
```
Customer clicks menu item → Payment Modal opens → Choose payment method → Complete payment → EurC sent to Taho wallet
```

### 2. Payment Methods

#### A. Wallet Connection (Crypto Payment)
- Customer connects their Ethereum wallet (MetaMask, Taho, WalletConnect, etc.)
- Direct EurC token transfer from customer wallet to your Taho wallet
- No intermediaries - direct peer-to-peer transaction
- Customer must have EurC tokens in their wallet

#### B. Credit Card Payment
- Customer enters credit card information
- Unlock Protocol processes EUR payment
- EUR is automatically converted to EurC
- EurC is sent directly to your Taho wallet
- Customer doesn't need crypto wallet or existing EurC

### 3. Security Features

#### Payment Security
- All payments processed through Unlock Protocol (established, audited platform)
- Direct transfers to your specified Taho wallet: `0xfda02035c04ab66769aedabcbeb3b26654e0d787`
- No funds held in escrow or intermediary wallets
- EurC provides stable 1:1 EUR pricing (no crypto volatility)

#### Technical Security
- HTTPS encryption for all communications
- Telegram WebApp security model
- Unlock Protocol's battle-tested smart contracts
- No API keys or sensitive data stored in frontend

### 4. Payment Options

#### Fixed Price Options
- **10 Minute Session**: €50 (50 EurC)
- **Booking Fee**: €100 (100 EurC)

#### Custom Amount
- Customer can enter any amount in EUR
- Automatically converted 1:1 to EurC
- Minimum amount: €1

### 5. Technical Implementation

#### Frontend Components
- `PaymentModal.tsx`: Main payment interface with dual payment options
- `ServicesMenu.tsx`: Service selection and pricing display
- `UnlockPayment.tsx`: Legacy component (replaced by PaymentModal)

#### Configuration
- `src/config/unlock.ts`: Unlock Protocol configuration
- `index.html`: Global Unlock Protocol setup with EurC support

#### Key Features
- Real-time payment status updates
- Telegram haptic feedback integration
- Mobile-optimized UI for Telegram WebApp
- Error handling and user feedback

### 6. Production Setup Requirements

#### Critical Steps Before Going Live

1. **Deploy Real Unlock Protocol Locks**
   ```
   Current Status: Using placeholder addresses
   Required Action: Create actual locks on https://app.unlock-protocol.com/
   
   Lock Configuration:
   - Network: Ethereum Mainnet (Chain ID: 1)
   - Currency: EurC (0x1aBaEA1f7C830bD89Acc67eC4af516284b1bC33c)
   - Recipient: 0xfda02035c04ab66769aedabcbeb3b26654e0d787
   - Prices: 50 EurC (10-min), 100 EurC (booking)
   ```

2. **Update Lock Addresses**
   ```typescript
   // In src/config/unlock.ts, replace:
   '0x1234567890123456789012345678901234567890' // with real 10-min lock address
   '0x0987654321098765432109876543210987654321' // with real booking lock address
   ```

3. **Test Payment Flows**
   - Test wallet payments with small amounts
   - Test credit card payments
   - Verify EurC arrives in Taho wallet
   - Test error scenarios

4. **Set Up Monitoring**
   - Configure Unlock Protocol webhooks
   - Monitor payment confirmations
   - Set up customer support flow

### 7. Customer Support Flow

#### Payment Issues
- Primary contact: @AinoReira on Telegram
- Backup: Direct message through Telegram mini-app
- Payment verification through blockchain explorer

#### Common Issues & Solutions
1. **Wallet Connection Failed**
   - Guide customer to refresh and try again
   - Suggest alternative wallet apps
   - Offer credit card payment option

2. **Insufficient EurC Balance**
   - Explain EurC requirement for wallet payments
   - Suggest credit card payment (auto-converts EUR to EurC)
   - Provide EurC purchase instructions

3. **Credit Card Payment Failed**
   - Verify card details and try again
   - Check if card supports international payments
   - Suggest wallet payment as alternative

### 8. Revenue Flow

#### Payment Processing
```
Customer Payment → Unlock Protocol → EurC Transfer → Your Taho Wallet
```

#### No Fees Deducted
- Payments go directly to your wallet
- No platform fees or commissions
- Only standard Ethereum gas fees apply
- EurC maintains 1:1 EUR value

### 9. Compliance & Legal

#### Payment Processing
- Unlock Protocol handles payment compliance
- EurC is a regulated stablecoin
- Transactions are recorded on Ethereum blockchain
- Full audit trail available

#### Customer Data
- No sensitive payment data stored in app
- Telegram handles user authentication
- Payment data processed by Unlock Protocol
- GDPR compliant through service providers

### 10. Monitoring & Analytics

#### Payment Tracking
- Monitor Taho wallet for incoming EurC transfers
- Use Ethereum blockchain explorer for verification
- Set up alerts for successful payments

#### Customer Analytics
- Track payment method preferences
- Monitor conversion rates
- Analyze popular service options

## Next Steps for Production

1. **Immediate (Required for Launch)**
   - [ ] Create real Unlock Protocol locks
   - [ ] Update lock addresses in config
   - [ ] Test all payment flows
   - [ ] Verify EurC receipts in Taho wallet

2. **Short Term (Within 1 week)**
   - [ ] Set up payment monitoring
   - [ ] Configure customer support flow
   - [ ] Test error scenarios
   - [ ] Document troubleshooting guide

3. **Medium Term (Within 1 month)**
   - [ ] Set up automated confirmations
   - [ ] Implement payment analytics
   - [ ] Add payment history feature
   - [ ] Optimize conversion rates

## Support Contacts

- **Technical Issues**: Contact Blink support
- **Payment Issues**: @AinoReira on Telegram
- **Unlock Protocol**: https://unlock-protocol.com/support
- **EurC Information**: https://www.centre.io/eurc