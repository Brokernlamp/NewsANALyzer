import { useMemo, useState } from 'react'

interface IssueBundleCardProps {
  date: string
  newspaper: string
  disabled?: boolean
}

export default function IssueBundleCard({ date, newspaper, disabled = false }: IssueBundleCardProps) {
  const [originalFile, setOriginalFile] = useState<File | null>(null)
  const [bundleFiles, setBundleFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const isReadyToUpload = useMemo(() => {
    if (!originalFile) return false
    if (bundleFiles.length === 0) return false
    // Require at least a summary.pdf in the bundle
    const hasSummary = bundleFiles.some(f => f.name.toLowerCase().includes('summary'))
    return hasSummary
  }, [originalFile, bundleFiles])

  const handleOriginalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setOriginalFile(file ?? null)
    setError(null)
    setSuccess(null)
  }

  const handleFolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    setBundleFiles(Array.from(files))
    setError(null)
    setSuccess(null)
  }

  const clearAll = () => {
    setOriginalFile(null)
    setBundleFiles([])
    setError(null)
    setSuccess(null)
  }

  const uploadToImageKit = async (file: File, folder: string, publicKey: string) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('fileName', file.name)
    formData.append('folder', folder)
    formData.append('useUniqueFileName', 'false')
    formData.append('tags', `date:${date},paper:${newspaper}`)

    const res = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Basic ${btoa(publicKey + ':')}`
      }
    })
    const data = await res.json()
    if (!res.ok) {
      throw new Error(data?.message || `Upload failed for ${file.name}`)
    }
    const path = data.filePath || data.file_path || data?.data?.filePath || data?.data?.file_path || (() => {
      try { return new URL(data.url).pathname } catch { return undefined }
    })()
    return {
      url: data.url as string,
      file_id: data.fileId || data.file_id || data?.data?.fileId || data?.data?.file_id,
      path
    }
  }

  const handleUploadBundle = async () => {
    if (!isReadyToUpload || !originalFile) return
    try {
      setUploading(true)
      setError(null)
      setSuccess(null)

      // Get ImageKit auth
      const authRes = await fetch('/.netlify/functions/ik-auth')
      const auth = await authRes.json()
      if (!authRes.ok) throw new Error(auth.error || 'Failed to get upload credentials')

      const dateParts = date.split('-')
      const baseFolder = `/news/${dateParts[0]}/${dateParts[1]}/${dateParts[2]}/${newspaper}`

      // Upload original
      const original = await uploadToImageKit(originalFile, `${baseFolder}/original`, auth.publicKey)

      // Upload bundle files (summary/topic)
      const uploaded = [] as Array<{ type: 'summary' | 'topic'; name: string; url: string; file_id: string; path?: string; topic?: string }>
      for (const file of bundleFiles) {
        const lower = file.name.toLowerCase()
        const isSummary = lower.includes('summary') || lower.includes('bundle') || lower.endsWith('-summary.pdf')
        const type: 'summary' | 'topic' = isSummary ? 'summary' : 'topic'
        const result = await uploadToImageKit(file, `${baseFolder}/${type}`, auth.publicKey)
        uploaded.push({ type, name: file.name, url: result.url, file_id: result.file_id, path: result.path, topic: !isSummary ? lower.replace(/\.pdf$/, '') : undefined })
      }

      // Save original
      {
        const resp = await fetch('/.netlify/functions/sb-upsert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            date,
            newspaper,
            type: 'original',
            url: original.url,
            file_id: original.file_id,
            path: original.path
          })
        })
        const data = await resp.json()
        if (!resp.ok) throw new Error(data.error || 'Failed saving original')
      }

      // Save bundle files
      for (const item of uploaded) {
        const resp = await fetch('/.netlify/functions/sb-upsert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            date,
            newspaper,
            type: item.type,
            url: item.url,
            file_id: item.file_id,
            path: item.path,
            topic: item.topic ?? null
          })
        })
        const data = await resp.json()
        if (!resp.ok) throw new Error(data.error || `Failed saving ${item.name}`)
      }

      setSuccess('Bundle uploaded successfully')
      clearAll()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Create New Issue Bundle</h3>
      <p className="text-gray-600 mb-4">Select the original PDF and a folder of summary/topic PDFs, review, and upload together.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Original PDF</label>
          <input type="file" accept=".pdf" onChange={handleOriginalChange} disabled={disabled || uploading} />
          <div className="mt-2 text-sm text-gray-600">{originalFile ? `📄 ${originalFile.name}` : 'No original selected'}</div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Summary & Topic PDFs Folder</label>
          <input type="file" accept=".pdf" onChange={handleFolderChange} {...({ webkitdirectory: 'true' as unknown as boolean, multiple: true })} disabled={disabled || uploading} />
          <div className="mt-2 max-h-40 overflow-auto text-sm text-gray-600">
            {bundleFiles.length === 0 ? 'No files selected' : bundleFiles.map(f => (
              <div key={f.name}>📑 {f.name}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button onClick={handleUploadBundle} disabled={!isReadyToUpload || uploading || disabled} className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50">Upload Complete Bundle</button>
        <button onClick={clearAll} disabled={uploading} className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700">Clear All</button>
        <div className="text-sm ml-2 {isReadyToUpload ? 'text-green-600' : 'text-yellow-600'}">{isReadyToUpload ? 'Ready to Upload' : 'Incomplete Bundle'}</div>
      </div>

      {uploading && (
        <div className="mt-4 text-sm text-gray-600">Uploading bundle...</div>
      )}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
      )}
      {success && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">{success}</div>
      )}
    </div>
  )
}


