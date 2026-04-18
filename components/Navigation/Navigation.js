'use client';

import React from 'react';
import Link from 'next/link';
import { Map, FileText, MessageSquare, Shield, Bell, Menu, Languages } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import styles from './Navigation.module.css';

const Navigation = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className={styles.sidebar}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>UDT</div>
          <span className={styles.logoText}>{t.title}</span>
        </div>
        
        <div className={styles.navLinks}>
          <Link href="/" className={styles.navItem}>
            <Map size={24} />
            <span>{t.liveMap}</span>
          </Link>
          <Link href="/forms" className={styles.navItem}>
            <FileText size={24} />
            <span>{t.civicForms}</span>
          </Link>
          <Link href="/support" className={styles.navItem}>
            <Shield size={24} />
            <span>{t.support}</span>
          </Link>
        </div>

        <div className={styles.sidebarFooter}>
          <div className={styles.langToggle} onClick={() => setLanguage(language === 'en' ? 'kn' : 'en')}>
            <Languages size={20} />
            <span>{language.toUpperCase()}</span>
          </div>
          <button className={styles.authBtn} onClick={() => alert("Sign In mode activated. You are browsing as a verified Citizen (Guest Mode).")}>
            <div className={styles.avatar}>G</div>
            <div className={styles.authInfo}>
              <strong>{t.signIn}</strong>
              <span>Citizen Portal</span>
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Bottom Bar */}
      <nav className={styles.mobileNav}>
        <Link href="/" className={styles.mobileItem}>
          <Map size={24} />
          <span>{t.liveMap.split(' ')[0]}</span>
        </Link>
        <Link href="/forms" className={styles.mobileItem}>
          <FileText size={24} />
          <span>{t.civicForms.split(' ')[0]}</span>
        </Link>
        <Link href="/support" className={styles.mobileItem}>
          <Shield size={24} />
          <span>{t.support}</span>
        </Link>
      </nav>
    </>
  );
};

export default Navigation;
