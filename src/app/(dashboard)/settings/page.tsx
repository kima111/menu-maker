'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Database, Upload, Settings } from 'lucide-react'
import { toast } from 'sonner'

export default function SettingsPage() {
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'connected' | 'error'>('unknown')
  const [connectionError, setConnectionError] = useState<string | null>(null)

  const testDatabaseConnection = async () => {
    setIsTestingConnection(true)
    setConnectionError(null)

    try {
      // Test database connection by making a simple query
      const response = await fetch('/api/test-db-connection')
      
      if (response.ok) {
        setConnectionStatus('connected')
        toast.success('Database connection successful!')
      } else {
        throw new Error('Database connection failed')
      }
    } catch (error) {
      setConnectionStatus('error')
      setConnectionError(error instanceof Error ? error.message : 'Unknown error')
      toast.error('Database connection failed')
    } finally {
      setIsTestingConnection(false)
    }
  }

  const testBlobStorage = async () => {
    try {
      const response = await fetch('/api/test-blob-storage')
      
      if (response.ok) {
        toast.success('Blob storage connection successful!')
      } else {
        throw new Error('Blob storage connection failed')
      }
    } catch (error) {
      toast.error('Blob storage connection failed')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-600 mt-1">
          Manage your application settings and connections
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Database Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Database Connection
            </CardTitle>
            <CardDescription>
              Neon PostgreSQL database configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Connection Status</p>
                <div className="flex items-center mt-1">
                  {connectionStatus === 'connected' && (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        Connected
                      </Badge>
                    </>
                  )}
                  {connectionStatus === 'error' && (
                    <>
                      <XCircle className="h-4 w-4 text-red-500 mr-2" />
                      <Badge variant="destructive">
                        Error
                      </Badge>
                    </>
                  )}
                  {connectionStatus === 'unknown' && (
                    <Badge variant="outline">
                      Unknown
                    </Badge>
                  )}
                </div>
              </div>
              <Button 
                onClick={testDatabaseConnection} 
                disabled={isTestingConnection}
                variant="outline"
              >
                {isTestingConnection ? 'Testing...' : 'Test Connection'}
              </Button>
            </div>

            {connectionError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{connectionError}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="database-url">Database URL</Label>
              <Input
                id="database-url"
                type="password"
                placeholder="postgresql://..."
                value="••••••••••••••••"
                disabled
              />
              <p className="text-xs text-gray-500">
                Set DATABASE_URL in your environment variables
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Blob Storage Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="h-5 w-5 mr-2" />
              File Storage
            </CardTitle>
            <CardDescription>
              Vercel Blob storage for images and files
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Storage Status</p>
                <Badge variant="outline" className="mt-1">
                  Vercel Blob
                </Badge>
              </div>
              <Button 
                onClick={testBlobStorage}
                variant="outline"
              >
                Test Storage
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="blob-token">Blob Token</Label>
              <Input
                id="blob-token"
                type="password"
                placeholder="vercel_blob_token_..."
                value="••••••••••••••••"
                disabled
              />
              <p className="text-xs text-gray-500">
                Set BLOB_READ_WRITE_TOKEN in your environment variables
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Environment Variables Help */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Environment Variables
          </CardTitle>
          <CardDescription>
            Required environment variables for the application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Required Variables:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <code className="font-mono">DATABASE_URL</code>
                  <Badge variant="outline">Required</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <code className="font-mono">BLOB_READ_WRITE_TOKEN</code>
                  <Badge variant="outline">Required</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <code className="font-mono">NEXTAUTH_SECRET</code>
                  <Badge variant="outline">Required</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <code className="font-mono">NEXTAUTH_URL</code>
                  <Badge variant="outline">Required</Badge>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-2">Setup Instructions:</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                <li>Create a Neon PostgreSQL database and copy the connection string</li>
                <li>Set up Vercel Blob storage and get the read/write token</li>
                <li>Add all required variables to your <code className="bg-gray-100 px-1 rounded">.env.local</code> file</li>
                <li>Run <code className="bg-gray-100 px-1 rounded">npm run db:push</code> to set up the database schema</li>
                <li>Restart your development server</li>
              </ol>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Need Help?</h4>
              <p className="text-blue-700 text-sm">
                Check the <code className="bg-blue-100 px-1 rounded">DATABASE_SETUP.md</code> file for detailed setup instructions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}