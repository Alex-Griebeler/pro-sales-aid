ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS hotmart_status text DEFAULT NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_webhook_payload jsonb DEFAULT NULL;