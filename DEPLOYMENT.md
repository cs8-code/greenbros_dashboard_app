# GreenBros Dashboard - Deployment Guide

This guide will help you set up and deploy the GreenBros Dashboard as a desktop application with a local backend.

## Architecture

- **Frontend**: React + Vite (TypeScript)
- **Desktop**: Electron wrapper
- **Backend**: Node.js + Express
- **Database**: SQLite (file-based, portable)

## Prerequisites

- Node.js (v18 or higher)
- npm

## Installation

1. Install all dependencies:
```bash
npm install
```

## Running in Development Mode

### Option 1: Run Everything Together (Recommended)
```bash
npm run start:all
```
This command starts both the backend server and the Electron app automatically.

### Option 2: Run Components Separately

**Terminal 1 - Backend Server:**
```bash
npm run backend:dev
```
The backend will run on `http://localhost:3001`

**Terminal 2 - Electron App:**
```bash
npm run electron:dev
```
This starts the Vite dev server on port 3000 and opens the Electron window.

### Option 3: Web Browser Only (No Desktop App)

**Terminal 1 - Backend Server:**
```bash
npm run backend:dev
```

**Terminal 2 - Frontend Only:**
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

## Building for Production (Desktop App)

1. Build the application:
```bash
npm run electron:build
```

2. The installer will be created in the `dist` folder:
   - **Windows**: `dist/GreenBros Dashboard Setup X.X.X.exe`
   - **macOS**: `dist/GreenBros Dashboard-X.X.X.dmg`
   - **Linux**: `dist/GreenBros Dashboard-X.X.X.AppImage`

3. Install the application on your desktop by running the installer.

## Database Location

The SQLite database file is stored at:
```
backend/greenbros.db
```

### Initial Data
On first run, the database is automatically seeded with sample data:
- 4 Clients (Alice Johnson, Bob Williams, Charlie Brown, Diana Miller)
- 4 Employees (David Green, Eve Gardener, Frank Spade, Grace Roots)
- 8 Tasks with various statuses
- 5 Bills with different payment statuses

### Backup Your Data
To backup your data, simply copy the `backend/greenbros.db` file to a safe location.

To restore, replace the file with your backup.

## API Endpoints

The backend provides the following REST API endpoints:

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
- `POST /api/employees` - Create new employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

## Troubleshooting

### Backend Not Starting
- Check if port 3001 is already in use
- Look for error messages in the terminal
- Ensure all dependencies are installed (`npm install`)

### Frontend Can't Connect to Backend
- Verify the backend is running on `http://localhost:3001`
- Check browser console for CORS errors
- Ensure the API_URL in `context/DataContext.tsx` is correct

### Electron App Not Opening
- Make sure the dev server (port 3000) is running first
- Wait for the message "Local: http://localhost:3000/" before Electron opens
- Check if port 3000 is available

### Database Issues
- Delete `backend/greenbros.db` to reset the database (will re-seed on next start)
- Check file permissions on the database file

## Production Deployment Notes

When you build the desktop app with `npm run electron:build`, the packaged application includes:
- The built frontend (static files)
- The backend server code
- The SQLite database
- All necessary Node.js dependencies

The Electron app automatically starts the backend server when it launches, so users don't need to manually start anything.

## Configuration

### Changing Ports

**Backend Port** (default: 3001):
Edit `backend/server.js`:
```javascript
const PORT = process.env.PORT || 3001;
```

**Frontend Port** (default: 3000):
Edit `vite.config.ts`:
```typescript
server: {
  port: 3000,
  ...
}
```

### API URL

The frontend connects to the backend via the API_URL in `context/DataContext.tsx`:
```typescript
const API_URL = 'http://localhost:3001/api';
```

Change this if you modify the backend port.

## Features

- Task management with drag-and-drop status updates
- Client management
- Bill/Invoice tracking
- Employee scheduling with weekly availability
- Persistent data storage in SQLite
- Desktop application for easy access
- Offline-capable (all data stored locally)

## Next Steps

Consider adding:
- User authentication
- Data export (CSV, PDF)
- Automated backups
- Multi-user support with role-based access
- Cloud sync capabilities
