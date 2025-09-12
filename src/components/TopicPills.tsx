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
      
      <div className="flex flex-wrap gap-2">
        {topics.map((topic) => {
          const isActive = currentTopic === topic
          return (
            <Link
              key={topic}
              to={`/date/${currentDate}/topic/${topic}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {humanizeTopic(topic)}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
