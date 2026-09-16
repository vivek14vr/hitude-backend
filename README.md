# HITUDE API

## Run locally

```bash
npm install
cp .env.example .env
npm run start:dev
```

The REST API listens on `http://localhost:4000/api`; Swagger is at `/docs`. MongoDB is the source of truth. Redis is used for cache, short-lived checkout state, OTPs, rate-limit state, idempotency keys, inventory locks, and BullMQ jobs. If Redis is unavailable, cache reads/writes fail open while primary MongoDB-backed requests continue.

## Security model

- Access and refresh JWTs are set as secure, HTTP-only cookies; tokens are never returned for localStorage use.
- `ValidationPipe` whitelists DTO fields and transforms input. HTML content should be sanitized before CMS persistence.
- Role guards protect admin, order management, consultation, and verification routes.
- Prescription documents are stored only in an approved private object store/database flow. Never place document bytes or private medical data in Redis.
- Replace all seed/demo values with approved brand, legal, compliance, and payment configuration before launch.

## Operations

Use `npm run seed` after MongoDB is available to insert the two editable product profiles. To create or update the admin account, set `ADMIN_EMAIL`, a unique `ADMIN_PASSWORD` (at least 8 characters), and optionally `ADMIN_FIRST_NAME`/`ADMIN_ROLE` in `.env`, then run `npm run seed:admin`. Add a proper migration/approval workflow around CMS data, and configure a managed MongoDB replica set and Redis with TLS in production.
# hitude-backend
