'use client';

import React, { useEffect, useState } from 'react';
import { db, collection, onSnapshot, query, orderBy } from '@/lib/firebase';
import { 
  Shield, CheckCircle, XCircle, Clock, 
  FileText, MessageSquare, User, MapPin 
} from 'lucide-react';
import styles from './page.module.css';

export default function GovDashboard() {
  const [applications, setApplications] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to Permit Applications
    const qPermits = query(collection(db, "permitApplications"), orderBy("submittedAt", "desc"));
    const unsubPermits = onSnapshot(qPermits, (snapshot) => {
      setApplications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Listen to Complaints
    const qComplaints = query(collection(db, "complaints"), orderBy("timestamp", "desc"));
    const unsubComplaints = onSnapshot(qComplaints, (snapshot) => {
      setComplaints(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => {
      unsubPermits();
      unsubComplaints();
    };
  }, []);

  const handleStatusUpdate = async (type, id, newStatus) => {
    const collectionName = type === 'permit' ? 'permitApplications' : 'complaints';
    try {
      const { doc, updateDoc } = await import('firebase/firestore');
      await updateDoc(doc(db, collectionName, id), { status: newStatus });
      alert(`${type === 'permit' ? 'Permit' : 'Ticket'} ${newStatus} successfully.`);
    } catch (e) {
      console.error("Status update failed:", e);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <Shield size={32} color="var(--accent-gold)" />
          <div>
            <h1>Government Administrative Portal</h1>
            <p>State of Karnataka | Digital Twin Approval System</p>
          </div>
        </div>
        <div className={styles.stats}>
          <div className={styles.statBox}>
            <strong>{applications.length}</strong>
            <span>Active Permits</span>
          </div>
          <div className={styles.statBox}>
            <strong>{complaints.length}</strong>
            <span>Active Tickets</span>
          </div>
          <a href="/" className={styles.backHome}>Exit Portal</a>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <FileText size={20} />
            <h2>Permit Applications</h2>
          </div>
          <div className={styles.grid}>
            {applications.map(app => (
              <div key={app.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.appId}>{app.applicationNumber}</span>
                  <span className={`${styles.status} ${styles[app.status?.toLowerCase().replace(/\s/g, '')]}`}>
                    {app.status}
                  </span>
                </div>
                <h3>{app.formTitle}</h3>
                <div className={styles.details}>
                  <p><User size={14} /> {app.applicantDetails?.fullName}</p>
                  <p><MapPin size={14} /> {app.applicantDetails?.address}</p>
                  <p><Clock size={14} /> {app.submittedAt?.toDate().toLocaleString()}</p>
                </div>
                {app.status === 'Pending Approval' && (
                  <div className={styles.actions}>
                    <button className={styles.approveBtn} onClick={() => handleStatusUpdate('permit', app.id, 'Approved')}>Approve</button>
                    <button className={styles.rejectBtn} onClick={() => handleStatusUpdate('permit', app.id, 'Rejected')}>Reject</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <MessageSquare size={20} />
            <h2>Citizen Complaints</h2>
          </div>
          <div className={styles.grid}>
            {complaints.map(ticket => (
              <div key={ticket.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.appId}>{ticket.ticketId || 'TICKET'}</span>
                  <span className={`${styles.status} ${styles[ticket.status?.toLowerCase().replace(/\s/g, '')]}`}>
                    {ticket.status}
                  </span>
                </div>
                <h3>{ticket.title}</h3>
                <p className={styles.complaintText}>{ticket.description}</p>
                <div className={styles.details}>
                  <p><MapPin size={14} /> {ticket.location}</p>
                  <p><Clock size={14} /> {ticket.createdAt?.toDate().toLocaleString()}</p>
                </div>
                {ticket.status !== 'Resolved' && (
                  <div className={styles.actions}>
                    <button className={styles.approveBtn} onClick={() => handleStatusUpdate('complaint', ticket.id, 'Resolved')}>Resolve</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
