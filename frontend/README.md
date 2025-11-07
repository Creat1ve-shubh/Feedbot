# Feedbot Frontend

Production-grade Next.js frontend for the Feedbot brand perception analysis platform.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI**: Tailwind CSS
- **State**: Zustand
- **Data Fetching**: SWR (auto-polling)
- **Charts**: Recharts
- **Language**: TypeScript

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env.local`:
   ```
   NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
   ```

3. Run dev server:
   ```bash
   npm run dev
   ```

   Frontend runs at http://localhost:3000

## Architecture

### Routes
- `/` - Home page
- `/analyze` - Brand input form
- `/insights?brand=X` - Real-time dashboard with charts and posts

### API Routes (Next.js Server)
- `/api/analyze` → Proxies to backend `POST /analyze`
- `/api/results` → Proxies to backend `GET /results`

### Components
- `BrandInput` - Form to trigger analysis
- `SentimentPie` - Pie chart for sentiment distribution
- `EmotionBar` - Bar chart for emotion frequencies
- `TopicBar` - Bar chart for topic frequencies
- `PostTable` - Paginated post listing

### State Management
- Zustand store tracks current brand and loading status
- SWR handles polling backend every 3 seconds

## Usage Flow

1. User enters brand name on `/analyze`
2. Form submits → calls `/api/analyze` → backend queues Celery task
3. User clicks "View Insights" → navigates to `/insights?brand=X`
4. SWR polls `/api/results` every 3 seconds
5. Charts and table update in real-time as ML pipeline completes

## Production Build

```bash
npm run build
npm start
```

## Notes

- All TypeScript errors will resolve after `npm install`
- Backend must be running on port 8000
- Uses client components for interactivity and polling
