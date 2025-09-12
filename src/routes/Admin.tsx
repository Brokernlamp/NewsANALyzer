import { useState } from 'react'
import { getTodayIST } from '../lib/format'
import AdminLayout from '../components/admin/AdminLayout'
import NewspaperSelect from '../components/admin/NewspaperSelect'
import AssetsTable from '../components/admin/AssetsTable'
import NewspaperManager from '../components/admin/NewspaperManager'
import IssueBundleCard from '../components/admin/IssueBundleCard'

export default function Admin() {
  const [selectedDate, setSelectedDate] = useState(getTodayIST())
  const [selectedNewspaper, setSelectedNewspaper] = useState('')
  const [refreshToken, setRefreshToken] = useState(0)

  // unused legacy flow removed
  /* const handleFolderUpload = async (files: FileList) => {
    if (!selectedNewspaper) {
      throw new Error('Please select a newspaper first')
    }

    // Get ImageKit auth
    const authResponse = await fetch('/.netlify/functions/ik-auth')
    const authData = await authResponse.json()
    if (!authResponse.ok) {
      throw new Error(authData.error || 'Failed to get upload credentials')
    }

    const dateParts = selectedDate.split('-')
    const baseFolder = `/news/${dateParts[0]}/${dateParts[1]}/${dateParts[2]}/${selectedNewspaper}`

    for (const file of Array.from(files)) {
      // Determine type by filename
      const lower = file.name.toLowerCase()
      const isSummary = lower.includes('summary') || lower.includes('bundle') || lower.endsWith('-summary.pdf')
      const type: 'summary' | 'topic' = isSummary ? 'summary' : 'topic'
      const folder = `${baseFolder}/${type}`

      const formData = new FormData()
      formData.append('file', file)
      formData.append('fileName', file.name)
      formData.append('folder', folder)
      formData.append('useUniqueFileName', 'false')
      formData.append('tags', `date:${selectedDate},paper:${selectedNewspaper},type:${type}`)

      const uploadResponse = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Basic ${btoa(authData.publicKey + ':')}`
        }
      })
      const uploadData = await uploadResponse.json()
      if (!uploadResponse.ok) {
        throw new Error(uploadData.message || `Upload failed for ${file.name}`)
      }

      const derivedPath = uploadData.filePath || uploadData.file_path || uploadData?.data?.filePath || uploadData?.data?.file_path || (() => {
        try { return new URL(uploadData.url).pathname } catch { return undefined }
      })()

      const dbResponse = await fetch('/.netlify/functions/sb-upsert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDate,
          newspaper: selectedNewspaper,
          type,
          url: uploadData.url,
          file_id: uploadData.fileId || uploadData.file_id || uploadData?.data?.fileId || uploadData?.data?.file_id,
          path: derivedPath,
          topic: !isSummary ? lower.replace(/\.pdf$/,'') : null
        })
      })
      const dbData = await dbResponse.json()
      if (!dbResponse.ok) {
        throw new Error(dbData.error || `Failed to save ${file.name}`)
      }
    }
  } */

  /* const handleOriginalUpload = async (file: File) => {
    if (!selectedNewspaper) {
      throw new Error('Please select a newspaper first')
    }

    // Get ImageKit auth
    const authResponse = await fetch('/.netlify/functions/ik-auth')
    const authData = await authResponse.json()

    if (!authResponse.ok) {
      throw new Error(authData.error || 'Failed to get upload credentials')
    }

    // Prepare file name and folder
    const dateParts = selectedDate.split('-')
    const folder = `/news/${dateParts[0]}/${dateParts[1]}/${dateParts[2]}/${selectedNewspaper}/original`
    const fileName = `${selectedNewspaper}-${selectedDate}.pdf`

    // Upload to ImageKit
    const formData = new FormData()
    formData.append('file', file)
    formData.append('fileName', fileName)
    formData.append('folder', folder)
    formData.append('useUniqueFileName', 'false')
    formData.append('tags', `date:${selectedDate},paper:${selectedNewspaper},type:original`)

    const uploadResponse = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Basic ${btoa(authData.publicKey + ':')}`
      }
    })

    const uploadData = await uploadResponse.json()

    if (!uploadResponse.ok) {
      throw new Error(uploadData.message || 'Upload failed')
    }

    // Save to database
    const originalPath = uploadData.filePath || uploadData.file_path || uploadData?.data?.filePath || uploadData?.data?.file_path || (() => {
      try {
        const u = new URL(uploadData.url)
        return u.pathname
      } catch {
        return undefined
      }
    })()
    const dbResponse = await fetch('/.netlify/functions/sb-upsert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: selectedDate,
        newspaper: selectedNewspaper,
        type: 'original',
        url: uploadData.url,
        file_id: uploadData.fileId || uploadData.file_id || uploadData?.data?.fileId || uploadData?.data?.file_id,
        path: originalPath
      })
    })

    const dbData = await dbResponse.json()

    if (!dbResponse.ok) {
      throw new Error(dbData.error || 'Failed to save to database')
    }
  } */

  return (
    <AdminLayout>
      {/* Date and Newspaper Selection */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Date & Newspaper</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Newspaper
            </label>
            <NewspaperSelect
              value={selectedNewspaper}
              onChange={setSelectedNewspaper}
            />
          </div>
        </div>
      </div>

      {/* Upload Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IssueBundleCard date={selectedDate} newspaper={selectedNewspaper} disabled={!selectedNewspaper} />
      </div>

      {/* Assets Management */}
      {selectedDate && selectedNewspaper && (
        <AssetsTable
          date={selectedDate}
          newspaper={selectedNewspaper}
          refreshToken={refreshToken}
        />
      )}

      {/* Issue Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Issue Actions</h3>
        <div className="flex items-center gap-3">
          <button
            className="px-4 py-2 rounded-lg bg-red-600 text-white disabled:opacity-50"
            disabled={!selectedDate || !selectedNewspaper}
            onClick={async () => {
              if (!confirm('Delete the entire issue (files in DB + ImageKit)?')) return
              try {
                // 1) Get files for this issue
                const listRes = await fetch(`/.netlify/functions/sb-files?date=${selectedDate}&newspaper=${selectedNewspaper}`)
                const listData = await listRes.json()
                if (!listRes.ok) throw new Error(listData.error || 'Failed to list files')

                const fileIds = (listData.data || []).map((f: any) => f.file_id).filter(Boolean)

                // 2) Delete from ImageKit (best-effort)
                if (fileIds.length > 0) {
                  await fetch('/.netlify/functions/ik-delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fileIds })
                  })
                }

                // 3) Delete DB rows and null out issue URLs
                const delRes = await fetch('/.netlify/functions/sb-delete', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    date: selectedDate,
                    newspaper: selectedNewspaper,
                    types: ['original', 'summary', 'topic'],
                    nullIssues: ['original_url', 'summary_url']
                  })
                })
                const delData = await delRes.json()
                if (!delRes.ok) throw new Error(delData.error || 'Failed to delete issue records')

                setRefreshToken(t => t + 1)
                alert('Issue deleted')
              } catch (e) {
                alert(e instanceof Error ? e.message : 'Delete failed')
              }
            }}
          >
            Delete Entire Issue
          </button>
        </div>
      </div>

      {/* Newspaper Management */}
      <NewspaperManager />
    </AdminLayout>
  )
}
