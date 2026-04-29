# Deployment Guide

This is a full-stack MERN auction platform.

## Architecture

| Part | Platform | Notes |
|------|----------|-------|
| **Backend** (Express + MongoDB) | [Render.com](https://render.com) | `render.yaml` pre-configured |
| **Frontend** (React + Vite) | [Vercel](https://vercel.com) | Deploy from `frontend/` folder |

---

## Step 1 — Set up external services

### MongoDB Atlas
1. Create free account at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a cluster → Database → Connect → Drivers → copy connection string
3. Replace `<username>`, `<password>`, `<cluster>` in the string

### Cloudinary
1. Create free account at [cloudinary.com](https://cloudinary.com)
2. Go to Dashboard → copy **Cloud Name**, **API Key**, **API Secret**

### Gmail App Password (for email)
1. Enable 2FA on your Google account
2. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Create app password → copy it (use this as SMTP_PASSWORD, NOT your login password)

---

## Step 2 — Deploy Backend on Render

1. Push this project to a GitHub repo
2. Go to [render.com](https://render.com) → New → Blueprint
3. Connect your GitHub repo — Render detects `render.yaml` automatically
4. Fill in all environment variables (marked `sync: false` in render.yaml):

```
MONGO_URI=         # From MongoDB Atlas
JWT_SECRET_KEY=    # Any long random string (e.g. 64 random chars)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
SMTP_MAIL=         # Your Gmail address
SMTP_PASSWORD=     # Gmail App Password (not login password)
FRONTEND_URL=      # Set AFTER frontend deploys (your Vercel URL)
```

5. Deploy → copy the live URL (e.g. `https://online-auction-api.onrender.com`)

---

## Step 3 — Deploy Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) → Add New Project
2. Import the same GitHub repo
3. **Important settings:**
   - Root Directory: `frontend`
   - Framework: Vite (auto-detected)
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add environment variable:
   ```
   VITE_API_URL=https://your-render-url.onrender.com
   ```
5. Deploy → copy your Vercel URL (e.g. `https://auction-app.vercel.app`)

---

## Step 4 — Update Backend CORS

Go back to Render → your backend service → Environment:
- Set `FRONTEND_URL` = your Vercel URL from Step 3

Render will auto-redeploy. This allows the frontend to make API calls.

---

## Local Development

### Backend
```bash
cd backend
npm install
# Edit config/config.env with your values
npm run dev
```

### Frontend
```bash
cd frontend
npm install
# Create .env file:
echo "VITE_API_URL=http://localhost:5000" > .env
npm run dev
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Blank page on Vercel | `vercel.json` rewrites are already set up |
| CORS errors | Make sure `FRONTEND_URL` on Render matches exact Vercel URL |
| Images not uploading | Check Cloudinary credentials |
| Emails not sending | Use Gmail App Password, not your regular password |
| Backend sleeping (Render free tier) | First request after inactivity may take ~30s |
