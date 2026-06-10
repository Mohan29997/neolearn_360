# NeoLearn 360 — Architecture Guide

## Overview

NeoLearn 360 is a single-page React application (SPA) built with Vite. It follows a layered, provider-first architecture where cross-cutting concerns (theming, state, routing, notifications) are composed as React context providers at the root level, and features are self-contained screen modules.

---

## Layer Diagram

```
┌─────────────────────────────────────────────────────┐
│                  Browser (SPA)                       │
├─────────────────────────────────────────────────────┤
│  App.tsx — bootstraps auth state, picks navigator   │
├────────────────────┬────────────────────────────────┤
│  AuthNavigation    │  AppNavigation                 │
│  (unauthenticated) │  (role-gated routes)           │
├────────────────────┴────────────────────────────────┤
│            Screens  (src/screens/)                  │
│  admindashboard / users / courses / benchonboarding │
│  learningjourneys / courserequests / settings       │
├─────────────────────────────────────────────────────┤
│         Service Layer  (src/service/)               │
│  service class  →  axiosInstance  →  REST API       │
├─────────────────────────────────────────────────────┤
│  Redux Store  (src/store/)                          │
│  authHelper slice  |  adminProfile slice            │
├─────────────────────────────────────────────────────┤
│  StorageManager  (src/storagemanager/)              │
│  AES-encrypted localStorage (tokens + profile)      │
└─────────────────────────────────────────────────────┘
```

---

## Provider Tree

Providers are composed in `src/providers/apputils/index.tsx`:

```
<StoreProvider>          ← Redux store
  <ThemeProvider>        ← MUI light/dark theme
    <SnackbarProvider>   ← notistack toast notifications
      <NavigationProvider>  ← react-router BrowserRouter
        <App />
      </NavigationProvider>
    </SnackbarProvider>
  </ThemeProvider>
</StoreProvider>
```

---

## Authentication Flow

```
App mounts
  │
  ├─ StorageManager.getAccessToken()
  │     ├─ token exists  → dispatch setIsLogin(true)  → AppNavigation
  │     └─ no token      → dispatch setIsLogin(false) → AuthNavigation
  │
  └─ isLogin === null     → Loading splash (LinearProgress)
```

### Token Refresh (silent re-auth)

The Axios response interceptor in `src/service/api.ts` handles 401 responses:

1. Intercept 401 on any request
2. Fetch `refreshToken` from `StorageManager`
3. `POST /auth/refresh-token` with the refresh token
4. On success — update both tokens in storage and retry the original request
5. On failure — dispatch `setIsLogin(false)` and clear storage

---

## Role-Based Access Control

Roles are stored in the `adminProfile` Redux slice after login. UI gating happens at the component level — no separate route guard needed because the server enforces permissions independently.

| Role | Dashboard | Users | Courses | Departments | Bench | LND Courses |
|---|---|---|---|---|---|---|
| SUPER_ADMIN | Full | ✓ | ✓ | ✓ | ✓ | ✓ |
| ADMIN | Team-scoped | ✓ | ✓ | ✓ | ✓ | — |
| MANAGER | Dept-scoped | Read | — | — | Dept only | — |
| EMPLOYEE | Personal | — | Read | — | — | — |

---

## Service Layer

`src/service/index.ts` is the only place that imports `axiosInstance`. All components call methods on the `service` class — no scattered `axios.get(...)` calls in screens.

The `axiosInstance` (from `src/service/api.ts`) adds:
- `Authorization: Bearer <token>` on every request
- Automatic retry (3×) with 1-second delay on network errors and 5xx
- Snackbar error notifications on 400, 404, 405

---

## State Management

Redux Toolkit is used for **shared global state only** — auth status and the logged-in user's profile. Screen-level state (table data, loading flags, modal open state) lives in component `useState` hooks.

```
store/
├── index.tsx          ← configureStore, exports RootState + AppDispatch
└── reducer/
    ├── AuthHelper.ts  ← isLogin: null | true | false
    └── AdminProfile.ts ← name, role, department, technologies, ...
```

---

## Directory Reference

```
src/
├── App.tsx                    Entry point: auth gate
├── main.tsx                   Mounts providers + App
│
├── navigation/
│   ├── authnavigation/        Login routes
│   └── appnavigation/         Protected routes + path constants
│
├── screens/
│   ├── auth/adminlogin/       Login screen
│   └── app/
│       ├── admindashboard/    Role-aware KPI dashboard (auto-refresh 30s)
│       ├── users/             User table + create/edit modals
│       ├── courses/           Course library + add/delete
│       ├── departments/       Department CRUD
│       ├── benchonboarding/   Bench employee tracking + course assignment
│       ├── learningjourneys/  Structured learning paths
│       ├── courserequests/    Assigned course view (employee-facing)
│       └── settings/          User profile + achievements
│
├── service/
│   ├── api.ts                 Axios instance + interceptors
│   └── index.ts               Service class (all API methods)
│
├── store/                     Redux slices
├── storagemanager/            Encrypted localStorage wrapper
├── hooks/                     useAppSelector, useAppDispatch, useDebounce, etc.
├── utils/                     Pure utility functions
├── shared/helpers/            Generic array/string helpers
├── helper/                    App-specific helpers (snackbar, device, base64)
├── theme/                     MUI theme tokens (palette, typography, shadows)
├── components/                Shared UI components (navigation, snackbar, tabtitle)
└── providers/                 Context providers (store, theme, snackbar, router)
```
