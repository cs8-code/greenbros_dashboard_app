# Localhost Setup Complete!

## Your Application is Ready

The GreenBros Dashboard is now fully configured and running on localhost with:
- ✅ Backend API on **http://localhost:3001**
- ✅ Database file created at [backend/data/database.json](backend/data/database.json)
- ✅ All data initialized with sample content
- ✅ Employees now use **initials instead of avatar images**

## Current Setup

### Backend Server
**Status:** Running
**URL:** http://localhost:3001
**Storage:** JSON file at `backend/data/database.json`

### Database Contains:
- **4 Clients** (Alice Johnson, Bob Williams, Charlie Brown, Diana Miller)
- **4 Employees** (David Green, Eve Gardener, Frank Spade, Grace Roots)
  - Each employee now displays with colored initials (no role or avatar)
- **8 Tasks** across different statuses
- **5 Bills** with various payment statuses

## API Endpoints Available

All endpoints are accessible at `http://localhost:3001/api/`

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `PATCH /api/tasks/:id/status` - Update task status only
- `DELETE /api/tasks/:id` - Delete task

### Clients
- `GET /api/clients` - Get all clients
- `GET /api/clients/:id` - Get client by ID
- `POST /api/clients` - Create new client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Bills
- `GET /api/bills` - Get all bills
- `GET /api/bills/:id` - Get bill by ID
- `POST /api/bills` - Create new bill
- `PUT /api/bills/:id` - Update bill
- `DELETE /api/bills/:id` - Delete bill

### Employees
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create new employee (only `id`, `name`, `availability`)
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

## How to Start the Application

### Option 1: Run Everything Together
```bash
npm run start:all
```
This starts both backend and frontend with Electron desktop app.

### Option 2: Backend Only (Currently Running)
```bash
npm run backend:dev
```
Backend is running on port 3001.

### Option 3: Frontend Only (for web browser)
```bash
npm run dev
```
Then open http://localhost:3000 in your browser.

## Employee Display Changes

Employees are now displayed with:
- **Colored circular badges** with their initials
- **8 different colors** consistently assigned based on name
- **No role field**
- **No external avatar images**

Example:
- "David Green" → **DG** in a blue circle
- "Eve Gardener" → **EG** in a green circle

## Testing the API

You can test any endpoint with curl:

```bash
# Get all employees
curl http://localhost:3001/api/employees

# Get all tasks
curl http://localhost:3001/api/tasks

# Get all clients
curl http://localhost:3001/api/clients

# Health check
curl http://localhost:3001/api/health
```

## Data Persistence

All changes are automatically saved to `backend/data/database.json`:
- **Backup:** Copy the database.json file
- **Restore:** Replace database.json with your backup
- **Reset:** Delete database.json (will recreate with sample data on restart)

## Next Steps

To access the frontend:

1. **In another terminal**, run:
   ```bash
   npm run dev
   ```

2. Open your browser to **http://localhost:3000**

3. Or use the Electron desktop app:
   ```bash
   npm run electron:dev
   ```

## File Structure

```
backend/
├── data/
│   └── database.json          # Your data (auto-created)
├── routes/
│   ├── tasks.js              # Task API endpoints
│   ├── clients.js            # Client API endpoints
│   ├── bills.js              # Bill API endpoints
│   └── employees.js          # Employee API endpoints
├── storage/
│   └── json-db.js            # Database operations
└── server.js                  # Express server

utils/
└── getInitials.ts             # Helper for employee initials

components/
├── TeamList.tsx              # Employee list (uses initials)
├── Dashboard.tsx             # Dashboard view
├── TasksBoard.tsx            # Task board
├── ClientsList.tsx           # Client list
└── TasksByClient.tsx         # Tasks by client view
```

## Troubleshooting

**Backend won't start:**
- Check if port 3001 is already in use
- Verify `npm install` was run successfully

**Data not saving:**
- Ensure `backend/data/` directory has write permissions
- Check backend terminal for error messages

**Frontend can't connect:**
- Verify backend is running on port 3001
- Check that `API_URL` in DataContext.tsx is `http://localhost:3001/api`

---

Your application is ready to use! 🎉
