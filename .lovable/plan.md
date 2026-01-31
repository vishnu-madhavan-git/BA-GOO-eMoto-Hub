
# Community Routes System - Implementation Plan

## Overview
Transform the basic Routes page into a full-featured community-driven route platform with interactive maps, user-generated routes, gamification, and social features. This system will enable riders to create, share, and compete on custom scooter routes across Dubai and the UAE.

## Architecture Summary

```text
+------------------+     +-------------------+     +------------------+
|    Frontend      |     |   Lovable Cloud   |     |  External APIs   |
|                  |     |                   |     |                  |
| - React + Maps   |<--->| - PostgreSQL      |<--->| - Google Maps    |
| - Route Drawing  |     | - Auth            |     | - Places API     |
| - Leaderboards   |     | - Edge Functions  |     | - Directions API |
| - User Profiles  |     | - RLS Policies    |     |                  |
+------------------+     +-------------------+     +------------------+
```

---

## Phase 1: Database & Authentication Foundation

### 1.1 Database Schema

**Users Profile Extension**
- `profiles` table linked to auth.users
- Stores username, avatar, bio, total_points, level, city

**Routes Table**
- id, user_id, name, description, tags[], difficulty
- start_point (geography), end_point (geography)
- waypoints (JSON array of coordinates)
- distance_km, estimated_time_mins
- terrain_type (paved/mixed/off-road)
- likes_count, uses_count, created_at

**Route Points (for detailed path)**
- id, route_id, sequence, lat, lng, elevation

**User Interactions**
- `route_votes` - user_id, route_id, vote_type (up/down)
- `route_comments` - user_id, route_id, content, created_at
- `route_completions` - user_id, route_id, completed_at, time_taken

**Gamification**
- `achievements` - id, name, description, icon, points_value, criteria
- `user_achievements` - user_id, achievement_id, earned_at
- `leaderboard_entries` - user_id, period (weekly/monthly/all-time), points, rank

### 1.2 Row Level Security
- Users can only edit their own routes
- All authenticated users can view and vote on public routes
- Profile data visible to all, editable by owner only
- Achievement criteria enforced via database functions

### 1.3 Authentication Setup
- Email/password sign-up and login
- Google OAuth integration via Lovable Cloud
- Profile creation on first sign-in

---

## Phase 2: Google Maps Integration

### 2.1 Map Component Setup
- Install `@react-google-maps/api` package
- Create reusable `MapView` component with dark theme styling
- Configure API key as environment secret

### 2.2 Route Drawing Tool
- **Drawing Mode**: Click-to-add waypoints with polyline visualization
- **Edit Mode**: Drag waypoints to adjust route
- **Preview Mode**: Display saved routes with markers
- Snap-to-road option using Directions API (optional)

### 2.3 Geolocation Features
- Current location detection
- Search places with autocomplete
- Distance calculation using Haversine formula

---

## Phase 3: Route Management Features

### 3.1 Create Route Page (`/routes/create`)
- Full-screen map with drawing tools
- Sidebar form: name, description, tags, difficulty, terrain
- Real-time distance/time calculation
- Preview before save
- Points awarded on successful creation

### 3.2 Route Explorer Page (`/routes/explore`)
- Interactive map showing route start points as markers
- Filter panel: distance, terrain, difficulty, popularity, creator
- List/grid view toggle
- Click route to see full path overlay

### 3.3 Route Detail Page (`/routes/:id`)
- Full route visualization on map
- Stats: distance, elevation, uses, likes
- Creator profile card
- Comments section
- "Use This Route" button (starts navigation mode)
- Share buttons (WhatsApp, copy link)

### 3.4 Navigation Mode
- Turn-by-turn preview (visual only, not GPS-tracked)
- "Mark Complete" button to log completion
- Points awarded based on distance

---

## Phase 4: Gamification System

### 4.1 Points Structure
| Action | Points |
|--------|--------|
| Create route | 50 |
| Route gets 10 uses | 25 |
| Route gets liked | 5 |
| Complete a route | distance x 2 |
| First route in new area | 100 |
| Daily login streak | 10 |

