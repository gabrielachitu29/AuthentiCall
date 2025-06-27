CREATE TABLE public.detection_feedback (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    analysis_history_id uuid REFERENCES public.analysis_history(id) ON DELETE CASCADE,
    is_helpful boolean NOT NULL,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE public.detection_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own detection feedback"
ON public.detection_feedback FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own detection feedback"
ON public.detection_feedback FOR SELECT
USING (auth.uid() = user_id);