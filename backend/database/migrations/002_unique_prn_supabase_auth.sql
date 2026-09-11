-- Unique PRN for student accounts (one PRN = one profile)
-- Safe to re-run

CREATE UNIQUE INDEX IF NOT EXISTS profiles_prn_unique
ON public.profiles (lower(prn))
WHERE prn IS NOT NULL AND length(trim(prn)) > 0;

-- Store PRN + phone from auth metadata on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    prn,
    phone,
    role,
    is_active,
    created_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'Campus Student'),
    NULLIF(UPPER(TRIM(NEW.raw_user_meta_data->>'prn')), ''),
    NULLIF(TRIM(NEW.raw_user_meta_data->>'phone'), ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    TRUE,
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    prn = COALESCE(EXCLUDED.prn, profiles.prn),
    phone = COALESCE(EXCLUDED.phone, profiles.phone),
    last_login_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
