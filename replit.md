# Soundpath - Music Discovery Platform

## Overview

This is a full-stack music directory application that celebrates the magic where music and location come together. Built as a "digital travel zine meets music atlas," the platform focuses on discovering extraordinary musical experiences around the world - from rooftop DJ sets in Medellín to folk concerts in Icelandic wilderness. The system features comprehensive event and category management with a cinematic, minimalist design using a dark color palette with orange accents.

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

## Recent Changes

- June 26, 2025: Initial category and event management system setup
- June 26, 2025: Enhanced event creation with city autocomplete and rich text editor  
- June 26, 2025: Rebranded to "Soundpath" with complete home page redesign inspired by The Sound Trek
- June 26, 2025: Added cinematic hero section with animated particles and gradient backgrounds
- June 26, 2025: Implemented inline submit event form replacing modal popup
- June 26, 2025: Added interactive map section with event location markers
- June 26, 2025: Enhanced event cards with hero image support and improved animations
- June 26, 2025: Added custom CSS animations (fade-in, float, pulse-glow, gradient-shift)
- June 27, 2025: Complete redesign with Kinfolk magazine aesthetic - neutral colors, elegant typography, minimalist layout
- June 27, 2025: Added Playfair Display serif font and Inter sans-serif for editorial typography
- June 27, 2025: Implemented scroll-triggered animations for smooth, professional interaction
- June 27, 2025: Redesigned with cream/beige/charcoal color palette replacing dark theme
- June 27, 2025: Added magazine-style grid layouts and editorial content presentation
- June 28, 2025: Added date field to events table with indexing for efficient sorting
- June 28, 2025: Seeded 20 realistic events with diverse locations, dates, and rich imagery
- June 28, 2025: Created "🕵️‍♀️ Last Discoveries" section showing 6 most recent events by date
- June 28, 2025: Created "💎 Hidden Gems" section showing 6 oldest events by date
- June 28, 2025: Enhanced event cards with date display, location info, and category badges

## Key Features

### Home Page Experience
- Cinematic hero section with "Sonic Atlas" branding and search functionality
- Dark color palette (grays and blacks) with orange accent colors for buttons and highlights
- Latest Discoveries section showcasing newest events
- Hidden Gems section featuring randomized event selection
- Integrated event submission modal accessible from multiple CTAs
- Professional footer with navigation links and branding

### Event Management
- Rich text editor (React Quill) for detailed event descriptions with formatting
- Intelligent city autocomplete with continent → country → city hierarchy
- Comprehensive filtering by location, categories, and tags
- Full CRUD operations with validation

### Visual Design
- Minimalist aesthetic focusing on visual storytelling
- Orange outlined buttons as primary interactive elements
- Responsive grid layouts for event displays
- Smooth transitions and hover effects
- Consistent typography and spacing