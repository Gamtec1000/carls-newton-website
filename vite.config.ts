import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Expose NEXT_PUBLIC_ variables to the client (in addition to VITE_ variables)
  define: {
    'import.meta.env.NEXT_PUBLIC_SUPABASE_URL': JSON.stringify(process.env.NEXT_PUBLIC_SUPABASE_URL),
    'import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY': JSON.stringify(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    'import.meta.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY': JSON.stringify(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY),
  },
})
