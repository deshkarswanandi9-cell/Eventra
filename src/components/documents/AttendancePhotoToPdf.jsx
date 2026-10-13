import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  FileText, 
  Image as ImageIcon, 
  RotateCw, 
  RotateCcw, 
  Sliders, 
  Sparkles, 
  Download, 
  Save, 
  RefreshCw, 
  Eye, 
  Trash2, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Check, 
  Layers, 
  MoveLeft, 
  MoveRight,
  ExternalLink,
  ChevronDown,
  ShieldCheck,
  Maximize2,
  FileCheck2
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { documentsService } from '../../services/documentsService';

// Helper to sanitize filename
export const sanitizeFileName = (eventName, date) => {
  const cleanName = (eventName || 'Event')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/_+/g, '_')
    .substring(0, 32);
  const cleanDate = date || new Date().toISOString().split('T')[0];
  return `${cleanName}_Attendance_${cleanDate}.pdf`;
};

// Helper to load image
const loadImage = (url) => new Promise((resolve, reject) => {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => resolve(img);
  img.onerror = reject;
  img.src = url;
});

// Canvas image enhancement processor
function processImageToCanvas(img, settings) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const {
    rotation = 0,
    brightness = 0,
    contrast = 0,
    scanFilter = 'none',
    cropMargins = { top: 0, bottom: 0, left: 0, right: 0 },
    perspectiveTilt = 0
  } = settings;

  // Calculate crop rectangle
  const cropL = (cropMargins.left / 100) * img.width;
  const cropR = (cropMargins.right / 100) * img.width;
  const cropT = (cropMargins.top / 100) * img.height;
  const cropB = (cropMargins.bottom / 100) * img.height;

  const sWidth = Math.max(20, img.width - cropL - cropR);
  const sHeight = Math.max(20, img.height - cropT - cropB);

  // Rotation setup
  const isRotated = rotation === 90 || rotation === 270;
  canvas.width = isRotated ? sHeight : sWidth;
  canvas.height = isRotated ? sWidth : sHeight;

  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((rotation * Math.PI) / 180);

  // Perspective keystone tilt
  if (perspectiveTilt !== 0) {
    const skewRad = (perspectiveTilt * Math.PI) / 180;
    ctx.transform(1, 0, Math.tan(skewRad), 1, 0, 0);
  }

  const drawW = isRotated ? canvas.height : canvas.width;
  const drawH = isRotated ? canvas.width : canvas.height;

  ctx.drawImage(img, cropL, cropT, sWidth, sHeight, -drawW / 2, -drawH / 2, drawW, drawH);
  ctx.restore();

  // Apply Pixel Filters (Brightness, Contrast, Document Scanner)
  if (brightness !== 0 || contrast !== 0 || scanFilter !== 'none') {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const d = imageData.data;

    // Contrast factor
    const cFactor = (259 * (contrast + 255)) / (255 * (259 - contrast));
    const bOffset = brightness * 1.28;

    for (let i = 0; i < d.length; i += 4) {
      const r = d[i];
      const g = d[i + 1];
      const b = d[i + 2];
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;

      if (scanFilter === 'scan_bw') {
        // High-contrast clean paper effect: highlights pen strokes while flattening page background
        let val = gray + bOffset;
        val = cFactor * (val - 128) + 128;
        const bw = val > 145 ? 255 : (val < 85 ? 0 : val * 0.7);
        d[i] = bw;
        d[i + 1] = bw;
        d[i + 2] = bw;
      } else if (scanFilter === 'grayscale') {
        let val = gray + bOffset;
        val = cFactor * (val - 128) + 128;
        val = Math.max(0, Math.min(255, val));
        d[i] = val;
        d[i + 1] = val;
        d[i + 2] = val;
      } else if (scanFilter === 'enhanced') {
        // Boost contrast & vibrancy for multi-colored pens and college stamps
        d[i] = Math.max(0, Math.min(255, cFactor * (r + bOffset - 128) + 128));
        d[i + 1] = Math.max(0, Math.min(255, cFactor * (g + bOffset - 128) + 128));
        d[i + 2] = Math.max(0, Math.min(255, cFactor * (b + bOffset - 128) + 128));
      } else {
        d[i] = Math.max(0, Math.min(255, cFactor * (r + bOffset - 128) + 128));
        d[i + 1] = Math.max(0, Math.min(255, cFactor * (g + bOffset - 128) + 128));
        d[i + 2] = Math.max(0, Math.min(255, cFactor * (b + bOffset - 128) + 128));
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }

  return canvas;
}

export function AttendancePhotoToPdf({
  event,
  events = [],
  onSelectEvent,
  currentUser,
  onUpdateEventDocStatus
}) {
  const [pages, setPages] = useState([]);
  const [selectedPageIndex, setSelectedPageIndex] = useState(0);
  const [workflowStep, setWorkflowStep] = useState(1); // 1: Upload, 2: Preview & Adjust, 3: PDF Ready
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfFileName, setPdfFileName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);
  const previewCanvasRef = useRef(null);

  const isFaculty = currentUser?.role === 'Faculty Coordinator' || currentUser?.role === 'Admin';
  const currentEvent = event || (events.length > 0 ? events[0] : null);
  const existingAttendanceDoc = currentEvent?.documents?.attendanceSheet;

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      pages.forEach(p => {
        if (p.originalUrl && p.originalUrl.startsWith('blob:')) {
          URL.revokeObjectURL(p.originalUrl);
        }
      });
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, []);

  // Update live canvas preview when selected page adjustments change
  useEffect(() => {
    if (workflowStep !== 2 || pages.length === 0 || !pages[selectedPageIndex]) return;

    let isCancelled = false;
    const page = pages[selectedPageIndex];

    loadImage(page.originalUrl)
      .then(img => {
        if (isCancelled) return;
        const canvas = processImageToCanvas(img, page);
        const targetCanvas = previewCanvasRef.current;
        if (targetCanvas) {
          targetCanvas.width = canvas.width;
          targetCanvas.height = canvas.height;
          const ctx = targetCanvas.getContext('2d');
          ctx.drawImage(canvas, 0, 0);
        }
      })
      .catch(err => {
        console.warn('Canvas preview render error:', err);
      });

    return () => {
      isCancelled = true;
    };
  }, [pages, selectedPageIndex, workflowStep]);

  // Handle file uploads (JPG, PNG, HEIC)
  const handleFilesAdded = (fileList) => {
    setErrorMsg('');
    setSuccessMsg('');

    if (!currentEvent) {
      setErrorMsg('Please select an event before uploading attendance sheets.');
      return;
    }

    const validFiles = [];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/heic', 'image/heif'];

    Array.from(fileList).forEach(file => {
      // Check type or extension
      const ext = file.name.split('.').pop().toLowerCase();
      const isHeic = ext === 'heic' || ext === 'heif';
      const isAllowed = allowedTypes.includes(file.type) || ['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif'].includes(ext);

      if (!isAllowed) {
        setErrorMsg(`Unsupported file type: "${file.name}". Please upload JPG, PNG, or JPEG photographs.`);
        return;
      }

      if (file.size > 25 * 1024 * 1024) {
        setErrorMsg(`File "${file.name}" exceeds the 25MB upload limit.`);
        return;
      }

      validFiles.push({
        id: `page_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        file,
        name: file.name,
        originalUrl: URL.createObjectURL(file),
        rotation: 0,
        brightness: 0,
        contrast: 0,
        scanFilter: 'scan_bw', // default to high-contrast document scan for crisp sheet readability
        cropMargins: { top: 0, bottom: 0, left: 0, right: 0 },
        perspectiveTilt: 0
      });
    });

    if (validFiles.length > 0) {
      setPages(prev => [...prev, ...validFiles]);
      setWorkflowStep(2);
      setSelectedPageIndex(pages.length); // select first newly added page
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesAdded(e.dataTransfer.files);
    }
  };

  // Page Adjustment Modifiers
  const updateCurrentPage = (updates) => {
    setPages(prev => prev.map((p, idx) => idx === selectedPageIndex ? { ...p, ...updates } : p));
  };

  const rotatePage = (degrees) => {
    const cur = pages[selectedPageIndex];
    if (!cur) return;
    const nextRot = (cur.rotation + degrees + 360) % 360;
    updateCurrentPage({ rotation: nextRot });
  };

  const movePageOrder = (fromIdx, toIdx) => {
    if (toIdx < 0 || toIdx >= pages.length) return;
    setPages(prev => {
      const copy = [...prev];
      const [item] = copy.splice(fromIdx, 1);
      copy.splice(toIdx, 0, item);
      return copy;
    });
    setSelectedPageIndex(toIdx);
  };

  const removePage = (idx) => {
    setPages(prev => {
      const copy = [...prev];
      const removed = copy.splice(idx, 1)[0];
      if (removed && removed.originalUrl.startsWith('blob:')) {
        URL.revokeObjectURL(removed.originalUrl);
      }
      return copy;
    });

    if (pages.length <= 1) {
      setWorkflowStep(1);
      setSelectedPageIndex(0);
    } else {
      setSelectedPageIndex(Math.max(0, idx - 1));
    }
  };

  // Generate Attendance PDF via client-side jsPDF
  const handleGeneratePdf = async () => {
    if (pages.length === 0) {
      setErrorMsg('Please upload at least one photograph of the attendance sheet.');
      return;
    }

    if (!currentEvent) {
      setErrorMsg('No event selected. Please choose the associated event.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg('');

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = 210;
      const pageHeight = 297;
      const marginX = 10;
      const marginY = 12;
      const printableW = pageWidth - (marginX * 2);
      const printableH = pageHeight - (marginY * 2);

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const img = await loadImage(page.originalUrl);
        const canvas = processImageToCanvas(img, page);

        // Constrain canvas dimensions to prevent browser memory issues while preserving 300dpi detail
        const maxDim = 2400;
        let finalCanvas = canvas;
        if (canvas.width > maxDim || canvas.height > maxDim) {
          const scale = maxDim / Math.max(canvas.width, canvas.height);
          const scaledCanvas = document.createElement('canvas');
          scaledCanvas.width = Math.round(canvas.width * scale);
          scaledCanvas.height = Math.round(canvas.height * scale);
          const sCtx = scaledCanvas.getContext('2d');
          sCtx.drawImage(canvas, 0, 0, scaledCanvas.width, scaledCanvas.height);
          finalCanvas = scaledCanvas;
        }

        const imgData = finalCanvas.toDataURL('image/jpeg', 0.92);

        if (i > 0) {
          doc.addPage('a4', 'portrait');
        }

        // Calculate aspect ratio so the physical sheet is never stretched
        const imgRatio = finalCanvas.width / finalCanvas.height;
        const printableRatio = printableW / printableH;

        let destW, destH;
        if (imgRatio > printableRatio) {
          destW = printableW;
          destH = printableW / imgRatio;
        } else {
          destH = printableH;
          destW = printableH * imgRatio;
        }

        const posX = marginX + (printableW - destW) / 2;
        const posY = marginY + (printableH - destH) / 2;

        doc.addImage(imgData, 'JPEG', posX, posY, destW, destH, undefined, 'FAST');

        // Document header stamp for NAAC compliance
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(30, 41, 59);
        doc.text(
          `DEPARTMENT OF COMPUTER ENGINEERING • VERIFIED PHYSICAL ATTENDANCE ROSTER`,
          marginX,
          7
        );

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(100, 116, 139);
        doc.text(
          `Event: ${currentEvent.title.substring(0, 50)} • ID: ${currentEvent.id} • Page ${i + 1} of ${pages.length}`,
          marginX,
          pageHeight - 5
        );
      }

      const generatedBlob = doc.output('blob');
      const blobUrl = URL.createObjectURL(generatedBlob);
      const fileName = sanitizeFileName(currentEvent.title, currentEvent.date);

      setPdfBlob(generatedBlob);
      setPdfUrl(blobUrl);
      setPdfFileName(fileName);
      setWorkflowStep(3);
      setSuccessMsg(`PDF successfully generated (${pages.length} page${pages.length > 1 ? 's' : ''})!`);
    } catch (err) {
      console.error('PDF Generation failed:', err);
      setErrorMsg('Failed to generate PDF: ' + (err.message || 'Error processing photographs.'));
    } finally {
      setIsProcessing(false);
    }
  };

  // Download PDF locally
  const handleDownloadPdf = () => {
    if (!pdfBlob || !pdfFileName) return;
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = pdfFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Save PDF to Supabase Storage and register in documents table
  const handleSaveToEventDocuments = async () => {
    if (!pdfBlob || !currentEvent) return;

    setIsSaving(true);
    setErrorMsg('');

    try {
      const storagePath = `${currentEvent.id}/attendance_${Date.now()}_${pdfFileName}`;
      
      // Upload to private Supabase Storage bucket 'event-documents'
      await documentsService.uploadFile('event-documents', storagePath, pdfBlob);

      // Save document record in documents table
      await documentsService.recordDocumentUpload(
        currentEvent.id,
        'attendance_sheet',
        pdfFileName,
        storagePath,
        {
          pagesCount: pages.length,
          generatedVia: 'photo-to-pdf-scanner',
          generatedAt: new Date().toISOString(),
          generatedBy: currentUser?.name || 'Faculty Coordinator'
        }
      );

      // Update parent event state to 'Approved' or 'Submitted'
      if (onUpdateEventDocStatus) {
        onUpdateEventDocStatus(currentEvent.id, 'attendanceSheet', 'Approved');
      }

      setSuccessMsg(`Attendance Sheet PDF saved to Supabase Storage and linked to ${currentEvent.id}!`);
    } catch (err) {
      console.error('Error saving attendance PDF to Supabase:', err);
      setErrorMsg('Failed to save to Supabase: ' + (err.message || 'Check storage permissions.'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setPages([]);
    setSelectedPageIndex(0);
    setWorkflowStep(1);
    setPdfBlob(null);
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    setPdfUrl(null);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const curPage = pages[selectedPageIndex];

  return (
    <div className="card" style={{
      background: '#ffffff',
      border: '1px solid var(--border-subtle)',
      boxShadow: 'var(--shadow-sm)',
      padding: '1.75rem',
      borderRadius: 'var(--radius-lg)',
      marginBottom: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem'
    }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              background: 'var(--brand-maroon)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(138, 58, 58, 0.25)'
            }}>
              <FileCheck2 size={20} color="#ffffff" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827' }}>
                Upload Attendance Sheet
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                Capture or upload photographs of signed physical attendance sheets → convert into an official high-resolution PDF dossier.
              </p>
            </div>
          </div>
        </div>

        {/* Event Association Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Associated Event:</span>
          {events.length > 0 && onSelectEvent ? (
            <select
              value={currentEvent?.id}
              onChange={(e) => onSelectEvent(e.target.value)}
              className="form-select"
              style={{ width: 'auto', minWidth: '220px', padding: '0.35rem 0.75rem', fontSize: '0.8rem', height: '36px' }}
            >
              {events.map(ev => (
                <option key={ev.id} value={ev.id}>
                  {ev.id}: {ev.title.substring(0, 32)}...
                </option>
              ))}
            </select>
          ) : (
            <span className="badge badge-maroon">{currentEvent?.id}</span>
          )}
        </div>
      </div>

      {/* Clear 4-Step Visual Workflow Progress Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '0.5rem',
        background: '#f8fafc',
        padding: '0.5rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid #e2e8f0'
      }}>
        {[
          { step: 1, title: '1. Upload Photograph', desc: 'Single or multi-page sheets' },
          { step: 2, title: '2. Preview & Adjust', desc: 'Rotate, crop & scan filter' },
          { step: 3, title: '3. Generate PDF', desc: 'A4 formatted vector document' },
          { step: 4, title: '4. Download / Save', desc: 'Persist to Supabase Storage' }
        ].map(s => {
          const isActive = (workflowStep === s.step) || (workflowStep === 3 && s.step === 4);
          const isDone = workflowStep > s.step;

          return (
            <div
              key={s.step}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.5rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                background: isActive ? '#ffffff' : 'transparent',
                border: `1px solid ${isActive ? 'var(--brand-maroon)' : 'transparent'}`,
                color: isActive ? 'var(--brand-maroon)' : isDone ? '#059669' : 'var(--text-muted)',
                boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: isDone ? '#059669' : isActive ? 'var(--brand-maroon)' : '#cbd5e1',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 700,
                flexShrink: 0
              }}>
                {isDone ? <Check size={13} /> : s.step}
              </div>
              <div style={{ lineHeight: 1.25, overflow: 'hidden' }}>
                <div style={{ fontSize: '0.785rem', fontWeight: isActive ? 700 : 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                  {s.title}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-subtle)', whiteSpace: 'nowrap' }}>
                  {s.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Notifications / Feedback Alerts */}
      {errorMsg && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.35)',
          borderRadius: 'var(--radius-md)',
          padding: '0.75rem 1rem',
          color: '#f87171',
          fontSize: '0.8rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem'
        }}>
          <AlertCircle size={16} style={{ flexShrink: 0 }} />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          borderRadius: 'var(--radius-md)',
          padding: '0.75rem 1rem',
          color: '#34d399',
          fontSize: '0.8rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem'
        }}>
          <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Existing Saved Attendance PDF Notice */}
      {existingAttendanceDoc?.storagePath && (
        <div style={{
          background: 'rgba(6, 182, 212, 0.08)',
          border: '1px solid rgba(6, 182, 212, 0.25)',
          borderRadius: 'var(--radius-md)',
          padding: '0.65rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.6rem',
          fontSize: '0.8rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#67e8f9' }}>
            <ShieldCheck size={16} />
            <span>
              Archived Attendance Sheet PDF exists in Supabase: <strong>{existingAttendanceDoc.fileName || 'Attendance.pdf'}</strong>
            </span>
          </div>
          <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
            Status: {existingAttendanceDoc.status || 'Approved'}
          </span>
        </div>
      )}

      {/* STEP 1: UPLOAD DRAG-AND-DROP AREA */}
      {workflowStep === 1 && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${isDragging ? 'var(--brand-maroon)' : '#cbd5e1'}`,
            background: isDragging ? 'var(--brand-maroon-light)' : '#f9fafb',
            borderRadius: 'var(--radius-lg)',
            padding: '2.5rem 1.5rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            multiple
            accept="image/jpeg,image/png,image/jpg,image/webp,image/heic,image/heif"
            style={{ display: 'none' }}
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFilesAdded(e.target.files);
              }
            }}
          />

          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'var(--brand-maroon-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--brand-maroon)',
            border: '1px solid var(--brand-maroon-border)'
          }}>
            <Upload size={28} />
          </div>

          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111827', marginBottom: '0.25rem' }}>
              Drag & Drop Attendance Sheet Photographs Here
            </h4>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Or click to browse from your computer, camera, or mobile device. Supports <strong>JPG, JPEG, PNG</strong> & multi-page sheets.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            style={{ pointerEvents: 'none' }}
          >
            <Upload size={16} />
            Select Photograph(s)
          </button>
        </div>
      )}

      {/* STEP 2: PREVIEW & ADJUST MULTI-PAGE PHOTOGRAPHS */}
      {workflowStep === 2 && curPage && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Multi-page Thumbnail Strip & Page Switcher */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#0c1322',
            padding: '0.6rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            flexWrap: 'wrap',
            gap: '0.6rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.2rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Pages ({pages.length}):</span>
              {pages.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPageIndex(idx)}
                  className={`btn btn-sm ${selectedPageIndex === idx ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem' }}
                >
                  Page {idx + 1}
                </button>
              ))}

              {/* Add another page button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                title="Add photograph for another page"
              >
                <Plus size={13} />
                Add Page
              </button>
            </div>

            {/* Page order controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <button
                disabled={selectedPageIndex === 0}
                onClick={() => movePageOrder(selectedPageIndex, selectedPageIndex - 1)}
                className="btn btn-secondary btn-sm"
                title="Move page left"
              >
                <MoveLeft size={13} />
              </button>
              <button
                disabled={selectedPageIndex === pages.length - 1}
                onClick={() => movePageOrder(selectedPageIndex, selectedPageIndex + 1)}
                className="btn btn-secondary btn-sm"
                title="Move page right"
              >
                <MoveRight size={13} />
              </button>
              <button
                onClick={() => removePage(selectedPageIndex)}
                className="btn btn-danger btn-sm"
                title="Remove this page"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>

          {/* Two-Column Editor: Controls on left, Live Canvas Preview on right */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.35fr',
            gap: '1.25rem',
            alignItems: 'start'
          }}>
            {/* Left Column: Adjustment Controls */}
            <div className="card" style={{
              background: '#0e1726',
              border: '1px solid var(--border-subtle)',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '0.6rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#818cf8', textTransform: 'uppercase' }}>
                  Page {selectedPageIndex + 1} Adjustments
                </span>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff' }}>
                  {curPage.name}
                </div>
              </div>

              {/* 1. Rotation Tool */}
              <div>
                <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '0.35rem' }}>
                  Rotate Orientation:
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => rotatePage(-90)}
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
                  >
                    <RotateCcw size={14} /> -90°
                  </button>
                  <button
                    onClick={() => rotatePage(90)}
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
                  >
                    <RotateCw size={14} /> +90°
                  </button>
                  <span className="badge badge-neutral" style={{ alignSelf: 'center', fontSize: '0.72rem' }}>
                    {curPage.rotation}°
                  </span>
                </div>
              </div>

              {/* 2. Document Scan Effect Filter */}
              <div>
                <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '0.35rem' }}>
                  Document Scan Effect:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.4rem' }}>
                  {[
                    { id: 'scan_bw', label: 'Scanner B&W', desc: 'Crisp paper & pen' },
                    { id: 'enhanced', label: 'Color Enhanced', desc: 'Vibrant stamps/pens' },
                    { id: 'grayscale', label: 'Grayscale', desc: 'Neutral gray' },
                    { id: 'none', label: 'Original Photo', desc: 'No enhancement' }
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => updateCurrentPage({ scanFilter: f.id })}
                      style={{
                        padding: '0.45rem 0.6rem',
                        borderRadius: 'var(--radius-sm)',
                        border: curPage.scanFilter === f.id ? '1px solid #818cf8' : '1px solid rgba(255, 255, 255, 0.08)',
                        background: curPage.scanFilter === f.id ? 'rgba(79, 70, 229, 0.25)' : 'rgba(255, 255, 255, 0.02)',
                        color: curPage.scanFilter === f.id ? '#ffffff' : 'var(--text-muted)',
                        fontSize: '0.75rem',
                        fontWeight: curPage.scanFilter === f.id ? 700 : 500,
                        textAlign: 'left',
                        cursor: 'pointer'
                      }}
                    >
                      <div>{f.label}</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-subtle)' }}>{f.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Brightness Slider */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                  <span>Brightness:</span>
                  <span style={{ color: '#818cf8', fontWeight: 600 }}>{curPage.brightness > 0 ? `+${curPage.brightness}` : curPage.brightness}</span>
                </div>
                <input
                  type="range"
                  min="-60"
                  max="60"
                  value={curPage.brightness}
                  onChange={(e) => updateCurrentPage({ brightness: parseInt(e.target.value) })}
                  style={{ width: '100%', cursor: 'pointer' }}
                />
              </div>

              {/* 4. Contrast Slider */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                  <span>Contrast:</span>
                  <span style={{ color: '#818cf8', fontWeight: 600 }}>{curPage.contrast > 0 ? `+${curPage.contrast}` : curPage.contrast}</span>
                </div>
                <input
                  type="range"
                  min="-60"
                  max="60"
                  value={curPage.contrast}
                  onChange={(e) => updateCurrentPage({ contrast: parseInt(e.target.value) })}
                  style={{ width: '100%', cursor: 'pointer' }}
                />
              </div>

              {/* 5. Perspective Tilt Correction */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                  <span>Perspective Tilt Correction:</span>
                  <span style={{ color: '#06b6d4', fontWeight: 600 }}>{curPage.perspectiveTilt}°</span>
                </div>
                <input
                  type="range"
                  min="-15"
                  max="15"
                  value={curPage.perspectiveTilt}
                  onChange={(e) => updateCurrentPage({ perspectiveTilt: parseInt(e.target.value) })}
                  style={{ width: '100%', cursor: 'pointer' }}
                />
              </div>

              {/* 6. Crop Margins (Trimming table desk/unwanted edges) */}
              <div>
                <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '0.35rem' }}>
                  Trim Unwanted Border Margins:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', fontSize: '0.72rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-subtle)' }}>Top: {curPage.cropMargins.top}%</span>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      value={curPage.cropMargins.top}
                      onChange={(e) => updateCurrentPage({ cropMargins: { ...curPage.cropMargins, top: parseInt(e.target.value) } })}
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-subtle)' }}>Bottom: {curPage.cropMargins.bottom}%</span>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      value={curPage.cropMargins.bottom}
                      onChange={(e) => updateCurrentPage({ cropMargins: { ...curPage.cropMargins, bottom: parseInt(e.target.value) } })}
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-subtle)' }}>Left: {curPage.cropMargins.left}%</span>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      value={curPage.cropMargins.left}
                      onChange={(e) => updateCurrentPage({ cropMargins: { ...curPage.cropMargins, left: parseInt(e.target.value) } })}
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-subtle)' }}>Right: {curPage.cropMargins.right}%</span>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      value={curPage.cropMargins.right}
                      onChange={(e) => updateCurrentPage({ cropMargins: { ...curPage.cropMargins, right: parseInt(e.target.value) } })}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              </div>

              {/* Reset this page button */}
              <button
                onClick={() => updateCurrentPage({
                  rotation: 0,
                  brightness: 0,
                  contrast: 0,
                  scanFilter: 'none',
                  perspectiveTilt: 0,
                  cropMargins: { top: 0, bottom: 0, left: 0, right: 0 }
                })}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.72rem' }}
              >
                <RefreshCw size={12} /> Reset Page Adjustments
              </button>
            </div>

            {/* Right Column: Real-Time Canvas Preview */}
            <div style={{
              background: '#090e17',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '380px'
            }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Eye size={13} color="#818cf8" />
                <span>Live Filter Preview (Page {selectedPageIndex + 1} of {pages.length})</span>
              </div>

              <div style={{
                maxWidth: '100%',
                maxHeight: '440px',
                overflow: 'hidden',
                borderRadius: '6px',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.7)',
                background: '#ffffff'
              }}>
                <canvas
                  ref={previewCanvasRef}
                  style={{
                    display: 'block',
                    maxWidth: '100%',
                    maxHeight: '420px',
                    height: 'auto',
                    objectFit: 'contain'
                  }}
                />
              </div>

              <div style={{ fontSize: '0.68rem', color: 'var(--text-subtle)', marginTop: '0.75rem', textAlign: 'center' }}>
                ✓ Original student signatures, handwriting, and roll numbers are preserved with high contrast.
              </div>
            </div>
          </div>

          {/* Action Bar: Proceed to Generate PDF */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '1rem',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}>
            <button
              onClick={handleReset}
              className="btn btn-secondary btn-sm"
            >
              Start Over
            </button>

            <button
              onClick={handleGeneratePdf}
              disabled={isProcessing}
              className="btn btn-primary btn-lg"
              style={{
                background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
                boxShadow: '0 4px 15px rgba(79, 70, 229, 0.4)'
              }}
            >
              {isProcessing ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Processing & Generating PDF...
                </>
              ) : (
                <>
                  <FileText size={17} />
                  Generate Attendance PDF ({pages.length} Page{pages.length > 1 ? 's' : ''})
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 & 4: PDF GENERATED - PREVIEW, DOWNLOAD & SAVE TO SUPABASE */}
      {workflowStep === 3 && pdfUrl && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.05)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
          {/* Success Banner */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#10b981'
              }}>
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>
                  Attendance PDF Ready
                </h4>
                <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                  {pdfFileName} • {pages.length} Page{pages.length > 1 ? 's' : ''} (A4 Portrait)
                </div>
              </div>
            </div>

            {/* Actions Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setShowPdfModal(true)}
                className="btn btn-secondary btn-sm"
              >
                <Eye size={14} />
                Preview PDF
              </button>

              <button
                onClick={handleDownloadPdf}
                className="btn btn-secondary btn-sm"
              >
                <Download size={14} />
                Download PDF
              </button>

              {isFaculty && (
                <button
                  onClick={handleSaveToEventDocuments}
                  disabled={isSaving}
                  className="btn btn-success btn-sm"
                >
                  <Save size={14} />
                  {isSaving ? 'Uploading to Supabase Storage...' : 'Save to Event Documents'}
                </button>
              )}

              <button
                onClick={() => setWorkflowStep(2)}
                className="btn btn-secondary btn-sm"
              >
                <Sliders size={14} />
                Adjust Again
              </button>

              <button
                onClick={handleReset}
                className="btn btn-secondary btn-sm"
              >
                <RefreshCw size={14} />
                Upload New
              </button>
            </div>
          </div>

          {/* Embedded PDF Preview Frame */}
          <div style={{
            background: '#090e17',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
              <span style={{ fontSize: '0.785rem', color: 'var(--text-muted)' }}>
                PDF Document Preview (A4 Vector Embed):
              </span>
              <a
                href={pdfUrl}
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: '0.75rem', color: '#818cf8', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
              >
                Open Fullscreen <ExternalLink size={12} />
              </a>
            </div>

            <iframe
              src={pdfUrl}
              title="Attendance Sheet PDF Preview"
              style={{
                width: '100%',
                height: '460px',
                border: 'none',
                borderRadius: '4px',
                background: '#525659'
              }}
            />
          </div>
        </div>
      )}

      {/* PDF Fullscreen Modal */}
      {showPdfModal && pdfUrl && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(6px)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          padding: '1.5rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.75rem',
            color: '#ffffff'
          }}>
            <div style={{ fontWeight: 600 }}>{pdfFileName}</div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={handleDownloadPdf} className="btn btn-primary btn-sm">
                <Download size={14} /> Download
              </button>
              <button onClick={() => setShowPdfModal(false)} className="btn btn-secondary btn-sm">
                Close Preview
              </button>
            </div>
          </div>
          <iframe
            src={pdfUrl}
            title="Attendance Sheet Full Preview"
            style={{ width: '100%', flex: 1, border: 'none', borderRadius: '8px' }}
          />
        </div>
      )}
    </div>
  );
}

export default AttendancePhotoToPdf;
