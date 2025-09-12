interface PDFViewerProps {
  url: string
  title: string
  onClose: () => void
}

function buildViewableUrl(originalUrl: string): { url: string; usedFallback: boolean } {
  let parsed: URL | null = null
  try {
    parsed = new URL(originalUrl)
  } catch {
    return { url: originalUrl, usedFallback: false }
  }

  // Prefer inline rendering if ImageKit supports attachment toggle
  if (parsed.searchParams && parsed.host.includes('imagekit')) {
    if (!parsed.searchParams.has('ik-attachment')) {
      parsed.searchParams.set('ik-attachment', 'false')
    }
    return { url: parsed.toString(), usedFallback: false }
  }

  // Android WebView often downloads PDFs instead of rendering
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent.toLowerCase() : ''
  const isAndroidWebView = ua.includes('android') || ua.includes('wv') || ua.includes('okhttp')
  if (isAndroidWebView) {
    const gview = 'https://docs.google.com/gview?embedded=1&url=' + encodeURIComponent(originalUrl)
    return { url: gview, usedFallback: true }
  }

  return { url: originalUrl, usedFallback: false }
}

export default function PDFViewer({ url, title, onClose }: PDFViewerProps) {
  // Close on Escape
  if (typeof window !== 'undefined') {
    window.onkeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
  }

  const { url: viewUrl, usedFallback } = buildViewableUrl(url)

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
        {usedFallback && (
          <div className="px-3 py-1 text-xs text-gray-600">Using fallback viewer for better compatibility.</div>
        )}
        <iframe src={viewUrl} title={title} className="w-full h-full" />
      </div>
    </div>
  )
}


