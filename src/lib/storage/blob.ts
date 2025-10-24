import { put, del, list } from '@vercel/blob'

export async function uploadImage(file: File, filename?: string): Promise<any> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error('BLOB_READ_WRITE_TOKEN environment variable is required')
  }

  const blob = await put(filename || file.name, file, {
    access: 'public',
    token: process.env.BLOB_READ_WRITE_TOKEN,
  })

  return blob
}

export async function deleteImage(url: string): Promise<void> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error('BLOB_READ_WRITE_TOKEN environment variable is required')
  }

  await del(url, {
    token: process.env.BLOB_READ_WRITE_TOKEN,
  })
}

export async function listImages(prefix?: string): Promise<any[]> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error('BLOB_READ_WRITE_TOKEN environment variable is required')
  }

  const { blobs } = await list({
    prefix,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  })

  return blobs
}

// Utility function to get image URL with optional transformations
export function getImageUrl(imageUrl: string | null, width?: number, height?: number): string | null {
  if (!imageUrl) return null
  
  // If it's already a URL string, return it
  if (typeof imageUrl === 'string') {
    return imageUrl
  }
  
  // Return a placeholder image URL for demo
  return `https://via.placeholder.com/${width || 200}x${height || 150}/cccccc/666666?text=Image`
}
