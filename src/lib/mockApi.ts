// Mock API responses for local development
// This replaces the Netlify functions when running with npm run dev

interface MockNewspaper {
  slug: string
  display_name: string
  created_at: string
}

interface MockAsset {
  id: string
  type: 'archive' | 'original'
  url: string
  created_at: string
  date: string
  newspaper: string
}

// Mock data
const mockNewspapers: MockNewspaper[] = [
  {
    slug: 'times-of-india',
    display_name: 'Times of India',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    slug: 'hindu',
    display_name: 'The Hindu',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    slug: 'indian-express',
    display_name: 'Indian Express',
    created_at: '2024-01-01T00:00:00Z'
  }
]

const mockAssets: MockAsset[] = [
  {
    id: '1',
    type: 'archive',
    url: 'https://example.com/archive.zip',
    created_at: '2024-01-15T10:30:00Z',
    date: '2024-01-15',
    newspaper: 'times-of-india'
  },
  {
    id: '2',
    type: 'original',
    url: 'https://example.com/original.pdf',
    created_at: '2024-01-15T10:35:00Z',
    date: '2024-01-15',
    newspaper: 'times-of-india'
  }
]

// Mock API functions
export const mockApi = {
  // Mock newspapers API
  async getNewspapers(): Promise<{ success: boolean; data: MockNewspaper[] }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))
    return { success: true, data: mockNewspapers }
  },

  async addNewspaper(slug: string, display_name: string): Promise<{ success: boolean; data: MockNewspaper }> {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const newNewspaper: MockNewspaper = {
      slug: slug.toLowerCase().replace(/\s+/g, '-'),
      display_name,
      created_at: new Date().toISOString()
    }
    
    mockNewspapers.push(newNewspaper)
    return { success: true, data: newNewspaper }
  },

  async deleteNewspaper(slug: string): Promise<{ success: boolean; data: any }> {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const index = mockNewspapers.findIndex(n => n.slug === slug)
    if (index === -1) {
      throw new Error('Newspaper not found')
    }
    
    mockNewspapers.splice(index, 1)
    return { success: true, data: {} }
  },

  // Mock files API
  async getFiles(date: string, newspaper: string): Promise<{ success: boolean; data: MockAsset[] }> {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const filteredAssets = mockAssets.filter(
      asset => asset.date === date && asset.newspaper === newspaper
    )
    
    return { success: true, data: filteredAssets }
  },

  async addFile(date: string, newspaper: string, type: 'archive' | 'original', url: string): Promise<{ success: boolean; data: MockAsset }> {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const newAsset: MockAsset = {
      id: Date.now().toString(),
      type,
      url,
      created_at: new Date().toISOString(),
      date,
      newspaper
    }
    
    mockAssets.push(newAsset)
    return { success: true, data: newAsset }
  },

  async deleteFile(id: string): Promise<{ success: boolean; data: any }> {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const index = mockAssets.findIndex(asset => asset.id === id)
    if (index === -1) {
      throw new Error('Asset not found')
    }
    
    mockAssets.splice(index, 1)
    return { success: true, data: {} }
  },

  // Mock ImageKit auth
  async getImageKitAuth(): Promise<{ publicKey: string; token: string; signature: string; expire: number }> {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return {
      publicKey: 'mock_public_key',
      token: 'mock_token',
      signature: 'mock_signature',
      expire: Date.now() + 3600000 // 1 hour from now
    }
  }
}

// Check if we're in development mode
const isDevelopment = import.meta.env.DEV

// API wrapper that uses mock data in development
export const api = {
  async getNewspapers() {
    if (isDevelopment) {
      return mockApi.getNewspapers()
    }
    
    // In production, use real API
    const response = await fetch('/.netlify/functions/sb-newspapers')
    return response.json()
  },

  async addNewspaper(slug: string, display_name: string) {
    if (isDevelopment) {
      return mockApi.addNewspaper(slug, display_name)
    }
    
    const response = await fetch('/.netlify/functions/sb-newspapers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, display_name })
    })
    return response.json()
  },

  async deleteNewspaper(slug: string) {
    if (isDevelopment) {
      return mockApi.deleteNewspaper(slug)
    }
    
    const response = await fetch('/.netlify/functions/sb-newspapers', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug })
    })
    return response.json()
  },

  async getFiles(date: string, newspaper: string) {
    if (isDevelopment) {
      return mockApi.getFiles(date, newspaper)
    }
    
    const response = await fetch(`/.netlify/functions/sb-files?date=${date}&newspaper=${newspaper}`)
    return response.json()
  },

  async addFile(date: string, newspaper: string, type: 'archive' | 'original', url: string) {
    if (isDevelopment) {
      return mockApi.addFile(date, newspaper, type, url)
    }
    
    const response = await fetch('/.netlify/functions/sb-upsert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, newspaper, type, url })
    })
    return response.json()
  },

  async deleteFile(id: string) {
    if (isDevelopment) {
      return mockApi.deleteFile(id)
    }
    
    const response = await fetch('/.netlify/functions/sb-delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    return response.json()
  },

  async getImageKitAuth() {
    if (isDevelopment) {
      return mockApi.getImageKitAuth()
    }
    
    const response = await fetch('/.netlify/functions/ik-auth')
    return response.json()
  }
}
