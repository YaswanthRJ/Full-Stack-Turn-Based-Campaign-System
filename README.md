# Full Stack Turn-Based Campaign System

A full-stack turn-based combat game with comprehensive admin dashboard for content management. Manage campaigns, creatures, and combat mechanics through an intuitive admin interface, then play strategic turn-based battles in an engaging frontend game experience.

## Overview

This is a three-tier application designed for managing and playing turn-based combat scenarios. The system separates content creation (Admin), game logic (Backend), and player experience (Frontend) into distinct, well-architected applications. The backend handles all combat simulations, the admin panel manages game content, and the frontend delivers an engaging mobile-first gaming experience.

## Project Structure

```
├── admin/              # Admin dashboard for content management
├── frontend/           # Player-facing game client
├── backend/            # REST API server & game engine
└── README.md          # This file
```

## Features

### 🎮 Game Frontend (React + Tailwind + Framer Motion)

**Core Combat Features**:
- ✅ **Turn-Based Combat System**: Strategic action selection with action point economy
- ✅ **Campaign Progression**: Complete multi-stage campaigns by defeating enemies in progression
- ✅ **Creature Selection**: Choose from available creatures for each campaign
- ✅ **Session Persistence**: Resume ongoing campaigns via localStorage
- ✅ **Animated Battle UI**:
  - Real-time health/AP bars with smooth animations
  - Creature cards with sprites and state indicators
  - Combat action log with event history
  - Framer Motion transitions on actions and state changes

**User Experience**:
- ✅ **User Authentication**: Anonymous and registered user support with session persistence
- ✅ **Mobile-First Design**: Optimized for mobile/tablet (desktop access blocked)
- ✅ **User Statistics Dashboard**: Track wins, losses, completed campaigns
- ✅ **Dynamic Audio System**: 
  - Background music with crossfading between tracks
  - Sound effects with automatic volume ducking
  - Persistent volume settings with audio unlock gate for browser autoplay policy
  - Preloading system with progress tracking

**Multi-Screen Navigation**:
- Home dashboard
- Campaign browser
- Creature selection
- Battle arena (GameScreen)
- User statistics page
- Settings page with audio controls
- Intro sequence (cached to localStorage)

### 🛠️ Admin Dashboard (React + Tailwind + Vite)

**Dashboard Analytics**:
- ✅ **Statistics Overview**: Real-time counts of users, actions, creatures, and campaigns

**Campaign Management**:
- ✅ **Campaign CRUD**: Create, read, update, delete campaign templates
- ✅ **Multi-Step Campaign Wizard**:
  - Step 0: Campaign details (name, description, images, status)
  - Step 1+: Select creatures for each combat stage
  - localStorage persistence for resumable wizard sessions
  - Form validation and error handling
- ✅ **Intro/Outro Media**: Upload custom images for campaign opening and completion screens
- ✅ **Campaign Status Management**: Active/inactive campaign control

**Creature Management**:
- ✅ **Creature CRUD**: Full create, read, update, delete functionality
- ✅ **Stat Management**: Configure max HP, attack, defence, action points, and speed
- ✅ **Image Upload**: Creature sprite upload via Cloudinary CDN
- ✅ **Playability Toggle**: Mark creatures as playable for players vs. enemy-only
- ✅ **Action Assignment**: Assign combat abilities to creatures with dedicated modal UI

**Action Management**:
- ✅ **Action CRUD**: Create and manage combat abilities
- ✅ **Action Properties**: Name, description, accuracy, damage multiplier, type, tag, weight
- ✅ **Table Interface**: Sortable/filterable action list with inline edit/delete
- ✅ **Action Configuration**: Assign actions to specific creatures

**Layout & Navigation**:
- Sidebar navigation with main sections
- Responsive header
- Footer
- Consistent styling with Tailwind CSS 4

### ⚙️ Backend API (Go + PostgreSQL)

**Core Game Systems**:
- ✅ **Turn-Based Combat Engine**:
  - Server-side action resolution with RNG-based accuracy
  - Intelligent AI decision making for enemies:
    - Action scoring based on combat state
    - Panic mode (defense boost when HP < 30%)
    - AP efficiency evaluation
    - Strategic randomness in action selection
  - Damage calculation with defense mitigation
  - Turn order determined by speed stat
  - Action point economy system

