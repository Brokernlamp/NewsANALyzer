import { useState } from 'react'

interface UploadCardProps {
  title: string
  description: string
  accept: string
  onUpload: (file: File) => Promise<void>
  disabled?: boolean
}

export default function UploadCard({ title, description, accept, onUpload, disabled = false }: UploadCardProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      setError(null)
      setSuccess(false)
      setProgress(0)

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90))
      }, 200)

      await onUpload(file)

      clearInterval(progressInterval)
      setProgress(100)
      setSuccess(true)
      
      // Reset after 3 seconds
      setTimeout(() => {
        setSuccess(false)
        setProgress(0)
        // Reset file input
        event.target.value = ''
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
      setProgress(0)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      
      <div className="space-y-4">
        <div>
          <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            disabled={disabled || uploading}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
          />
        </div>

        {uploading && (
          <div className="space-y-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600">Uploading... {progress}%</p>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-600">Upload successful!</p>
          </div>
        )}
      </div>
    </div>
  )
}
