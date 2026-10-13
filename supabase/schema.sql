-- ====================================================================
-- EVENTRA: College Activity & Event Documentation Automation System
-- Production PostgreSQL Database Schema & Security Policies for Supabase
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS & DOMAINS
DO $$ BEGIN
    CREATE TYPE user_role_type AS ENUM ('admin', 'activity_coordinator', 'faculty_coordinator');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE event_status_type AS ENUM ('draft', 'upcoming', 'ongoing', 'completed', 'cancelled', 'scheduled', 'documents_overdue', 'in_review');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE event_mode_type AS ENUM ('offline', 'online', 'hybrid');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE document_type_enum AS ENUM ('flyer', 'invitation_letter', 'attendance_sheet', 'activity_report', 'thank_you_letter');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE document_status_type AS ENUM ('draft', 'draft_ready', 'submitted', 'pending_review', 'in_review', 'approved', 'needs_revision', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE checklist_status_type AS ENUM ('pending', 'in_progress', 'completed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. HELPER FUNCTION FOR UPDATING TIMESTAMPS
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ====================================================================
-- 4. TABLE CREATION
-- ====================================================================

-- A. PROFILES TABLE
-- References Supabase auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'faculty_coordinator' CHECK (role IN ('admin', 'activity_coordinator', 'faculty_coordinator')),
    department TEXT NOT NULL DEFAULT 'Computer Engineering',
    designation TEXT,
    avatar_url TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Trigger for profiles updated_at
DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Function to safely fetch user role without recursive RLS evaluation
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Function to safely fetch user department
CREATE OR REPLACE FUNCTION public.get_current_user_department()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT department FROM public.profiles WHERE id = auth.uid();
$$;

-- B. EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_code TEXT UNIQUE, -- e.g. EVT-2026-001
    title TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Expert Session',
    description TEXT,
    objectives JSONB DEFAULT '[]'::jsonb,
    outcomes JSONB DEFAULT '[]'::jsonb,
    mapped_pos JSONB DEFAULT '[]'::jsonb,
    event_date DATE NOT NULL,
    end_date DATE,
    start_time TEXT,
    duration TEXT,
    venue TEXT NOT NULL,
    mode TEXT NOT NULL DEFAULT 'offline' CHECK (mode IN ('offline', 'online', 'hybrid')),
    speaker_name TEXT NOT NULL,
    speaker_designation TEXT,
    speaker_organization TEXT,
    speaker_email TEXT,
    speaker_phone TEXT,
    speaker_bio TEXT,
    speaker_photo TEXT,
    organizing_body TEXT DEFAULT 'Department of Computer Engineering',
    faculty_coordinator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    activity_coordinator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    admin_supervisor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    faculty_coordinator_name TEXT,
    activity_coordinator_name TEXT,
    academic_year TEXT NOT NULL DEFAULT '2026-2027',
    semester TEXT NOT NULL DEFAULT 'Odd (Sem V & VII)',
    participant_years JSONB DEFAULT '["TE", "BE"]'::jsonb,
    participant_divisions JSONB DEFAULT '["Div A", "Div B"]'::jsonb,
    expected_participants INTEGER DEFAULT 60,
    actual_participants INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'upcoming', 'ongoing', 'completed', 'cancelled', 'documents_overdue', 'in_review')),
    feedback_rating NUMERIC(3, 2),
    event_photos JSONB DEFAULT '[]'::jsonb,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

DROP TRIGGER IF EXISTS set_events_updated_at ON public.events;
CREATE TRIGGER set_events_updated_at
BEFORE UPDATE ON public.events
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- C. DOCUMENTS TABLE
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL CHECK (document_type IN ('flyer', 'invitation_letter', 'attendance_sheet', 'activity_report', 'thank_you_letter')),
    file_name TEXT,
    storage_path TEXT,
    version INTEGER NOT NULL DEFAULT 1,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'draft_ready', 'submitted', 'pending_review', 'in_review', 'approved', 'needs_revision', 'rejected')),
    generated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    approved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    review_comments TEXT,
    ref_no TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
    CONSTRAINT unique_event_doc_type UNIQUE (event_id, document_type)
);

DROP TRIGGER IF EXISTS set_documents_updated_at ON public.documents;
CREATE TRIGGER set_documents_updated_at
BEFORE UPDATE ON public.documents
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- D. ATTENDANCE TABLE
CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    student_roll_number TEXT NOT NULL,
    student_name TEXT NOT NULL,
    class_year TEXT NOT NULL,
    division TEXT NOT NULL,
    attendance_status BOOLEAN NOT NULL DEFAULT true,
    signature_or_verification_reference TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
    CONSTRAINT unique_event_student UNIQUE (event_id, student_roll_number)
);

