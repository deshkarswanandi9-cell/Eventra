# Eventra 🎓
### College Activity & Event Documentation Automation System
**Department of Computer Engineering**

---

## 📌 Project Overview
**Eventra** is a centralized college event lifecycle and documentation automation platform tailored for academic departments. It solves the challenge of repetitive manual paperwork across faculty members, activity coordinators, and departmental administrators. 

Faculty Coordinators enter event details **once**, and the system automatically generates, formats, and maintains all standard departmental documents: **Event Flyers, Formal Invitation Letters, Student Attendance Sheets, Accredited Activity Reports, and Thank-You Letters**.

---

## 👥 Three Core Roles & Portals

1. **Department Admin (Head of Department)**
   - *Example: Prof. Vaishnavi Chitragar*
   - Oversees all department activities and compliance rates.
   - One-click document review, signature approval, and revision requests.
   - System audit trail and consolidated departmental report exports (CSV).

2. **Activity Coordinator**
   - *Example: Prof. Rajesh Verma*
   - Real-time event lifecycle tracker with multi-document completion checklists.
   - Identifies overdue submissions (e.g. pending attendance sheets or post-event reports).
   - Triggers automated reminder alerts to faculty coordinators.

3. **Faculty Coordinator**
   - *Example: Prof. Sneha Kulkarni & Prof. Arvind Patil*
   - Multi-step event creation wizard with dynamic category-specific fields (Expert Sessions, Workshops, Internships, Seminars).
   - Live document preview and customization center.
   - One-click document generation and submission for review.

---

## 📄 Core Feature: 5 Automatic Document Generation Engines

| Document | Format & Key Features | Accreditation Relevance |
| :--- | :--- | :--- |
| **1. Event Flyer / Poster** | High-res customizable themes (*Indigo, Emerald, Ruby, Cyber*), speaker profile, date/time chips, QR code. | Student Outreach & Notice Boards |
| **2. Formal Invitation Letter** | Official college letterhead, reference numbers, schedule breakdown, authorized signatory blocks. | Guest Speaker Communication |
| **3. Attendance Sheet** | Pre-populated student rosters (SE, TE, BE), interactive Present/Absent toggle, attendance metrics, CSV export. | NAAC Criterion 1 & 2 Verification |
| **4. Activity Report (Dossier)** | PO/PSO mapping, session proceedings, learning outcomes, student feedback ratings, geotagged photo captures. | NBA / NAAC Accreditation Dossier |
| **5. Formal Thank-You Letter** | Official letterhead, expression of gratitude, student impact notes, HOD signature. | Departmental Industry Relations |

---

## 💻 Tech Stack
- **Frontend**: React 19 + Vite
- **Styling**: Vanilla CSS Design System with CSS Custom Properties, Glassmorphism, and Print Stylesheets (`@media print`)
- **Icons**: Lucide React
- **Persistence**: LocalStorage with automatic audit trails and notifications
- **Exporting**: High-fidelity A4 document printing & CSV export

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/deshkarswanandi9-cell/Eventra.git

# Navigate to the project directory
cd Eventra

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be live at `http://localhost:5173/`.

---

## 🔑 Demo Coordinator Credentials

You can use the **1-Click Quick Sign-In** on the login screen or enter:

- **Admin (HOD)**: `v.chitragar@engg.edu` / `admin@eventra`
- **Activity Coordinator**: `r.verma@engg.edu` / `coord@eventra`
- **Faculty Coordinator**: `s.kulkarni@engg.edu` / `faculty@eventra`
- **Faculty Coordinator 2**: `a.patil@engg.edu` / `faculty@eventra`

---

## 🏛️ License
Developed for the Department of Computer Engineering.
