-- ====================================================================
-- EVENTRA: Provision Official Department Coordinators into Supabase Auth
-- Run this in the Supabase SQL Editor to make these users appear
-- immediately in: Supabase Dashboard -> Authentication -> Users
-- ====================================================================

-- 1. Ensure pgcrypto extension is enabled for password hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA extensions;

-- 2. Insert Official Coordinators into auth.users (if not already existing)
-- Passwords:
-- Admin: admin@eventra
-- Activity Coord: coord@eventra
-- Faculty Coord: faculty@eventra
DO $$
DECLARE
    admin_id UUID := 'a1111111-1111-1111-1111-111111111111';
    act_coord_id UUID := 'b2222222-2222-2222-2222-222222222222';
    fac_coord1_id UUID := 'c3333333-3333-3333-3333-333333333333';
    fac_coord2_id UUID := 'd4444444-4444-4444-4444-444444444444';
BEGIN

    -- 1. Prof. Vaishnavi Chitragar (Admin / HOD)
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'v.chitragar@engg.edu') THEN
        INSERT INTO auth.users (
            id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
            raw_app_meta_data, raw_user_meta_data, created_at, updated_at
        ) VALUES (
            admin_id,
            '00000000-0000-0000-0000-000000000000',
            'authenticated',
            'authenticated',
            'v.chitragar@engg.edu',
            extensions.crypt('admin@eventra', extensions.gen_salt('bf')),
            NOW(),
            '{"provider":"email","providers":["email"]}'::jsonb,
            '{"full_name":"Prof. Vaishnavi Chitragar","role":"admin","department":"Computer Engineering","designation":"Head of Department & Faculty Coordinator","avatar_url":"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"}'::jsonb,
            NOW(),
            NOW()
        );
    END IF;

    -- 2. Prof. Rajesh Verma (Activity Coordinator)
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'r.verma@engg.edu') THEN
        INSERT INTO auth.users (
            id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
            raw_app_meta_data, raw_user_meta_data, created_at, updated_at
        ) VALUES (
            act_coord_id,
            '00000000-0000-0000-0000-000000000000',
            'authenticated',
            'authenticated',
            'r.verma@engg.edu',
            extensions.crypt('coord@eventra', extensions.gen_salt('bf')),
            NOW(),
            '{"provider":"email","providers":["email"]}'::jsonb,
            '{"full_name":"Prof. Rajesh Verma","role":"activity_coordinator","department":"Computer Engineering","designation":"Associate Professor & Activity In-charge","avatar_url":"https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80"}'::jsonb,
            NOW(),
            NOW()
        );
    END IF;

    -- 3. Prof. Sneha Kulkarni (Faculty Coordinator)
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 's.kulkarni@engg.edu') THEN
        INSERT INTO auth.users (
            id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
            raw_app_meta_data, raw_user_meta_data, created_at, updated_at
        ) VALUES (
            fac_coord1_id,
            '00000000-0000-0000-0000-000000000000',
            'authenticated',
            'authenticated',
            's.kulkarni@engg.edu',
            extensions.crypt('faculty@eventra', extensions.gen_salt('bf')),
            NOW(),
            '{"provider":"email","providers":["email"]}'::jsonb,
            '{"full_name":"Prof. Sneha Kulkarni","role":"faculty_coordinator","department":"Computer Engineering","designation":"Assistant Professor","avatar_url":"https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=150&auto=format&fit=crop&q=80"}'::jsonb,
            NOW(),
            NOW()
        );
    END IF;

    -- 4. Prof. Arvind Patil (Faculty Coordinator)
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'a.patil@engg.edu') THEN
        INSERT INTO auth.users (
            id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
            raw_app_meta_data, raw_user_meta_data, created_at, updated_at
        ) VALUES (
            fac_coord2_id,
            '00000000-0000-0000-0000-000000000000',
            'authenticated',
            'authenticated',
            'a.patil@engg.edu',
            extensions.crypt('faculty@eventra', extensions.gen_salt('bf')),
            NOW(),
            '{"provider":"email","providers":["email"]}'::jsonb,
            '{"full_name":"Prof. Arvind Patil","role":"faculty_coordinator","department":"Computer Engineering","designation":"Assistant Professor","avatar_url":"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}'::jsonb,
            NOW(),
            NOW()
        );
    END IF;

END $$;

-- 3. Verify public.profiles are in sync
INSERT INTO public.profiles (id, full_name, email, role, department, designation, avatar_url)
SELECT 
    id, 
    raw_user_meta_data->>'full_name',
    email,
    COALESCE(raw_user_meta_data->>'role', 'faculty_coordinator'),
    COALESCE(raw_user_meta_data->>'department', 'Computer Engineering'),
    COALESCE(raw_user_meta_data->>'designation', 'Assistant Professor'),
    raw_user_meta_data->>'avatar_url'
FROM auth.users
WHERE email IN ('v.chitragar@engg.edu', 'r.verma@engg.edu', 's.kulkarni@engg.edu', 'a.patil@engg.edu')
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    department = EXCLUDED.department,
    designation = EXCLUDED.designation;
