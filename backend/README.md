# MBG Chain — Backend API

NestJS + Prisma (PostgreSQL) backend for the MBG Chain (Makan Bergizi Gratis) platform.
Implements every feature surfaced in the frontend: vendor permits & supervision,
supply-demand matching, B2B procurement, AI insights & an on-chain trust layer.

## Stack & conventions
- **NestJS 11** (modular, one module per resource), **Prisma 6** ORM.
- **Auth**: JWT (Passport). Global `JwtAuthGuard` + `RolesGuard`; opt out with `@Public()`.
- **Validation**: global `ValidationPipe` (whitelist + transform) with `class-validator` DTOs.
- **Errors**: global `AllExceptionsFilter` (consistent envelope + Prisma error mapping).
- **Docs**: OpenAPI/Swagger at `/docs` (auto-generated via the swagger CLI plugin).
- **Security**: `helmet`, CORS, rate limiting (`@nestjs/throttler`).
- **Pagination**: shared `PaginationQueryDto` + `paginate()` → `{ data, meta }`.

## Setup
```bash
cd backend
npm install
cp ../.env.example ../.env        # set DATABASE_URL, JWT_SECRET

npx prisma generate
npx prisma migrate dev --name init   # or: npx prisma db push
npx prisma db seed                   # demo data + login accounts

npm run start:dev                    # http://localhost:3000  (docs: /docs)
```

Seeded logins (password `password123`): `admin@`, `pemerintah@`, `sppg@`, `mitra@`, `sekolah@` `mbgchain.id`.

## Modules / endpoints (all under `/api` unless noted)
| Area | Routes |
|---|---|
| Auth | `POST /auth/login`, `POST /auth/register`, `GET /auth/me` |
| Account | `users` (me + admin) |
| Map | `entities` (public) |
| Distribusi | `distribution` (+ `/pipeline`, `/advance`, `/confirm-receipt`), `personnel`, `vehicles` |
| Anggaran | `budget` (+ `/summary`, `/status`), `proposals` |
| Menu & Gizi | `menu`, `ingredients`, `nutrition` (+ `/levels`, `/analyze`, `/generate`) |
| Laporan | `reports`, `reviews` (+ `/stats`) |
| Data tim & mitra | `partners`, `suppliers`, `beneficiaries`, `kitchen-staff` |
| Manajemen data | `kitchens` (perizinan/checklist/inspections/issue-permit), `vendor-verification` (NPWP/NIB/cert/BGN approve) |
| Rantai pasok | `requirements`, `procurement` (+ `/match`), `rfq`/`catalog`/`producers`, `stock` (+ `/adjust`), `analytics` |
| AI | `ai` (`/insights`, `/summary`, `/supplier-match`, `/ask`) |
| Blockchain | `blockchain` (`/audit-trail`, `/verify`, `/contracts`, `/anchor`) |
| Notifikasi | `notifications` (+ read / read-all / unread-count) |
| Health | `GET /health` (public) |

## Notes
- Roles map to platform stakeholders: `ADMIN`, `PEMERINTAH`, `SPPG`, `MITRA`, `SEKOLAH`.
- The blockchain module runs a deterministic simulation (mirrors the on-chain
  contracts in `/blockchain`); swap in ethers.js + an RPC to go live.
- AI endpoints derive insights/forecasts from live DB data (no external LLM needed).
