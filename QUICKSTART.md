# Quick Start Guide

## Setup Complete!

Your GreenBros Dashboard is now fully configured with:
- Electron desktop app wrapper
- Node.js/Express backend API
- JSON file storage (no compilation needed!)
- Frontend integrated with backend

## Get Started in 3 Steps

### 1. Install Dependencies (Already Done!)
```bash
npm install
```

### 2. Run the Application

**Option A: Run Everything at Once (Recommended)**
```bash
npm run start:all
```
This will:
- Start the backend server on port 3001
- Start the Vite dev server on port 3000
- Open the Electron desktop app automatically

**Option B: Run Components Separately**

Terminal 1 - Backend:
```bash
npm run backend:dev
```

Terminal 2 - Desktop App:
```bash
npm run electron:dev
```

**Option C: Web Browser Only**

Terminal 1 - Backend:
```bash
npm run backend:dev
```

Terminal 2 - Frontend:
```bash
npm run dev
```
Then open http://localhost:3000 in your browser

### 3. Start Using the App!

The app will open with sample data already loaded:
- 4 clients
- 4 employees
- 8 tasks
- 5 bills

## Data Storage

All your data is saved in:
```
backend/data/database.json
```

**To backup:** Simply copy this file to a safe location
**To restore:** Replace the file with your backup
**To reset:** Delete the file and restart the backend (will recreate with sample data)

## Build Desktop Installer

When you're ready to create an installable desktop app:

```bash
npm run electron:build
```

The installer will be created in the `dist` folder:
- **Windows**: `GreenBros Dashboard Setup 1.0.0.exe`
- **macOS**: `GreenBros Dashboard-1.0.0.dmg`
- **Linux**: `GreenBros Dashboard-1.0.0.AppImage`

## Features

- Drag-and-drop task management
- Client management with contact information
- Bill/invoice tracking with payment status
- Employee scheduling with availability
- Persistent data storage (all changes are automatically saved)
- Works offline (all data stored locally)

## Troubleshooting

**Backend won't start:**
- Check if port 3001 is already in use
- Make sure you ran `npm install` first

**Frontend can't connect to backend:**
- Ensure backend is running (you should see "Backend server running on http://localhost:3001")
- Check that no firewall is blocking port 3001

**Electron app won't open:**
- Wait for "Local: http://localhost:3000/" message before Electron starts
- Check if port 3000 is available

**Data not saving:**
- Check that `backend/data/database.json` exists and is writable
- Look for error messages in the backend terminal

## Next Steps

- Customize the employee list
- Add your real clients
- Create tasks for your actual projects
- Track your invoices and payments

For more detailed information, see:
- [DEPLOYMENT.md](DEPLOYMENT.md) - Complete deployment guide
- [package.json](package.json) - All available npm scripts

Enjoy your GreenBros Dashboard!
