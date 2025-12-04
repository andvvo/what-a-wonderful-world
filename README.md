# What a Wonderful World 🌍

An interactive map application for saving and organizing location pins with descriptions and images.

## Features

- **Interactive Map** - Explore the world using Mapbox with smooth navigation and search functionality
- **Create Pins** - Click anywhere on the map to drop a pin with a description and optional image URL
- **Color-Coded Pins** - Organize your pins with 6 color options (red, blue, green, yellow, purple, orange)
- **Saved Pins Gallery** - Browse all your saved pins in a beautiful card layout
- **Filter by Color** - Filter pins by color with customizable labels
- **Location Search** - Search for any location using the Mapbox search box
- **Deep Linking** - Share specific map locations via URL parameters

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Maps**: [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/) via [react-map-gl](https://visgl.github.io/react-map-gl/)
- **Database**: [Supabase](https://supabase.com)
- **Search**: [@mapbox/search-js-react](https://docs.mapbox.com/mapbox-search-js/)

## Getting Started

### Prerequisites

- Node.js 18+
- A [Mapbox](https://www.mapbox.com/) account and access token
- A [Supabase](https://supabase.com/) project

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Setup

Create a `pins` table in Supabase with the following schema:

```sql
create table pins (
  id uuid default gen_random_uuid() primary key,
  latitude double precision not null,
  longitude double precision not null,
  description text not null,
  image_url text,
  color text default 'red',
  created_at timestamp with time zone default now()
);
```

### Installation

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

1. **Explore the Map** - Navigate around the interactive world map
2. **Search Locations** - Use the search bar to find specific places
3. **Add a Pin** - Click anywhere on the map to create a new pin
4. **View Saved Pins** - Navigate to "Saved Pins" to see all your pins in a gallery view
5. **Filter Pins** - Use color filters to organize and find pins
6. **Customize Labels** - Hover over color filters to rename them (e.g., "Food", "Travel", "Work")

## Project Structure

```
├── app/
│   ├── page.tsx          # Main map page
│   ├── saved-pins/
│   │   └── page.tsx      # Saved pins gallery
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── navbar.tsx        # Navigation component
│   └── pin.tsx           # Pin marker component
├── lib/
│   ├── pins.ts           # Pin data operations
│   └── supabase.ts       # Supabase client
```
