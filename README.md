# NewsAlyzer

A simple React TypeScript SPA for viewing daily newspapers and topic-wise PDFs. Built with Vite, React Router, and Supabase.

## Features

- **Today's Newspapers**: View newspapers for any date with Summary and Original PDF buttons
- **Date Navigation**: Simple date picker with Today button
- **Topic-wise PDFs**: Access topic-specific PDFs organized by newspaper
- **Clean UI**: Simple, responsive design
- **Error Handling**: Robust error states and loading skeletons

## Tech Stack

- **Frontend**: Vite + React + TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Database**: Supabase (read-only with anon key)
- **Deployment**: Netlify

## Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase project with the following tables:
  - `issues` (date, newspaper, original_url, summary_url)
  - `files` (date, newspaper, type, topic, url)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your-project-url
   VITE_SUPABASE_ANON=your-anon-key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## Deployment

### Netlify

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy to Netlify:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Set environment variables in Netlify dashboard:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON`

The `netlify.toml` file is already configured for SPA routing.

## Project Structure

```
src/
├── api/
│   └── queries.ts          # Supabase queries
├── components/
│   ├── DateBar.tsx         # Simple date picker with Today button
│   ├── Header.tsx          # App header
│   ├── NewspaperCard.tsx   # Newspaper card component
│   ├── Skeleton.tsx        # Loading skeletons
│   ├── TopicPills.tsx      # Topic navigation pills
│   └── TopicResultCard.tsx # Topic PDF result cards
├── lib/
│   ├── format.ts           # Utility functions for formatting
│   └── supabase.ts         # Supabase client setup
├── routes/
│   ├── DatePage.tsx        # Date-specific page
│   └── TopicPage.tsx       # Topic-specific PDFs
├── styles/
│   └── tailwind.css        # Tailwind CSS styles
├── App.tsx                 # Main app component with routing
└── main.tsx               # App entry point
```

## Routes

- `/` - Redirects to today's date
- `/date/:iso` - Newspapers and topics for a specific date
- `/date/:iso/topic/:slug` - Topic-specific PDFs for a date

## Data Schema

### Issues Table
- `date` (text): ISO date (YYYY-MM-DD)
- `newspaper` (text): Newspaper identifier
- `original_url` (text, nullable): URL to original PDF
- `summary_url` (text, nullable): URL to summary PDF

### Files Table
- `date` (text): ISO date (YYYY-MM-DD)
- `newspaper` (text): Newspaper identifier
- `type` (text): File type (e.g., 'topic')
- `topic` (text): Topic slug
- `url` (text): ImageKit URL to PDF

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## License

MIT