-- E. EVENT CHECKLIST TABLE
CREATE TABLE IF NOT EXISTS public.event_checklist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    checklist_item TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
    assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    due_date DATE,
    updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

DROP TRIGGER IF EXISTS set_event_checklist_updated_at ON public.event_checklist;
CREATE TRIGGER set_event_checklist_updated_at
BEFORE UPDATE ON public.event_checklist
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- F. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    title TEXT,
    message TEXT NOT NULL,
    notification_type TEXT NOT NULL DEFAULT 'info' CHECK (notification_type IN ('info', 'warning', 'success', 'danger')),
    target_role TEXT,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

-- G. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    user_name TEXT,
    user_role TEXT,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    details TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

-- ====================================================================
-- 5. INDEXES FOR PERFORMANCE
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_events_faculty ON public.events(faculty_coordinator_id);
CREATE INDEX IF NOT EXISTS idx_events_activity_coord ON public.events(activity_coordinator_id);
CREATE INDEX IF NOT EXISTS idx_documents_event_id ON public.documents(event_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON public.documents(status);
CREATE INDEX IF NOT EXISTS idx_attendance_event ON public.attendance(event_id);
CREATE INDEX IF NOT EXISTS idx_checklist_event ON public.event_checklist(event_id);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON public.notifications(recipient_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- ====================================================================
-- 6. SECURITY: PREVENT ROLE SELF-ELEVATION
-- ====================================================================
CREATE OR REPLACE FUNCTION public.check_profile_role_update()
RETURNS TRIGGER AS $$
BEGIN
    -- If role is changing, verify requester is an admin
    IF NEW.role IS DISTINCT FROM OLD.role THEN
        IF public.get_current_user_role() != 'admin' THEN
            RAISE EXCEPTION 'Only administrators can modify user roles.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS enforce_profile_role_security ON public.profiles;
CREATE TRIGGER enforce_profile_role_security
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.check_profile_role_update();

-- Auto-create profile trigger on auth.users signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id, 
        full_name, 
        email, 
        role, 
        department,
        designation,
        avatar_url
    )
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'role', 'faculty_coordinator'),
        COALESCE(NEW.raw_user_meta_data->>'department', 'Computer Engineering'),
        COALESCE(NEW.raw_user_meta_data->>'designation', 'Assistant Professor'),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80')
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- ====================================================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_checklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ---- PROFILES POLICIES ----
DROP POLICY IF EXISTS "Profiles are readable by authenticated users" ON public.profiles;
CREATE POLICY "Profiles are readable by authenticated users"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Users can update their own profile details" ON public.profiles;
CREATE POLICY "Users can update their own profile details"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
CREATE POLICY "Admins can update any profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (public.get_current_user_role() = 'admin');

-- ---- EVENTS POLICIES ----
-- Read: Everyone authenticated can see events in their department (or all events)
DROP POLICY IF EXISTS "View department events" ON public.events;
CREATE POLICY "View department events"
ON public.events FOR SELECT
TO authenticated
USING (true);

-- Insert: Admins and Faculty Coordinators can create events
DROP POLICY IF EXISTS "Coordinators and Admins can create events" ON public.events;
CREATE POLICY "Coordinators and Admins can create events"
ON public.events FOR INSERT
TO authenticated
WITH CHECK (
    public.get_current_user_role() IN ('admin', 'faculty_coordinator', 'activity_coordinator')
);

-- Update:
-- 1. Admin can update any event.
-- 2. Activity Coordinator can update status and metadata of events in department.
-- 3. Faculty Coordinator can update events assigned to them.
DROP POLICY IF EXISTS "Update event permissions" ON public.events;
CREATE POLICY "Update event permissions"
ON public.events FOR UPDATE
TO authenticated
USING (
    public.get_current_user_role() = 'admin' OR
    public.get_current_user_role() = 'activity_coordinator' OR
    (public.get_current_user_role() = 'faculty_coordinator' AND faculty_coordinator_id = auth.uid())
)
WITH CHECK (
    public.get_current_user_role() = 'admin' OR
    public.get_current_user_role() = 'activity_coordinator' OR
    (public.get_current_user_role() = 'faculty_coordinator' AND faculty_coordinator_id = auth.uid())
);

-- Delete: Only Admin can delete an event, or Faculty can delete draft event they created
DROP POLICY IF EXISTS "Delete event permissions" ON public.events;
CREATE POLICY "Delete event permissions"
ON public.events FOR DELETE
TO authenticated
USING (
    public.get_current_user_role() = 'admin' OR
    (public.get_current_user_role() = 'faculty_coordinator' AND faculty_coordinator_id = auth.uid() AND status = 'draft')
);

