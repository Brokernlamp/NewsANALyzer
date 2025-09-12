
export default function DemoMode() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Babdi</h1>
          <p className="text-gray-600 mb-4">Supabase env missing</p>
          <div className="text-sm text-gray-500">
            <p>Add to your <code className="bg-gray-100 px-1 rounded">.env</code> file:</p>
            <div className="mt-2 text-left bg-gray-100 p-3 rounded font-mono text-xs">
              <div>VITE_SUPABASE_URL=your-project-url</div>
              <div>VITE_SUPABASE_ANON=your-anon-key</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
