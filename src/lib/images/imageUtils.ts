// Image URL function for Vercel Blob storage
export function getImageUrl(image: string | null | undefined, width?: number, height?: number): string | null {
  if (!image) return null
  
  // If it's already a URL string, return it
  if (typeof image === 'string') {
    return image
  }
  
  // Return a placeholder image URL for demo
  return `https://via.placeholder.com/${width || 200}x${height || 150}/cccccc/666666?text=Image`
}
