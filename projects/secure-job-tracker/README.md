# JobTrack — Secure Job Application Tracker

JobTrack is being upgraded from a browser-only MVP to a multi-user application using Supabase Auth and PostgreSQL. It demonstrates CRUD workflows, authentication, row-level authorization, validation, safe CSV export, and automated tests.

## Current implementation

- Email/password sign-up, sign-in, and sign-out through Supabase Auth.
- PostgreSQL storage for job applications.
- Per-user row-level security (RLS) for select, insert, update, and delete.
- Application search, status filtering, dashboard counts, follow-up dates, and CSV export.
- Client-side validation plus database constraints.
- CSV formula-injection mitigation.
- Node.js tests for validation and CSV helpers.

## Configure a Supabase project

The repository does **not** contain credentials, and no service-role/secret key should ever be placed in browser code.

1. Create or choose a Supabase project and ensure it is active.
2. Open the SQL Editor and run `supabase/migrations/202610120001_job_applications.sql`.
3. Open **Project Settings → API Keys** (or the **Connect** dialog) and copy the Project URL and **publishable** key. A publishable key is expected to be public in browser apps; database RLS must protect all rows.
4. Open JobTrack and use **Connect your Supabase project** to enter the URL and publishable key. The app stores this configuration in the current browser's local storage; do not use a secret/service-role key.
5. In Supabase Auth settings, configure the site URL and redirect URLs for the deployed site, including the JobTrack path. If email confirmation is enabled, confirm the account before signing in.

Supabase docs: [API keys](https://supabase.com/docs/guides/getting-started/api-keys), [Auth](https://supabase.com/docs/guides/auth), [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security).

## Run tests

Requires Node.js 20 or newer:

```bash
node projects/secure-job-tracker/test.js
```

## Security notes

- RLS policies compare `user_id` with `auth.uid()` for every operation; authentication alone is not treated as authorization.
- Update policies include both `USING` and `WITH CHECK`, preventing users from reassigning rows to another owner.
- Never put Supabase `service_role` or secret keys in the browser, GitHub, or a public environment variable.
- The SQL migration has not been applied to a live project automatically. Activate/configure a Supabase project and apply the migration before using the cloud features.
- This is a portfolio application, not a certified or audited production service. Avoid storing highly sensitive personal data.

## Skills demonstrated

JavaScript, PostgreSQL, Supabase Auth, row-level security, input validation, secure CRUD, CSV export hardening, test-driven development, and CI.
