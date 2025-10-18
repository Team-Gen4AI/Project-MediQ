-- Enable RLS on prescriptions table
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can create own prescriptions" ON public.prescriptions;
DROP POLICY IF EXISTS "Users can view own prescriptions" ON public.prescriptions;
DROP POLICY IF EXISTS "Users can delete own prescriptions" ON public.prescriptions;

-- Create policy for INSERT
CREATE POLICY "Users can create own prescriptions"
ON public.prescriptions
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create policy for SELECT
CREATE POLICY "Users can view own prescriptions"
ON public.prescriptions
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Create policy for DELETE
CREATE POLICY "Users can delete own prescriptions"
ON public.prescriptions
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);