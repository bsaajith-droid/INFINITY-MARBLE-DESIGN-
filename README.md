# Infinity Marble Design

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/bsaajith-7514s-projects/v0-infinity-marble-design)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/fnzTvTAcUyQ)

## Overview

This is a modern web application for showcasing marble and stone products with porcelain tiles. Built with Next.js, React, and powered by FAL AI for image processing.

## Tech Stack

- **Framework:** Next.js 16 with React 19
- **Styling:** Tailwind CSS 4 with Radix UI components
- **Language:** TypeScript
- **AI:** FAL AI serverless client for image generation/processing
- **State Management:** Zustand
- **Forms:** React Hook Form with Zod validation
- **Package Manager:** pnpm

## Getting Started

### Prerequisites

- Node.js 18+ or pnpm 8+
- FAL AI API key (get from [fal.ai/dashboard](https://fal.ai/dashboard))

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/bsaajith-droid/INFINITY-MARBLE-DESIGN-.git
   cd INFINITY-MARBLE-DESIGN-
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.local.example .env.local
   ```
   Then edit `.env.local` and add your FAL AI API key:
   ```
   FAL_KEY=your_actual_fal_api_key
   ```

### Development

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build & Production

Build the application:

```bash
pnpm build
pnpm start
```

### Linting & Type Checking

Check for TypeScript errors:

```bash
pnpm type-check
```

Run ESLint:

```bash
pnpm lint
pnpm lint:fix  # Auto-fix issues
```

## Project Structure

```
.
├── app/              # Next.js app directory (pages, layouts)
├── components/       # React components (UI, features)
├── lib/             # Utilities and helpers
├── hooks/           # Custom React hooks
├── public/          # Static assets (images, icons)
├── package.json     # Dependencies and scripts
├── tsconfig.json    # TypeScript configuration
├── next.config.mjs  # Next.js configuration
└── tailwind.config.js # Tailwind CSS configuration
```

## Deployment

This project is deployed on Vercel and automatically syncs with v0.app:

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

**Live Deployment:** [https://vercel.com/bsaajith-7514s-projects/v0-infinity-marble-design](https://vercel.com/bsaajith-7514s-projects/v0-infinity-marble-design)

## Using FAL AI

To use FAL AI in your application:

```typescript
import { fal } from '@fal-ai/serverless-client';

const result = await fal.subscribe('path/to/model', {
  input: {
    // your input parameters
  },
});
```

Refer to [FAL AI Documentation](https://fal.ai/docs) for available models and usage.

## Troubleshooting

### Build Errors
- Run `pnpm install` to ensure all dependencies are installed
- Delete `node_modules` and `.pnpm-lock.yaml` if issues persist
- Run `pnpm type-check` to identify TypeScript errors

### FAL AI Issues
- Verify your FAL_KEY is correctly set in `.env.local`
- Check FAL AI dashboard for API quota and usage
- Ensure the model path is correct

### Styling Issues
- Clear Next.js cache: `rm -rf .next`
- Rebuild: `pnpm build`

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [FAL AI Docs](https://fal.ai/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Radix UI](https://www.radix-ui.com)
- [React Hook Form](https://react-hook-form.com)

## Support

For issues or questions:
1. Check the [v0.app chat](https://v0.app/chat/fnzTvTAcUyQ)
2. Review this README and troubleshooting section
3. Check the GitHub issues page

## License

This project is automatically synced from v0.app.
