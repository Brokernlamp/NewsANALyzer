import { Handler } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE)

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    const { date, newspaper, type, url, topic } = JSON.parse(event.body || '{}')

    if (!date || !newspaper || !type || !url) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields: date, newspaper, type, url' })
      }
    }

    const results = []

    // Insert/update files row
    const { data: filesData, error: filesError } = await supabase
      .from('files')
      .upsert({
        date,
        newspaper,
        type,
        url,
        topic: topic || null
      }, {
        onConflict: 'date,newspaper,type,topic'
      })
      .select()

    if (filesError) {
      throw new Error(`Files upsert error: ${filesError.message}`)
    }

    results.push(filesData)

    // Update issues table based on type
    if (type === 'original') {
      const { data: issuesData, error: issuesError } = await supabase
        .from('issues')
        .upsert({
          date,
          newspaper,
          original_url: url
        }, {
          onConflict: 'date,newspaper'
        })
        .select()

      if (issuesError) {
        throw new Error(`Issues upsert error: ${issuesError.message}`)
      }

      results.push(issuesData)
    } else if (type === 'summary') {
      const { data: issuesData, error: issuesError } = await supabase
        .from('issues')
        .upsert({
          date,
          newspaper,
          summary_url: url
        }, {
          onConflict: 'date,newspaper'
        })
        .select()

      if (issuesError) {
        throw new Error(`Issues upsert error: ${issuesError.message}`)
      }

      results.push(issuesData)
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
      },
      body: JSON.stringify({ success: true, data: results })
    }
  } catch (error) {
    console.error('Error in sb-upsert:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Internal server error' })
    }
  }
}
