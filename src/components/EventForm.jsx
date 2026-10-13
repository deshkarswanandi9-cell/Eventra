import React, { useState } from 'react';
import { 
  PlusCircle, 
  Sparkles, 
  Calendar, 
  MapPin, 
  Clock, 
  User, 
  Users, 
  BookOpen, 
  CheckCircle,
  FileCheck,
  Building
} from 'lucide-react';

export function EventForm({ currentUser, onSaveEvent, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Expert Session',
    academicYear: '2026-2027',
    semester: 'Odd (Sem V & VII)',
    date: new Date().toISOString().split('T')[0],
    endDate: '',
    startTime: '10:00 AM',
    duration: '2 Hours',
    venue: 'Seminar Hall 3, Department of Computer Engineering',
    mode: 'Offline',
    organizingBody: 'Association of Computer Engineering Students (ACES)',
    facultyCoordinator: currentUser.name || 'Prof. Sneha Kulkarni',
    speakerName: '',
    speakerDesignation: '',
    speakerOrganization: '',
    speakerEmail: '',
    speakerPhone: '',
    speakerProfile: '',
    targetYears: ['TE', 'BE'],
    divisions: ['Div A', 'Div B'],
    expectedCount: 70,
    description: '',
    objectives: '1. Understand real-world enterprise architectures\n2. Bridge textbook theory with production software practices',
    outcomes: '1. Students will grasp modern industry deployment pipelines\n2. Familiarize with quality and security audit protocols',
    mappedPos: ['PO1', 'PO3', 'PO5', 'PSO1'],
    // Category specific
    internshipCompany: '',
    labRequirements: '',
    handsOnPrerequisites: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (field, item) => {
    setFormData(prev => {
      const current = prev[field];
      if (current.includes(item)) {
        return { ...prev, [field]: current.filter(x => x !== item) };
      } else {
        return { ...prev, [field]: [...current, item] };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setErrors({ title: 'Event title is required' });
      return;
    }
    if (!formData.speakerName.trim()) {
      setErrors({ speakerName: 'Resource speaker name is required' });
      return;
    }

    const newId = `EVT-2026-${String(Math.floor(Math.random() * 900) + 100)}`;
    
    const objectivesArray = formData.objectives.split('\n').filter(s => s.trim().length > 0);
    const outcomesArray = formData.outcomes.split('\n').filter(s => s.trim().length > 0);

    const newEvent = {
      id: newId,
      title: formData.title,
      category: formData.category,
      academicYear: formData.academicYear,
      semester: formData.semester,
      date: formData.date,
      endDate: formData.endDate || null,
      startTime: formData.startTime,
      duration: formData.duration,
      venue: formData.venue,
      mode: formData.mode,
      status: 'Scheduled',
      organizingBody: formData.organizingBody,
      facultyCoordinator: formData.facultyCoordinator,
      facultyCoordinatorId: currentUser.id,
      activityCoordinator: 'Prof. Rajesh Verma',
      adminSupervisor: 'Prof. Vaishnavi Chitragar',
      speaker: {
        name: formData.speakerName,
        designation: formData.speakerDesignation || 'Industry Specialist',
        organization: formData.speakerOrganization || 'Enterprise Tech',
        email: formData.speakerEmail || 'speaker@tech.org',
        phone: formData.speakerPhone || '+91 98000 12345',
        profile: formData.speakerProfile || 'Domain specialist in software architecture and modern cloud ecosystems.',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
      },
      participants: {
        targetYears: formData.targetYears,
        divisions: formData.divisions,
        expectedCount: parseInt(formData.expectedCount) || 60,
        actualAttended: 0
      },
      description: formData.description || 'Comprehensive interactive academic activity designed to impart industrial perspective and technical rigor.',
      objectives: objectivesArray.length > 0 ? objectivesArray : ['Understand core industry practices'],
      outcomes: outcomesArray.length > 0 ? outcomesArray : ['Students will apply modern concepts to real problems'],
      mappedPos: formData.mappedPos,
      documents: {
        flyer: { generated: true, status: 'Draft Ready', generatedAt: new Date().toISOString().split('T')[0] },
        invitationLetter: { generated: true, status: 'Draft Ready', generatedAt: new Date().toISOString().split('T')[0], refNo: `CO/GEN/${newId.replace('EVT-','')}` },
        attendanceSheet: { generated: true, status: 'Ready (Empty)', generatedAt: new Date().toISOString().split('T')[0], totalPresent: 0 },
        activityReport: { generated: false, status: 'Awaiting Event Execution', generatedAt: null },
        thankYouLetter: { generated: false, status: 'Draft', generatedAt: null, refNo: `CO/TY/${newId.replace('EVT-','')}` }
      },
      feedbackRating: null,
      eventPhotos: []
    };

    onSaveEvent(newEvent);
  };

  return (
    <div className="card animate-fade-in" style={{ maxWidth: '960px', margin: '0 auto', padding: '2rem', borderLeft: '5px solid var(--brand-maroon)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={20} color="var(--brand-maroon)" />
            <h2 style={{ fontSize: '1.4rem', color: '#111827', fontWeight: 800 }}>Create New Academic Activity / Event</h2>
          </div>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Enter details once. Eventra automatically generates the Flyer, Invitation Letter, Attendance Sheet, Report, and Thank-You Letter.
          </p>
        </div>
        <span className="badge badge-maroon">Coordinator: {currentUser.name}</span>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Basic Event Information */}
        <div style={{ marginBottom: '1.75rem' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--brand-maroon)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}>
            <BookOpen size={16} /> 1. Event Identification & Category
          </h3>
          
          <div className="form-group">
            <label className="form-label">Activity / Event Title *</label>
            <input 
              type="text" 
              name="title" 
              className="form-input" 
              placeholder="e.g. Masterclass: Real-Time Stream Processing with Apache Kafka"
              value={formData.title}
              onChange={handleChange}
              required
            />
            {errors.title && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.title}</span>}
          </div>

          <div className="grid-3">
            <div className="form-group">
              <label className="form-label">Activity Category</label>
              <select name="category" className="form-select" value={formData.category} onChange={handleChange}>
                <option value="Expert Session">Expert Session / Guest Lecture</option>
                <option value="Workshop">Hands-on Technical Workshop</option>
                <option value="Internship">Industry / Research Internship</option>
                <option value="Seminar">Academic / Career Seminar</option>
                <option value="Technical Activity">Coding Hackathon / Competition</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Academic Year</label>
              <select name="academicYear" className="form-select" value={formData.academicYear} onChange={handleChange}>
                <option value="2026-2027">2026-2027</option>
                <option value="2025-2026">2025-2026</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Semester</label>
              <select name="semester" className="form-select" value={formData.semester} onChange={handleChange}>
                <option value="Odd (Sem V & VII)">Odd (Sem V & VII)</option>
                <option value="Even (Sem VI & VIII)">Even (Sem VI & VIII)</option>
                <option value="Odd (Sem III)">Odd (Sem III - SE)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Date, Time & Venue */}
        <div style={{ marginBottom: '1.75rem' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--brand-maroon)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}>
            <Calendar size={16} /> 2. Schedule, Timing & Location
          </h3>

          <div className="grid-4">
            <div className="form-group">
              <label className="form-label">Event Date *</label>
              <input type="date" name="date" className="form-input" value={formData.date} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label className="form-label">Start Time</label>
              <input type="text" name="startTime" className="form-input" placeholder="e.g. 10:30 AM" value={formData.startTime} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label className="form-label">Duration</label>
              <input type="text" name="duration" className="form-input" placeholder="e.g. 2 Hours" value={formData.duration} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label className="form-label">Mode</label>
              <select name="mode" className="form-select" value={formData.mode} onChange={handleChange}>
                <option value="Offline">Offline (Campus)</option>
                <option value="Hybrid">Hybrid (Classroom + Teams)</option>
                <option value="Online">Online (Google Meet / Zoom)</option>
              </select>
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Venue / Room</label>
              <input type="text" name="venue" className="form-input" placeholder="e.g. Seminar Hall 3 / Lab 5" value={formData.venue} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label className="form-label">Organizing Body / Student Chapter</label>
              <input type="text" name="organizingBody" className="form-input" placeholder="e.g. ACES / CSI Student Branch" value={formData.organizingBody} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Resource Person / Speaker Details */}
        <div style={{ marginBottom: '1.75rem' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--brand-maroon)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}>
            <User size={16} /> 3. Resource Person / Guest Details
          </h3>

          <div className="grid-3">
            <div className="form-group">
              <label className="form-label">Speaker Name *</label>
              <input 
                type="text" 
                name="speakerName" 
                className="form-input" 
                placeholder="e.g. Ms. Rohini More / Dr. Sameer Patil" 
                value={formData.speakerName} 
                onChange={handleChange} 
                required 
              />
              {errors.speakerName && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.speakerName}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Designation</label>
              <input type="text" name="speakerDesignation" className="form-input" placeholder="e.g. Principal Consultant" value={formData.speakerDesignation} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label className="form-label">Organization / Company</label>
              <input type="text" name="speakerOrganization" className="form-input" placeholder="e.g. Deloitte Pune / Red Hat" value={formData.speakerOrganization} onChange={handleChange} />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Speaker Email</label>
              <input type="email" name="speakerEmail" className="form-input" placeholder="speaker@deloitte.com" value={formData.speakerEmail} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label className="form-label">Speaker Phone</label>
              <input type="text" name="speakerPhone" className="form-input" placeholder="+91 98220 00000" value={formData.speakerPhone} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Speaker Profile / Brief Bio</label>
            <textarea 
              name="speakerProfile" 
              className="form-textarea" 
              placeholder="Highlight years of industry expertise, domains, patent portfolio, or past roles..."
              value={formData.speakerProfile} 
              onChange={handleChange} 
            />
          </div>
        </div>

        {/* Dynamic Category Specific Fields */}
        {formData.category === 'Internship' && (
          <div style={{ 
            marginBottom: '1.75rem', 
            background: 'rgba(6, 182, 212, 0.08)', 
            border: '1px solid rgba(6, 182, 212, 0.25)', 
            padding: '1.25rem', 
            borderRadius: 'var(--radius-md)' 
          }}>
            <h4 style={{ fontSize: '0.9rem', color: '#06b6d4', marginBottom: '0.75rem' }}>
              Internship Specific Fields:
            </h4>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Internship End Date</label>
                <input type="date" name="endDate" className="form-input" value={formData.endDate} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Collaborating Industry / Lab</label>
                <input type="text" name="internshipCompany" className="form-input" placeholder="e.g. CAAI Research Labs" value={formData.internshipCompany} onChange={handleChange} />
              </div>
            </div>
          </div>
        )}

        {formData.category === 'Workshop' && (
          <div style={{ 
            marginBottom: '1.75rem', 
            background: 'rgba(99, 102, 241, 0.08)', 
            border: '1px solid rgba(99, 102, 241, 0.25)', 
            padding: '1.25rem', 
            borderRadius: 'var(--radius-md)' 
          }}>
            <h4 style={{ fontSize: '0.9rem', color: '#818cf8', marginBottom: '0.75rem' }}>
              Workshop Hands-on Prerequisites:
            </h4>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Software / Environment Setup</label>
                <input type="text" name="labRequirements" className="form-input" placeholder="e.g. Docker Desktop, Minikube, VS Code" value={formData.labRequirements} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Pre-requisite Courses</label>
                <input type="text" name="handsOnPrerequisites" className="form-input" placeholder="e.g. Linux Basics, Computer Networks" value={formData.handsOnPrerequisites} onChange={handleChange} />
              </div>
            </div>
          </div>
        )}

        {/* Target Students & Objectives */}
        <div style={{ marginBottom: '1.75rem' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--brand-maroon)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}>
            <Users size={16} /> 4. Participants, Objectives & POs
          </h3>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Target Classes (Select all that apply)</label>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.4rem' }}>
                {['SE', 'TE', 'BE'].map(yr => (
                  <label key={yr} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                    <input 
                      type="checkbox" 
                      checked={formData.targetYears.includes(yr)} 
                      onChange={() => handleCheckboxChange('targetYears', yr)} 
                    />
                    {yr} Computer
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Target Divisions</label>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.4rem' }}>
                {['Div A', 'Div B'].map(div => (
                  <label key={div} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                    <input 
                      type="checkbox" 
                      checked={formData.divisions.includes(div)} 
                      onChange={() => handleCheckboxChange('divisions', div)} 
                    />
                    {div}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Program Objectives (One per line)</label>
            <textarea 
              name="objectives" 
              className="form-textarea" 
              rows={3} 
              value={formData.objectives} 
              onChange={handleChange} 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Expected Learning Outcomes (One per line)</label>
            <textarea 
              name="outcomes" 
              className="form-textarea" 
              rows={3} 
              value={formData.outcomes} 
              onChange={handleChange} 
            />
          </div>
        </div>

        {/* Submit Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary btn-lg">
            <Sparkles size={18} />
            Save Event & Generate All Documents
          </button>
        </div>
      </form>
    </div>
  );
}
