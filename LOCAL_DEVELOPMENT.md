# Sonic Paths - Local Development Setup

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (version 18 or higher) - [Download from nodejs.org](https://nodejs.org/)
- **PostgreSQL** (version 12 or higher) - [Download from postgresql.org](https://www.postgresql.org/download/)
- **Git** - [Download from git-scm.com](https://git-scm.com/)

## Project Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd sonic-paths
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

#### Option A: Local PostgreSQL Database

1. **Start PostgreSQL service** (varies by OS):
   - Windows: Start via Services or pgAdmin
   - macOS: `brew services start postgresql`
   - Linux: `sudo systemctl start postgresql`

2. **Create a database**:
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database and user
CREATE DATABASE sonic_paths;
CREATE USER sonic_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE sonic_paths TO sonic_user;
\q
```

3. **Set up environment variables** (see Environment Configuration below)

#### Option B: Use Neon (Cloud PostgreSQL)

1. Sign up at [neon.tech](https://neon.tech/)
2. Create a new project
3. Get your connection string from the dashboard
4. Use it as your `DATABASE_URL`

### 4. Environment Configuration

Create a `.env` file in the root directory:

```bash
# Database Configuration
DATABASE_URL=postgresql://sonic_user:your_password@localhost:5432/sonic_paths
PGHOST=localhost
PGPORT=5432
PGUSER=sonic_user
PGPASSWORD=your_password
PGDATABASE=sonic_paths

# Google Maps API (Optional - for map functionality)
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

**To get a Google Maps API Key:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable "Maps JavaScript API" and "Places API"
4. Create credentials (API Key)
5. Enable billing (required for map display)
6. Add your API key to the `.env` file

### 5. Database Migration

Run the database migration to set up tables:

```bash
npm run db:push
```

### 6. Seed Sample Data (Optional)

To populate the database with sample events:

```bash
npm run db:seed
```

## Development Scripts

### Primary Development Commands

```bash
# Start the full application (frontend + backend)
npm run dev

# Build the application for production
npm run build

# Start production build locally
npm start
```

### Database Management

```bash
# Push schema changes to database
npm run db:push

# Generate database migration files
npm run db:generate

# View database in Drizzle Studio (GUI)
npm run db:studio

# Seed sample data
npm run db:seed
```

### Development Utilities

```bash
# Type checking
npm run type-check

# Lint code
npm run lint

# Format code
npm run format
```

## Local Development Workflow

### 1. Start Development Server

```bash
npm run dev
```

This will start:
- **Frontend**: Vite dev server on `http://localhost:5173` (with hot reload)
- **Backend**: Express server on `http://localhost:5000`
- **Proxy**: Frontend proxies API calls to backend automatically

### 2. Access the Application

Open your browser and navigate to: `http://localhost:5173`

### 3. Database Management

**View data in browser:**
```bash
npm run db:studio
```
This opens Drizzle Studio at `http://localhost:4983`

**Make schema changes:**
1. Edit `shared/schema.ts`
2. Run `npm run db:push` to apply changes

### 4. API Testing

The API is available at `http://localhost:5000/api/`

**Example endpoints:**
- `GET /api/events` - List all events
- `POST /api/events` - Create new event
- `GET /api/categories` - List categories
- `POST /api/categories` - Create category

**Test with curl:**
```bash
# Get all events
curl http://localhost:5000/api/events

# Create a new event
curl -X POST http://localhost:5000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Event",
    "continent": "North America",
    "country": "United States",
    "city": "New York",
    "shortDescription": "A test event"
  }'
```

## Project Structure

```
sonic-paths/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utilities
│   └── index.html
├── server/                 # Express backend
│   ├── controllers/        # Route handlers
│   ├── services/           # Business logic
│   ├── middlewares/        # Express middlewares
│   └── index.ts            # Server entry point
├── shared/                 # Shared code
│   ├── schema.ts           # Database schema
│   └── config.ts           # App configuration
├── package.json
└── .env                    # Environment variables
```

## Features Available Locally

### ✅ Working Features
- Event creation and management
- Category management
- Rich text editor for event descriptions
- Location-based event filtering
- Responsive design
- Database persistence
- API endpoints

### 🔧 Requires Setup
- **Google Maps Integration**: Requires API key with billing enabled
- **Email notifications**: Would need email service configuration
- **File uploads**: Currently using placeholder images

## Troubleshooting

### Common Issues

**1. Database Connection Error**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
- Ensure PostgreSQL is running
- Check database credentials in `.env`
- Verify database exists

**2. Port Already in Use**
```
Error: listen EADDRINUSE :::5000
```
- Kill process using the port: `npx kill-port 5000`
- Or change port in `server/index.ts`

**3. Node Modules Issues**
```bash
rm -rf node_modules package-lock.json
npm install
```

**4. Database Schema Issues**
```bash
npm run db:push --force
```

### Logs and Debugging

**Backend logs:** Check terminal running `npm run dev`
**Frontend logs:** Open browser developer tools (F12)
**Database queries:** Enable in `server/db.ts` by uncommenting logger

## Deployment Preparation

### Local Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Environment Variables for Production

```bash
NODE_ENV=production
DATABASE_URL=your_production_database_url
VITE_GOOGLE_MAPS_API_KEY=your_api_key
```

## Additional Resources

- **Database Schema**: See `shared/schema.ts`
- **API Documentation**: Check `server/routes.ts` for endpoints
- **Component Library**: Uses Shadcn/ui components
- **Styling**: Tailwind CSS with custom theme

## Getting Help

If you encounter issues:

1. Check the console logs (browser and terminal)
2. Verify environment variables are set correctly
3. Ensure database is running and accessible
4. Check that all dependencies are installed
5. Try clearing node_modules and reinstalling

## Next Steps

Once you have the project running locally:

1. **Explore the codebase** - Start with `client/src/pages/home.tsx`
2. **Test API endpoints** - Use the examples above
3. **Customize styling** - Edit Tailwind classes in components
4. **Add features** - Follow the existing patterns in the codebase
5. **Deploy** - Use Replit for easy deployment

---

**Need help?** Check the project documentation in `replit.md` for more technical details about the architecture and recent changes.