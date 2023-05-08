import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/apps/is-my-crypto-wallet-safe',
  plugins: [react()],
})
