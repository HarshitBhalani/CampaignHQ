CampaignHQ – Marketing Analytics Dashboard

CampaignHQ is a high-performance marketing analytics dashboard built with Next.js (App Router), TypeScript, GraphQL, Apollo Client & Tailwind CSS.
Designed to match modern frontend job roles requiring advanced React/Next.js skills.

🚀 Features
JWT Authentication
Dashboard with campaign KPIs (CTR, CPC, ROAS)
Filtering (Channel / Status / Search)
Campaign detail view
Notes CRUD (Add / Edit / Delete)
Reports page (saved views demo)
Settings page with user + organization info
Fully responsive and optimized UI

🧑‍💻 Tech Stack

Frontend
Next.js 13+ (App Router)
TypeScript
Apollo Client
Tailwind CSS
Backend
GraphQL Yoga API

In-memory Mock Database (mockData.ts)
JWT Auth flow

📂 Project Structure
src/
 ├─ app/
 │   ├─ (public)/login/page.tsx
 │   ├─ (app)/layout.tsx
 │   ├─ (app)/dashboard/page.tsx
 │   ├─ (app)/campaigns/[id]/page.tsx
 │   ├─ (app)/reports/page.tsx
 │   ├─ (app)/settings/page.tsx
 │   ├─ api/graphql/route.ts
 │   └─ api/login/route.ts
 │
 ├─ components/
 │   ├─ AppShell.tsx
 │   └─ ApolloProviderWrapper.tsx
 │
 ├─ graphql/
 │   ├─ schema.ts
 │   ├─ mockData.ts
 │   ├─ types.ts
 │   └─ queries.ts
 │
 └─ lib/apolloClient.ts

-> Demo Login

Login with:
Email: demo@campaignhq.com
Password: demo123


Token is stored in localStorage and sent to every GraphQL request.

-> Dashboard
Total aggregated performance stats
Metric Cards (Impr, Clicks, Conv, CTR, ROAS)
Interactive Table
Fast filtering with Apollo cache

-> Clicking a campaign → opens detail page
-> Campaign Notes (CRUD)

On the campaign detail view:
-> Add notes
-> Inline edit notes
-> Delete notes

All done through GraphQL mutations and UI auto-refresh.
-> Reports (Saved Views)

Demo implementation showing:
Filter ranges
Author
Created date

-> Future: convert into SSG/ISR static analytics pages

-> Settings Page
Logged-in user details
Organization details
Mock Google & Meta Ads connections

-> How to Run
Install dependencies:
npm install
Create .env.local:

JWT_SECRET=my-secret
NEXT_PUBLIC_GRAPHQL_ENDPOINT=/api/graphql


Run locally:
npm run dev


Visit: http://localhost:3000

Build for production:
npm run build
npm start

-> project Description Mapping
Required Skill	How This Project Proves It
Next.js + TypeScript	Full App Router app with strict TS
GraphQL experience	Queries + Mutations + Apollo cache
Performance optimization	Memoization + caching + lazy loading
SSR/SSG	Landing page uses ISR and structure supports SSR
Responsive UI	Tailwind across all breakpoints
Clean code & architecture	Modular structure + typed entities
Debugging & UX	Loading / error states, graceful fallback UI
CI/CD ready	Deployable to Vercel / AWS easily

-> Future Enhancements

Real DB integration (Prisma + PostgreSQL)

Role-based access control
Sort + advanced filters
Exportable performance reports (PDF)
Real integrations with Google / Meta Marketing APIs