# Deployment Guide

## Netlify Functions Setup

This project uses Netlify Functions for the booking API endpoints. The functions are located in `netlify/functions/` and are written in TypeScript.

### API Endpoints

- **POST `/api/create-booking`** - Create a new booking
- **GET `/api/get-bookings`** - Fetch bookings (with optional query parameters)

These endpoints are proxied from `/api/*` to `/.netlify/functions/*` via redirects in `netlify.toml`.

## Environment Variables

### Required for Netlify Functions

Set these in **Netlify Dashboard → Site settings → Environment variables**:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
RESEND_API_KEY=your_resend_api_key
```

### Required for Frontend

These are also needed (same values as above):

```
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

**IMPORTANT**: All environment variables must be set in Netlify's dashboard for the deployed site to work. Without these, the API will return 500 errors.

## Local Development

### Option 1: Using Netlify Dev (Recommended)

This runs both the Vite dev server AND the Netlify Functions locally:

```bash
# 1. Install dependencies
npm install

# 2. Create .env file from .env.example
cp .env.example .env

# 3. Fill in your environment variables in .env
# VITE_SUPABASE_URL=...
# VITE_SUPABASE_ANON_KEY=...
# RESEND_API_KEY=...
# VITE_GOOGLE_MAPS_API_KEY=...

# 4. Run Netlify Dev
npm run dev
```

This will start:
- Vite dev server (usually on http://localhost:5173)
- Netlify Functions (accessible at http://localhost:8888/.netlify/functions/*)
- Automatic proxying of `/api/*` to functions

### Option 2: Vite Only (Functions won't work)

If you only want to test the frontend without API:

```bash
npm run dev:vite
```

Note: API calls will fail with 404 errors.

## Deployment to Netlify

### First-Time Setup

1. **Connect to Netlify**:
   ```bash
   # Login to Netlify
   npx netlify login

   # Link to your Netlify site
   npx netlify link
   ```

2. **Set Environment Variables** in Netlify Dashboard:
   - Go to: Site settings → Environment variables
   - Add all required variables listed above
   - Make sure to set them for "All scopes" or at least "Production"

3. **Deploy**:
   ```bash
   # Manual deploy
   npx netlify deploy --prod

   # Or push to your connected Git branch (recommended)
   git push origin main
   ```

### Automatic Deployments

Once connected, Netlify will automatically deploy when you:
- Push to your main branch
- Merge a pull request

## Troubleshooting

### Issue: API returns 404 Not Found

**Possible causes:**

1. **Environment variables not set** in Netlify dashboard
   - Solution: Add all required env vars in Site settings → Environment variables

2. **Functions not deployed**
   - Solution: Check Netlify deploy logs for function build errors
   - Ensure `netlify.toml` has correct `functions = "netlify/functions"` setting

3. **Testing locally without Netlify Dev**
   - Solution: Use `npm run dev` (not `npm run dev:vite`)

### Issue: API returns 500 Internal Server Error

**Possible causes:**

1. **Missing environment variables**
   - Solution: Check Netlify dashboard for VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, RESEND_API_KEY

2. **Database connection issues**
   - Solution: Verify Supabase URL and key are correct
   - Check if database table `bookings` exists with correct schema

3. **Email service issues**
   - Solution: Verify RESEND_API_KEY is valid
   - Note: Email errors won't fail the booking, but check logs

### Issue: "Unexpected token 'T', "The page c"... is not valid JSON"

This means the endpoint is returning HTML (probably a 404 page) instead of JSON.

**Cause**: Functions aren't accessible or redirects aren't working

**Solution**:
1. Verify you're using `npm run dev` (with Netlify Dev) for local testing
2. For deployed site, check that functions are listed in Netlify deploy logs
3. Verify `netlify.toml` redirects are configured correctly

## Verify Deployment

After deploying, test the API endpoints:

```bash
# Test get-bookings (should return JSON with bookings array)
curl https://your-site.netlify.app/api/get-bookings

# Test create-booking (should return 400 for missing fields, not 404)
curl -X POST https://your-site.netlify.app/api/create-booking \
  -H "Content-Type: application/json" \
  -d '{}'
```

If you get 404, the functions aren't deployed correctly.
If you get 400/500, the functions are working but there's a data issue.

## Build Configuration

The `netlify.toml` file configures:
- Build command: `npm run build`
- Publish directory: `dist`
- Functions directory: `netlify/functions`
- Node bundler: `esbuild` (for TypeScript support)
- Redirects: `/api/*` → `/.netlify/functions/*`

Don't modify these unless you know what you're doing.
