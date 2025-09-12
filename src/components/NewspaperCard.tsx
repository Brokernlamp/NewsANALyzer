import { humanizeNewspaper } from '../lib/format'

interface NewspaperCardProps {
  newspaper: string
  originalUrl: string | null
  summaryUrl: string | null
}

export default function NewspaperCard({ newspaper, originalUrl, summaryUrl }: NewspaperCardProps) {
  const displayName = humanizeNewspaper(newspaper)

  const handleSummaryClick = () => {
    if (summaryUrl) {
      window.open(summaryUrl, '_blank', 'noopener,noreferrer')
    }
  }

  const handleOriginalClick = () => {
    if (originalUrl) {
      window.open(originalUrl, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {displayName}
      </h3>
      
      <div className="space-y-3">
        <button
          onClick={handleSummaryClick}
          disabled={!summaryUrl}
          className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
            summaryUrl
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          Summary
        </button>
        
        <button
          onClick={handleOriginalClick}
          disabled={!originalUrl}
          className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
            originalUrl
              ? 'bg-gray-600 text-white hover:bg-gray-700'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          Original
        </button>
      </div>
    </div>
  )
}
