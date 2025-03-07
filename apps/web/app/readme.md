# BetPal Money Integration

This set of components adds real money betting functionality to the existing BetPal application, allowing users to place bets with actual currency while maintaining the social features of the original app.

## Components Overview

### Core Components

1. **MonetaryBetForm.tsx**
   - Handles the creation of money bets
   - Includes amount selection, bet details, and payment method selection
   - Displays security information and terms acceptance

2. **MonetaryBetDashboard.tsx**
   - Dashboard for managing money bets
   - Displays active and historical bets
   - Shows key statistics: active bets, winnings, win rate, etc.

3. **PaymentSettingsPage.tsx**
   - Manages payment methods (credit cards, bank accounts)
   - Handles user balance and withdrawals
   - Displays transaction history

4. **BetTypeToggle.tsx**
   - Toggles between regular bets and money bets
   - Acts as the main entry point for the integrated app

5. **IdentityVerification.tsx**
   - Handles KYC (Know Your Customer) verification
   - Collects and verifies user identity for legal compliance
   - Manages document uploads and verification status

### Utility Components

1. **BetTypeToggle.tsx**
   - Toggle component for switching between regular and monetary bets
   - Improves user experience by clearly separating the two modes

2. **BetPalMonetary.tsx**
   - Wrapper component that integrates all money-related features
   - Provides a consistent UI layer for the money betting experience

## Integration Steps

1. **Add Required Dependencies**
   ```bash
   npm install @stripe/stripe-js @stripe/react-stripe-js zod react-hook-form
   ```

2. **Setup Environment Variables**
   Create a `.env.local` file with the following variables:
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
   STRIPE_SECRET_KEY=sk_test_your_key
   ```

3. **Add API Routes**
   Create the following API routes in your Next.js app:
   - `/api/payments/methods` - Manage payment methods
   - `/api/payments/deposit` - Handle deposits
   - `/api/payments/withdraw` - Handle withdrawals
   - `/api/bets/money` - Create and manage money bets
   - `/api/verify/identity` - Handle identity verification

4. **Update Navigation**
   Modify your main app navigation to include BetPalToggle instead of directly using MyBetsPage.

5. **Configure User Authentication**
   Ensure your authentication system captures additional fields required for money betting (age verification, etc.)

## Legal and Compliance Considerations

Before launching real money betting functionality, ensure you address these important legal requirements:

1. **Licensing**
   - Obtain appropriate gambling/betting licenses in each jurisdiction
   - Consider using a licensed third-party payment processor specialized in gambling

2. **Age Verification**
   - Implement strict age verification (18+ or 21+ depending on jurisdiction)
   - Use multi-factor verification methods

3. **Responsible Gambling**
   - Add betting limits functionality
   - Implement self-exclusion options
   - Provide resources for gambling addiction support

4. **Privacy & Data Security**
   - Update privacy policy to cover financial data
   - Implement encryption for all personal and financial information
   - Comply with relevant data protection regulations (GDPR, CCPA, etc.)

5. **Terms of Service**
   - Update to cover monetary transactions
   - Clearly outline dispute resolution procedures
   - Specify fee structure and withdrawal policies

## Security Best Practices

1. **Payment Processing**
   - Never store full credit card details
   - Use tokenization for all payment methods
   - Implement 3D Secure authentication

2. **Escrow System**
   - Use a secure third-party escrow service for holding funds
   - Implement dual authorization for bet resolution
   - Maintain clear audit trails for all transactions

3. **Fraud Prevention**
   - Implement velocity checks to prevent rapid suspicious transactions
   - Use device fingerprinting to detect suspicious activities
   - Implement geographic restrictions based on legal jurisdictions

## Testing Instructions

1. Test the entire betting flow with Stripe's test cards:
   - Use `4242 4242 4242 4242` for successful payments
   - Use `4000 0000 0000 9995` to test 3D Secure authentication

2. Test identity verification with sample documents provided in the `/test-assets` folder

3. Verify proper escrow functionality by testing the complete bet lifecycle:
   - Creating a bet
   - Accepting a bet
   - Resolving outcomes
   - Disputed outcomes

## Deployment Checklist

Before deploying to production:

1. Complete security audit of all payment-related code
2. Ensure compliance with all relevant gambling regulations
3. Test on multiple devices and browsers
4. Set up monitoring for suspicious transaction patterns
5. Configure proper error logging and notification systems
6. Create backup and recovery procedures for financial data

## Support Contacts

For integration assistance or questions:
- Technical Support: dev@betpal.example.com
- Compliance Questions: legal@betpal.example.com
- Security Concerns: security@betpal.example.com