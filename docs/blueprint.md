# **App Name**: Transactify GHL

## Core Features:

- OAuth App Installation: Implement the OAuth 2.0 Authorization Code flow for GoHighLevel Marketplace installation, securely storing access and refresh tokens in Firestore.
- Custom Provider Registration: Register Cardknox as a custom payment provider within GoHighLevel, including supported methods and action hooks mapped to backend API routes.
- Secure Iframe Checkout: Serve a PCI-compliant hosted iframe for payment processing, integrating with Cardknox API for sales transactions and recording them in GoHighLevel.
- Cardknox API Integration: Handle payments using Cardknox payment services, as well as all subsequent reconciliation processes, while observing secure data practices and safeguarding client information.
- Data Synchronization with GHL: Ensure all transactions and subscriptions processed via Cardknox are accurately reflected in GoHighLevel, updating transaction and subscription statuses in real-time.
- Webhook Handling: Implement webhooks for Cardknox and GoHighLevel to manage transaction and subscription status changes, keeping the systems synchronized.
- Agency-Subaccount Settings Page: Provide a UI to manage Cardknox credentials and view transactions/subscriptions, secured behind a basic email-password admin login

## Style Guidelines:

- Primary color: A deep, authoritative blue (#2962FF) to inspire trust in the payment solution.
- Background color: A very light, desaturated blue (#F0F5FF) for a clean, professional look.
- Accent color: A vibrant violet (#7C4DFF) for interactive elements and key CTAs to guide the user.
- Headline font: 'Space Grotesk', a geometric sans-serif for a modern, tech-forward look. Body font: 'Inter', a grotesque-style sans-serif to use if longer text is required
- Code font: 'Source Code Pro' for displaying code snippets or transaction details, providing clear readability for technical information.
- Use a set of consistent, minimalist icons focused on security and payment processing metaphors (e.g., shields, cards, graphs).
- Subtle transition animations and loading states to enhance user experience without being distracting (e.g., loader animations while processing payments).