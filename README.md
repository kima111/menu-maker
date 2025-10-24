# Restaurant Menu Maker

A modern, professional restaurant menu creation tool built with Next.js 16, TypeScript, and Tailwind CSS.

## Features

- 🍽️ **Menu Templates**: Sushi Restaurant and Fancy Restaurant designs
- 🖨️ **Print Ready**: Optimized for Letter, A4, and Legal paper sizes
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile
- 🎨 **Modern UI**: Clean, minimal interface with Tailwind CSS
- 📄 **PDF Export**: High-quality PDF generation
- 🗄️ **Neon Database**: PostgreSQL database with Drizzle ORM
- 📁 **Vercel Blob Storage**: Image and file storage
- 🏪 **Restaurant-Scoped Data**: All data is automatically organized per restaurant

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Database Configuration
# Get this from your Neon database console
DATABASE_URL="postgresql://username:password@hostname:port/database"

# Vercel Blob Storage  
# Get this from your Vercel dashboard under Storage > Blob
BLOB_READ_WRITE_TOKEN="vercel_blob_token_here"
```

**Important**: Without these environment variables, the application will show a "Database not configured" message and won't be able to save data.

### 3. Set Up Database

1. Create a Neon PostgreSQL database at [console.neon.tech](https://console.neon.tech/)
2. Copy the connection string and add it to your `.env.local` as `DATABASE_URL`
3. Run database migrations:
   ```bash
   npm run db:push
   ```

### 4. Set Up File Storage

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to Storage → Blob
3. Create a new Blob store
4. Copy the read/write token and add it to your `.env.local` as `BLOB_READ_WRITE_TOKEN`

### 5. Start Development Server

```bash
npm run dev
```

Navigate to `http://localhost:3000` to see the application.

## Database Commands

- `npm run db:generate` - Generate migration files
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Run migrations
- `npm run db:studio` - Open Drizzle Studio

## Usage

### 1. Create Your First Restaurant

1. Go to the **Restaurants** page
2. Click "Add Restaurant"
3. Fill in your restaurant details
4. Click "Create Restaurant"

The system will automatically:
- Set this as your current restaurant
- Scope all future data to this restaurant
- Enable dish and menu management

### 2. Add Dishes

1. Go to the **Dishes** page
2. Click "Add New Dish"
3. Fill in dish information including:
   - Name and description
   - Price
   - Category
   - Spice level
   - Dietary information
   - Image upload
4. Click "Create Dish"

All dishes are automatically associated with your current restaurant.

### 3. Create Menus

1. Go to the **Menus** page
2. Click "Create New Menu"
3. Select a template (Sushi or Fancy)
4. Add menu sections and dishes
5. Customize the layout
6. Export as PDF when ready

## Database Schema

The database includes the following tables with restaurant-scoped data:
- `restaurants` - Restaurant information
- `dishes` - Individual menu items (scoped to restaurant)
- `menu_sections` - Menu categories/sections (scoped to restaurant)
- `menus` - Complete menus (scoped to restaurant)
- `menu_section_dishes` - Many-to-many relationship between sections and dishes
- `menu_sections_in_menus` - Many-to-many relationship between menus and sections

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Database**: Neon PostgreSQL with Drizzle ORM
- **Storage**: Vercel Blob for images and files
- **UI Components**: Radix UI primitives
- **PDF Generation**: React PDF Renderer
- **Icons**: Lucide React

## Key Features

### Automatic Configuration
- **No User Setup Required**: Database and storage connections are automatic
- **Environment-Based**: Uses environment variables for configuration
- **Zero Configuration**: Works out of the box once environment variables are set

### Restaurant-Scoped Data
- **Data Isolation**: Each restaurant's data is completely separate
- **Automatic Context**: Current restaurant is managed automatically
- **Cross-Reference Integrity**: All related data maintains restaurant relationships

### Real-Time Updates
- **Context Management**: Restaurant context updates all pages automatically
- **Live Data**: Changes reflect immediately across the application
- **Optimistic Updates**: UI updates before server confirmation

## Migration from Sanity

This project has been migrated from Sanity CMS to Neon database + Vercel Blob storage for better performance and cost efficiency. All Sanity-related code has been removed and replaced with:

- Database queries using Drizzle ORM
- Image storage using Vercel Blob
- Modern database schema design
- Restaurant-scoped data architecture

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details