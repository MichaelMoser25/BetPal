# BetPal
BetPal/
├── .github/                      # GitHub workflows and templates
│   └── workflows/
│       └── ci.yml               # Continuous Integration setup
├── apps/                        # Application packages
│   ├── web/                     # Next.js frontend application
│   │   ├── app/                 # App router directory
│   │   │   ├── (auth)/         # Authentication routes
│   │   │   │   ├── login/
│   │   │   │   ├── register/
│   │   │   │   └── verify/
│   │   │   ├── (dashboard)/    # Protected dashboard routes
│   │   │   │   ├── bets/       # Bet management
│   │   │   │   ├── friends/    # Friend connections
│   │   │   │   └── profile/    # User profile
│   │   │   ├── api/           # API routes
│   │   │   └── layout.tsx     # Root layout
│   │   ├── components/        # Reusable components
│   │   │   ├── ui/           # Basic UI components
│   │   │   │   ├── button/
│   │   │   │   ├── card/
│   │   │   │   └── input/
│   │   │   ├── features/     # Feature-specific components
│   │   │   │   ├── bets/
│   │   │   │   ├── friends/
│   │   │   │   └── profile/
│   │   │   └── layouts/      # Layout components
│   │   ├── lib/             # Utility functions and shared logic
│   │   │   ├── api/         # API client
│   │   │   ├── auth/        # Auth utilities
│   │   │   └── hooks/       # Custom React hooks
│   │   ├── public/          # Static assets
│   │   └── styles/          # Global styles
│   └── mobile/              # React Native mobile app (future)
├── packages/                # Shared packages
│   ├── database/           # Database schema and migrations
│   │   ├── migrations/
│   │   └── schema.prisma
│   ├── shared/             # Shared TypeScript types and utilities
│   │   ├── types/
│   │   └── utils/
│   └── config/             # Shared configuration
├── docs/                   # Documentation
│   ├── api/               # API documentation
│   └── guides/            # User and developer guides
└── scripts/               # Development and deployment scripts

Key Features by Directory:

1. Authentication & Authorization (/app/(auth)/):
   - Social login integration
   - Email verification
   - Two-factor authentication
   - Session management

2. Bet Management (/app/(dashboard)/bets/):
   - Create and manage bets
   - Bet verification
   - Resolution system
   - History and analytics

3. Social Features (/app/(dashboard)/friends/):
   - Friend connections
   - Social feed
   - Activity tracking
   - Notifications

4. User Profile (/app/(dashboard)/profile/):
   - User settings
   - Reputation system
   - Achievement tracking
   - Payment methods (for stakes tracking)

5. API Structure (/app/api/):
   - RESTful endpoints
   - WebSocket connections for real-time updates
   - Rate limiting
   - Error handling

6. Database Schema (packages/database/):
   - User profiles
   - Bet records
   - Friend connections
   - Transaction history
   - Analytics data
  
----------------------------------------------------------------


Monorepo Setup: Using a monorepo structure with apps/ and packages/ allows for:

Code sharing between web and future mobile apps
Consistent tooling and dependencies
Easier deployment and CI/CD


Scalable Architecture:

Separation of concerns
Component-driven development
Feature-based organization
Clear dependency boundaries


Modern Tech Stack Considerations:

Next.js App Router for optimal performance
Type safety with TypeScript
Database schema management with Prisma
Component library structure for consistent UI
