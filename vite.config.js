import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
   plugins: [react()],
   server: {
      proxy: {
         '/api/bgg': {
            target: 'https://boardgamegeek.com/xmlapi2',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api\/bgg/, ''),
            secure: false,
            headers: {
               'User-Agent': 'MeepleAndMilestones/0.1',
            },
         },
      },
   },
})
