import { humanizeNewspaper } from '../lib/format'

interface NewspaperCardProps {
  newspaper: string
  originalUrl: string | null
  summaryUrl: string | null
  onOpenPdf?: (url: string, title: string) => void
}

export default function NewspaperCard({ newspaper, originalUrl, summaryUrl, onOpenPdf }: NewspaperCardProps) {
  const displayName = humanizeNewspaper(newspaper)

  const handleSummaryClick = () => {
    if (!summaryUrl) return
    if (onOpenPdf) onOpenPdf(summaryUrl, `${displayName} - Summary`)
    else window.open(summaryUrl, '_blank', 'noopener,noreferrer')
  }

  const handleOriginalClick = () => {
    if (!originalUrl) return
    if (onOpenPdf) onOpenPdf(originalUrl, `${displayName} - Original`)
    else window.open(originalUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {displayName}
      </h3>
      
      <div className="space-y-3">
        <button
          onClick={handleSummaryClick}
          disabled={!summaryUrl}
          className={`w-full px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
            summaryUrl
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          <span>📄</span>
          <span>View Summary</span>
        </button>
        
        <button
          onClick={handleOriginalClick}
          disabled={!originalUrl}
          className={`w-full px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
            originalUrl
              ? 'bg-gray-600 text-white hover:bg-gray-700'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          <span>📰</span>
          <span>View Original</span>
        </button>
      </div>
    </div>
  )
}
