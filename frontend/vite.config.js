// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import esbuild from 'esbuild-wasm/vite'

// export default defineConfig({
//   server: {
//     host: '0.0.0.0',
//     port: 3000,
//   },
//   plugins: [react(), esbuild()],
// })
// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// // https://vitejs.dev/config/
// export default defineConfig({
//   server: {
//     host: "0.0.0.0",
//     port: 3000,
//     fs: {
//       strict: false,
//     },
//   },
//   plugins: [react()],
// });
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import esbuild from 'esbuild-wasm';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 3000,
    fs: {
      strict: false,
    },
  },
  plugins: [react({ esbuild })],
});



