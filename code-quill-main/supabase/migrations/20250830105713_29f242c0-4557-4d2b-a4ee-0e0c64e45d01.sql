-- Update the handle_new_user function to set admin role for admin users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = 'public'
AS $$
BEGIN
  -- Determine role based on email
  DECLARE
    user_role TEXT := 'user';
  BEGIN
    IF NEW.email LIKE '%admin%' OR NEW.email = 'admin@devnovate.io' THEN
      user_role := 'admin';
    END IF;
  END;

  INSERT INTO public.profiles (user_id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    NEW.email,
    user_role
  );
  RETURN NEW;
END;
$$;