# GlowMatch AI - Beauty Coach Platform

> Your personal AI beauty coach. Create personalized skincare routines and track your progress towards your beauty goals.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Whop account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/glowmatch.git
   cd glowmatch
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your actual keys
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
glowmatch/
├── src/
│   ├── app/                 # Next.js App Router pages & routes
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Homepage
│   │   └── api/             # API routes
│   │
│   ├── components/          # React components
│   │   ├── ui/              # Reusable UI components (shadcn/ui)
│   │   └── layout/          # Layout components (Header, Footer, etc.)
│   │
│   ├── lib/                 # Utility functions & helpers
│   │   ├── supabase.ts      # Supabase client initialization
│   │   └── utils.ts         # Helper functions
│   │
│   ├── config/              # Configuration files
│   │   └── app.ts           # App constants & configuration
│   │
│   ├── hooks/               # Custom React hooks
│   │
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts         # Core types
│   │
│   └── styles/              # Global styles
│       └── globals.css      # Tailwind CSS & global styles
│
├── public/                  # Static files
├── .env.example            # Environment variables template
├── .env.local              # Local env vars (git-ignored)
├── .prettierrc.json        # Prettier formatting
├── next.config.ts          # Next.js configuration
├── vercel.json             # Vercel deployment config
└── package.json            # Dependencies & scripts
```

## 🔧 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 15 + React | Web framework |
| **Styling** | TailwindCSS + shadcn/ui | UI components |
| **Language** | TypeScript | Type safety |
| **Database** | Supabase (PostgreSQL) | Data persistence |
| **Payments** | Whop | Subscription billing |
| **AI** | OpenAI GPT-4o-mini | Routine generation |
| **Email** | Resend | Email delivery |
| **Deployment** | Vercel | Cloud hosting |

## 📋 Project Phases

### Phase 1: Foundation ✅
- [x] Next.js 15 + TypeScript
- [x] TailwindCSS + shadcn/ui setup
- [x] Supabase client initialization
- [x] Environment configuration
- [x] ESLint + Prettier
- [ ] Next: Landing Page

### Phase 2: Landing Page
- [ ] Hero section
- [ ] Newsletter signup
- [ ] "Start free" flow

### Phase 3: Questionnaire & Routine Generation
- [ ] Questionnaire form
- [ ] OpenAI integration
- [ ] Routine generation

### Phase 4: Dashboard & Tracking
- [ ] Dashboard UI
- [ ] Routine checklist
- [ ] Progress tracking

### Phase 5: Coach IA
- [ ] Chat interface
- [ ] OpenAI integration
- [ ] Email digests

### Phase 6: Auth & Payments
- [ ] Email/password authentication
- [ ] Whop checkout
- [ ] Subscription management

### Phase 7: Launch
- [ ] Beta testing
- [ ] Bug fixes
- [ ] Production launch

## 🏃 Available Scripts

```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start prod server
npm run lint             # Run ESLint
npm run format           # Format with Prettier
npm run type-check       # Type checking
```

## 🔐 Environment Setup

1. Copy `.env.example` to `.env.local`
2. Fill in required Supabase credentials:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. (Later phases) Add OpenAI, Whop, Resend keys

See `.env.example` for complete list.

## 🎯 Code Standards

- **TypeScript**: Strict mode, explicit types
- **Components**: Functional, typed props
- **Quality**: ESLint + Prettier before commit
- **Git**: Descriptive commit messages, issue references

## 🚀 Deployment

Deploy to Vercel:
1. Connect GitHub repo at vercel.com
2. Add environment variables
3. Auto-deploys on push to main

## 📧 Support

- **Issues**: GitHub Issues
- **Docs**: PRD & architecture in project docs
- **Questions**: CLAUDE.md for CTO decisions

---

**Status**: Phase 1 ✅ | **Last Updated**: 2026-07-24 | **Version**: 1.0.0-foundation(https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
