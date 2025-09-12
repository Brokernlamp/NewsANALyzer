import { Link } from 'react-router-dom'
import { humanizeTopic } from '../lib/format'

interface TopicPillsProps {
  topics: string[]
  currentDate: string
  currentTopic?: string
}

export default function TopicPills({ topics, currentDate, currentTopic }: TopicPillsProps) {
  if (topics.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No topics available for this date</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Topics</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {topics.map((topic) => {
          const isActive = currentTopic === topic
          return (
            <Link
              key={topic}
              to={`/date/${currentDate}/topic/${topic}`}
              className={`group flex items-center gap-3 p-3 rounded-lg border transition shadow-sm hover:shadow ${
                isActive ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200 hover:border-blue-200'
              }`}
              title={humanizeTopic(topic)}
            >
              <span className={`w-8 h-8 flex items-center justify-center rounded-md border ${
                isActive ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 text-gray-600 border-gray-200 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600'
              }`}>📁</span>
              <span className={`text-sm font-medium truncate ${
                isActive ? 'text-blue-800' : 'text-gray-800'
              }`}>{humanizeTopic(topic)}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
