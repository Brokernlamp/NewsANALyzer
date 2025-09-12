import { useEffect, useState } from 'react'
import NewspaperSelect from './NewspaperSelect'

interface Newspaper {
  slug: string
  display_name: string
  created_at: string
}

export default function NewspaperManager() {
  const [newspapers, setNewspapers] = useState<Newspaper[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  // Add newspaper form
  const [newSlug, setNewSlug] = useState('')
  const [newDisplayName, setNewDisplayName] = useState('')
  const [adding, setAdding] = useState(false)
  
  // Delete newspaper
  const [deleteSlug, setDeleteSlug] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchNewspapers()
  }, [])

  const fetchNewspapers = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/.netlify/functions/sb-newspapers')
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch newspapers')
      }
      
      setNewspapers(data.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch newspapers')
      console.error('Error fetching newspapers:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddNewspaper = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newSlug.trim() || !newDisplayName.trim()) {
      setError('Both slug and display name are required')
      return
    }

    try {
      setAdding(true)
      setError(null)
      setSuccess(null)

      const response = await fetch('/.netlify/functions/sb-newspapers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: newSlug.trim(),
          display_name: newDisplayName.trim()
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add newspaper')
      }

      setSuccess('Newspaper added successfully!')
      setNewSlug('')
      setNewDisplayName('')
      await fetchNewspapers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add newspaper')
      console.error('Error adding newspaper:', err)
    } finally {
      setAdding(false)
    }
  }

  const handleDeleteNewspaper = async () => {
    if (!deleteSlug) {
      setError('Please select a newspaper to delete')
      return
    }

    if (!confirm(`Are you sure you want to delete "${deleteSlug}"? This action cannot be undone.`)) {
      return
    }

    try {
      setDeleting(true)
      setError(null)
      setSuccess(null)

      const response = await fetch('/.netlify/functions/sb-newspapers', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: deleteSlug })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete newspaper')
      }

      setSuccess('Newspaper deleted successfully!')
      setDeleteSlug('')
      await fetchNewspapers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete newspaper')
      console.error('Error deleting newspaper:', err)
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Manage Newspapers</h3>
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Manage Newspapers</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-600">{success}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Add Newspaper */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3">Add New Newspaper</h4>
          <form onSubmit={handleAddNewspaper} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug (URL-friendly name)
                </label>
                <input
                  type="text"
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                  placeholder="e.g., new-times"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={newDisplayName}
                  onChange={(e) => setNewDisplayName(e.target.value)}
                  placeholder="e.g., New Times"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={adding}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {adding ? 'Adding...' : 'Add Newspaper'}
            </button>
          </form>
        </div>

        {/* Delete Newspaper */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3">Delete Newspaper</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Newspaper to Delete
              </label>
              <NewspaperSelect
                value={deleteSlug}
                onChange={setDeleteSlug}
                disabled={deleting}
              />
            </div>
            <button
              onClick={handleDeleteNewspaper}
              disabled={!deleteSlug || deleting}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {deleting ? 'Deleting...' : 'Delete Newspaper'}
            </button>
          </div>
        </div>

        {/* Current Newspapers */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3">Current Newspapers</h4>
          <div className="space-y-2">
            {newspapers.map((newspaper) => (
              <div key={newspaper.slug} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{newspaper.display_name}</p>
                  <p className="text-sm text-gray-600">Slug: {newspaper.slug}</p>
                </div>
                <span className="text-xs text-gray-500">
                  Added {new Date(newspaper.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
