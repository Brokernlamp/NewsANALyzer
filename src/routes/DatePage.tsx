import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { isValidISTDate } from '../lib/format'
import { fetchIssues, fetchTopics } from '../api/queries'
import DateBar from '../components/DateBar'
import NewspaperCard from '../components/NewspaperCard'
import PDFViewer from '../components/PDFViewer'
import TopicPills from '../components/TopicPills'
import { NewspaperCardSkeleton, TopicPillSkeleton, Skeleton } from '../components/Skeleton'

export default function DatePage() {
  const { date } = useParams<{ date: string }>()
  const navigate = useNavigate()
  const [issues, setIssues] = useState<any[]>([])
  const [topics, setTopics] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showPDF, setShowPDF] = useState(false)
  const [currentPDF, setCurrentPDF] = useState<{ url: string; title: string } | null>(null)

  useEffect(() => {
    if (!date || !isValidISTDate(date)) {
      navigate('/')
      return
    }

    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const [issuesData, topicsData] = await Promise.all([
          fetchIssues(date),
          fetchTopics(date)
        ])
        
        setIssues(issuesData)
        setTopics(topicsData)
      } catch (err) {
        setError('Failed to load data. Please try again.')
        console.error('Error loading date data:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [date, navigate])

  if (!date || !isValidISTDate(date)) {
    return null
  }

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

        {/* Today's Newspapers Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Today's Newspapers</h2>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <NewspaperCardSkeleton key={i} />
              ))}
            </div>
          ) : issues.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {issues.map((issue) => (
                <NewspaperCard
                  key={issue.newspaper}
                  newspaper={issue.newspaper}
                  originalUrl={issue.original_url}
                  summaryUrl={issue.summary_url}
                  onOpenPdf={(url, title) => { setCurrentPDF({ url, title }); setShowPDF(true) }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No newspapers for this date yet</p>
            </div>
          )}
        </section>

        {/* Topics Section */}
        <section>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-32" />
              <div className="flex flex-wrap gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <TopicPillSkeleton key={i} />
                ))}
              </div>
            </div>
          ) : (
            <TopicPills topics={topics} currentDate={date} />
          )}
        </section>
      </main>
      {showPDF && currentPDF && (
        <PDFViewer url={currentPDF.url} title={currentPDF.title} onClose={() => setShowPDF(false)} />
      )}
    </div>
  )
}
