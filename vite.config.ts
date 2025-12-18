
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Casting process to any to resolve property 'cwd' existence error in this execution context.
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Vercel에서 설정한 API_KEY를 process.env.API_KEY로 코드에 주입합니다.
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      // 필요한 경우 다른 환경변수도 이곳에 추가합니다.
    },
  };
});
