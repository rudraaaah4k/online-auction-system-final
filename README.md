# 🏛️ PrimeBid — MERN Stack Auction Platform

A luxury, dark-themed auction platform with animated UI and full MERN stack.

---

## 🐛 Bugs Fixed

### 1. Login Not Working
**Root cause:** The `login` action was sending `FormData`, but the backend endpoint expects `Content-Type: application/json`.

**Fix:** In `frontend/src/store/slices/userSlice.js`, the `login` thunk now converts FormData to a plain object before sending as JSON:
```js
const payload = data instanceof FormData ? Object.fromEntries(data.entries()) : data;
```

### 2. Hardcoded API URLs
**Root cause:** All API calls used hardcoded `http://localhost:5000` — broken in any deployed/production environment.

**Fix:** All slice files now use an env variable:
```js
`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/v1/...`
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB (Atlas or local)
- Cloudinary account (for image uploads)

### Backend Setup
```bash
cd backend
npm install

# Copy and fill in your credentials:
cp config/config.env.example config/config.env
# Edit config/config.env with your:
#   MONGO_URI, JWT_SECRET_KEY, CLOUDINARY_*, SMTP_* values

npm start
```

### Frontend Setup
```bash
cd frontend
npm install

# Create .env file:
echo "VITE_API_URL=http://localhost:5000" > .env

npm run dev
```

Frontend will run at: `http://localhost:5173`
Backend will run at: `http://localhost:5000`

---

## 🗝️ Environment Variables

### Backend `config/config.env`
| Variable | Description |
|---|---|
| `PORT` | Server port (default 5000) |
| `MONGO_URI` | MongoDB connection string |
| `FRONTEND_URL` | Frontend URL for CORS |
| `JWT_SECRET_KEY` | Secret for JWT signing |
| `JWT_EXPIRE` | JWT expiry (e.g. `7d`) |
| `COOKIE_EXPIRE` | Cookie expiry in days |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `SMTP_HOST` | Email server host |
| `SMTP_PORT` | Email server port |
| `SMTP_MAIL` | Sender email |
| `SMTP_PASSWORD` | Email password / app password |

### Frontend `.env`
| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL |

---

## 🎨 Design Highlights
- **Luxury dark theme** with obsidian, charcoal, and gold palette
- **Playfair Display** serif headings + **DM Sans** body
- Animated orb backgrounds, shimmer text, fade-up entrances
- Live countdown timers on every auction card
- Redesigned sidebar with active link highlighting and user avatar
- Responsive 2-column grid for auction cards

---

## 🚀 Permanent Deployment (Render)

This repository includes a `render.yaml` blueprint to deploy both services:
- `online-auction-api` (Node backend)
- `online-auction-web` (static React frontend)

One-click deploy:

`https://render.com/deploy?repo=https://github.com/ThakurAnsh33/Online-Auction-System`

After Render creates both services, set these environment variables in Render:

### Backend service (`online-auction-api`)
- `MONGO_URI`
- `JWT_SECRET_KEY`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `SMTP_MAIL`
- `SMTP_PASSWORD`
- `FRONTEND_URL` = your frontend Render URL (example: `https://online-auction-web.onrender.com`)

### Frontend service (`online-auction-web`)
- `VITE_API_URL` = your backend Render URL (example: `https://online-auction-api.onrender.com`)

Then trigger a manual redeploy for the frontend after setting `VITE_API_URL`.

---

## 🆓 Permanent Deployment (Free via Vercel)

Use two separate Vercel projects from the same repository:

1. **Backend project**
- Import repo in Vercel
- **Root Directory:** `backend`
- Build command: default
- Output: default
- Deploy using `backend/vercel.json`

2. **Frontend project**
- Import repo in Vercel
- **Root Directory:** `frontend`
- Build command: `npm run build`
- Output directory: `dist`

Set these environment variables in Vercel:

### Backend (Vercel project for `backend`)
- `MONGO_URI`
- `FRONTEND_URL` = frontend Vercel URL
- `JWT_SECRET_KEY`
- `JWT_EXPIRE=7d`
- `COOKIE_EXPIRE=7`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `SMTP_HOST=smtp.gmail.com`
- `SMTP_PORT=587`
- `SMTP_MAIL`
- `SMTP_PASSWORD`

### Frontend (Vercel project for `frontend`)
- `VITE_API_URL` = backend Vercel URL

After both deploys succeed, redeploy frontend once to ensure `VITE_API_URL` is baked into the build.

Note:
- Background cron jobs are disabled automatically on Vercel serverless runtime.