**Player Sessions & Campaigns**:
- ✅ **Campaign Session Management**: Start campaigns, track player progress through stages
- ✅ **Multi-Stage Campaigns**: Progress through multiple enemy encounters
- ✅ **Fight State Tracking**: Individual combat encounter management with round-by-round resolution
- ✅ **Campaign Completion**: Outro text/images when campaigns are won

**User Management**:
- ✅ **User Accounts**: Registration, login, and anonymous user creation
- ✅ **Session Authentication**: Header-based user identification (X-User-ID)
- ✅ **User Statistics**: Track completed campaigns, wins, losses, total fights

**Content Management API**:
- ✅ **Creature Endpoints**: CRUD operations for creatures and their stats, action assignment
- ✅ **Action Endpoints**: CRUD for combat actions with properties
- ✅ **Campaign Endpoints**: Full campaign template management with stage configuration
- ✅ **Statistics Endpoint**: Platform-wide analytics

**Media Handling**:
- ✅ **Cloudinary CDN Integration**: 
  - Image upload for creatures and campaigns
  - Automatic image resizing and optimization
  - Image deletion support
  - Secure URL generation for client display

**API Architecture**:
- RESTful design with standard HTTP methods
- JSON request/response bodies
- Custom X-User-ID header for client identification
- CORS enabled for all origins
- Comprehensive error handling

**Database**:
- ✅ **PostgreSQL Schema** with 11 tables:
  - Users, Creatures, CreatureStats, Actions
  - CampaignTemplates, CampaignSessions, Fights
  - Action relationships and creature-to-campaign mappings
- ✅ **Auto-Updating Timestamps**: PostgreSQL triggers on sessions and fights
- ✅ **Database Migrations**: 3 migration files (init, game session tables, seed data)
- ✅ **Query Optimization**: Strategic indexes on frequently queried columns

## Tech Stack

### Frontend (Game)
- **React 19.2** with TypeScript 6.0
- **React Router 7** for navigation
- **Tailwind CSS 4** for styling
- **Framer Motion 12** for animations
- **Howler.js 2** for audio management
- **Vite 8** for fast development and builds
- **React Compiler** for optimized rendering

### Admin Dashboard
- **React 19.2** with TypeScript 6.0
- **React Router 7** for navigation
- **Tailwind CSS 4** for styling
- **Axios 1.15** for HTTP requests with interceptors
- **Vite 8** for fast development and builds
- **React Compiler** for optimized rendering

### Backend
- **Go 1.24** for high-performance server
- **PostgreSQL 12+** for data persistence
- **golang-migrate** for schema versioning and management
- **Cloudinary Go SDK** for image service integration
- **Standard library HTTP** (`http.ServeMux`) for API endpoints
- **UUID and crypto packages** for security and uniqueness
```

## Getting Started

### Prerequisites

**All Platforms**:
- Node.js 18+ (for admin and frontend)
- npm or yarn (for admin and frontend)
- Git

**Backend Only**:
- Go 1.20+
- PostgreSQL 12+
- Cloudinary account (for image uploads)

### Quick Start

#### 1. Backend Setup (Go + PostgreSQL)

```bash
cd backend

# Install Go dependencies
go mod download

# Create .env file with required configuration
cat > .env << EOF
DATABASE_URL=postgres://user:password@localhost:5432/game_db
PORT=8080
AUTO_MIGRATE=true
APP_ENV=dev
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EOF

# Run database migrations and start server
go run main.go
```

**Server**: Runs on `http://localhost:8080`

**Available Commands**:
```bash
make build    # Build the application
make run      # Run the server
make test     # Run tests (if configured)
```

**Key Endpoints**:
- Health check: `GET /game/user`
- API documentation: See endpoint list below

#### 2. Frontend Setup (Game Client)

```bash
cd frontend

# Install dependencies
npm install

# Create environment configuration
cat > .env.local << EOF
VITE_BASE_URL=http://localhost:8080
EOF

# Start development server
npm run dev
```

**Client**: Runs on `http://localhost:5173` (default Vite port)

**Build for production**:
```bash
npm run build    # Creates optimized build in dist/
npm run preview  # Preview production build locally
```

