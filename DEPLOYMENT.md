# Deployment Guide

## Vercel Deployment

This application is ready to deploy to Vercel with automatic database and blob storage connections.

### Prerequisites

1. **Neon Database**: Create a PostgreSQL database at [console.neon.tech](https://console.neon.tech/)
2. **Vercel Blob Storage**: Set up blob storage at [Vercel Dashboard](https://vercel.com/dashboard)

### Environment Variables

Set these environment variables in your Vercel project settings:

```bash
DATABASE_URL=postgresql://username:password@hostname:port/database
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
```

### Deployment Steps

1. **Connect Repository**: Connect your GitHub repository to Vercel
2. **Set Environment Variables**: Add the environment variables in Vercel project settings
3. **Deploy**: Vercel will automatically build and deploy your application
4. **Database Setup**: After deployment, run the database migration:
   ```bash
   npm run db:push
   ```

### Post-Deployment

1. Visit your deployed application
2. Go to Settings to test database and blob storage connections
3. Create your first restaurant
4. Start adding dishes and creating menus

### Features Available After Deployment

- ✅ Automatic database connection
- ✅ Automatic blob storage for images
- ✅ Restaurant-scoped data management
- ✅ Real-time data synchronization
- ✅ PDF menu generation
- ✅ Responsive design

### Troubleshooting

If you encounter issues:

1. **Database Connection**: Check that `DATABASE_URL` is correctly set
2. **Blob Storage**: Verify `BLOB_READ_WRITE_TOKEN` is valid
3. **Build Errors**: Ensure all dependencies are compatible with Next.js 16

The application is designed to work out of the box once environment variables are configured!
