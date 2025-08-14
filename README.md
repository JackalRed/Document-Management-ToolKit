# Document Management Toolkit (Vite)

## Local dev
```bash
npm i
npm run dev
```

## Deploy to GitHub Pages (via GitHub Actions)
1. Create a **public repo** on GitHub, e.g. `Document-Management-Toolkit`.
2. Push this project with a `main` branch.
3. In `vite.config.ts`, set:
   ```ts
   export default defineConfig({
     base: '/Document-Management-Toolkit/',
     // ...
   })
   ```
   If your repo name is different, change the string accordingly.
4. Go to **Settings → Pages** and ensure “Build and deployment” is set to **GitHub Actions** (default).
5. Push to `main`. The included workflow `.github/workflows/deploy.yml` will build & publish to Pages.
6. Your site will be live at: `https://<your-username>.github.io/<repo-name>/`.

### SPA routing
A `404.html` copy of `index.html` is included so client-side routes work on GitHub Pages.
