interface PDFViewerProps {
  url: string
  title: string
  onClose: () => void
}

export default function PDFViewer({ url, title, onClose }: PDFViewerProps) {
  // Close on Escape
  if (typeof window !== 'undefined') {
    window.onkeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: 'rgba(0,0,0,0.9)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="flex items-center justify-between px-4 py-3 shadow" style={{ background: '#4f46e5' }}>
        <h3 className="text-white font-semibold truncate pr-3">{title}</h3>
        <button onClick={onClose} className="text-white text-xl leading-none hover:opacity-80">✕</button>
      </div>
      <div className="flex-1 bg-white">
        <iframe src={url} title={title} className="w-full h-full" />
      </div>
    </div>
  )
}


