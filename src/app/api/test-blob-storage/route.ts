import { NextRequest, NextResponse } from 'next/server'
import { listImages } from '@/lib/storage/blob'

export async function GET(request: NextRequest) {
  try {
    // Test blob storage connection by listing images
    await listImages()
    
    return NextResponse.json({ 
      success: true, 
      message: 'Blob storage connection successful' 
    })
  } catch (error) {
    console.error('Blob storage connection test failed:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Blob storage connection failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
