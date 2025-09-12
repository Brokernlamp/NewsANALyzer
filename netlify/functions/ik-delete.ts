import { Handler } from '@netlify/functions'

const IMAGEKIT_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY

if (!IMAGEKIT_PRIVATE_KEY) {
  throw new Error('Missing ImageKit private key')
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    const { fileIds } = JSON.parse(event.body || '{}')

    if (!fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'fileIds array is required' })
      }
    }

    const results = []

    for (const fileId of fileIds) {
      try {
        const response = await fetch('https://api.imagekit.io/v1/files/' + fileId, {
          method: 'DELETE',
          headers: {
            'Authorization': `Basic ${Buffer.from(IMAGEKIT_PRIVATE_KEY + ':').toString('base64')}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          const errorData = await response.json()
          console.error(`Failed to delete file ${fileId}:`, errorData)
          results.push({ fileId, success: false, error: errorData.message })
        } else {
          results.push({ fileId, success: true })
        }
      } catch (error) {
        console.error(`Error deleting file ${fileId}:`, error)
        results.push({ fileId, success: false, error: error.message })
      }
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
      },
      body: JSON.stringify({ success: true, results })
    }
  } catch (error) {
    console.error('Error in ik-delete:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Internal server error' })
    }
  }
}
