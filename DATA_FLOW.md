# Data Flow Documentation

## Current Architecture

The application now uses a **backend API** for all data operations. Mock data is **no longer used**.

## Data Source

**Primary Data Source:** Backend API
**Storage:** JSON file at [backend/data/database.json](backend/data/database.json)
**API Base URL:** `http://localhost:3001/api`

## Data Flow

```
Frontend (React)
    ↓ fetches data from
Backend API (Express)
    ↓ reads/writes to
JSON Database (database.json)
```

## Implementation Details

### Frontend Data Fetching

**File:** [context/DataContext.tsx](context/DataContext.tsx:4)

```typescript
const API_URL = 'http://localhost:3001/api';
```

The DataContext:
- Fetches all data on component mount via `fetchAllData()`
- Makes API calls for all CRUD operations
- No longer uses mock data from `data/mockData.ts`

### Backend Storage

**File:** [backend/storage/json-db.js](backend/storage/json-db.js)

The backend:
- Reads and writes to `backend/data/database.json`
- Automatically creates the file with initial data if it doesn't exist
- Provides CRUD operations for all collections (tasks, clients, bills, employees)

## Data Collections

### 1. Employees
**Endpoint:** `/api/employees`
**Structure:**
```json
{
  "id": "e1",
  "name": "David Green",
  "availability": {
    "monday": true,
    "tuesday": true,
    "wednesday": true,
    "thursday": true,
    "friday": false,
    "saturday": false,
    "sunday": false
  }
}
```

**Note:** No `role` or `avatarUrl` fields. Employees display with colored initials.

### 2. Tasks
**Endpoint:** `/api/tasks`
**Structure:**
```json
{
  "id": "t1",
  "title": "Rasenmähen & Kantenschneiden",
  "clientId": "c1",
  "assignedTo": ["e1", "e4"],
  "dueDate": "2025-11-15",
  "status": "in-progress",
  "description": "..."
}
```

### 3. Clients
**Endpoint:** `/api/clients`
**Structure:**
```json
{
  "id": "c1",
  "name": "Alice Johnson",
  "address": "Eichenweg 123",
  "phone": "555-0101",
  "email": "alice@example.com"
}
```

### 4. Bills
**Endpoint:** `/api/bills`
**Structure:**
```json
{
  "id": "b1",
  "clientId": "c1",
  "amount": 150,
  "dueDate": "2025-11-22",
  "status": "due"
}
```

## Key Files

### Frontend
- [context/DataContext.tsx](context/DataContext.tsx) - Data fetching and state management
- [types.ts](types.ts) - TypeScript type definitions
- ~~[data/mockData.ts](data/mockData.ts)~~ - **DEPRECATED** (no longer used)

### Backend
- [backend/server.js](backend/server.js) - Express server
- [backend/storage/json-db.js](backend/storage/json-db.js) - Database operations
- [backend/data/database.json](backend/data/database.json) - Actual data storage
- [backend/routes/tasks.js](backend/routes/tasks.js) - Task endpoints
- [backend/routes/clients.js](backend/routes/clients.js) - Client endpoints
- [backend/routes/bills.js](backend/routes/bills.js) - Bill endpoints
- [backend/routes/employees.js](backend/routes/employees.js) - Employee endpoints

## How Data Updates Work

### Example: Updating a Task Status

1. **User Action:** Drags a task to a different column
2. **Frontend:** Calls `updateTaskStatus(taskId, newStatus)`
3. **DataContext:** Makes PATCH request to `/api/tasks/:id/status`
4. **Backend Route:** Receives request, updates data in memory
5. **JSON DB:** Writes updated data to `database.json`
6. **Frontend:** Updates local state to reflect the change

### Example: Adding a New Client

1. **User Action:** Fills out "Add Client" form and submits
2. **Frontend:** Calls `addClient(clientData)`
3. **DataContext:** Makes POST request to `/api/clients`
4. **Backend Route:** Creates new client with generated ID
5. **JSON DB:** Writes new client to `database.json`
6. **Frontend:** Updates local state to show new client

## Data Persistence

All data is automatically saved to `backend/data/database.json` whenever:
- A task is created, updated, or deleted
- A client is created, updated, or deleted
- A bill is created, updated, or deleted
- An employee is created, updated, or deleted

**Backup Strategy:**
- Copy `backend/data/database.json` to backup location
- To restore: Replace the file and restart the backend

## Testing Data Flow

```bash
# Check backend is running
curl http://localhost:3001/api/health

# Get all employees
curl http://localhost:3001/api/employees

# Get all tasks
curl http://localhost:3001/api/tasks

# Update task status
curl -X PATCH http://localhost:3001/api/tasks/t1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'
```

## Migration Notes

### What Changed
- ✅ Removed mock data usage
- ✅ All data now comes from backend API
- ✅ Data persists between sessions
- ✅ Multiple users can access the same data (when running on a server)

### Breaking Changes
- Employee structure changed (removed `role` and `avatarUrl`)
- Frontend now requires backend to be running
- Data is no longer reset on page refresh

---

**Last Updated:** 2025-11-15
**Current Status:** ✅ Fully operational with backend API
