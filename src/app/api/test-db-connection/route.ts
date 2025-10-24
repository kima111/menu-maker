import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/config'

export async function GET(request: NextRequest) {
  try {
    // Check if database is configured
    if (!db) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Database not configured. Please set DATABASE_URL environment variable.',
          error: 'DATABASE_URL environment variable is not set'
        },
        { status: 500 }
      )
    }

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
