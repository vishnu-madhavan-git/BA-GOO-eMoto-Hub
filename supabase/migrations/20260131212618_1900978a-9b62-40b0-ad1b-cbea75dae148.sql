-- Move PostGIS extension to extensions schema (best practice)
DROP EXTENSION IF EXISTS postgis CASCADE;
CREATE EXTENSION IF NOT EXISTS postgis SCHEMA extensions;

-- Recreate geography columns that depend on PostGIS
ALTER TABLE public.routes DROP COLUMN IF EXISTS start_point;
ALTER TABLE public.routes DROP COLUMN IF EXISTS end_point;
ALTER TABLE public.routes ADD COLUMN start_point extensions.geography(POINT, 4326);
ALTER TABLE public.routes ADD COLUMN end_point extensions.geography(POINT, 4326);