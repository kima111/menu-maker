import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/config'

export async function GET(request: NextRequest) {
  try {
    // Test database connection with a simple query
    await db.execute('SELECT 1 as test')
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connection successful' 
    })
  } catch (error) {
    console.error('Database connection test failed:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
