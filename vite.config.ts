import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    dts({ 
      insertTypesEntry: true,
    })
  ],
  build: {
    lib: {
      // The entry file we just created
      entry: resolve('lib.ts'),
      name: 'BuildFlow',
      // Proper extensions for different module formats
      fileName: (format) => `buildflow.${format}.js`
    },
    rollupOptions: {
      // Externalize deps that shouldn't be bundled into your library
      // IMPORTANT: 'react/jsx-runtime' must be externalized to avoid duplicate React instances
      external: ['react', 'react-dom', 'tailwindcss', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          tailwindcss: 'tailwindcss',
          'react/jsx-runtime': 'jsxRuntime'
        }
      }
    }
  }
});