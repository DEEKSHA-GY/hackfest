'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, User, Lock, ArrowRight, Info } from 'lucide-react';
import styles from './page.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simple mock login logic
    setTimeout(() => {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', email);
      router.push('/');
      setLoading(false);
    }, 1500);
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.logoSection}>
          <div className={styles.logoBadge}>UDT</div>
          <h1>Digital Twin</h1>
          <p>Government of Karnataka Citizen Portal</p>
        </div>

        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.inputGroup}>
            <label><User size={18} /> Email Address</label>
            <input 
              type="email" 
              placeholder="citizen@karnataka.gov.in" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label><Lock size={18} /> Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className={styles.loginBtn} disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight size={20} />
          </button>
        </form>

        <div className={styles.guestHint}>
          <Info size={16} />
          <span>Demo mode: Any credentials will work.</span>
        </div>

        <div className={styles.footer}>
          <Shield size={16} />
          <span>Secure Multi-Factor Authentication</span>
        </div>
      </div>
    </div>
  );
}
