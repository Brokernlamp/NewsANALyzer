import { supabase, isDemoMode } from '../lib/supabase'

export interface Issue {
  newspaper: string
  original_url: string | null
  summary_url: string | null
}

export interface TopicPdf {
  newspaper: string
  url: string
}

export async function fetchIssues(iso: string): Promise<Issue[]> {
  if (isDemoMode) {
    throw new Error('Set Supabase env to view data.')
  }

  const { data, error } = await supabase!
    .from('issues')
    .select('newspaper, original_url, summary_url')
    .eq('date', iso)
    .order('newspaper')

  if (error) {
    console.error('Error fetching issues:', error)
    throw error
  }

  return data || []
}

export async function fetchTopics(iso: string): Promise<string[]> {
  if (isDemoMode) {
    throw new Error('Set Supabase env to view data.')
  }

  const { data, error } = await supabase!
    .from('files')
    .select('topic')
    .eq('date', iso)
    .eq('type', 'topic')
    .order('topic')

  if (error) {
    console.error('Error fetching topics:', error)
    throw error
  }

  // Return unique topics (filter falsy)
  return [...new Set((data || []).map(item => item.topic).filter(Boolean))]
}

export async function fetchTopicPdfs(iso: string, slug: string): Promise<TopicPdf[]> {
  if (isDemoMode) {
    throw new Error('Set Supabase env to view data.')
  }

  const { data, error } = await supabase!
    .from('files')
    .select('newspaper, url')
    .eq('date', iso)
    .eq('type', 'topic')
    .eq('topic', slug)
    .order('newspaper')

  if (error) {
    console.error('Error fetching topic PDFs:', error)
    throw error
  }

  return data || []
}
