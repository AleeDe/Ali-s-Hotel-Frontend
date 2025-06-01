import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {
      REACT_APP_WHATSAPP_PHONE_NUMBER: JSON.stringify(process.env.REACT_APP_WHATSAPP_PHONE_NUMBER)
    }
  }
})
