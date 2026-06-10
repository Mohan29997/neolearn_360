# NeoLearn 360 — API Reference

All HTTP calls go through the `service` class in `src/service/index.ts`.
The underlying Axios instance (`src/service/api.ts`) attaches the Bearer token automatically and handles token refresh on 401.

Base URL is configured via the `VITE_API_URL` environment variable (default: `/api/v1`).

---

## Authentication

### `service.userlogin(payload)`
**POST** `/auth/login`

| Param | Type | Description |
|---|---|---|
| `payload.email` | `string` | User's corporate email |
| `payload.password` | `string` | Plain text password |

**Response:** `{ accessToken, refreshToken, user }`

---

## Users

### `service.getUsers(params)`
**GET** `/users`

| Param | Type | Default | Description |
|---|---|---|---|
| `page` | `number` | — | Page number (1-indexed) |
| `limit` | `number` | `90` | Items per page |
| `search` | `string` | — | Filter by name or email |
| `role` | `string` | — | Filter by role |
| `department` | `string` | — | Filter by department |
| `status` | `string` | — | Filter by bench status |

**Response:** `{ users: User[], pagination: { total, page, limit } }`

---

### `service.getuserprofile()`
**GET** `/users/profile`

Returns the full profile of the authenticated user.

---

### `service.updateAdminUser(id, payload)`
**PATCH** `/users/admins/:id`

| Field | Type | Required |
|---|---|---|
| `employeeId` | `string` | No |
| `name` | `string` | No |
| `email` | `string` | No |
| `password` | `string` | No — omit to keep current |
| `isActive` | `boolean` | No |

---

### `service.updateUserStatus(id, status)`
**PATCH** `/users/:id/status`

Updates a user's bench status.

| Status value | Display label |
|---|---|
| `"on_bench"` | On Bench |
| `"shadowing"` | Shadowing |
| `"on_project"` | On Project |

---

### `service.onboardUser(payload)`
**POST** `/users/onboard`

Creates a new user account. See `IOnboardUserPayload` in `src/service/service.d.ts` for the full payload shape.

---

## Departments

### `service.getDepartments()`
**GET** `/departments`

Returns all departments. Cache-busted on each call via `?_t=<timestamp>`.

---

### `service.createDepartment(payload)`
**POST** `/departments`

```json
{
  "departlist": [
    { "name": "Engineering", "manager_name": "Alice", "employee_id": "EMP001" }
  ]
}
```

---

### `service.updateDepartment(id, payload)`
**PATCH** `/departments/:id`

| Field | Type |
|---|---|
| `name` | `string` |
| `manager_name` | `string` |
| `employee_id` | `string` |
| `isActive` | `boolean` |

---

## Courses

### `service.getCourses(page, limit)`
**GET** `/courses?page=1&limit=90`

**Response:** `{ courses: Course[], pagination: { total, page, limit } }`

---

### `service.addCourse(payload)`
**POST** `/courses`

| Field | Description |
|---|---|
| `course_title` | Course name |
| `provider` | e.g. "Coursera", "Udemy" |
| `level` | `"beginner"` \| `"intermediate"` \| `"advanced"` |
| `duration_hours` | Numeric hours |
| `course_url` | External course link |
| `description` | Short summary |

---

### `service.deleteCourse(id)`
**DELETE** `/courses/:id`

---

### `service.assignCourse(payload)`
**POST** `/courses/assign`

Assigns a course to a bench employee with a designated mentor.

```json
{ "course_id": "...", "mentor_id": "...", "user_id": "..." }
```

---

### `service.getAssignedCourses(params)`
**GET** `/courses/assign`

| Param | Description |
|---|---|
| `page` | Page (1-indexed) |
| `limit` | Items per page |
| `user_id` | Filter to a specific user |
| `status` | Filter by assignment status |

**Response:** `{ assignments: Assignment[] }`

Assignment `status` values: `"assigned"` | `"in_progress"` | `"completed"`

---

### `service.updateAssignedCourse(payload)`
**PATCH** `/courses/assign`

```json
{ "user_id": "...", "course_id": "...", "coordinator_id": "..." }
```

---

## Learning Journeys

### `service.getLearningJourneys(params)`
**GET** `/learning-journeys`

| Param | Default |
|---|---|
| `page` | `1` |
| `limit` | `20` |

**Response:** `{ learningJourneys: Journey[] }` — each journey contains a `courses` array with individual course steps.

---

## Misc

### `service.getRoles()`
**GET** `/users/roles` — List of available role strings.

### `service.getCities()`
**GET** `/users/city` — List of office city names.

---

## Error Handling

The Axios interceptor handles errors globally:

| HTTP Status | Behaviour |
|---|---|
| `400` | Snackbar with server message |
| `401` | Silent token refresh → retry; logout on failure |
| `404` | Snackbar with server message |
| `405` | Snackbar: "Request method not allowed" |
| `408 / 500 / 503` | Auto-retry up to 3× with 1-second delay |
| Network error | Auto-retry up to 3× |
