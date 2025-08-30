-- Add unique constraint to profiles table user_id column if it doesn't exist
ALTER TABLE public.profiles ADD CONSTRAINT profiles_user_id_unique UNIQUE (user_id);