**Features**:
- Mobile-first responsive design
- Audio system (background music + sound effects)
- Turn-based combat with animations
- User authentication and session persistence

#### 3. Admin Dashboard Setup

```bash
cd admin

# Install dependencies
npm install

# Create environment configuration
cat > .env.local << EOF
VITE_BASE_URL=http://localhost:8080
EOF

# Start development server
npm run dev
```

**Admin Panel**: Runs on `http://localhost:5174` (Vite alternate port)

**Build for production**:
```bash
npm run build    # Creates optimized build in dist/
npm run preview  # Preview production build locally
```

**Features**:
- Campaign management with multi-step wizard
- Creature and action CRUD
- Dashboard with game statistics
- Responsive admin interface

---

## API Endpoints

### User Management
```
GET    /game/user                    # Create/get anonymous user
POST   /game/user/register           # Register new account
POST   /game/user/signin             # Login (requires X-User-ID header)
GET    /game/user/auth               # Verify authentication
GET    /game/user/stats              # Get user statistics
```

### Campaign Gameplay
```
GET    /game/campaign/session                        # Get active campaign session
POST   /game/campaign/{id}/start                     # Start campaign with creature
GET    /game/campaign/{id}/creatures                 # Get playable creatures for campaign
POST   /game/campaign/fight/{fightId}/round          # Resolve combat action
POST   /game/campaign/session/{sessionId}/next       # Progress to next stage
GET    /game/campaign/session/{sessionId}/success    # Get campaign completion data (outro)
```

### Admin: Creatures
```
POST   /creatures                    # Create creature with stats
GET    /creatures                    # List all creatures
GET    /creatures/{id}               # Get creature details
PUT    /creatures/{id}/stats         # Update creature stats
GET    /creatures/{id}/action        # Get creature's assigned actions
POST   /creatures/{id}/actions       # Assign actions to creature
DELETE /creatures/{id}               # Delete creature
```

### Admin: Actions
```
POST   /actions                      # Create action
GET    /actions                      # List all actions
GET    /actions/{id}                 # Get action details
PUT    /actions/{id}                 # Update action
DELETE /actions/{id}                 # Delete action
```

### Admin: Campaigns
```
POST   /campaigns                          # Create campaign template
GET    /campaigns                          # List all campaigns
GET    /campaigns/{id}                     # Get campaign details
DELETE /campaigns/{id}                     # Delete campaign
POST   /campaigns/{id}/creatures           # Assign playable creatures to campaign
POST   /campaigns/{id}/stages              # Add combat stage (enemy)
PUT    /campaigns/{id}/stages/{idx}        # Update stage enemy
DELETE /campaigns/{id}/stages/{idx}        # Delete stage
```

### Admin: Statistics
```
GET    /stats                        # Get platform statistics (users, actions, creatures, campaigns count)
```

**Authentication**: Include `X-User-ID` header for game endpoints. Admin endpoints have no authentication requirement.

---

## Game Architecture

### Combat Engine

**Action Resolution Flow**:
1. Player selects action → Frontend validates AP availability
2. Request sent to backend with action ID
3. Backend validates action against creature stats
4. Damage calculated: `Raw Damage = Attack × ActionMultiplier`
5. Defense applied: `Final Damage = Raw Damage - (Defense × MitigationRatio)`
6. Accuracy roll: Probability-based hit/miss determination
7. Enemy AI selects counter-action:
   - Scores available actions based on state
   - Low HP (<30%) triggers defensive behavior (1.5× defense boost)
   - Considers AP availability
   - Applies strategic randomness
8. Both actions resolved and damage applied
9. Updated state returned to frontend
10. Combat continues or ends based on HP thresholds

**AI Decision Making**:
- Evaluates available actions based on current combat state
- Prioritizes high-impact actions when healthy
- Switches to defensive posture at low HP
- Respects action point limitations
- Filters out actions with insufficient points
- Applies minimum threshold to avoid poor decisions

**Key Stats**:
- **Max HP**: Total health points
- **Attack**: Base damage output
- **Defence**: Damage reduction capability
- **Action Points**: Resource for performing abilities (regenerates per turn)
- **Speed**: Determines turn order (higher = acts first)

