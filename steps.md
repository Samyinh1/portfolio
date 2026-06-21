# CI/CD Setup Steps & Fixes

## 1. GitHub Actions Workflow Files

- Workflow files must live at `.github/workflows/<name>.yml` in the repo root.
- This project has two workflows:
  - `.github/workflows/client-deploy.yml` — builds and deploys the React client to Vercel
  - `.github/workflows/server-deploy.yml` — validates the Node/Express server (Railway deploy is commented out until configured)
- Both workflows trigger on push/PR to `main` or `master`, scoped to their respective paths.

---

## 2. Required GitHub Repository Secrets

These are set in GitHub UI — **not** in local files or code.

**Location:** GitHub repo → Settings → Secrets and variables → Actions → New repository secret

| Secret name        | Where to get it                                              |
|--------------------|--------------------------------------------------------------|
| `VERCEL_TOKEN`     | vercel.com → Account Settings → Tokens → Create             |
| `VERCEL_ORG_ID`    | vercel.com → Account Settings → General → Your ID           |
| `VERCEL_PROJECT_ID`| Vercel project → Settings → General → Project ID            |
| `RAILWAY_TOKEN`    | railway.app → Account Settings → Tokens (when ready)        |

GitHub Actions injects these at runtime via `${{ secrets.SECRET_NAME }}` — they never touch your local files.

---

## 3. `.env.example` Rules

- `.env.example` is committed to the repo as a **template only**.
- It must contain **placeholder values**, never real secrets.

**Correct:**
```
VITE_API_URL=https://your-api.com
```

**Wrong (causes push block):**
```
VITE_API_URL=http://localhost:5000/api
VERCEL_TOKEN=vcp_realTokenHere...
```

---

## 4. Fixing a Leaked Secret in Git History

If you accidentally commit a real token:

### Step 1 — Revoke the token immediately
Go to the service (e.g. vercel.com → Account Settings → Tokens) and delete the token. A token in local git history is compromised even if the push was blocked.

### Step 2 — Check if the bad commit reached the remote
```bash
git log --oneline origin/master
```
If the offending commit is not listed, it's local only.

### Step 3 — Reset local commits back to the last good remote commit
```bash
git reset --soft <last-good-commit-hash>
```
This unstages the bad commits but keeps your working tree changes.

### Step 4 — Verify the staged state is clean (no secrets)
```bash
git status --short
git diff --cached
```

### Step 5 — Recommit and push
```bash
git commit -m "your message"
git push origin master
```

### Step 6 — Generate a new token
Create a fresh token on the service and add it as a GitHub secret (see section 2).

---

## 5. Transient GitHub Actions Errors

If a run shows "An unexpected error has occurred" or "The workflow file could not be found" with a GitHub request ID (e.g. `D565:...`), it is a GitHub infrastructure error — not a code problem.

**Fix:** Re-trigger the workflow by pushing an empty commit:
```bash
git commit --allow-empty -m "retrigger CI"
git push origin master
```
