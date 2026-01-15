-- Create table for AI consultations history and quality ratings
CREATE TABLE public.ai_consultations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  input_type TEXT NOT NULL CHECK (input_type IN ('scenario', 'questionnaire')),
  input_text TEXT NOT NULL,
  source_filename TEXT,
  detected_format TEXT,
  ai_response TEXT NOT NULL,
  quality_rating INTEGER CHECK (quality_rating >= 1 AND quality_rating <= 5),
  rating_comment TEXT,
  rated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.ai_consultations ENABLE ROW LEVEL SECURITY;

-- Public policies (no auth required)
CREATE POLICY "Anyone can insert consultations"
ON public.ai_consultations
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can view consultations"
ON public.ai_consultations
FOR SELECT
USING (true);

CREATE POLICY "Anyone can update consultation ratings"
ON public.ai_consultations
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX idx_ai_consultations_session_id ON public.ai_consultations(session_id);
CREATE INDEX idx_ai_consultations_created_at ON public.ai_consultations(created_at DESC);
CREATE INDEX idx_ai_consultations_quality_rating ON public.ai_consultations(quality_rating) WHERE quality_rating IS NOT NULL;