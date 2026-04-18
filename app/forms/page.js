'use client';

import React, { useState } from 'react';
import { 
  FileText, Download, CheckCircle2, Clock, 
  ChevronRight, Search, ShieldCheck, Info, X 
} from 'lucide-react';
import { db, collection, addDoc, Timestamp } from '@/lib/firebase';
import { useLanguage } from '@/context/LanguageContext';
import styles from './page.module.css';

const FormsPage = () => {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [selectedForm, setSelectedForm] = useState(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    purpose: ''
  });

  const forms = [
    {
      id: 'road-closure',
      title: t.roadClosurePermission || 'Road Closure Permission',
      department: 'Traffic Police / BBMP',
      time: '2-3 Working Days',
      description: 'Request temporary road closure for construction, repair, or planned activities.',
      requirements: ['Route Map', 'Work Order', 'Traffic NOC']
    },
    {
      id: 'procession-permission',
      title: t.processionPermission || 'Procession Permission',
      department: 'Karnataka State Police',
      time: '48 Hours',
      description: 'Formal permission for religious, social, or public processions/parades.',
      requirements: ['Route Map', 'Organizer ID', 'Local Police NOC']
    }
  ];

  const generateLetterText = () => {
    return `To,
The Commissioner,
${selectedForm?.department},
Government of Karnataka.

Subject: Formal Application for ${selectedForm?.title}

Respected Sir/Madam,

I, ${formData.fullName || '[Name]'}, residing at ${formData.address || '[Full Address]'}, am writing to formally submit an application for a ${selectedForm?.title}.

Purpose of Request:
${formData.purpose || '[Purpose of Request]'}

I hereby undertake to abide by all the rules and regulations set forth by the department and the Government of Karnataka. I have attached the necessary documents as per the requirements mentioned in the citizen portal.

Kindly consider my application for further processing.

Yours faithfully,
${formData.fullName || '[Name]'}
Phone: ${formData.phone || '[Phone]'}
Date: ${new Date().toLocaleDateString()}
Place: Bengaluru/Karnataka`;
  };

  const handleApply = async () => {
    setSubmitting(true);
    
    // 1. Generate Application Number & Local Metadata
    const appNumber = `APP-${Math.floor(100000 + Math.random() * 900000)}`;
    const submissionData = {
      formId: selectedForm.id,
      formTitle: selectedForm.title,
      status: 'Pending Approval',
      submittedAt: Timestamp.now(),
      applicantDetails: formData,
      applicationNumber: appNumber
    };

    try {
      // 2. Start PDF Generation
      const jsPDFModule = await import('jspdf');
      const PObj = jsPDFModule.default || jsPDFModule.jsPDF;
      const doc = new PObj();
      
      console.log("Generating PDF for:", appNumber);
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("GOVERNMENT OF KARNATAKA", 105, 20, { align: "center" });
      doc.setFontSize(10);
      doc.text("OFFICIAL SERVICE DRAFT - NOT A FINAL PERMIT", 105, 27, { align: "center" });
      doc.line(20, 32, 190, 32);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      const letter = generateLetterText();
      const splitText = doc.splitTextToSize(letter, 170);
      doc.text(splitText, 20, 50);
      
      doc.setFontSize(9);
      doc.setTextColor(100);
      doc.text(`Reference: ${appNumber}`, 20, 280);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 190, 280, { align: "right" });

      // Trigger download
      doc.save(`Application_${appNumber}.pdf`);
      
      // 3. Background submission to Firebase (Non-blocking but with logging)
      const docRef = await addDoc(collection(db, "permitApplications"), submissionData);
      console.log("Firestore Submission Success:", docRef.id);

      // Success UI
      alert(`Application ${appNumber} submitted and downloaded successfully!`);
      setSelectedForm(null);
      setStep(1);
    } catch (error) {
      console.error("PDF/Submission Error:", error);
      alert("Submission failed. Please check your connection.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredForms = forms.filter(f => 
    f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerInfo}>
          <h1 className={styles.title}>{t.civicForms}</h1>
          <p className={styles.subtitle}>{t.applyForPermits} & {t.quickActions}</p>
        </div>
        <div className={styles.searchBar}>
          <Search size={20} />
          <input 
            type="text" 
            placeholder="Search forms, departments..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <CheckCircle2 color="var(--success-green)" size={24} />
          <div className={styles.statInfo}>
            <strong>12</strong>
            <span>Processed</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <Clock color="var(--accent-gold)" size={24} />
          <div className={styles.statInfo}>
            <strong>2</strong>
            <span>Under Review</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <ShieldCheck color="var(--action-blue)" size={24} />
          <div className={styles.statInfo}>
            <strong>DigiLocker</strong>
            <span>Verified Profile</span>
          </div>
        </div>
      </div>

      <div className={styles.formGrid}>
        {filteredForms.map(form => (
          <div key={form.id} className={styles.formCard}>
            <div className={styles.cardHeader}>
              <div className={styles.iconBox}>
                <FileText size={24} color="var(--primary-blue)" />
              </div>
              <div className={styles.timeTag}>
                <Info size={14} />
                <span>{form.time}</span>
              </div>
            </div>
            
            <h3 className={styles.formTitle}>{form.title}</h3>
            <p className={styles.departmentName}>{form.department}</p>
            <p className={styles.description}>{form.description}</p>
            
            <div className={styles.requirements}>
              <h4>Requirements:</h4>
              <ul>
                {form.requirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </div>

            <button 
              className={styles.applyBtn} 
              onClick={() => {
                setSelectedForm(form);
                setStep(1);
              }}
            >
              {t.applyNow}
              <ChevronRight size={18} />
            </button>
          </div>
        ))}
      </div>

      {/* Multi-step Application Modal */}
      {selectedForm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>{selectedForm.title}</h3>
              <button className={styles.closeBtn} onClick={() => setSelectedForm(null)}>
                <X size={20} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.stepIndicator}>
                <div className={`${styles.step} ${step >= 1 ? styles.active : ''}`}>1</div>
                <div className={`${styles.step} ${step >= 2 ? styles.active : ''}`}>2</div>
                <div className={`${styles.step} ${step >= 3 ? styles.active : ''}`}>3</div>
              </div>

              {step === 1 && (
                <div className={styles.stepContent}>
                  <h4>{t.basicDetails}</h4>
                  <div className={styles.formGroup}>
                    <label>Applicant Full Name</label>
                    <input 
                      type="text" 
                      placeholder="Enter your name" 
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Contact Number</label>
                    <input 
                      type="tel" 
                      placeholder="+91" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className={styles.stepContent}>
                  <h4>Location & Purpose</h4>
                  <div className={styles.formGroup}>
                    <label>{t.fullAddress}</label>
                    <textarea 
                      placeholder="Enter resident/site address" 
                      rows={3}
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>{t.purposeOfRequest}</label>
                    <textarea 
                      placeholder="Why do you need this permit?" 
                      rows={3}
                      value={formData.purpose}
                      onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className={styles.stepContent}>
                  <h4>{t.previewLetter}</h4>
                  <div className={styles.letterPreview}>
                    {generateLetterText()}
                  </div>
                </div>
              )}
            </div>

            <div className={styles.modalFooter}>
              {step > 1 && (
                <button className={styles.prevBtn} onClick={() => setStep(step - 1)}>
                  Back
                </button>
              )}
              {step < 3 ? (
                <button 
                  className={styles.nextBtn} 
                  onClick={() => setStep(step + 1)}
                  disabled={step === 1 && (!formData.fullName || !formData.phone)}
                >
                  Continue
                </button>
              ) : (
                <button 
                  className={styles.nextBtn} 
                  onClick={handleApply}
                  disabled={submitting}
                >
                  {submitting ? 'Generating...' : t.generateDraft}
                  <Download size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormsPage;
