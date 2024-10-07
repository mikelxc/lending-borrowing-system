# Lending and Borrowing System

[Open Demo](https://lending-borrowing-system.vercel.app/)

## Overview

This project implements a decentralized lending and borrowing system using Ethereum smart contracts. It allows users to lend ETH, borrow against their collateral, and manage their positions through a user-friendly web interface.

## Features

- Lend ETH and receive cETH (Collateral ETH) tokens
- Borrow ETH against cETH collateral and receive lETH (Liability ETH) tokens
- Redeem cETH tokens for ETH
- Repay borrowed ETH using lETH tokens
- Real-time balance display for ETH, cETH, and lETH
- Responsive web interface for easy interaction

## Project Structure

This project is set up as a monorepo using Turborepo, containing both the smart contract and frontend packages:

```
lending-borrowing-system/
├── apps/
│   ├── contract/
│   │   ├── src/
│   │   ├── test/
│   │   ├── script/
│   │   └── package.json
│   └── web/
│       ├── app/
│       ├── public/
│       └── package.json
├── turbo.json
└── package.json
```

## Technologies Used

- Solidity for smart contracts
- Foundry for smart contract development and testing
- React for the frontend
- Next.js as the React framework
- Wagmi for Ethereum interactions in the frontend
- TailwindCSS and Shadcn UI for styling

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- pnpm (v6 or later)
- Foundry

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/mikelxc/lending-borrowing-system.git
   cd lending-borrowing-system
   ```

2. Install dependencies:
   ```
   pnpm install
   ```

3. Build the project:
   ```
   pnpm run build
   ```

### Smart Contract Deployment

1. Navigate to the smart contract package:
   ```
   cd apps/contract
   ```

2. Set up your `.env` file with your private key and RPC URL:
   ```
   PRIVATE_KEY=your_private_key_here
   LINEA_SEPOLIA_RPC_URL=https://linea-sepolia.infura.io/v3/your_infura_project_id
   LINEASCAN_API_KEY=your_lineascan_api_key
   ```

3. Deploy the contract:
   ```
   pnpm run deploy
   ```

4. Update the `CONTRACT_ADDRESS` in `packages/frontend/src/components/LendingBorrowingSystem.tsx` with the deployed contract address.

### Running the Frontend

1. Navigate to the frontend package:
   ```
   cd apps/web
   ```

2. Start the development server:
   ```
   pnpm run dev
   ```

3. Open your browser and visit `http://localhost:3000`

## Usage

1. Connect your wallet using the "Connect" button.
2. Use the input field to enter the amount of ETH you want to lend, borrow, or redeem.
3. Click the respective buttons to perform actions:
   - "Lend" to lend ETH and receive cETH
   - "Borrow" to borrow ETH against your cETH collateral
   - "Redeem Collateral" to redeem your cETH for ETH
   - "Redeem Liability" to repay your borrowed ETH

## Testing

To run the smart contract tests:

1. Navigate to the smart contract package:
   ```
   cd apps/contract
   ```

2. Run the tests:
   ```
   pnpm run test
   `````
