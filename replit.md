# Category Management System

## Overview

This is a full-stack category management application built with a modern tech stack featuring Express.js backend, React frontend, and PostgreSQL database. The system provides comprehensive CRUD operations for managing categories with different types (genre, setting, eventType) through a clean and intuitive web interface.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Build Tool**: Vite for fast development and optimized builds
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for REST API server
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Validation**: Zod schemas for runtime type validation
- **Middleware**: Custom validation, error handling, and request logging

### Repository Structure
- `client/` - React frontend application
- `server/` - Express.js backend server
- `shared/` - Shared TypeScript types and schemas
- `migrations/` - Database migration files (Drizzle)

## Key Components

### Database Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Connection**: Neon serverless connection with WebSocket support
- **Schema**: Centralized schema definitions in `/shared/schema.ts`
- **Tables**: Categories (uuid, name, type, timestamps) and Users (basic auth structure)

### API Layer
- **REST Endpoints**: Full CRUD operations for categories
- **Validation**: Request validation using Zod schemas
- **Error Handling**: Centralized error handling with custom error classes
- **Response Format**: Consistent API response structure with success/error states

### Frontend Components
- **Layout**: Sidebar navigation with responsive design
- **Data Management**: React Query for server state synchronization
- **Forms**: Type-safe forms with validation feedback
- **UI Library**: Comprehensive component system with consistent styling

### Business Logic
- **Category Service**: Encapsulates business rules (duplicate prevention, filtering)
- **Storage Layer**: Abstracted database operations through repository pattern
- **Type Safety**: End-to-end TypeScript with shared schemas

## Data Flow

1. **Request Flow**: Client → React Query → API Routes → Controllers → Services → Storage → Database
2. **Response Flow**: Database → Storage → Services → Controllers → API Response → React Query → UI Update
3. **Validation**: Client-side (React Hook Form + Zod) → Server-side (middleware validation) → Database constraints

## External Dependencies

### Core Dependencies
- **Database**: PostgreSQL via Neon serverless platform
- **UI Components**: Radix UI primitives for accessible components
- **Icons**: Lucide React and React Icons for iconography
- **Validation**: Zod for schema validation across frontend and backend

### Development Tools
- **Type Checking**: TypeScript compiler for static analysis
- **Build Process**: Vite for frontend, ESBuild for backend production builds
- **Development**: Hot module replacement and error overlay for rapid development

## Deployment Strategy

### Production Build
- **Frontend**: Vite builds static assets to `dist/public/`
- **Backend**: ESBuild bundles server code to `dist/index.js`
- **Database**: Drizzle migrations managed via `drizzle-kit`

### Environment Configuration
- **Development**: Uses Vite dev server with Express API proxy
- **Production**: Express serves static frontend files and API routes
- **Database**: Configured via `DATABASE_URL` environment variable

### Hosting Platform
- **Target**: Replit autoscale deployment
- **Port Configuration**: Internal port 5000, external port 80
- **Process Management**: npm scripts for development and production modes

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- June 26, 2025. Initial setup