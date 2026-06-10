# Contributing to NeoLearn 360

## Prerequisites

- Node.js ≥ 18
- npm or yarn

## Setup

```bash
git clone <repo-url>
cd neolearn_360
npm install
cp .env.example .env        # fill in VITE_API_URL and VITE_STORAGE_SALT
npm run dev                 # starts Vite dev server at http://localhost:5173
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run test` | Run all tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Generate coverage report in `coverage/` |
| `npm run deploy` | Build + deploy to Firebase Hosting |

## Code Style

- **TypeScript** everywhere — avoid `any` unless the external API shape is truly unknown
- **No inline `console.log`** in committed code — use the `SnackNotification` helper for user-facing messages
- **No component-level API calls** — all HTTP goes through `src/service/index.ts`
- **Component state** (table rows, loading flags, modals) stays in `useState`; only auth and user profile go into Redux
- **Single-responsibility hooks** — if a hook grows beyond one concern, split it

## Adding a New Screen

1. Create `src/screens/app/<feature>/index.tsx`
2. Add the route to `src/navigation/appnavigation/index.tsx`
3. Export the path constant from `src/navigation/appnavigation/apppath.ts`
4. Add the nav link in `src/components/navigation/navigations.tsx`

## Adding a New API Method

1. Add the static method to `src/service/index.ts` with a JSDoc comment
2. Add the corresponding type declaration to `src/service/service.d.ts` if a new payload type is needed
3. Write a unit test in `src/tests/service/service.test.ts`

## Testing

Tests live in `src/tests/` and mirror the source structure:

```
src/tests/
├── constants/    ← constant file tests
├── helper/       ← helper function tests
├── hooks/        ← custom hook tests
├── service/      ← API service tests
├── shared/       ← shared helper tests
├── store/        ← Redux reducer tests
└── utils/        ← utility function tests
```

Use **Vitest** + **React Testing Library**. Keep tests colocated by concern, not by file.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | Yes | Backend REST API base URL (e.g. `https://api.neolearn360.com/api/v1`) |
| `VITE_STORAGE_SALT` | Recommended | AES passphrase for token encryption; use a UUID in production |

## Deployment

The app is deployed to **Firebase Hosting**:

```bash
npm run deploy   # runs: npm run build && firebase deploy
```

For Vercel, the `vercel.json` at root handles SPA rewrites (all routes → `index.html`).

## Branch Conventions

| Branch prefix | Purpose |
|---|---|
| `feature/` | New features |
| `fix/` | Bug fixes |
| `chore/` | Dependency updates, config changes |
| `docs/` | Documentation only |

Target the `dev` branch for all pull requests. `main` is the production branch.
