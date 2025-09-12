import { Handler } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE

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

  try {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Missing Supabase environment variables' })
      }
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE)

    if (event.httpMethod === 'GET') {
      // Get all newspapers
      const { data, error } = await supabase
        .from('newspapers')
        .select('*')
        .order('display_name')

      if (error) {
        throw new Error(`Failed to fetch newspapers: ${error.message}`)
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, data })
      }
    }

    if (event.httpMethod === 'POST') {
      // Create new newspaper
      const { slug, display_name } = JSON.parse(event.body || '{}')

      if (!slug || !display_name) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Missing required fields: slug, display_name' })
        }
      }

      // Normalize slug: lowercase and hyphenate
      const normalizedSlug = slug.toLowerCase().replace(/\s+/g, '-')

      const { data, error } = await supabase
        .from('newspapers')
        .insert({
          slug: normalizedSlug,
          display_name
        })
        .select()

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          return {
            statusCode: 409,
            body: JSON.stringify({ error: 'Newspaper with this slug already exists' })
          }
        }
        throw new Error(`Failed to create newspaper: ${error.message}`)
      }

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ success: true, data: data[0] })
      }
    }

    if (event.httpMethod === 'DELETE') {
      // Delete newspaper
      const { slug } = JSON.parse(event.body || '{}')

      if (!slug) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Missing required field: slug' })
        }
      }

      // Check for dependencies (optional safety check)
      const { data: filesData, error: filesError } = await supabase
        .from('files')
        .select('id')
        .eq('newspaper', slug)
        .limit(1)

      if (filesError) {
        throw new Error(`Failed to check dependencies: ${filesError.message}`)
      }

      if (filesData && filesData.length > 0) {
        return {
          statusCode: 409,
          body: JSON.stringify({ 
            error: 'Cannot delete newspaper: it has associated files. Use force delete to override.' 
          })
        }
      }

      const { data, error } = await supabase
        .from('newspapers')
        .delete()
        .eq('slug', slug)
        .select()

      if (error) {
        throw new Error(`Failed to delete newspaper: ${error.message}`)
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, data })
      }
    }

    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('Error in sb-newspapers:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Internal server error' })
    }
  }
}
