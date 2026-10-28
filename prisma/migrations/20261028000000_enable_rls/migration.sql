-- Enable Row-Level Security on all public tables.
-- Prisma connects as the `postgres` superuser (bypasses RLS).
-- The Supabase REST API (anon/authenticated roles) will be fully blocked.

ALTER TABLE "Project"           ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Phase"             ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Task"              ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Material"          ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Activity"          ENABLE ROW LEVEL SECURITY;
ALTER TABLE "User"              ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Account"           ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Session"           ENABLE ROW LEVEL SECURITY;
ALTER TABLE "VerificationToken" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Lead"              ENABLE ROW LEVEL SECURITY;
