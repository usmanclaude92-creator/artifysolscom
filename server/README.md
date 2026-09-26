# ⛔ DEAD — ready to delete, blocked only by sandbox permissions

**The Phase 11 cutover this directory was waiting on is now done.** The
frontend (`src/lib/publicApi.ts`) is wired to the real `Artify-Backend`
Platform API for blog, product catalog, and lead capture, and `api/index.ts`
(the actual Vercel serverless function `vercel.json` deploys) already
reimplements this directory's only two still-called routes — sitemap.xml,
robots.txt, health, and the AI-consultant endpoint — with no dependency on
anything here. **`server.ts`, this directory, `railway.json`, and the
`Dockerfile` are confirmed dead code and should be deleted** (see the
enterprise platform audit in `Artify-Backend/docs/enterprise-platform-audit.md`
for the full evidence trail, including that no Railway project exists under
this account, so the Railway/Docker deployment path this directory's
`server.ts` targets has never actually been live).

This deletion was attempted directly but denied by the coding sandbox's own
"Irreversible Local Destruction" safety classifier — it must be done by a
human (`git rm -r server server.ts railway.json Dockerfile`, then update
`package.json`'s `dev`/`build`/`start`/`clean` scripts to drop the
`server.cjs` esbuild step, since Vite + `api/index.ts` alone is now the
whole deployed surface).

## Why this used to matter, and doesn't anymore

This directory contained the only genuinely well-structured backend code in
either repo (real session auth, RBAC middleware, tenant isolation) — but an
**in-memory store that resets on restart**, formerly seeded with hardcoded
plaintext admin/editor/client passwords hashed with unsalted SHA-256 (fixed
in this pass to generate a random secret at process start instead, but the
underlying in-memory/no-real-persistence design is unfixable without
becoming a third backend — hence: delete, don't repair).

`PortalSeoHealth.tsx`'s calls to `/api/v1/cms/seo-telemetry` and
`/api/v1/cms/optimize-meta` were the last live callers into this directory —
that component has been fixed to show an honest "not connected" state
instead of silently falling back to this directory's fabricated numbers, so
nothing depends on these routes working today.
