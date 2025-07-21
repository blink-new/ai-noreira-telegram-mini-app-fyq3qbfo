# Ethereum Payment Integration Setup

This Telegram mini-app is configured to process all payments in Ethereum (ETH) and send them directly to the specified wallet address: **0xDbF8811e8035ADDc5D4046176c66E896e5e13FeC**

## Payment Configuration

### Network: Ethereum Mainnet
- **Network ID**: 1 (Ethereum mainnet)
- **Currency**: ETH (Ethereum)
- **Recipient Wallet**: 0xDbF8811e8035ADDc5D4046176c66E896e5e13FeC

### Service Pricing (ETH Equivalent)

#### 10 Minute Session
- **EUR Price**: €50 (for reference)
- **ETH Price**: 0.025 ETH (approximate)
- **Duration**: 10 minutes

#### Booking Fee
- **EUR Price**: €100 (for reference)
- **ETH Price**: 0.05 ETH (approximate)
- **Duration**: 1 year (one-time fee)

## How It Works

1. **User Selection**: User selects a service option from the menu
2. **Wallet Connection**: User connects their Ethereum wallet (MetaMask, WalletConnect, etc.)
3. **ETH Transaction**: Payment is processed in ETH on Ethereum mainnet
4. **Direct Transfer**: Funds are sent directly to the recipient wallet
5. **Confirmation**: User receives access confirmation via Telegram

## Payment Methods Supported

- **MetaMask**: Browser extension wallet
- **WalletConnect**: Mobile wallet connection
- **Other Web3 Wallets**: Any Ethereum-compatible wallet
- **Custom Amounts**: Users can specify custom EUR amounts (converted to ETH)

## Security Features

- **Direct Wallet Transfer**: No intermediary holding funds
- **Blockchain Verification**: All transactions are verifiable on Ethereum blockchain
- **Secure Wallet**: Funds go directly to the specified secure wallet address
- **No Custodial Risk**: No third-party custody of funds

## Price Conversion

Prices are displayed in EUR for user convenience but processed in ETH:
- EUR amounts are converted to ETH at current market rates
- ETH prices may fluctuate with market conditions
- Users see both EUR reference and ETH amount

## Custom Payment Flow

For custom amounts:
1. User enters desired EUR amount
2. System calculates approximate ETH equivalent
3. User contacts @AinoReira on Telegram for manual processing
4. ETH transaction details provided including exact wallet address

## Technical Implementation

### Unlock Protocol Integration
- Uses Unlock Protocol for payment processing
- Configured for Ethereum mainnet (network: 1)
- Direct wallet integration for seamless payments

### Telegram Integration
- Haptic feedback for payment interactions
- Native alerts for payment status
- Deep integration with Telegram WebApp API

### Mobile Optimization
- Responsive design for mobile devices
- Touch-friendly payment interface
- Optimized for Telegram mobile app

## Wallet Address Verification

**Important**: Always verify the recipient wallet address before sending payments:
```
0xDbF8811e8035ADDc5D4046176c66E896e5e13FeC
```

This address is displayed in the app interface and should match exactly.

## Benefits of Ethereum Payments

- **Decentralized**: No single point of failure
- **Transparent**: All transactions visible on blockchain
- **Global**: Works worldwide without restrictions
- **Fast**: Near-instant transaction confirmation
- **Secure**: Cryptographically secured transactions
- **No Chargebacks**: Final settlement of payments

## User Experience

- Clean, intuitive payment interface
- Clear pricing in both EUR and ETH
- Step-by-step payment guidance
- Real-time transaction status
- Telegram integration for notifications

## Support

For payment issues or questions:
- Contact: @AinoReira on Telegram
- Wallet Address: 0xDbF8811e8035ADDc5D4046176c66E896e5e13FeC
- Network: Ethereum Mainnet

## Important Notes

1. **Gas Fees**: Users pay Ethereum network gas fees in addition to service fees
2. **Price Fluctuation**: ETH prices may vary with market conditions
3. **Confirmation Time**: Transactions typically confirm within 1-5 minutes
4. **Irreversible**: Ethereum transactions cannot be reversed once confirmed
5. **Wallet Required**: Users must have an Ethereum wallet with sufficient ETH balance

## Testing

Before going live:
1. Test with small amounts first
2. Verify wallet address is correct
3. Confirm transaction appears in recipient wallet
4. Test on Ethereum testnet if needed

This configuration ensures all payments are processed securely in Ethereum and sent directly to the specified wallet address.