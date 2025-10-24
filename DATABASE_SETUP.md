# Database and Storage Setup

This project now uses Neon PostgreSQL database and Vercel Blob storage instead of Sanity CMS.

## Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Database
DATABASE_URL="postgresql://username:password@hostname:port/database"

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN="your_vercel_blob_token"

# NextAuth.js
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"
```

## Setup Instructions

### 1. Neon Database Setup
1. Go to [Neon Console](https://console.neon.tech/)
2. Create a new project
3. Copy the connection string and add it to your `.env.local` as `DATABASE_URL`
4. Run database migrations: `npm run db:push`

### 2. Vercel Blob Storage Setup
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to Storage → Blob
3. Create a new Blob store
4. Copy the read/write token and add it to your `.env.local` as `BLOB_READ_WRITE_TOKEN`

### 3. Database Commands
- `npm run db:generate` - Generate migration files
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Run migrations
- `npm run db:studio` - Open Drizzle Studio

## Database Schema

The database includes the following tables:
- `restaurants` - Restaurant information
- `dishes` - Individual menu items
- `menu_sections` - Menu categories/sections
- `menus` - Complete menus
- `menu_section_dishes` - Many-to-many relationship between sections and dishes
- `menu_sections_in_menus` - Many-to-many relationship between menus and sections

## Migration from Sanity

All Sanity-related code has been removed and replaced with:
- Database queries using Drizzle ORM
- Image storage using Vercel Blob
- Local storage fallback for dishes (temporary during migration)
