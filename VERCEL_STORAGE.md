# Vercel storage

Vercel serverless functions must not write persistent application data to the deployment filesystem. The production persistence path for the local/fallback admin store is GitHub Contents when `GITHUB_STORE_TOKEN` is configured.

Required environment variables for that fallback store:

- `GITHUB_STORE_TOKEN`
- `GITHUB_STORE_REPO` (optional; defaults to `aimanage750/masaram-gondi-dictionary`)
- `GITHUB_STORE_BRANCH` (optional; defaults to `data-store`)

If Supabase is configured, it remains the primary persistent database and the local store is not used for normal dictionary operations.
