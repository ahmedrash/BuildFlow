import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  // Check if we are building the demo app (e.g. for Netlify)
  const isDemo = mode === 'demo';

  return {
    plugins: [
      react(),
      // Only generate types for library build
      !isDemo && dts({ 
        insertTypesEntry: true,
      })
    ],
    build: {
      outDir: 'dist',
      // If it's a demo build, we let Vite use index.html as entry (default behavior).
      // If it's a library build, we specify the lib config.
      ...(isDemo ? {} : {
        lib: {
          entry: resolve('lib.ts'),
          name: 'BuildFlow',
          fileName: (format) => `buildflow.${format}.js`
        },
        rollupOptions: {
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
      })
    }
  };
});