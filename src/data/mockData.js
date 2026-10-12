// Mock Database & Initial Pre-seeded State for Eventra System

export const INITIAL_USERS = [
  {
    id: 'usr_admin',
    name: 'Prof. Vaishnavi Chitragar',
    role: 'Admin',
    designation: 'Head of Department & Faculty Coordinator',
    department: 'Computer Engineering',
    email: 'v.chitragar@engg.edu',
    password: 'admin@eventra',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr_activity_coord',
    name: 'Prof. Rajesh Verma',
    role: 'Activity Coordinator',
    designation: 'Associate Professor & Activity In-charge',
    department: 'Computer Engineering',
    email: 'r.verma@engg.edu',
    password: 'coord@eventra',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr_faculty_coord',
    name: 'Prof. Sneha Kulkarni',
    role: 'Faculty Coordinator',
    designation: 'Assistant Professor',
    department: 'Computer Engineering',
    email: 's.kulkarni@engg.edu',
    password: 'faculty@eventra',
    avatar: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr_faculty_2',
    name: 'Prof. Arvind Patil',
    role: 'Faculty Coordinator',
    designation: 'Assistant Professor',
    department: 'Computer Engineering',
    email: 'a.patil@engg.edu',
    password: 'faculty@eventra',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_STUDENTS = [
  { id: 'S101', rollNo: 'COMP-2301', name: 'Aarav Sharma', year: 'TE', division: 'A' },
  { id: 'S102', rollNo: 'COMP-2302', name: 'Ananya Deshmukh', year: 'TE', division: 'A' },
  { id: 'S103', rollNo: 'COMP-2303', name: 'Rohan Mehta', year: 'TE', division: 'A' },
  { id: 'S104', rollNo: 'COMP-2304', name: 'Pooja Iyer', year: 'TE', division: 'A' },
  { id: 'S105', rollNo: 'COMP-2305', name: 'Siddharth Joshi', year: 'TE', division: 'A' },
  { id: 'S106', rollNo: 'COMP-2306', name: 'Tanvi Shinde', year: 'TE', division: 'A' },
  { id: 'S107', rollNo: 'COMP-2307', name: 'Aditya Kulkarni', year: 'TE', division: 'B' },
  { id: 'S108', rollNo: 'COMP-2308', name: 'Neha Chawla', year: 'TE', division: 'B' },
  { id: 'S109', rollNo: 'COMP-2309', name: 'Virendra Patil', year: 'TE', division: 'B' },
  { id: 'S110', rollNo: 'COMP-2310', name: 'Snehal Jagtap', year: 'TE', division: 'B' },
  { id: 'S111', rollNo: 'COMP-2201', name: 'Gaurav Kadam', year: 'BE', division: 'A' },
  { id: 'S112', rollNo: 'COMP-2202', name: 'Riya Wani', year: 'BE', division: 'A' },
  { id: 'S113', rollNo: 'COMP-2203', name: 'Pranav Rao', year: 'BE', division: 'A' },
  { id: 'S114', rollNo: 'COMP-2204', name: 'Shruti Kulkarni', year: 'BE', division: 'B' },
  { id: 'S115', rollNo: 'COMP-2205', name: 'Devendra More', year: 'BE', division: 'B' }
];

export const INITIAL_EVENTS = [
  {
    id: 'EVT-2026-001',
    title: 'Product Development Life Cycle (PDLC) in Modern Tech Giants',
    category: 'Expert Session',
    academicYear: '2026-2027',
    semester: 'Odd (Sem V & VII)',
    date: '2026-09-18',
    startTime: '10:30 AM',
    duration: '2 Hours',
    venue: 'Seminar Hall 3, Department of Computer Engineering',
    mode: 'Offline',
    status: 'Completed',
    organizingBody: 'Association of Computer Engineering Students (ACES)',
    facultyCoordinator: 'Prof. Sneha Kulkarni',
    facultyCoordinatorId: 'usr_faculty_coord',
    activityCoordinator: 'Prof. Rajesh Verma',
    adminSupervisor: 'Prof. Vaishnavi Chitragar',
    speaker: {
      name: 'Ms. Rohini More',
      designation: 'Principal Consultant & Product Lead',
      organization: 'Deloitte Pune',
      email: 'rohini.more@deloitte.com',
      phone: '+91 98220 44521',
      profile: '12+ years leading enterprise digital transformations, SaaS architectures, Agile sprint planning, and user experience telemetry across North American and EMEA clients.',
      photo: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&auto=format&fit=crop&q=80'
    },
    participants: {
      targetYears: ['TE', 'BE'],
      divisions: ['Div A', 'Div B'],
      expectedCount: 75,
      actualAttended: 72
    },
    description: 'An intensive session detailing how commercial software evolves from market ideation to architecture, CI/CD automated testbeds, sprint velocity, and post-launch telemetry.',
    objectives: [
      'Understand enterprise stages of PDLC from discovery to decommissioning',
      'Examine real-world case studies of rapid prototyping vs enterprise resilience',
      'Familiarize students with cross-functional roles: PM, Engineering Lead, and DevOps'
    ],
    outcomes: [
      'Students mapped core software engineering theory to industry sprint practices',
      'Understood how quality gates and security audits integrate into production pipelines'
    ],
    mappedPos: ['PO1', 'PO3', 'PO5', 'PO11', 'PSO1'],
    documents: {
      flyer: { generated: true, status: 'Approved', generatedAt: '2026-09-10' },
      invitationLetter: { generated: true, status: 'Approved', generatedAt: '2026-09-10', refNo: 'CO/EXT/2026/042' },
      attendanceSheet: { generated: true, status: 'Approved', generatedAt: '2026-09-18', totalPresent: 72 },
      activityReport: { generated: true, status: 'Approved', generatedAt: '2026-09-20' },
      thankYouLetter: { generated: true, status: 'Approved', generatedAt: '2026-09-20', refNo: 'CO/TY/2026/042' }
    },
    feedbackRating: 4.8,
    eventPhotos: [
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=500&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'EVT-2026-002',
    title: 'One-Month Research Internship on Applied Machine Learning & Deep Learning',
    category: 'Internship',
    academicYear: '2026-2027',
    semester: 'Odd (Sem VII)',
    date: '2026-08-01',
    endDate: '2026-08-31',
    startTime: '09:00 AM',
    duration: '1 Month (120 Hours)',
    venue: 'Advanced AI & High Performance Computing Lab (Lab 7)',
    mode: 'Hybrid',
    status: 'In Review',
    organizingBody: 'AI & Data Science Research Group (CE-R&D)',
    facultyCoordinator: 'Prof. Arvind Patil',
    facultyCoordinatorId: 'usr_faculty_2',
    activityCoordinator: 'Prof. Rajesh Verma',
    adminSupervisor: 'Prof. Vaishnavi Chitragar',
    speaker: {
      name: 'Dr. Sameer Deshmukh',
      designation: 'Principal Research Scientist',
      organization: 'Center for Applied Artificial Intelligence (CAAI)',
      email: 's.deshmukh@caai.org',
      phone: '+91 94230 11984',
      profile: 'Renowned researcher with 40+ publications in CVPR, NeurIPS, and IEEE Transactions. Pioneer in multimodal medical imaging models.',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'
    },
    participants: {
      targetYears: ['BE'],
      divisions: ['Div A', 'Div B'],
      expectedCount: 30,
      actualAttended: 28
    },
    description: 'Intensive capstone research internship focusing on transformer architectures, fine-tuning LLMs, domain adaptation for medical diagnostics, and paper drafting.',
    objectives: [
      'Train students in formulation of research hypotheses and literature synthesis',
      'Implement PyTorch distributed training pipelines on NVIDIA workstation nodes',
      'Produce measurable research draft manuscripts for conference submission'
    ],
    outcomes: [
      '28 students completed benchmark evaluations on 4 public clinical datasets',
      '6 draft manuscripts submitted to IEEE student colloquium'
    ],
    mappedPos: ['PO1', 'PO2', 'PO4', 'PO5', 'PSO2'],
    documents: {
      flyer: { generated: true, status: 'Approved', generatedAt: '2026-07-20' },
      invitationLetter: { generated: true, status: 'Approved', generatedAt: '2026-07-22', refNo: 'CO/INTERN/2026/019' },
      attendanceSheet: { generated: true, status: 'Approved', generatedAt: '2026-08-31', totalPresent: 28 },
      activityReport: { generated: true, status: 'Pending Review', generatedAt: '2026-09-05' },
      thankYouLetter: { generated: false, status: 'Draft', generatedAt: null, refNo: 'CO/TY/2026/019' }
    },
    feedbackRating: 4.9,
    eventPhotos: [
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=500&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'EVT-2026-003',
    title: 'Hands-on Workshop: Cloud Native Architecture with Kubernetes & Microservices',
    category: 'Workshop',
    academicYear: '2026-2027',
    semester: 'Odd (Sem V)',
    date: '2026-10-24',
    startTime: '09:30 AM',
    duration: 'Full Day (6 Hours)',
    venue: 'Cloud Computing Lab & Online Stream',
    mode: 'Hybrid',
    status: 'Scheduled',
    organizingBody: 'Computer Society of India (CSI Student Chapter)',
    facultyCoordinator: 'Prof. Sneha Kulkarni',
    facultyCoordinatorId: 'usr_faculty_coord',
    activityCoordinator: 'Prof. Rajesh Verma',
    adminSupervisor: 'Prof. Vaishnavi Chitragar',
    speaker: {
      name: 'Mr. Aniket Joshi',
      designation: 'Senior Cloud Solutions Architect',
      organization: 'Red Hat India',
      email: 'aniket.joshi@redhat.com',
      phone: '+91 98812 77432',
      profile: 'Certified Kubernetes Administrator (CKA), specializing in multi-tenant cluster management, Istio service mesh, and GitOps workflows with ArgoCD.',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80'
    },
    participants: {
      targetYears: ['TE'],
      divisions: ['Div A', 'Div B'],
      expectedCount: 60,
      actualAttended: 0
    },
    description: 'Practical lab-intensive bootcamp covering container orchestration, pod scheduling, cluster ingress controllers, and automated canary deployments.',
    objectives: [
      'Build containerized microservices and push to secure private registries',
      'Deploy resilient clusters on AWS EKS with autoscaling and persistent volume claims',
      'Configure ingress controllers, secrets, and Prometheus observability'
    ],
    outcomes: [
      'Students will deploy a complete polyglot microservice application on Kubernetes cluster'
    ],
    mappedPos: ['PO3', 'PO5', 'PSO1'],
    documents: {
      flyer: { generated: true, status: 'Approved', generatedAt: '2026-10-02' },
      invitationLetter: { generated: true, status: 'Approved', generatedAt: '2026-10-04', refNo: 'CO/WS/2026/067' },
      attendanceSheet: { generated: true, status: 'Ready (Empty)', generatedAt: '2026-10-05', totalPresent: 0 },
      activityReport: { generated: false, status: 'Awaiting Event Execution', generatedAt: null },
      thankYouLetter: { generated: false, status: 'Not Started', generatedAt: null, refNo: 'CO/TY/2026/067' }
    },
    feedbackRating: null,
    eventPhotos: []
  },
  {
    id: 'EVT-2026-004',
    title: 'International Seminar: Higher Education & Research Pathways in AI in Europe & US',
    category: 'Seminar',
    academicYear: '2026-2027',
    semester: 'Odd (Sem VII)',
    date: '2026-10-05',
    startTime: '02:00 PM',
    duration: '2.5 Hours',
    venue: 'Auditorium A, Main Engineering Complex',
    mode: 'Offline',
    status: 'Documents Overdue',
    organizingBody: 'Higher Studies & Career Guidance Cell',
    facultyCoordinator: 'Prof. Rahul Shinde',
    facultyCoordinatorId: 'usr_faculty_3',
    activityCoordinator: 'Prof. Rajesh Verma',
    adminSupervisor: 'Prof. Vaishnavi Chitragar',
    speaker: {
      name: 'Dr. Kaustubh Deshpande',
      designation: 'Postdoctoral Fellow & Admissions Advisor',
      organization: 'Technical University of Munich (TUM), Germany',
      email: 'k.deshpande@tum.de',
      phone: '+49 89 289 01',
      profile: 'Alumnus of IIT Bombay and TUM. Guide to over 300 Indian engineering scholars securing DAAD and Fulbright fellowships.',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80'
    },
    participants: {
      targetYears: ['BE', 'TE'],
      divisions: ['Div A'],
      expectedCount: 110,
      actualAttended: 104
    },
    description: 'Comprehensive roadmap for engineering undergraduates planning MS/PhD admissions abroad: funding strategies, GRE/TOEFL timeline, research statement crafting, and faculty outreach.',
    objectives: [
      'Demystify scholarship opportunities including DAAD, Erasmus Mundus, and US Graduate Assistantships',
      'Provide concrete examples of standout Statements of Purpose (SOP) and Letters of Recommendation'
    ],
    outcomes: [
      'Over 100 students gained clarity on funding windows and application protocols for Fall 2027'
    ],
    mappedPos: ['PO8', 'PO9', 'PO12'],
    documents: {
      flyer: { generated: true, status: 'Approved', generatedAt: '2026-09-22' },
      invitationLetter: { generated: true, status: 'Approved', generatedAt: '2026-09-24', refNo: 'CO/SEM/2026/058' },
      attendanceSheet: { generated: true, status: 'Submitted', generatedAt: '2026-10-05', totalPresent: 104 },
      activityReport: { generated: false, status: 'Overdue (Pending Submission)', generatedAt: null },
      thankYouLetter: { generated: true, status: 'Approved', generatedAt: '2026-10-06', refNo: 'CO/TY/2026/058' }
    },
    feedbackRating: 4.7,
    eventPhotos: [
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&auto=format&fit=crop&q=80'
    ]
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif_1',
    targetRole: 'Activity Coordinator',
    recipient: 'Prof. Rajesh Verma',
    title: 'Overdue Activity Report',
    message: 'Event "International Seminar: Higher Education" held on Oct 5 is missing its Activity Report. Please follow up with Prof. Rahul Shinde.',
    type: 'warning',
    timestamp: '2 hours ago',
    unread: true,
    eventId: 'EVT-2026-004'
  },
  {
    id: 'notif_2',
    targetRole: 'Admin',
    recipient: 'Prof. Vaishnavi Chitragar',
    title: 'Report Pending Approval',
    message: 'Prof. Arvind Patil submitted the Activity Report for "One-Month Research Internship on Applied Machine Learning".',
    type: 'info',
    timestamp: '5 hours ago',
    unread: true,
    eventId: 'EVT-2026-002'
  },
  {
    id: 'notif_3',
    targetRole: 'Faculty Coordinator',
    recipient: 'Prof. Sneha Kulkarni',
    title: 'Upcoming Workshop Preparation',
    message: 'Reminder: Hands-on Workshop with Red Hat scheduled for Oct 24. Ensure attendance sheets and student rosters are ready.',
    type: 'success',
    timestamp: '1 day ago',
    unread: false,
    eventId: 'EVT-2026-003'
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: 'audit_1',
    user: 'Prof. Vaishnavi Chitragar',
    role: 'Admin',
    action: 'Approved Document',
    details: 'Approved Activity Report & Thank You Letter for EVT-2026-001 (PDLC Session)',
    timestamp: '2026-09-21 16:30'
  },
  {
    id: 'audit_2',
    user: 'Prof. Sneha Kulkarni',
    role: 'Faculty Coordinator',
    action: 'Generated Documents',
    details: 'Generated Flyer, Invitation Letter & Empty Attendance Sheet for EVT-2026-003 (Kubernetes Workshop)',
    timestamp: '2026-10-04 11:15'
  },
  {
    id: 'audit_3',
    user: 'Prof. Rajesh Verma',
    role: 'Activity Coordinator',
    action: 'Sent Reminder',
    details: 'Triggered urgent report submission reminder to Prof. Rahul Shinde for EVT-2026-004',
    timestamp: '2026-10-10 14:00'
  },
  {
    id: 'audit_4',
    user: 'Prof. Arvind Patil',
    role: 'Faculty Coordinator',
    action: 'Submitted Document',
    details: 'Submitted Activity Report for EVT-2026-002 (Research Internship) for review',
    timestamp: '2026-09-05 18:40'
  }
];