### Data Models

**Creature**:
```
{
  id: UUID,
  name: string,
  description: string,
  isPlayable: boolean,
  imageUrl: string,
  stats: {
    maxHp: number,
    attack: number,
    defence: number,
    actionPoint: number,
    speed: number
  }
}
```

**Action**:
```
{
  id: UUID,
  name: string,
  description: string,
  accuracy: number (0-1),
  multiplier: number (damage multiplier),
  type: string,
  tag: string,
  actionWeight: number
}
```

**Campaign**:
```
{
  id: UUID,
  name: string,
  description: string,
  status: "active" | "inactive",
  imageUrl: string,
  outroText: string,
  outroImage: string,
  stages: [
    {
      index: number,
      enemyCreatureId: UUID
    }
  ]
}
```

**Campaign Session**:
```
{
  id: UUID,
  userId: UUID,
  campaignTemplateId: UUID,
  currentStageIndex: number,
  playerCreatureId: UUID,
  currentHp: number,
  maxHp: number,
  currentActionPoint: number,
  maxActionPoint: number,
  status: "ongoing" | "completed" | "failed",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

---

## Development Workflow

### Running All Services Locally

**Terminal 1 - Backend**:
```bash
cd backend
go run main.go
```

**Terminal 2 - Frontend**:
```bash
cd frontend
npm run dev
```

**Terminal 3 - Admin**:
```bash
cd admin
npm run dev
```

Then open:
- Game: `http://localhost:5173`
- Admin: `http://localhost:5174`
- Backend: `http://localhost:8080`

### Database Management

**Run migrations**:
```bash
cd backend
# Migrations run automatically on startup with AUTO_MIGRATE=true
# Manual migration with golang-migrate CLI:
migrate -path migrations -database "$DATABASE_URL" up
```

**Reset database**:
```bash
psql -d game_db -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
# Then restart backend to re-run migrations
```

### Image Upload Configuration

The system uses **Cloudinary** for image management. To configure:

1. Create a Cloudinary account at https://cloudinary.com
2. Get your Cloud Name, API Key, and API Secret
3. Add to backend `.env`:
   ```
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
4. Images are organized by folder:
   - Creatures: `creatures/{uuid}`
   - Campaign intro: `campaigns/{uuid}/intro`
   - Campaign outro: `campaigns/{uuid}/outro`

---

## Project Structure Details

### Frontend (Game Client)
```
frontend/src/
├── components/           # Reusable UI components
│   ├── ActionButton.tsx      # Individual action selection
│   ├── ActionPanel.tsx       # Grid of available actions
│   ├── CreatureCard.tsx      # Creature display with animations
│   ├── HealthBar.tsx         # HP visualization
│   ├── APBar.tsx            # Action Points visualization
│   ├── StatBar.tsx          # Generic stat bar
│   └── LogBox.tsx           # Battle event log
├── context/              # React Context for state management
│   ├── AuthProvider.tsx      # User authentication state
│   ├── GameProvider.tsx      # Game session and combat state
│   └── useGameInitializer.tsx # Bootstrap hook
├── layout/               # Layout components
│   ├── Header.tsx
│   ├── Layout.tsx
│   └── UserMenu.tsx
├── pages/                # Route components
│   ├── GameScreen.tsx       # Main combat arena
│   ├── Campaigns.tsx        # Campaign browser
│   ├── Creatures.tsx        # Creature selection
│   ├── Home.tsx            # Dashboard
│   ├── AuthForm.tsx        # Login/Register
│   ├── UserStats.tsx       # Statistics display
│   └── Settings.tsx        # Game settings
├── service/              # API service layer
│   ├── api.ts              # Base HTTP client
│   ├── user.service.ts     # User operations
│   ├── campaign.service.ts # Campaign/combat operations
│   └── creatures.service.ts # Creature operations
├── types/                # TypeScript type definitions
├── music/                # Audio system
│   ├── AudioProvider.tsx    # Audio context
│   ├── audio.service.ts     # Howler.js wrapper
│   └── useAudio.ts          # Audio hook
└── assets/               # Static assets
    └── music/               # Background music files
