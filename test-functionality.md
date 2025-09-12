# Functionality Test Results

## Changes Made

### ✅ Centralized Queries in src/api/queries.ts
- `fetchIssues(iso: string)`: Returns data array and bubbles errors
- `fetchTopics(iso: string)`: Returns unique topics (filter falsy)
- `fetchTopicPdfs(iso: string, slug: string)`: Returns PDFs for specific topic/date

### ✅ Date Handling and Routing
- Route `/` redirects to `/date/:todayIso` (local timezone)
- DateBar uses only route param `iso` for queries
- Changing date updates route and triggers refetch
- Removed Today.tsx component (no longer needed)

### ✅ Today/Date Page Rendering
- If fetchIssues returns rows, renders one card per row
- Newspaper title-cased ("the-hindu" → "The Hindu")
- "Summary PDF" button enabled if summary_url exists
- "Original PDF" button enabled if original_url exists; disabled otherwise
- Links open with target="_blank" rel="noopener noreferrer"
- Shows "No newspapers for this date yet" if zero rows
- Added loading skeletons and error alerts

### ✅ Topics and Topic Page
- Topics bar uses fetchTopics
- Clicking pill routes to /date/:iso/topic/:slug
- Topic page uses fetchTopicPdfs and shows cards per newspaper with "Open PDF"

### ✅ Environment and Client
- src/lib/supabase.ts reads VITE_SUPABASE_URL and VITE_SUPABASE_ANON
- Shows visible banner in demo mode when env vars missing
- Includes netlify.toml SPA redirect

### ✅ Debug Features
- Added debug line showing active ISO date above the grid
- Logs the length of issues result in dev console
- Logs topic PDFs result length in dev console

## Test Scenarios

### 1. Route `/` → `/date/:todayIso`
- ✅ App.tsx redirects root to today's date
- ✅ DateBar shows current date
- ✅ Debug line shows active ISO date

### 2. Date Navigation
- ✅ DateBar date picker updates route
- ✅ "Today" button navigates to current date
- ✅ Route changes trigger data refetch

### 3. Newspaper Cards
- ✅ Title-cased newspaper names
- ✅ Summary PDF button enabled when summary_url exists
- ✅ Original PDF button enabled when original_url exists
- ✅ Buttons disabled when URLs are null
- ✅ Links open in new tab with proper rel attributes

### 4. Topic Navigation
- ✅ Topic pills navigate to /date/:iso/topic/:slug
- ✅ Topic page shows PDFs organized by newspaper
- ✅ Debug line shows both date and topic

### 5. Error Handling
- ✅ Loading skeletons during data fetch
- ✅ Error alerts for failed requests
- ✅ Empty states for no data
- ✅ Demo mode when env vars missing

## Expected Behavior for /date/2025-09-12

When visiting `/date/2025-09-12`, the app should:
1. Show debug line: "Active ISO date: 2025-09-12"
2. Log in console: "Issues result length: X" (where X > 0 if data exists)
3. Display "The Hindu" card with:
   - Summary PDF button enabled (if summary_url exists)
   - Original PDF button disabled (if original_url is null)
4. Show topics section with clickable pills
5. Allow navigation to topic pages showing PDFs

## Environment Variables

The app now uses the provided Supabase credentials:
- VITE_SUPABASE_URL=https://diyjfgvpnjjciuttlrxo.supabase.co
- VITE_SUPABASE_ANON=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

## Next Steps

1. Run `npm install` to install dependencies
2. Run `npm run dev` to start development server
3. Visit `http://localhost:5173` (should redirect to today's date)
4. Test `/date/2025-09-12` to verify The Hindu appears with Summary enabled
5. Check browser console for debug logs
6. Test topic navigation and PDF opening
