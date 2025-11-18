# Deployment Guide

This guide covers **two deployment options** for your Business Management Dashboard:
1. **Desktop Application** - Windows executable for local use
2. **Web Application** - Cloud deployment using Vercel + Render

---

## Option 1: Desktop Application (Local Deployment)

Deploy as a Windows desktop application that runs entirely on the user's computer.

### Prerequisites

- Node.js installed
- Windows operating system

### Step 1: Build the Desktop Application

```bash
npm run electron:build
```

This creates two installers in the `dist` folder:
- **GreenBros-Dashboard-Portable.exe** - No installation needed, runs directly
- **GreenBros-Dashboard Setup.exe** - Traditional installer with Start Menu entry

### Step 2: Share with Client

**Option A: Portable Version (Recommended)**
1. Send `dist/GreenBros-Dashboard-Portable.exe` to your client
2. Client double-clicks to run - no installation needed
3. All data stays on their computer

**Option B: Installer Version**
1. Send `dist/GreenBros-Dashboard Setup.exe` to your client
2. Client runs installer
3. App appears in Start Menu
4. Can be uninstalled via Windows Settings

### Important Notes for Desktop Deployment

**Backend is Bundled:**
- The backend runs automatically when the app starts
- No separate backend setup needed
- Data stored in: `%APPDATA%/greenbros-dashboard/` (or local folder)

**Pros:**
- ✅ No internet required (works offline)
- ✅ All data stays private on local machine
- ✅ No monthly costs
- ✅ Fast performance
- ✅ Easy to share (single .exe file)

**Cons:**
- ❌ Windows only
- ❌ Must rebuild and reshare for updates
- ❌ Each user has separate data
- ❌ No remote access

### Development Mode

For development with hot-reload:
```bash
npm run start:all
```

This starts both frontend (with auto-refresh) and backend.

---

## Option 2: Web Application (Cloud Deployment)

Deploy to the cloud for browser-based access from anywhere.

### Prerequisites

- GitHub account
- Vercel account (free tier)
- Render account (free tier)
- Your code pushed to GitHub repository

---

## Part 1: Deploy Backend to Render

### Step 1: Prepare Your Repository

1. Push all your code to GitHub
2. Make sure `.gitignore` excludes `backend/data/database.json` (already configured)

### Step 2: Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with your GitHub account

### Step 3: Create New Web Service

1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `greenbros-dashboard-backend` (or your choice)
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

**Important:** Make sure the Root Directory is set to `backend` so Render uses the backend's package.json.

### Step 4: Add Environment Variables (Optional)

If you need any environment variables for the backend, add them in the "Environment" section.

### Step 5: Verify Database Initialization

The database is **automatically initialized** when the backend starts. No manual steps required!

What happens automatically:
- Creates the `data` directory if it doesn't exist
- Initializes `database.json` with sample data on first run
- You can verify this in the Render logs (look for "Database initialized with sample data")

**Note:** Shell access requires a paid Render plan. The free tier works perfectly without it because the backend handles initialization automatically.

### Step 6: Copy Your Backend URL

