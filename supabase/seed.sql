-- ====================================================================
-- EVENTRA: College Activity & Event Documentation Automation System
-- Database Seed Data (Demo & Initial Pre-seeded State)
-- Run this in the Supabase SQL Editor after running schema.sql
-- ====================================================================

-- 1. SEED EVENTS
INSERT INTO public.events (
    id,
    event_code,
    title,
    category,
    academic_year,
    semester,
    event_date,
    start_time,
    duration,
    venue,
    mode,
    status,
    organizing_body,
    faculty_coordinator_name,
    activity_coordinator_name,
    speaker_name,
    speaker_designation,
    speaker_organization,
    speaker_email,
    speaker_phone,
    speaker_bio,
    speaker_photo,
    participant_years,
    participant_divisions,
    expected_participants,
    actual_participants,
    description,
    objectives,
    outcomes,
    mapped_pos,
    feedback_rating,
    event_photos
) VALUES 
(
    '11111111-1111-1111-1111-111111111111',
    'EVT-2026-001',
    'Product Development Life Cycle (PDLC) in Modern Tech Giants',
    'Expert Session',
    '2026-2027',
    'Odd (Sem V & VII)',
    '2026-09-18',
    '10:30 AM',
    '2 Hours',
    'Seminar Hall 3, Department of Computer Engineering',
    'offline',
    'completed',
    'Association of Computer Engineering Students (ACES)',
    'Prof. Sneha Kulkarni',
    'Prof. Rajesh Verma',
    'Ms. Rohini More',
    'Principal Consultant & Product Lead',
    'Deloitte Pune',
    'rohini.more@deloitte.com',
    '+91 98220 44521',
    '12+ years leading enterprise digital transformations, SaaS architectures, Agile sprint planning, and user experience telemetry across North American and EMEA clients.',
    'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&auto=format&fit=crop&q=80',
    '["TE", "BE"]'::jsonb,
    '["Div A", "Div B"]'::jsonb,
    75,
    72,
    'An intensive session detailing how commercial software evolves from market ideation to architecture, CI/CD automated testbeds, sprint velocity, and post-launch telemetry.',
    '["Understand enterprise stages of PDLC from discovery to decommissioning", "Examine real-world case studies of rapid prototyping vs enterprise resilience", "Familiarize students with cross-functional roles: PM, Engineering Lead, and DevOps"]'::jsonb,
    '["Students mapped core software engineering theory to industry sprint practices", "Understood how quality gates and security audits integrate into production pipelines"]'::jsonb,
    '["PO1", "PO3", "PO5", "PO11", "PSO1"]'::jsonb,
    4.8,
    '["https://images.unsplash.com/photo-1531482615713-2afd69097998?w=500&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=500&auto=format&fit=crop&q=80"]'::jsonb
),
(
    '22222222-2222-2222-2222-222222222222',
    'EVT-2026-002',
    'One-Month Research Internship on Applied Machine Learning & Deep Learning',
    'Internship',
    '2026-2027',
    'Odd (Sem VII)',
    '2026-08-01',
    '09:00 AM',
    '1 Month (120 Hours)',
    'Advanced AI & High Performance Computing Lab (Lab 7)',
    'hybrid',
    'in_review',
    'AI & Data Science Research Group (CE-R&D)',
    'Prof. Arvind Patil',
    'Prof. Rajesh Verma',
    'Dr. Sameer Deshmukh',
    'Principal Research Scientist',
    'Center for Applied Artificial Intelligence (CAAI)',
    's.deshmukh@caai.org',
    '+91 94230 11984',
    'Renowned researcher with 40+ publications in CVPR, NeurIPS, and IEEE Transactions. Pioneer in multimodal medical imaging models.',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    '["BE"]'::jsonb,
    '["Div A", "Div B"]'::jsonb,
    30,
    28,
    'Intensive capstone research internship focusing on transformer architectures, fine-tuning LLMs, domain adaptation for medical diagnostics, and paper drafting.',
    '["Train students in formulation of research hypotheses and literature synthesis", "Implement PyTorch distributed training pipelines on NVIDIA workstation nodes", "Produce measurable research draft manuscripts for conference submission"]'::jsonb,
    '["28 students completed benchmark evaluations on 4 public clinical datasets", "6 draft manuscripts submitted to IEEE student colloquium"]'::jsonb,
    '["PO1", "PO2", "PO4", "PO5", "PSO2"]'::jsonb,
    4.9,
    '["https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&auto=format&fit=crop&q=80"]'::jsonb
),
(
    '33333333-3333-3333-3333-333333333333',
    'EVT-2026-003',
    'Hands-on Workshop: Cloud Native Architecture with Kubernetes & Microservices',
    'Workshop',
    '2026-2027',
    'Odd (Sem V)',
    '2026-10-24',
    '09:30 AM',
    'Full Day (6 Hours)',
    'Cloud Computing Lab & Online Stream',
    'hybrid',
    'scheduled',
    'Computer Society of India (CSI Student Chapter)',
    'Prof. Sneha Kulkarni',
    'Prof. Rajesh Verma',
    'Mr. Aniket Joshi',
    'Senior Cloud Solutions Architect',
    'Red Hat India',
    'aniket.joshi@redhat.com',
    '+91 98812 77432',
    'Certified Kubernetes Administrator (CKA), specializing in multi-tenant cluster management, Istio service mesh, and GitOps workflows with ArgoCD.',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    '["TE"]'::jsonb,
    '["Div A", "Div B"]'::jsonb,
    60,
    0,
    'Practical lab-intensive bootcamp covering container orchestration, pod scheduling, cluster ingress controllers, and automated canary deployments.',
    '["Build containerized microservices and push to secure private registries", "Deploy resilient clusters on AWS EKS with autoscaling and persistent volume claims", "Configure ingress controllers, secrets, and Prometheus observability"]'::jsonb,
    '["Students will deploy a complete polyglot microservice application on Kubernetes cluster"]'::jsonb,
    '["PO3", "PO5", "PSO1"]'::jsonb,
    null,
    '[]'::jsonb
),
(
    '44444444-4444-4444-4444-444444444444',
    'EVT-2026-004',
    'International Seminar: Higher Education & Research Pathways in AI in Europe & US',
    'Seminar',
    '2026-2027',
    'Odd (Sem VII)',
    '2026-10-05',
    '02:00 PM',
    '2.5 Hours',
    'Auditorium A, Main Engineering Complex',
    'offline',
    'documents_overdue',
    'Higher Studies & Career Guidance Cell',
    'Prof. Rahul Shinde',
    'Prof. Rajesh Verma',
    'Dr. Kaustubh Deshpande',
    'Postdoctoral Fellow & Admissions Advisor',
    'Technical University of Munich (TUM), Germany',
    'k.deshpande@tum.de',
    '+49 89 289 01',
    'Alumnus of IIT Bombay and TUM. Guide to over 300 Indian engineering scholars securing DAAD and Fulbright fellowships.',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
    '["BE", "TE"]'::jsonb,
    '["Div A"]'::jsonb,
    110,
    104,
    'Comprehensive roadmap for engineering undergraduates planning MS/PhD admissions abroad: funding strategies, GRE/TOEFL timeline, research statement crafting, and faculty outreach.',
    '["Demystify scholarship opportunities including DAAD, Erasmus Mundus, and US Graduate Assistantships", "Provide concrete examples of standout Statements of Purpose (SOP) and Letters of Recommendation"]'::jsonb,
    '["Over 100 students gained clarity on funding windows and application protocols for Fall 2027"]'::jsonb,
    '["PO8", "PO9", "PO12"]'::jsonb,
    4.7,
    '["https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&auto=format&fit=crop&q=80"]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- 2. SEED DOCUMENTS FOR EVT-2026-001
INSERT INTO public.documents (event_id, document_type, file_name, status, ref_no) VALUES
('11111111-1111-1111-1111-111111111111', 'flyer', 'EVT-2026-001_Flyer.pdf', 'approved', null),
('11111111-1111-1111-1111-111111111111', 'invitation_letter', 'EVT-2026-001_Invitation.pdf', 'approved', 'CO/EXT/2026/042'),
('11111111-1111-1111-1111-111111111111', 'attendance_sheet', 'EVT-2026-001_Attendance.csv', 'approved', null),
('11111111-1111-1111-1111-111111111111', 'activity_report', 'EVT-2026-001_ActivityReport.pdf', 'approved', null),
('11111111-1111-1111-1111-111111111111', 'thank_you_letter', 'EVT-2026-001_ThankYou.pdf', 'approved', 'CO/TY/2026/042')
ON CONFLICT (event_id, document_type) DO NOTHING;

-- DOCUMENTS FOR EVT-2026-002
INSERT INTO public.documents (event_id, document_type, file_name, status, ref_no) VALUES
('22222222-2222-2222-2222-222222222222', 'flyer', 'EVT-2026-002_Flyer.pdf', 'approved', null),
('22222222-2222-2222-2222-222222222222', 'invitation_letter', 'EVT-2026-002_Invitation.pdf', 'approved', 'CO/INTERN/2026/019'),
('22222222-2222-2222-2222-222222222222', 'attendance_sheet', 'EVT-2026-002_Attendance.csv', 'approved', null),
('22222222-2222-2222-2222-222222222222', 'activity_report', 'EVT-2026-002_ActivityReport.pdf', 'pending_review', null),
('22222222-2222-2222-2222-222222222222', 'thank_you_letter', null, 'draft', 'CO/TY/2026/019')
ON CONFLICT (event_id, document_type) DO NOTHING;

-- DOCUMENTS FOR EVT-2026-003
INSERT INTO public.documents (event_id, document_type, file_name, status, ref_no) VALUES
('33333333-3333-3333-3333-333333333333', 'flyer', 'EVT-2026-003_Flyer.pdf', 'approved', null),
('33333333-3333-3333-3333-333333333333', 'invitation_letter', 'EVT-2026-003_Invitation.pdf', 'approved', 'CO/WS/2026/067'),
('33333333-3333-3333-3333-333333333333', 'attendance_sheet', 'EVT-2026-003_Attendance.csv', 'draft_ready', null),
('33333333-3333-3333-3333-333333333333', 'activity_report', null, 'draft', null),
('33333333-3333-3333-3333-333333333333', 'thank_you_letter', null, 'draft', 'CO/TY/2026/067')
ON CONFLICT (event_id, document_type) DO NOTHING;

-- DOCUMENTS FOR EVT-2026-004
INSERT INTO public.documents (event_id, document_type, file_name, status, ref_no) VALUES
('44444444-4444-4444-4444-444444444444', 'flyer', 'EVT-2026-004_Flyer.pdf', 'approved', null),
('44444444-4444-4444-4444-444444444444', 'invitation_letter', 'EVT-2026-004_Invitation.pdf', 'approved', 'CO/SEM/2026/058'),
('44444444-4444-4444-4444-444444444444', 'attendance_sheet', 'EVT-2026-004_Attendance.csv', 'submitted', null),
('44444444-4444-4444-4444-444444444444', 'activity_report', null, 'needs_revision', null),
('44444444-4444-4444-4444-444444444444', 'thank_you_letter', 'EVT-2026-004_ThankYou.pdf', 'approved', 'CO/TY/2026/058')
ON CONFLICT (event_id, document_type) DO NOTHING;

-- 3. SEED CHECKLIST ITEMS
INSERT INTO public.event_checklist (event_id, checklist_item, status) VALUES
('33333333-3333-3333-3333-333333333333', 'Send Resource Person Invitation & Obtain Acceptance', 'completed'),
('33333333-3333-3333-3333-333333333333', 'Circulate Event Flyer to Students across TE classes', 'completed'),
('33333333-3333-3333-3333-333333333333', 'Generate and print Empty Student Attendance Sheet', 'completed'),
('33333333-3333-3333-3333-333333333333', 'Conduct Event & Collect Geotagged Photographs', 'pending'),
('33333333-3333-3333-3333-333333333333', 'Submit Post-Event Activity Report & Feedback Rating', 'pending')
ON CONFLICT DO NOTHING;

-- 4. SEED NOTIFICATIONS
INSERT INTO public.notifications (target_role, title, message, notification_type, is_read, event_id) VALUES
('activity_coordinator', 'Overdue Activity Report', 'Event "International Seminar: Higher Education" held on Oct 5 is missing its Activity Report. Please follow up with Prof. Rahul Shinde.', 'warning', false, '44444444-4444-4444-4444-444444444444'),
('admin', 'Report Pending Approval', 'Prof. Arvind Patil submitted the Activity Report for "One-Month Research Internship on Applied Machine Learning".', 'info', false, '22222222-2222-2222-2222-222222222222'),
('faculty_coordinator', 'Upcoming Workshop Preparation', 'Reminder: Hands-on Workshop with Red Hat scheduled for Oct 24. Ensure attendance sheets and student rosters are ready.', 'success', true, '33333333-3333-3333-3333-333333333333')
ON CONFLICT DO NOTHING;

-- 5. SEED AUDIT LOGS
INSERT INTO public.audit_logs (user_name, user_role, action, entity_type, details) VALUES
('Prof. Vaishnavi Chitragar', 'Admin', 'Approved Document', 'document', 'Approved Activity Report & Thank You Letter for EVT-2026-001 (PDLC Session)'),
('Prof. Sneha Kulkarni', 'Faculty Coordinator', 'Generated Documents', 'document', 'Generated Flyer, Invitation Letter & Empty Attendance Sheet for EVT-2026-003 (Kubernetes Workshop)'),
('Prof. Rajesh Verma', 'Activity Coordinator', 'Sent Reminder', 'notification', 'Triggered urgent report submission reminder to Prof. Rahul Shinde for EVT-2026-004'),
('Prof. Arvind Patil', 'Faculty Coordinator', 'Submitted Document', 'document', 'Submitted Activity Report for EVT-2026-002 (Research Internship) for review')
ON CONFLICT DO NOTHING;
