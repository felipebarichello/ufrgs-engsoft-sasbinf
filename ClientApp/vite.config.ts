import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // <--- Make sure path is imported

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		proxy: {
			'/api': {
				target: 'https://localhost:7037', // Your backend URL
				changeOrigin: true,
				secure: false,
			},
		},
		port: 5173,
	},
	build: {
		// <--- Add this 'build' section
		// Output directory relative to ClientApp folder -> points to project root's wwwroot
		outDir: path.resolve(__dirname, '../api/wwwroot'),
		// Ensure the output directory is emptied before building
		emptyOutDir: true,
	},
});
