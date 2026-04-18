'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Ticket, Clock, CheckCircle2, ChevronRight, Camera, MapPin, AlertCircle, X } from 'lucide-react';
import { db, collection, addDoc, onSnapshot, query, orderBy, Timestamp } from '@/lib/firebase';
import { useLanguage } from '@/context/LanguageContext';
import styles from './page.module.css';

const SupportPage = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('active');
  const [tickets, setTickets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTicket, setNewTicket] = useState({
    title: '',
    category: 'Sanitation',
    description: '',
    location: ''
  });

  // Listen to tickets from Firestore
  useEffect(() => {
    const q = query(collection(db, "complaints"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ticketsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTickets(ticketsData);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "complaints"), {
        ...newTicket,
        status: 'Pending',
        createdAt: Timestamp.now(),
        ticketId: `KA-${Math.floor(1000 + Math.random() * 9000)}-${new Date().getFullYear()}`
      });
      setShowModal(false);
      setNewTicket({ title: '', category: 'Sanitation', description: '', location: '' });
    } catch (error) {
      console.error("Error adding ticket: ", error);
      alert("Failed to submit ticket. Please try again.");
    }
  };

  const filteredTickets = tickets.filter(t => 
    activeTab === 'active' ? t.status !== 'Resolved' : t.status === 'Resolved'
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved': return 'var(--success-green)';
      case 'In Progress': return 'var(--action-blue)';
      default: return 'var(--accent-gold)';
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>{t.support}</h1>
          <p className={styles.subtitle}>{t.activeTickets} & {t.quickActions}</p>
        </div>
        <button className={styles.newTicketBtn} onClick={() => setShowModal(true)}>
          <Plus size={20} /> {t.fileComplaint}
        </button>
      </header>

      <div className={styles.tabs}>
        <button 
          className={activeTab === 'active' ? styles.activeTab : ''} 
          onClick={() => setActiveTab('active')}
        >
          {t.activeTickets}
        </button>
        <button 
          className={activeTab === 'history' ? styles.activeTab : ''} 
          onClick={() => setActiveTab('history')}
        >
          {t.resolvedHistory}
        </button>
      </div>

      <div className={styles.ticketGrid}>
        {filteredTickets.length > 0 ? filteredTickets.map(ticket => (
          <div key={ticket.id} className={styles.ticketCard}>
            <div className={styles.ticketBadge} style={{ backgroundColor: getStatusColor(ticket.status) }}>
              {ticket.status}
            </div>
            <div className={styles.ticketInfo}>
              <span className={styles.ticketId}>{ticket.ticketId || ticket.id.substring(0, 8)}</span>
              <h3 className={styles.ticketTitle}>{ticket.title}</h3>
              <div className={styles.ticketMeta}>
                <span>{ticket.category}</span>
                <span className={styles.dot}></span>
                <span>{ticket.createdAt?.toDate().toLocaleDateString() || 'Just now'}</span>
              </div>
            </div>
            <div className={styles.chevron}>
              <ChevronRight size={20} />
            </div>
          </div>
        )) : (
          <div className={styles.emptyState}>
            <Ticket size={48} opacity={0.2} />
            <p>No tickets found in this category.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>{t.fileComplaint}</h3>
              <button onClick={() => setShowModal(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.field}>
                <label>Issue Title</label>
                <input 
                  required 
                  value={newTicket.title}
                  onChange={e => setNewTicket({...newTicket, title: e.target.value})}
                  placeholder="e.g. Broken Streetlight"
                />
              </div>
              <div className={styles.field}>
                <label>Category</label>
                <select 
                  value={newTicket.category}
                  onChange={e => setNewTicket({...newTicket, category: e.target.value})}
                >
                  <option>Sanitation</option>
                  <option>Public Safety</option>
                  <option>Water Supply</option>
                  <option>Roads & Traffic</option>
                </select>
              </div>
              <div className={styles.field}>
                <label>Location</label>
                <input 
                  required
                  value={newTicket.location}
                  onChange={e => setNewTicket({...newTicket, location: e.target.value})}
                  placeholder="Street name or landmark"
                />
              </div>
              <div className={styles.field}>
                <label>Description</label>
                <textarea 
                  rows={4}
                  value={newTicket.description}
                  onChange={e => setNewTicket({...newTicket, description: e.target.value})}
                />
              </div>
              <button type="submit" className={styles.submitBtn}>Submit Ticket</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportPage;
