import { useNavigate } from 'react-router-dom'
import { getTodayIST } from '../lib/format'

interface DateBarProps {
  date: string
}

export default function DateBar({ date }: DateBarProps) {
  const navigate = useNavigate()

  const handleTodayClick = () => {
    const today = getTodayIST()
    navigate(`/date/${today}`)
  }

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = event.target.value
    if (newDate) {
      navigate(`/date/${newDate}`)
    }
  }

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={handleTodayClick}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Today
          </button>
          
          <input
            type="date"
            value={date}
            onChange={handleDateChange}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  )
}
