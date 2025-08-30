# Overview

PC Today is a comprehensive e-commerce platform specializing in electronics, built as a Kenya-focused marketplace. The application features a full-stack architecture with React/TypeScript frontend, Express.js backend, and PostgreSQL database with Drizzle ORM. It includes features like product management, shopping cart, order processing with cash-on-delivery, admin dashboard, and PWA capabilities for mobile users.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client is built with React 18 and TypeScript, using Vite as the build tool and development server. The UI is constructed with shadcn/ui components built on Radix UI primitives and styled with Tailwind CSS. The application uses Wouter for client-side routing and TanStack Query for server state management and caching.

Key architectural decisions:
- **Component Library**: shadcn/ui provides consistent, accessible UI components with customizable styling
- **State Management**: TanStack Query handles server state, while React Context manages cart state with localStorage persistence
- **Routing**: Wouter chosen for lightweight client-side routing over React Router
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming

## Backend Architecture
The server is built with Express.js and TypeScript, using a modular structure with separate layers for routing, storage, and database operations. Authentication is handled through Replit's OpenID Connect integration with session-based storage.

Key architectural decisions:
- **Database Layer**: Drizzle ORM provides type-safe database operations with PostgreSQL
- **Authentication**: Replit Auth integration for seamless user management within the Replit ecosystem
- **Session Management**: PostgreSQL-backed sessions using connect-pg-simple for scalability
- **API Structure**: RESTful endpoints with consistent error handling and request logging

## Data Storage Solutions
PostgreSQL database with Drizzle ORM for schema management and migrations. The database schema includes tables for users, products, categories, orders, and sessions. Relationships are properly defined with foreign keys and indexes for performance.

Schema design choices:
- **User Management**: Integration with Replit's user system while maintaining local user profiles
- **Product Organization**: Hierarchical category structure with slug-based URLs for SEO
- **Order Processing**: Separate order and order items tables for flexibility and reporting
- **Session Storage**: Database-backed sessions for horizontal scaling

## Authentication and Authorization
Uses Replit's OpenID Connect for authentication with role-based access control. Admin users have additional permissions for product and category management. Session management is handled server-side with secure cookies.

Security considerations:
- **Session Security**: HTTP-only, secure cookies with configurable TTL
- **Role-Based Access**: Admin role checks for sensitive operations
- **API Protection**: Authentication middleware on protected routes

# External Dependencies

## Third-Party Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Replit Authentication**: OpenID Connect provider for user authentication
- **Unsplash**: Image hosting for product photos and marketing content

## Key Libraries and Frameworks
- **Frontend**: React 18, TypeScript, Vite, TanStack Query, Wouter, shadcn/ui, Tailwind CSS
- **Backend**: Express.js, Drizzle ORM, Passport.js for auth, connect-pg-simple for sessions
- **Database**: PostgreSQL with Neon serverless driver
- **Development**: ESBuild for server bundling, PostCSS for CSS processing

## PWA Features
The application includes Progressive Web App capabilities with service worker registration, web app manifest, and offline caching strategies. This enables mobile users to install the app and access basic functionality offline.

PWA implementation:
- **Service Worker**: Caches static assets and provides offline fallbacks
- **Web Manifest**: Enables installation on mobile devices with proper app metadata
- **Meta Tags**: Comprehensive SEO and social media optimization