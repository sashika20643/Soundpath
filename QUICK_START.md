# 🎵 Sonic Paths - Quick Start Guide

## One-Command Setup

```bash
# Clone and setup (replace with your repo URL)
git clone <your-repo-url>
cd sonic-paths
node setup-local.js
```

## Available Scripts

Since package.json editing is restricted in this environment, here are the equivalent commands you can run:

### Core Development
```bash
# Start development server (frontend + backend)
NODE_ENV=development tsx server/index.ts

# Alternative: Use the provided script
./run-local.sh
```

### Database Management
```bash
# Push schema changes to database
npx drizzle-kit push

# Generate migration files
npx drizzle-kit generate

# Open database studio (GUI)
npx drizzle-kit studio

# Seed sample events
tsx server/seed-events.ts
```

### Build & Production
```bash
# Build for production
vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

# Start production build
NODE_ENV=production node dist/index.js

# Type checking
npx tsc --noEmit
```

## 5-Minute Setup

1. **Prerequisites**: Node.js 18+, PostgreSQL, Git

2. **Database Setup**:
```sql
-- In PostgreSQL
CREATE DATABASE sonic_paths;
CREATE USER sonic_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE sonic_paths TO sonic_user;
```

3. **Environment Variables** (create `.env`):
```env
DATABASE_URL=postgresql://sonic_user:your_password@localhost:5432/sonic_paths
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
```

4. **Install & Run**:
```bash
npm install
npx drizzle-kit push
tsx server/seed-events.ts
NODE_ENV=development tsx server/index.ts
```

5. **Access**: Open `http://localhost:5173`

## Development URLs

- **Frontend**: http://localhost:5173 (Vite dev server)
- **Backend API**: http://localhost:5000 (Express server)
- **Database Studio**: http://localhost:4983 (run `npx drizzle-kit studio`)

## Project Features

### Current Features
- ✅ Event creation and management
- ✅ Category-based filtering
- ✅ Rich text editor for descriptions
- ✅ Location-based organization (continent → country → city)
- ✅ Responsive design with Tailwind CSS
- ✅ PostgreSQL database with Drizzle ORM
- ✅ RESTful API endpoints

### Map Integration
- 🔧 Google Maps with markers (requires API key + billing)
- 📍 Automatic coordinate generation for events
- 🗺️ Interactive popups with event details

### Google Maps Setup
1. Get API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable "Maps JavaScript API" and "Places API"
3. Enable billing account (required for map display)
4. Add key to `.env` as `VITE_GOOGLE_MAPS_API_KEY`

## API Endpoints

### Events
- `GET /api/events` - List events with filtering
- `POST /api/events` - Create new event
- `GET /api/events/:id` - Get event details
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Categories
- `GET /api/categories` - List all categories
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Example API Usage
```bash
# Create event
curl -X POST http://localhost:5000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Jazz Night in NYC",
    "continent": "North America",
    "country": "United States", 
    "city": "New York",
    "shortDescription": "Amazing jazz performance",
    "description": "<p>Join us for an unforgettable evening of jazz...</p>"
  }'
```

## File Structure

```
sonic-paths/
├── client/src/           # React frontend
│   ├── components/       # Reusable UI components
│   ├── pages/           # Page components
│   ├── hooks/           # Custom React hooks
│   └── lib/             # Utilities & API client
├── server/              # Express backend
│   ├── controllers/     # Route handlers
│   ├── services/        # Business logic
│   └── validators/      # Input validation
├── shared/              # Shared types & schemas
└── LOCAL_DEVELOPMENT.md # Detailed setup guide
```

## Troubleshooting

### Common Issues

**Database connection error**:
- Check PostgreSQL is running
- Verify credentials in `.env`
- Ensure database exists

**Port conflicts**:
- Kill processes: `npx kill-port 5000` or `npx kill-port 5173`

**Module issues**:
```bash
rm -rf node_modules package-lock.json
npm install
```

**Schema changes not applying**:
```bash
npx drizzle-kit push --force
```

## Development Tips

1. **Hot Reload**: Frontend changes reload automatically
2. **Backend Changes**: Restart server manually or use nodemon
3. **Database Changes**: Always run `npx drizzle-kit push` after schema edits
4. **Debugging**: Check browser console and terminal logs
5. **API Testing**: Use curl commands or tools like Postman

## Next Steps

Once running locally:
1. Explore the event creation forms
2. Test the filtering functionality  
3. Set up Google Maps for full map integration
4. Customize the styling and branding
5. Add your own events and categories

---

For detailed documentation, see `LOCAL_DEVELOPMENT.md`