```

### Admin Dashboard
```
admin/src/
├── components/          # Reusable UI components
│   ├── Card.tsx             # Statistics card
│   ├── Table.tsx            # Data table
│   └── modals/              # Form modals for CRUD
│       ├── ActionModal.tsx
│       ├── CreatureModal.tsx
│       ├── DeleteModal.tsx
│       └── AssignActionsModal.tsx
├── layout/              # Layout components
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   ├── Footer.tsx
│   └── Layout.tsx
├── pages/               # Route components
│   ├── Dashboard.tsx        # Analytics overview
│   ├── Actions.tsx          # Action management
│   ├── Creatures.tsx        # Creature management
│   ├── Campaigns.tsx        # Campaign list
│   └── CampaignWizard.tsx   # Multi-step campaign creator
├── service/             # API service layer
│   ├── api.ts              # Base HTTP client with interceptors
│   ├── action.service.ts   # Action CRUD
│   ├── campaign.service.ts # Campaign CRUD
│   ├── creature.service.ts # Creature CRUD
│   └── dashboard.ts        # Statistics
└── types/               # TypeScript type definitions
```

### Backend (Go)
```
backend/
├── main.go              # Application entry point
├── database/            # Database connection
│   └── connect.go
├── domain/              # Data models
│   ├── action_domain.go
│   ├── campaign_domain.go
│   ├── creature_domain.go
│   └── user_domain.go
├── handler/             # HTTP request handlers
│   ├── *_handler.go     # Endpoint implementations
│   └── *_dto.go         # Request/response schemas
├── repository/          # Data access layer
│   ├── *_repo.go        # Database queries
│   └── dbtx.go          # Database transaction wrapper
├── service/             # Business logic layer
│   ├── *_service.go     # Core logic
│   ├── engine_service.go    # Combat engine
│   ├── *_dto.go         # Service data transfer objects
│   └── engine_helpers.go    # Combat utilities
├── imageservice/        # Media handling
│   └── image_service.go     # Cloudinary integration
├── migrations/          # Database schema
│   ├── 01_init.up.sql       # Core tables
│   ├── 02_game.up.sql       # Session/fight tables
│   └── 03_seed.up.sql       # Sample data
├── utils/               # Utilities
│   ├── middleware.go        # HTTP middleware
│   └── response_writer.go   # Response helpers
├── scripts/             # Helper scripts
└── makefile             # Build commands
```

---

## Configuration

### Environment Variables

**Backend (.env)**:
```
DATABASE_URL=postgres://user:password@localhost:5432/game_db
PORT=8080
AUTO_MIGRATE=true
APP_ENV=dev
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Frontend (.env.local)**:
```
VITE_BASE_URL=http://localhost:8080
VITE_APP_NAME=Campaign Game
```

**Admin (.env.local)**:
```
VITE_BASE_URL=http://localhost:8080
VITE_APP_NAME=Admin Dashboard
```

---

## Deployment

### Production Build

**Backend**:
```bash
cd backend
go build -o game-server main.go
# Configure production .env
./game-server
```

**Frontend & Admin**:
```bash
cd frontend
npm run build
# Serve dist/ folder with static host

cd admin
npm run build
# Serve dist/ folder with static host
```

### Docker (Optional)

Create `Dockerfile` for backend and `docker-compose.yml` for orchestration (not currently included).

---

## Testing

Currently no test files are configured. To add tests:

**Backend**:
```bash
# In backend/
go test ./...
```

**Frontend/Admin**:
```bash
# In frontend/ or admin/
npm test
```

---

## Troubleshooting

### Backend won't start
- Verify PostgreSQL is running
- Check `DATABASE_URL` is correct
- Ensure `AUTO_MIGRATE=true` or run migrations manually
- Check Cloudinary credentials are set

### Frontend won't load
- Verify backend is running on correct port
- Check `VITE_BASE_URL` matches backend address
- Clear browser cache and localStorage if needed

### Combat not resolving
- Check network requests in browser DevTools
- Verify action has sufficient AP cost
- Check backend logs for error details

### Images not uploading
- Verify Cloudinary credentials
- Check file size limits
- Ensure public upload folder is created in Cloudinary

---

## Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and test locally with all three services running
3. Commit with descriptive messages
4. Push and create pull request

---

## License

[Specify your license here]

## Support

