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
    <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleTodayClick}
              className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              title="Go to today"
            >
              Today
            </button>
            <input
              type="date"
              value={date}
              onChange={handleDateChange}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="text-sm text-gray-500 hidden sm:block">Tip: Press Esc to close PDFs</div>
        </div>
      </div>
    </div>
  )
}
