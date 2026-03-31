// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   build: {
//     chunkSizeWarningLimit: 4000, // Set this to the desired size in KB
//   },
//   server:{
//     proxy:{
//       "/api/v1":{
//         target: 'https://api.tunshpreshgloballtd.com',
//         changeOrigin: true,
//         secure: false,
//       },
//     },
//   },
// });

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5175,
  },
  build: {
    chunkSizeWarningLimit: 4000,
  },
});
