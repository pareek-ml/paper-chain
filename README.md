# AcademicChain - Decentralized Academic Publishing Platform

A decentralized academic publishing platform built on the Internet Computer that enables researchers to submit papers, conduct peer reviews, and earn token-based incentives for quality contributions.

## Features

- **Paper Submission**: Upload papers as files or provide external links (arXiv, ResearchGate, etc.)
- **Peer Review System**: Submit detailed reviews with ratings (1-5 stars)
- **Token Incentives**: 
  - Earn 10 tokens for each paper submission
  - Earn 5 tokens for each review submission
- **Reputation System**: Build your reputation through quality contributions
- **Internet Identity**: Secure authentication using Internet Identity
- **Persistent Storage**: All data stored on-chain with permanent availability

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Motoko (Internet Computer)
- **Authentication**: Internet Identity
- **Storage**: On-chain blob storage for files
- **State Management**: React Query

## Prerequisites

- [DFX SDK](https://internetcomputer.org/docs/current/developer-docs/setup/install/) (version 0.15.0 or later)
- Node.js (version 18 or later)
- pnpm (or npm/yarn)

## Setup

1. **Clone the repository** (or navigate to your project directory)

2. **Install dependencies**:
   ```bash
   cd frontend
   pnpm install
   cd ..
   ```

3. **Start the local Internet Computer replica**:
   ```bash
   dfx start --clean --background
   ```

4. **Deploy the canisters locally**:
   ```bash
   dfx deploy
   ```

5. **Start the development server**:
   ```bash
   cd frontend
   pnpm start
   ```

6. **Open your browser** and navigate to `http://localhost:3000`

## Deployment to Playground

To deploy to the Internet Computer playground:

