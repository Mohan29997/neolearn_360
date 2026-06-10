# NeoLearn 360 — Enterprise Bench Learning Management System

**NeoLearn 360** is a full-stack enterprise LMS purpose-built to solve a common but costly enterprise problem: **what do employees do while they're on the bench (between projects)?**

Instead of idle bench time, NeoLearn 360 turns it into structured, trackable, role-based upskilling — with automated course assignment, mentor pairing, real-time dashboards, and multi-role access control.

---

## The Problem

In large IT services companies, 10–30% of the workforce is "on bench" at any given time — waiting for project allocation. This idle time is lost productivity. Most enterprises have no structured way to track, assign, or measure bench learning. Managers can't see progress, L&D teams can't plan, and employees don't know what to learn next.

## Our Solution

NeoLearn 360 provides:

- **Bench Management**: Track every employee's status — On Bench, Shadowing, On Project
- **Smart Course Assignment**: Assign specific courses and mentors to bench employees in one click
- **Role-Based Dashboards**: Super Admins see org-wide KPIs; Managers see their team; Employees see their own progress
- **Learning Journeys**: Structured multi-course paths mapped to tracks like Full Stack, Cloud, Data Engineering
- **Real-Time Progress Tracking**: Auto-refreshing dashboards, completion rates, and department performance

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript + Vite |
| UI Library | MUI v9 (Material UI) |
| State Management | Redux Toolkit |
| API Layer | Axios with JWT refresh token interceptor |
| Auth | Token-based auth stored via encrypted StorageManager |
| Backend | REST API (Node.js) |
| Database | MongoDB |
| Deployment | Firebase Hosting + Vercel |
| Testing | Vitest + React Testing Library (coverage reports available) |

---

## Architecture

```
src/
├── screens/app/         # Feature screens (dashboard, users, courses, bench, journeys)
├── screens/auth/        # Authentication screens
├── service/             # Centralized API service layer (axios + interceptors)
├── store/               # Redux slices (AuthHelper, AdminProfile)
├── providers/           # App-wide providers (theme, store, snackbar, navigation)
├── hooks/               # Custom hooks (useAppSelector, useAppDispatch, useMUITheme, useDebounce)
├── storagemanager/      # Encrypted local storage abstraction
├── theme/               # MUI theme customization (light/dark palettes, typography, shadows)
├── navigation/          # Route definitions (auth + app navigation)
└── tests/               # Unit tests for utils, hooks, services, store
```

**Key architectural decisions:**
- `service` class acts as a typed API facade — all HTTP calls go through one place, no scattered axios calls in components
- Axios interceptor handles 401 → token refresh → retry transparently
- `StorageManager` encrypts tokens at rest using CryptoJS (no plain-text tokens in localStorage)
- Role-based rendering is handled at the component level using Redux-stored user profile

---

## Roles & Access

| Role | Capabilities |
|---|---|
| SUPER_ADMIN | Full org visibility, all features, system diagnostics |
| ADMIN | User management, course CRUD, department management |
| MANAGER | View own team only, track bench status, assign courses |
| EMPLOYEE | View assigned courses, learning journeys, personal progress |

---

## Key Features

### Bench Onboarding (Team Management)
- See all employees with their bench status in one table
- Change status (On Bench → Shadowing → On Project) inline
- Assign a course + mentor to any bench employee in one modal
- Tracks assignment state: Unassigned → Course Assigned → Course Started

### Admin Dashboard
- Real-time KPIs: enrolled users, active programs, bench count, completion rate
- Department performance progress bars (live from API)
- Recent activity feed
- Bench status donut chart breakdown
- Auto-refreshes every 30 seconds

### Employee Dashboard
- Personal progress across all assigned courses
- Quick access to learning journeys and course catalog
- Overall completion rate tracker

### Learning Journeys
- Structured learning paths (e.g. "Full Stack Dev", "Cloud Architect")
- Per-journey progress tracking with expandable course list

---

## Getting Started

```bash
npm install
npm run dev        # Start dev server
npm run build      # Production build
npm run test       # Run tests
npm run test:coverage  # Test coverage report
```

Set `VITE_API_URL` in your `.env` file to point to the backend.

---

## Security

- Tokens stored encrypted (CryptoJS AES) via `StorageManager`
- All API calls are authenticated via Bearer token in Axios interceptor
- Refresh token rotation on 401 — silent re-auth without user disruption
- Role-based access: routes and UI elements are gated per user role

---

## Testing

Unit tests cover:
- Utility functions (`calculateAge`, `formatNumber`, `colorUtils`, `buildQueryParams`, etc.)
- Hooks (`useDebounce`, `useQueryParams`, `useMUITheme`)
- Storage manager (encrypt/decrypt)
- Redux reducers (`AdminProfile`, `AuthHelper`)
- API service layer
- Shared helpers (array, string utilities)

```bash
npm run test:coverage
```

---

## Team

Built for [Hackathon Name] · June 2026

NeoLearn 360 — *Turn bench time into build time.*
