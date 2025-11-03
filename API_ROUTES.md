# Vercel API Routes Documentation

This project uses Vercel serverless functions for the booking system API. The API routes are located in the `/api` directory.

## Environment Variables

Set these in your Vercel project settings:

```bash
# Supabase (client-side accessible)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Resend (server-side only)
RESEND_API_KEY=your_resend_api_key

# Google Maps (client-side accessible)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

For local development with Vite, the legacy `VITE_*` environment variables are still supported.

## API Endpoints

### 1. Create Booking

**Endpoint:** `POST /api/create-booking`

**Description:** Creates a new booking and sends confirmation emails to admin and customer.

**Request Body:**
```json
{
  "customer_name": "John Doe",
  "organization_name": "ABC School",
  "email": "john@example.com",
  "phone": "+971501234567",
  "full_address": "123 Main Street",
  "address_details": "Building A, Floor 2",
  "city": "Dubai",
  "latitude": 25.2048,
  "longitude": 55.2708,
  "package_type": "classic",
  "date": "2024-12-15",
  "time_slot": "10:00 AM - 11:00 AM",
  "price": 1800,
  "message": "Optional message"
}
```

**Required Fields:**
- `customer_name`
- `organization_name`
- `email`
- `phone`
- `full_address`
- `package_type` (one of: `preschool`, `classic`, `halfday`)
- `date`
- `time_slot`

**Response:**
```json
{
  "success": true,
  "bookingId": "uuid",
  "booking": { ... },
  "message": "Booking created successfully"
}
```

**Package Prices:**
- Preschool Special: AED 1,200
- Classic Show: AED 1,800
- Half-Day Experience: AED 2,500

### 2. Get Bookings

**Endpoint:** `GET /api/get-bookings`

**Description:** Retrieves bookings with optional filters.

**Query Parameters:**
- `date` - Filter by specific date (YYYY-MM-DD)
- `from_date` - Filter from date (inclusive)
- `to_date` - Filter to date (inclusive)
- `status` - Filter by status (`pending`, `confirmed`, `cancelled`)

**Examples:**
```bash
# Get all bookings
GET /api/get-bookings

# Get bookings for a specific date
GET /api/get-bookings?date=2024-12-15

# Get bookings in a date range
GET /api/get-bookings?from_date=2024-12-01&to_date=2024-12-31

# Get only confirmed bookings
GET /api/get-bookings?status=confirmed
```

**Response:**
```json
{
  "success": true,
  "bookings": [
    {
      "id": "uuid",
      "customer_name": "John Doe",
      "organization_name": "ABC School",
      "email": "john@example.com",
      "phone": "+971501234567",
      "full_address": "123 Main Street",
      "city": "Dubai",
      "package_type": "classic",
      "date": "2024-12-15",
      "time_slot": "10:00 AM - 11:00 AM",
      "status": "confirmed",
      "payment_status": "paid",
      "price": 1800,
      "created_at": "2024-11-03T12:00:00Z"
    }
  ],
  "count": 1
}
```

### 3. Update Booking

**Endpoint:** `POST /api/update-booking` or `PATCH /api/update-booking`

**Description:** Updates booking status and/or payment status. Sends confirmation email when status changes to 'confirmed'.

**Request Body:**
```json
{
  "booking_id": "uuid",
  "status": "confirmed",
  "payment_status": "paid"
}
```

**Fields:**
- `booking_id` (required) - The UUID of the booking to update
- `status` (optional) - One of: `pending`, `confirmed`, `cancelled`
- `payment_status` (optional) - One of: `pending`, `paid`, `refunded`

**Response:**
```json
{
  "success": true,
  "booking": { ... },
  "message": "Booking updated successfully"
}
```

## Email Notifications

### Admin Notification Email
Sent to: `carls.newton10@gmail.com`
- Triggered when a new booking is created
- Contains all booking details
- Includes Google Maps link if coordinates are provided

### Customer Confirmation Email
Sent to: Customer's email address
- Initial confirmation sent when booking is created
- Follow-up confirmation sent when status changes to 'confirmed'
- Includes booking details and next steps

## Error Handling

All endpoints return appropriate HTTP status codes:

- `200 OK` - Successful GET/PATCH/PUT request
- `201 Created` - Successful POST request (new booking)
- `400 Bad Request` - Missing required fields or invalid data
- `404 Not Found` - Booking not found (update only)
- `405 Method Not Allowed` - Incorrect HTTP method
- `500 Internal Server Error` - Server or database error

Error Response Format:
```json
{
  "error": "Error message",
  "details": "Detailed error description"
}
```

## CORS

All endpoints support CORS with the following headers:
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Headers: Content-Type`
- `Access-Control-Allow-Methods: GET, POST, PATCH, PUT, OPTIONS`

## Local Development

For local development, you can use Vercel CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Run locally with serverless functions
vercel dev
```

This will start a local server that simulates the Vercel environment, including serverless functions.

## Deployment

When you deploy to Vercel:

1. The `/api` directory is automatically detected
2. Each `.js` file becomes a serverless function
3. Environment variables must be set in Vercel project settings
4. The functions will be available at `https://your-domain.vercel.app/api/endpoint-name`

## Migration from Netlify

This project was migrated from Netlify Functions to Vercel Serverless Functions. Key changes:

1. Functions moved from `/netlify/functions/` to `/api/`
2. Environment variables changed from `VITE_*` to `NEXT_PUBLIC_*` (for Vercel)
3. Handler signature changed from Netlify's `Handler` to Vercel's `(req, res) => {}`
4. Dependencies updated (removed `@netlify/functions`)