### 4.2 Achievements/Badges
- **Explorer**: Complete 10 different routes
- **Cartographer**: Create 5 routes
- **Popular**: Get 50 total likes
- **Trailblazer**: First to map a new area
- **Community Helper**: Leave 20 comments
- **Speed Demon**: Complete shortest route time

### 4.3 Leaderboards
- **Multiple Boards**: Top Creators, Top Riders, Most Popular Routes
- **Time Filters**: Weekly, Monthly, All-Time
- **Location Filters**: Dubai, Abu Dhabi, Sharjah, All UAE
- Real-time updates using Supabase subscriptions

### 4.4 Level System
- Levels 1-50 based on total points
- Level badges displayed on profile and route cards
- Unlock perks at certain levels (custom profile colors, priority featuring)

---

## Phase 5: Community Features

### 5.1 User Profiles (`/profile/:username`)
- Avatar, bio, city, member since
- Stats: routes created, routes completed, total distance, points
- Achievement showcase
- Recent activity feed
- Follow/unfollow (future enhancement)

### 5.2 Comments & Voting
- Upvote/downvote routes
- Comment with @mentions
- Report inappropriate content

### 5.3 Route Discovery
- "Featured Routes" curated section
- "Trending This Week" algorithm-based
- "Near You" location-based suggestions

---

## Phase 6: Edge Functions

### 6.1 Points Calculation Function
- Triggered on route creation, completion, votes
- Updates user points and checks achievement criteria

### 6.2 Leaderboard Recalculation
- Scheduled function (daily) to recalculate rankings
- Uses database aggregations for efficiency

### 6.3 Route Suggestions AI (Future)
- Uses AI Gateway to recommend routes based on user history
- Personalized difficulty and distance matching

---

## New Pages & Components

### Pages to Create
1. `/routes` - Main community hub (redesigned)
2. `/routes/explore` - Map-based route browser
3. `/routes/create` - Route creation tool
4. `/routes/:id` - Route detail view
5. `/profile/:username` - User profile
6. `/leaderboard` - Full leaderboard page

### Components to Create
1. `MapView` - Reusable Google Maps wrapper
2. `RouteDrawer` - Drawing tool for route creation
3. `RouteCard` - Card for route listings
4. `LeaderboardTable` - Ranked user list
5. `AchievementBadge` - Badge display component
6. `UserAvatar` - Avatar with level indicator
7. `RouteFilters` - Filter panel for exploration
8. `CommentSection` - Comments list with input
9. `PointsDisplay` - Animated points counter
10. `AuthModal` - Login/signup modal

---

## Technical Implementation Details

### Database Tables SQL Summary
```text
profiles          - User extended data with points/level
routes            - Route metadata with geospatial columns
route_waypoints   - Ordered coordinate points
route_votes       - User votes on routes
route_comments    - User comments
route_completions - Ride completion records
achievements      - Badge definitions
user_achievements - Earned badges
```

### Key Dependencies to Add
- `@react-google-maps/api` - Google Maps React wrapper
- `@types/google.maps` - TypeScript definitions

### Environment Secrets Required
- `GOOGLE_MAPS_API_KEY` - For Maps JavaScript API

---

## Implementation Order

1. **Database & Auth** - Create tables, RLS, enable auth
2. **Profile System** - User profiles, basic CRUD
3. **Map Integration** - Google Maps setup, basic rendering
4. **Route Creation** - Drawing tool, save routes
5. **Route Explorer** - List/filter routes, map visualization
6. **Route Detail** - Full route view, comments, voting
7. **Gamification** - Points, achievements, leaderboards
8. **Polish** - Animations, mobile optimization, edge cases

---

## Marketplace Integration

The route pages will include:
- Sidebar widget showing featured scooters
- "Upgrade Your Ride" prompts after completing routes
- Achievement rewards linked to store discounts
- Points redemption for merchandise (future)

This creates a natural funnel from community engagement to scooter purchases.
