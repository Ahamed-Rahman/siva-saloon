// vite.config.js for client-customer
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174, // ✅ use 5174 for stylist, 5175 for admin
  },
});
