import { put, del, list } from '@vercel/blob'

export async function uploadImage(file: File, filename?: string): Promise<any> {
  const blob = await put(filename || file.name, file, {
    access: 'public',
  })

  return blob
}

export async function deleteImage(url: string): Promise<void> {
  await del(url)
}

export async function listImages(prefix?: string): Promise<any[]> {
  const { blobs } = await list({
    prefix,
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
