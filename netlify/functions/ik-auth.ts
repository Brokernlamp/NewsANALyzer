import { Handler } from '@netlify/functions'

const IMAGEKIT_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY
const IMAGEKIT_PUBLIC_KEY = process.env.IMAGEKIT_PUBLIC_KEY
const IMAGEKIT_URL_ENDPOINT = process.env.IMAGEKIT_URL_ENDPOINT

if (!IMAGEKIT_PRIVATE_KEY || !IMAGEKIT_PUBLIC_KEY || !IMAGEKIT_URL_ENDPOINT) {
  throw new Error('Missing ImageKit environment variables')
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    // Generate token for client-side upload
    const token = Buffer.from(JSON.stringify({
      token: IMAGEKIT_PRIVATE_KEY,
      expire: Math.floor(Date.now() / 1000) + 2400, // 40 minutes
      signature: 'dummy' // ImageKit will validate the private key
    })).toString('base64')

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
      },
      body: JSON.stringify({
        token,
        expire: Math.floor(Date.now() / 1000) + 2400,
        signature: 'dummy',
        publicKey: IMAGEKIT_PUBLIC_KEY,
        urlEndpoint: IMAGEKIT_URL_ENDPOINT
      })
    }
  } catch (error) {
    console.error('Error generating ImageKit auth:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to generate auth token' })
    }
  }
}
