import { useEffect, useState } from 'react'

interface Asset {
  id: string
  type: 'archive' | 'original'
  url: string
  created_at: string
}

interface AssetsTableProps {
  date: string
  newspaper: string
  refreshToken?: number
}

export default function AssetsTable({ date, newspaper, refreshToken }: AssetsTableProps) {
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (date && newspaper) {
      fetchAssets()
    }
  }, [date, newspaper, refreshToken])

  const fetchAssets = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/.netlify/functions/sb-files?date=${date}&newspaper=${newspaper}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch assets')
      }
      
      setAssets(data.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch assets')
      console.error('Error fetching assets:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAsset = async (assetId: string) => {
    if (!confirm('Are you sure you want to delete this asset? This action cannot be undone.')) {
      return
    }

    try {
      setError(null)
      
      const response = await fetch('/.netlify/functions/sb-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: assetId })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete asset')
      }
      
      // Refresh the assets list
      await fetchAssets()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete asset')
      console.error('Error deleting asset:', err)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Assets for {newspaper} - {date}</h3>
        <p className="text-gray-600">Loading assets...</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Assets for {newspaper} - {date}
        </h3>
        <button
          onClick={fetchAssets}
          className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {assets.length === 0 ? (
        <p className="text-gray-600">No assets found for this date and newspaper.</p>
      ) : (
        <div className="space-y-3">
          {assets.map((asset) => (
            <div key={asset.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className={`w-3 h-3 rounded-full ${
                    asset.type === 'archive' ? 'bg-blue-500' : 'bg-green-500'
                  }`} />
                </div>
                <div>
                  <p className="font-medium text-gray-900 capitalize">
                    {asset.type} file
                  </p>
                  <p className="text-sm text-gray-600">
                    Uploaded {new Date(asset.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <a
                  href={asset.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                >
                  View
                </a>
                <button
                  onClick={() => handleDeleteAsset(asset.id)}
                  className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