-- ---- DOCUMENTS POLICIES ----
DROP POLICY IF EXISTS "View event documents" ON public.documents;
CREATE POLICY "View event documents"
ON public.documents FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Manage documents" ON public.documents;
CREATE POLICY "Manage documents"
ON public.documents FOR INSERT
TO authenticated
WITH CHECK (
    public.get_current_user_role() IN ('admin', 'activity_coordinator', 'faculty_coordinator')
);

DROP POLICY IF EXISTS "Update documents" ON public.documents;
CREATE POLICY "Update documents"
ON public.documents FOR UPDATE
TO authenticated
USING (
    public.get_current_user_role() IN ('admin', 'activity_coordinator') OR
    EXISTS (
        SELECT 1 FROM public.events e 
        WHERE e.id = event_id AND e.faculty_coordinator_id = auth.uid()
    )
)
WITH CHECK (
    public.get_current_user_role() IN ('admin', 'activity_coordinator') OR
    EXISTS (
        SELECT 1 FROM public.events e 
        WHERE e.id = event_id AND e.faculty_coordinator_id = auth.uid()
    )
);

-- ---- ATTENDANCE POLICIES ----
DROP POLICY IF EXISTS "View attendance records" ON public.attendance;
CREATE POLICY "View attendance records"
ON public.attendance FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Manage attendance records" ON public.attendance;
CREATE POLICY "Manage attendance records"
ON public.attendance FOR ALL
TO authenticated
USING (
    public.get_current_user_role() IN ('admin', 'activity_coordinator') OR
    EXISTS (
        SELECT 1 FROM public.events e 
        WHERE e.id = event_id AND e.faculty_coordinator_id = auth.uid()
    )
);

-- ---- EVENT CHECKLIST POLICIES ----
DROP POLICY IF EXISTS "View checklist" ON public.event_checklist;
CREATE POLICY "View checklist"
ON public.event_checklist FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Manage checklist items" ON public.event_checklist;
CREATE POLICY "Manage checklist items"
ON public.event_checklist FOR ALL
TO authenticated
USING (
    public.get_current_user_role() IN ('admin', 'activity_coordinator') OR
    assigned_to = auth.uid()
);

-- ---- NOTIFICATIONS POLICIES ----
DROP POLICY IF EXISTS "Users can view their notifications" ON public.notifications;
CREATE POLICY "Users can view their notifications"
ON public.notifications FOR SELECT
TO authenticated
USING (
    recipient_id = auth.uid() OR
    (target_role IS NOT NULL AND target_role = public.get_current_user_role())
);

DROP POLICY IF EXISTS "Users can mark notifications as read" ON public.notifications;
CREATE POLICY "Users can mark notifications as read"
ON public.notifications FOR UPDATE
TO authenticated
USING (
    recipient_id = auth.uid() OR
    (target_role IS NOT NULL AND target_role = public.get_current_user_role())
)
WITH CHECK (
    recipient_id = auth.uid() OR
    (target_role IS NOT NULL AND target_role = public.get_current_user_role())
);

DROP POLICY IF EXISTS "Create notifications" ON public.notifications;
CREATE POLICY "Create notifications"
ON public.notifications FOR INSERT
TO authenticated
WITH CHECK (true);

-- ---- AUDIT LOGS POLICIES ----
DROP POLICY IF EXISTS "Admins and Activity Coords can view audit logs" ON public.audit_logs;
CREATE POLICY "Admins and Activity Coords can view audit logs"
ON public.audit_logs FOR SELECT
TO authenticated
USING (public.get_current_user_role() IN ('admin', 'activity_coordinator'));

DROP POLICY IF EXISTS "Users can insert audit logs" ON public.audit_logs;
CREATE POLICY "Users can insert audit logs"
ON public.audit_logs FOR INSERT
TO authenticated
WITH CHECK (true);

-- ====================================================================
-- 8. STORAGE BUCKET CONFIGURATION & POLICIES
-- ====================================================================
-- Run the following to insert default private buckets into storage:
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('event-flyers', 'event-flyers', true),
    ('event-documents', 'event-documents', false),
    ('event-photos', 'event-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage object policies
DROP POLICY IF EXISTS "Authenticated users can read flyers and photos" ON storage.objects;
CREATE POLICY "Authenticated users can read flyers and photos"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id IN ('event-flyers', 'event-photos'));

DROP POLICY IF EXISTS "Authorized users can read documents" ON storage.objects;
CREATE POLICY "Authorized users can read documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'event-documents' AND
    auth.role() = 'authenticated'
);

DROP POLICY IF EXISTS "Authenticated users can upload event assets" ON storage.objects;
CREATE POLICY "Authenticated users can upload event assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id IN ('event-flyers', 'event-documents', 'event-photos')
);

DROP POLICY IF EXISTS "Coordinators and Admins can update/delete event assets" ON storage.objects;
CREATE POLICY "Coordinators and Admins can update/delete event assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id IN ('event-flyers', 'event-documents', 'event-photos')
);
