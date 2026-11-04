# SHEEDO — The Digital Art Museum

A Next.js frontend starter for a public art museum featuring paintings and drawings.

## Requirements
- Node.js 20.9 or newer
- npm

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:3000.

## Routes
- `/` — museum homepage
- `/gallery` — collection with category filters
- `/artwork/[id]` — artwork detail
- `/about` — artist page
- `/admin/login` — admin login visual preview
- `/admin/dashboard` — admin dashboard visual preview

## Important implementation status
This package is a frontend milestone. Artwork content currently comes from `src/lib/artworks.ts`.
The admin sign-in and upload controls are intentionally demo-only. They do not authenticate users,
upload files, or persist changes. Do not deploy the admin routes as a functioning admin system yet.

## Next backend milestone
1. Create a Supabase project.
2. Add environment variables for the Supabase URL and anon key.
3. Implement Supabase Auth and restrict admin access to Sheedo's authorized user ID.
4. Create `artworks` and `collections` tables.
5. Configure a private upload bucket and secure Storage policies.
6. Add server-side authorization for create, update, and delete operations.
7. Replace demo artwork records with database queries.

Never put a Supabase service-role key in browser code.
