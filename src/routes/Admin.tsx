import { useState } from 'react'
import { getTodayIST } from '../lib/format'
import AdminLayout from '../components/admin/AdminLayout'
import NewspaperSelect from '../components/admin/NewspaperSelect'
import UploadCard from '../components/admin/UploadCard'
import AssetsTable from '../components/admin/AssetsTable'
import NewspaperManager from '../components/admin/NewspaperManager'

export default function Admin() {
  const [selectedDate, setSelectedDate] = useState(getTodayIST())
  const [selectedNewspaper, setSelectedNewspaper] = useState('')

  const handleZipUpload = async (file: File) => {
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
    const folder = `/news/${dateParts[0]}/${dateParts[1]}/${dateParts[2]}/${selectedNewspaper}/archive`
    const fileName = `${selectedNewspaper}-${selectedDate}.zip`

    // Upload to ImageKit
    const formData = new FormData()
    formData.append('file', file)
    formData.append('fileName', fileName)
    formData.append('folder', folder)
    formData.append('useUniqueFileName', 'false')
    formData.append('tags', `date:${selectedDate},paper:${selectedNewspaper},type:archive`)

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
    const archivePath = uploadData.filePath || uploadData.file_path || uploadData?.data?.filePath || uploadData?.data?.file_path || (() => {
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
        type: 'archive',
        url: uploadData.url,
        file_id: uploadData.fileId || uploadData.file_id || uploadData?.data?.fileId || uploadData?.data?.file_id,
        path: archivePath
      })
    })

    const dbData = await dbResponse.json()

    if (!dbResponse.ok) {
      throw new Error(dbData.error || 'Failed to save to database')
    }
  }

  const handleOriginalUpload = async (file: File) => {
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
  }

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
        <UploadCard
          title="Upload ZIP Archive"
          description="Upload a ZIP file containing the day's bundle. This will be stored as an archive."
          accept=".zip"
          onUpload={handleZipUpload}
          disabled={!selectedNewspaper}
        />
        
        <UploadCard
          title="Upload Original PDF"
          description="Upload the original e-paper PDF. This will update the issues table and create a files entry."
          accept=".pdf"
          onUpload={handleOriginalUpload}
          disabled={!selectedNewspaper}
        />
      </div>

      {/* Assets Management */}
      {selectedDate && selectedNewspaper && (
        <AssetsTable
          date={selectedDate}
          newspaper={selectedNewspaper}
        />
      )}

      {/* Newspaper Management */}
      <NewspaperManager />
    </AdminLayout>
  )
}
