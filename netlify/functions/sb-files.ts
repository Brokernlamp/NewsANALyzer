import { Handler } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE)

export const handler: Handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  }

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    const { date, newspaper } = event.queryStringParameters || {}

    if (!date || !newspaper) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required parameters: date, newspaper' })
      }
    }

    const { data, error } = await supabase
      .from('files')
      .select('*')
      .eq('date', date)
      .eq('newspaper', newspaper)
      .order('type')

    if (error) {
      throw new Error(`Failed to fetch files: ${error.message}`)
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, data })
    }
  } catch (error) {
    console.error('Error in sb-files:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Internal server error' })
    }
  }
}
