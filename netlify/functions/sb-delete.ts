import { Handler } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE

const supabase = SUPABASE_URL && SUPABASE_SERVICE_ROLE
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE)
  : null

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    if (!supabase) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Missing Supabase environment variables' })
      }
    }

    const { id, date, newspaper, types, fileIds, nullIssues } = JSON.parse(event.body || '{}')

    if (!date || !newspaper) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields: date, newspaper' })
      }
    }

    const results = []

    // Delete a single file by id
    if (id) {
      const { data: deletedRows, error: delErr } = await supabase
        .from('files')
        .delete()
        .eq('id', id)
        .select()

      if (delErr) {
        throw new Error(`Files delete error: ${delErr.message}`)
      }

      results.push({ table: 'files', deleted: deletedRows })
    }

    // Delete files rows
    if (!id && types && types.length > 0) {
      const { data: filesData, error: filesError } = await supabase
        .from('files')
        .delete()
        .eq('date', date)
        .eq('newspaper', newspaper)
        .in('type', types)

      if (filesError) {
        throw new Error(`Files delete error: ${filesError.message}`)
      }

      results.push({ table: 'files', deleted: filesData })
    }

    // Update issues table to null out URLs
    if (nullIssues && nullIssues.length > 0) {
      const updateData: any = {}
      
      if (nullIssues.includes('original_url')) {
        updateData.original_url = null
      }
      if (nullIssues.includes('summary_url')) {
        updateData.summary_url = null
      }

      if (Object.keys(updateData).length > 0) {
        const { data: issuesData, error: issuesError } = await supabase
          .from('issues')
          .update(updateData)
          .eq('date', date)
          .eq('newspaper', newspaper)
          .select()

        if (issuesError) {
          throw new Error(`Issues update error: ${issuesError.message}`)
        }

        results.push({ table: 'issues', updated: issuesData })
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
      body: JSON.stringify({ success: true, data: results })
    }
  } catch (error) {
    console.error('Error in sb-delete:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Internal server error' })
    }
  }
}
