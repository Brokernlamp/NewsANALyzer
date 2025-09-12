import { humanizeNewspaper } from '../lib/format'

interface TopicResultCardProps {
  newspaper: string
  url: string
  onOpenPdf?: (url: string, title: string) => void
}

export default function TopicResultCard({ newspaper, url, onOpenPdf }: TopicResultCardProps) {
  const displayName = humanizeNewspaper(newspaper)

  const handleClick = () => {
    if (onOpenPdf) onOpenPdf(url, `${displayName} - ${'Topic PDF'}`)
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {displayName}
      </h3>
      
      <button
        onClick={handleClick}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        Open PDF
      </button>
    </div>
  )
}