- Your backend URL will be: `https://greenbros-dashboard-backend.onrender.com`
- Copy this URL (you'll need it for frontend deployment)

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with your GitHub account

### Step 2: Import Your Repository

1. Click "Add New..." → "Project"
2. Import your GitHub repository
3. Vercel will auto-detect it as a Vite project

### Step 3: Configure Build Settings

- **Framework Preset**: Vite
- **Root Directory**: `./` (leave as root)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 4: Add Environment Variable

In the "Environment Variables" section, add:

- **Name**: `VITE_API_URL`
- **Value**: `https://greenbros-dashboard-backend.onrender.com/api`
  (Replace with your actual Render backend URL + `/api`)

### Step 5: Deploy

1. Click "Deploy"
2. Wait for the build to complete (2-3 minutes)
3. Your app will be live at: `https://your-project-name.vercel.app`

---

## Part 3: Testing Your Deployment

### Test Backend

Visit: `https://your-backend.onrender.com/api/health`

You should see:
```json
{
  "status": "ok",
  "message": "Backend is running"
}
```

### Test Frontend

1. Visit your Vercel URL
2. Try creating a task, client, or employee
3. Refresh the page - data should persist

---

## Part 4: Updating Your App

### Update Backend

1. Push changes to GitHub
2. Render will auto-deploy (if auto-deploy is enabled)
3. Or manually deploy from Render dashboard

### Update Frontend

1. Push changes to GitHub
2. Vercel will auto-deploy
3. Or manually redeploy from Vercel dashboard

---

## Important Notes

### Free Tier Limitations

**Render Free Tier:**
- Spins down after 15 minutes of inactivity
- First request after spin-down takes 30-50 seconds
- 750 hours/month (sufficient for testing)

**Vercel Free Tier:**
- 100GB bandwidth/month
- Unlimited deployments
- Always fast (no spin-down)

### Data Persistence

- Your data is stored in `backend/data/database.json` on Render
- **Important**: Free tier may lose data on redeployment
- For production use, consider upgrading to paid tier or use a database service

### File Uploads

- Uploaded documents are stored in `backend/uploads/`
- **Important**: Free tier file storage is ephemeral
- Files may be lost on redeployment
- For production, consider using cloud storage (AWS S3, Cloudflare R2, etc.)

---

## Troubleshooting

### Common Issue: "Failed to load resource" on Vercel

If your Vercel app shows "Failed to load resource" or no data loads:

**1. Check if VITE_API_URL is set in Vercel:**
   - Go to Vercel dashboard → Your Project → Settings → Environment Variables
   - Verify `VITE_API_URL` is set to: `https://your-backend.onrender.com/api`
   - **Important:** Include `/api` at the end!
   - If missing or wrong, add/update it and redeploy

**2. Verify your backend is running on Render:**
   - Go to your Render dashboard → Your Service
   - Check the status - it should say "Live"
   - If it says "Deploy failed", check the logs for errors
   - Test the backend: Visit `https://your-backend.onrender.com/api/health`
   - You should see: `{"status":"ok","message":"Backend is running"}`

**3. Check for CORS errors:**
   - Open browser console (F12) on your Vercel site
   - Look for red CORS errors
   - If you see CORS errors, the backend CORS is working but might need the Vercel domain added

### Backend not connecting

1. Check Render logs for errors
2. Verify `database.json` exists in `backend/data/`
3. Check CORS is enabled in backend
4. Ensure `backend/package.json` exists (required for deployment)

### Frontend can't reach backend

1. Verify `VITE_API_URL` environment variable in Vercel
2. Make sure URL ends with `/api`
3. Check browser console for CORS errors
4. Test backend directly: `https://your-backend.onrender.com/api/health`

### Data not persisting

1. Check backend logs in Render
2. Verify write permissions for `database.json`
3. Check if service redeployed (data resets on free tier)

---

---

## Quick Comparison: Desktop vs Web

| Feature | Desktop App | Web App |
|---------|-------------|---------|
| **Installation** | Single .exe file | Just a URL |
| **Internet Required** | No | Yes |
| **Data Privacy** | Stays on local machine | Stored in cloud |
| **Cost** | Free forever | Free tier available |
| **Updates** | Manual redistribution | Automatic |
| **Access** | Windows only | Any device with browser |
| **Performance** | Very fast | Depends on connection |
| **Data Sharing** | Each user separate | Shared database |
| **Best For** | Single user, privacy-focused | Multiple users, remote access |

---

## Alternative: Quick Local Testing with ngrok

Before deploying to web, test with ngrok to temporarily share locally:

1. Install ngrok: [ngrok.com](https://ngrok.com)
2. Run backend: `cd backend && node server.js`
3. In another terminal: `ngrok http 3001`
4. Share the ngrok URL with your client (temporary, free tier has limitations)

---

## Support

### Desktop App Issues
- Check if backend is running (Task Manager → GreenBros Dashboard)
- Check database file location
- Try running as administrator

### Web App Issues
- Render logs: Dashboard → Your Service → Logs
- Vercel logs: Dashboard → Your Project → Deployments → Click deployment → View Function Logs
- Check browser console for errors (F12)
