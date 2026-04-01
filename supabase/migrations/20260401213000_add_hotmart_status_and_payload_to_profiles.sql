ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS hotmart_status TEXT;

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS last_webhook_payload JSONB;
