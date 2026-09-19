# ⚠️ Legacy — scheduled for relocation into Artify-Backend

**Do not add new routes, services, or business logic here.**

This directory was the subject of a Phase 0 audit finding
([`ADR-001-platform-boundary`](../../artify-backend/docs/ADR/ADR-001-platform-boundary.md)
in the `Artify-Backend` repository): it contains the only genuinely
well-structured backend code found across either repository (real session
auth, RBAC middleware, tenant isolation, a CMS/product/subscription/lead
service layer), but it is **not** where the platform's source of truth is
meant to live going forward.

## What's happening to it

Per `docs/MIGRATION_PLAN.md` and `docs/INTEGRATION_ARCHITECTURE.md` in the
`Artify-Backend` repository, this code is being relocated (not duplicated)
into `Artify-Backend`, which becomes the canonical Platform API + Control
Center. Once that relocation lands and this frontend is rewired to consume
the canonical API (`Artify-Backend`'s `docs/IMPLEMENTATION_PLAN.md` Phase
11), this directory will be deleted.

## What's still live here today

Two routes in this directory are genuinely called by the frontend right
now and must keep working until the Phase 11 cutover:

- `GET /api/v1/cms/seo-telemetry` (used by `src/components/portal/PortalSeoHealth.tsx`)
- `POST /api/v1/cms/optimize-meta` (used by the same component)

Everything else here (auth, article CRUD, products, subscriptions, leads,
notifications, audit, AI coworkers) is implemented but **not currently
called by any UI** — see `docs/CURRENT_STATE.md` §2.5 in the
`Artify-Backend` repository for the full endpoint-by-endpoint audit of what
is and isn't wired up.

## If you need to change something here

- A bug affecting the two live routes above: fix it here, but keep the fix
  minimal — it will be ported to its new home shortly.
- Anything else (a new endpoint, new business logic): build it in
  `Artify-Backend/server/` instead, following that repository's
  `docs/API_DESIGN.md`.
