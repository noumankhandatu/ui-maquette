import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';

process.env = {...process.env, ...loadEnv('mock', process.cwd())};

export default defineConfig({
  plugins: [react()],
  server: {
    port: parseInt(process.env.VITE_PORT),
  },
});
