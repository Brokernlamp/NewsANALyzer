import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { isValidISTDate, humanizeTopic } from '../lib/format'
import { fetchTopicPdfs } from '../api/queries'
import DateBar from '../components/DateBar'
import TopicResultCard from '../components/TopicResultCard'
import PDFViewer from '../components/PDFViewer'
import { TopicResultCardSkeleton } from '../components/Skeleton'

export default function TopicPage() {
  const { date, slug } = useParams<{ date: string; slug: string }>()
  const navigate = useNavigate()
  const [pdfs, setPdfs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showPDF, setShowPDF] = useState(false)
  const [currentPDF, setCurrentPDF] = useState<{ url: string; title: string } | null>(null)

  useEffect(() => {
    if (!date || !isValidISTDate(date) || !slug) {
      navigate('/')
      return
    }

    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const pdfsData = await fetchTopicPdfs(date, slug)
        setPdfs(pdfsData)
      } catch (err) {
        setError('Failed to load topic PDFs. Please try again.')
        console.error('Error loading topic PDFs:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [date, slug, navigate])

  if (!date || !isValidISTDate(date) || !slug) {
    return null
  }

  const topicName = humanizeTopic(slug)

  return (
    <div className="min-h-screen">
      <DateBar date={date} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Topic Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{topicName}</h1>
          <p className="text-gray-600">PDFs organized by newspaper</p>
        </div>

        {/* PDFs Section */}
        <section>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <TopicResultCardSkeleton key={i} />
              ))}
            </div>
          ) : pdfs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pdfs.map((pdf) => (
                <TopicResultCard
                  key={pdf.newspaper}
                  newspaper={pdf.newspaper}
                  url={pdf.url}
                  onOpenPdf={(url, title) => { setCurrentPDF({ url, title }); setShowPDF(true) }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No PDFs available for this topic on this date</p>
            </div>
          )}
        </section>
      </main>
      {showPDF && currentPDF && (
        <PDFViewer url={currentPDF.url} title={currentPDF.title} onClose={() => setShowPDF(false)} />
      )}
    </div>
  )
}
