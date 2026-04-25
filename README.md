# Full Stack Turn-Based Game

A full-stack turn-based combat game with comprehensive admin dashboard for content management. Manage campaigns, creatures, and combat mechanics through an intuitive admin interface, then play strategic turn-based battles in an engaging frontend game experience.

## Overview

This is a three-tier application designed for managing and playing turn-based combat scenarios. The system separates content creation (Admin), game logic (Backend), and player experience (Frontend) into distinct, well-architected applications.

## Features

### 🎮 Game Frontend
- **Turn-Based Combat System**: Strategic action selection with action point economy
- **Campaign Progression**: Complete campaigns by defeating staged encounters
- **Real-Time Battle UI**: Live health/AP bars, combat animations, and action logs
- **Creature Selection**: Choose from available creatures for each campaign
- **Session Persistence**: Resume ongoing campaigns

### 🛠️ Admin Dashboard
- **Campaign Management**: Create and configure campaign templates
- **Stage Configuration**: Define multi-stage campaigns with enemy progression
- **Creature Library**: Full CRUD for playable and enemy creatures
- **Action Management**: Define combat actions with accuracy, AP costs, and damage multipliers
- **Campaign Assignment**: Assign creatures and actions to campaigns

### ⚙️ Backend API
- **Campaign Endpoints**: Start campaigns, manage sessions, retrieve templates
- **Combat Resolution**: Server-side action resolution with RNG and stat calculation
- **Creature Management**: Manage creature templates and instances
- **User Sessions**: Track active campaigns and player progress
- **RESTful Architecture**: Clean API endpoints with JSON responses

## Tech Stack

### Frontend (Game)
- **React 19.2** with TypeScript
- **React Router 7** for navigation
- **Tailwind CSS 4** for styling
- **Vite 8** for fast development and builds
- **React Compiler** for optimized rendering

### Admin
- **React 19.2** with TypeScript
- **React Router 7** for navigation
- **Tailwind CSS 4** for styling
- **Vite 8** for fast development and builds

### Backend
- **Go 1.x** for high-performance server
- **PostgreSQL** for data persistence
- **golang-migrate** for schema versioning
- **Standard library HTTP** for API endpoints
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Go 1.20+
- PostgreSQL 12+

### Backend Setup

1. **Install dependencies**
   ```bash
   cd backend
   go mod download
   ```

2. **Configure environment**
   ```bash
   # Create .env file
   cat > .env << EOF
   DATABASE_URL=postgres://user:password@localhost:5432/game_db
   PORT=8080
   AUTO_MIGRATE=true
   EOF
   ```

3. **Start server**
   ```bash
   go run main.go
   ```

   Server runs on `http://localhost:8080`

### Frontend Setup

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure API**
   - Update `src/service/api.ts` with backend URL if needed (defaults to localhost:8080)

3. **Start development server**
   ```bash
   npm run dev
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
