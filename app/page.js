'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Search, MapPin, Users, BookOpen, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import styles from './page.module.css';

// Dynamically import Map component to avoid SSR issues with Leaflet
const CitizenMap = dynamic(() => import('@/components/Map/CitizenMap'), { 
  ssr: false,
  loading: () => <div className={styles.mapLoading}>Initializing Live City Twin...</div>
});

export default function Home() {
  const { language, setLanguage, t } = useLanguage();
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/data/karnataka district lat and long data.csv')
      .then(res => res.text())
      .then(text => {
        const lines = text.split('\n');
        const headers = lines[0].split(',');
        const data = lines.slice(1).filter(line => line.trim()).map(line => {
          const values = line.split(',');
          const obj = {};
          headers.forEach((header, i) => {
            obj[header.trim()] = values[i]?.trim();
          });
          return obj;
        });
        setDistricts(data);
        const defaultDist = data.find(d => d['District Name'] === 'Udupi') || data[0];
        setSelectedDistrict(defaultDist);
      });
  }, []);

  const filteredDistricts = districts.filter(d => 
    d['District Name'].toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.container}>
      {/* Top Header Bar */}
      <header className={styles.header}>
        <div className={styles.searchContainer}>
          <Search size={20} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder={t.searchPlaceholder} 
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <div className={styles.searchResults}>
              {filteredDistricts.map(d => (
                <div 
                  key={d['District Code']} 
                  className={styles.resultItem}
                  onClick={() => {
                    setSelectedDistrict(d);
                    setSearchQuery('');
                  }}
                >
                  {d['District Name']}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className={styles.headerActions}>
          <div className={styles.langSwitch}>
            <button 
              className={language === 'kn' ? styles.activeLang : ''} 
              onClick={() => setLanguage('kn')}
            >ಕನ್ನಡ</button>
            <button 
              className={language === 'en' ? styles.activeLang : ''} 
              onClick={() => setLanguage('en')}
            >EN</button>
          </div>
        </div>
      </header>

      {/* Main Map View */}
      <div className={styles.mapWrapper}>
        <CitizenMap selectedDistrict={selectedDistrict} />
        
        {/* Statistics Overlay Card */}
        {selectedDistrict && (
          <div className={styles.statsCard + " animate-fade"}>
            <h2 className={styles.districtTitle}>{selectedDistrict['District Name']}</h2>
            <div className={styles.statGrid}>
              <div className={styles.statItem}>
                <Users size={18} color="var(--action-blue)" />
                <div>
                  <label>{t.population}</label>
                  <span>{parseInt(selectedDistrict['Total Population']).toLocaleString()}</span>
                </div>
              </div>
              <div className={styles.statItem}>
                <BookOpen size={18} color="var(--success-green)" />
                <div>
                  <label>{t.literacy}</label>
                  <span>{selectedDistrict['Literacy Rate (%)']}%</span>
                </div>
              </div>
              <div className={styles.statItem}>
                <MapPin size={18} color="var(--accent-gold)" />
                <div>
                  <label>{t.density}</label>
                  <span>{selectedDistrict['Population Density (per sq km)']}/sq km</span>
                </div>
              </div>
            </div>
            
            <div className={styles.emergencyBanner}>
              <AlertCircle size={20} />
              <span>Accident records: 2,160 Crashes in 2023</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
