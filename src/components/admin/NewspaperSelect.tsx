import { useEffect, useState } from 'react'

interface Newspaper {
  slug: string
  display_name: string
  created_at: string
}

interface NewspaperSelectProps {
  value: string
  onChange: (slug: string) => void
  disabled?: boolean
}

export default function NewspaperSelect({ value, onChange, disabled = false }: NewspaperSelectProps) {
  const [newspapers, setNewspapers] = useState<Newspaper[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
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

    fetchNewspapers()
  }, [])

  if (loading) {
    return (
      <select disabled className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-100">
        <option>Loading newspapers...</option>
      </select>
    )
  }

  if (error) {
    return (
      <div className="text-red-600 text-sm">
        Error: {error}
      </div>
    )
  }

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
    >
      <option value="">Select a newspaper</option>
      {newspapers.map((newspaper) => (
        <option key={newspaper.slug} value={newspaper.slug}>
          {newspaper.display_name}
        </option>
      ))}
    </select>
  )
}
