# Raze

> Plug-and-play AI commerce layer for agentic shopping and Razorpay-powered payments.

Raze enables AI agents to discover products, understand merchant catalogs, guide customers, and securely complete transactions through Razorpay.

## Core Vision

AI Buyer → Raze → Merchant → Razorpay → Payment

## Features

- AI-powered product discovery and recommendations
- Conversational checkout
- Razorpay-powered AI transactions
- Bounded, gated, and explainable payments
- Intelligent payment failure recovery
- Merchant AI for upselling and revenue recovery
- Agent action audit trail
- Plug-and-play merchant integration

## Tech Stack

Frontend: Next.js, React, TypeScript, Tailwind CSS  
Backend: Node.js, Express, TypeScript  
Database: PostgreSQL, Prisma  
Payments: Razorpay  
AI: LLM-powered agents  
Infrastructure: pnpm, Turborepo

## Architecture

raze/
├── apps/
│   ├── web/           # Merchant dashboard and AI commerce interface
│   ├── api/           # Backend, agents and payment APIs
│   └── demo-store/    # Example merchant storefront
│
└── packages/
    └── commerce-sdk/  # Plug-and-play merchant SDK

## Current Status

Implemented:

- Monorepo setup
- Next.js web application
- Express API
- PostgreSQL database
- Prisma ORM
- Merchant API
- Product API
- AI-readable catalog API
- Commerce database models
- Agent action and audit log models

In development:

- Razorpay integration
- AI Buyer
- Conversational checkout
- Payment failure recovery
- Merchant Growth Agent
- Commerce SDK
- Merchant dashboard

## Buildathon

Raze is being built for the Razorpay AI Growth & Agentic Commerce Buildathon.

The goal is to create a commerce layer that allows AI agents to safely discover, recommend, and transact with existing merchants.

> From customer intent to completed transaction, powered by AI.