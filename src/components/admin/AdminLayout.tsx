import { ReactNode } from 'react'

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="rounded-xl p-6" style={{ background: '#4f46e5' }}>
            <h1 className="text-3xl font-bold text-white">📰 News Today</h1>
            <p className="text-blue-100 mt-1">Daily newspapers and topic-wise PDFs</p>
            <span className="mt-3 inline-block text-xs font-semibold px-2 py-1 bg-white/20 text-white rounded">Admin</span>
          </div>
        </div>
        
        <div className="space-y-8">
          {children}
        </div>
      </div>
    </div>
  )
}