For issues, questions, or suggestions, please create an issue on the repository.
   ```

   Open `http://localhost:5173`

### Admin Setup

1. **Install dependencies**
   ```bash
   cd admin
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

   Open `http://localhost:5174`

## API Endpoints

### Campaign Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/campaigns` | List all campaign templates |
| POST | `/api/campaign/{id}/start` | Start a new campaign session |
| GET | `/api/campaign/session` | Get active user session |
| POST | `/api/campaign/session/{id}/next` | Start next fight in campaign |
| POST | `/api/campaign/fight/{id}/round` | Resolve combat action |

### Creature Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/creatures` | List all creatures |
| GET | `/api/creatures/{campaignId}` | Get creatures for campaign |
| POST | `/api/creatures` | Create new creature |
| PUT | `/api/creatures/{id}` | Update creature |
| DELETE | `/api/creatures/{id}` | Delete creature |

### Action Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/actions` | List all actions |
| POST | `/api/actions` | Create new action |
| PUT | `/api/actions/{id}` | Update action |
| DELETE | `/api/actions/{id}` | Delete action |

### Campaign Admin Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/campaign` | Create campaign template |
| POST | `/api/admin/campaign/{id}/creatures` | Add creatures to campaign |
| POST | `/api/admin/campaign/{id}/stages` | Define campaign stages |
| PUT | `/api/admin/campaign/{id}/stage/{index}` | Edit stage creature |
| DELETE | `/api/admin/campaign/{id}` | Delete campaign |

## Game Mechanics

### Combat System

**Turn Structure:**
- Player and enemy alternate selecting actions
- Each action costs Action Points (AP)
- Combat continues until one participant's HP reaches 0

**Action Resolution:**
- Actions have accuracy ratings (0-100%) that affect hit chance
- Successful hits apply damage multipliers from action definition
- Damage calculations include creature base stats
- Enemy AI selects optimal actions based on game state

**Action Points (AP):**
- Each creature starts each turn with a pool of AP
- Actions consume AP based on their weight
- Remaining AP rolls to next turn if unused
- Maximum AP threshold prevents hoarding

**Campaign Progression:**
- Campaigns consist of multiple stages with increasing difficulty
- Each stage presents a different enemy creature
- Player creature persists health/AP across stages
- Campaign completion unlocks rewards

## Game Flow

```
Home → Select Campaign → Choose Player Creature → Battle → Next Stage → Victory Screen
```

1. **Campaign Selection**: Browse available campaigns and their descriptions
2. **Creature Selection**: Pick your character from available playable creatures
3. **Combat**: Execute actions in turn-based combat against enemy
4. **Progression**: Advance to next stage or complete campaign
5. **Results**: View campaign summary and statistics

## Development

### Building for Production

**Frontend:**
```bash
cd frontend
npm run build
# Output in dist/
```

**Admin:**
```bash
cd admin
npm run build
# Output in dist/
```

**Backend:**
```bash
cd backend
# Build binary
go build -o game-server
```

### Linting

**Frontend:**
```bash
npm run lint
```

**Admin:**
```bash
npm run lint
```

## Database Schema

The application uses PostgreSQL with the following main entities:

- **users**: Player accounts
- **creatures**: Creature definitions (playable and enemy types)
- **actions**: Combat actions with mechanics
- **campaign_templates**: Campaign configurations
- **campaign_stages**: Stage definitions within campaigns
- **campaign_sessions**: Active player campaign progress
- **fights**: Individual combat encounters
- **creature_actions**: Actions available to creatures

Migrations are automatically applied on startup with `AUTO_MIGRATE=true`.

## Architecture

### Clean Layered Design

**Frontend:**
- Pages: Route-specific components
- Components: Reusable UI elements
- Services: API communication layer
- Context: Global state management
- Types: TypeScript interfaces and types

**Backend:**
- Handlers: HTTP request/response handling
- Services: Business logic and game rules
- Repository: Database queries and transactions
- Domain: Core business entities and rules

This separation enables:
- Easy testing through dependency injection
- Clear responsibility boundaries
- Simple swapping of implementations
- Reusable service logic

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Support

For issues, feature requests, or questions, please open an issue on GitHub.

---

**A complete full-stack turn-based game implementation**
