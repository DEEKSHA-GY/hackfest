'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap, Polyline, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useLanguage } from '@/context/LanguageContext';
import styles from './CitizenMap.module.css';

// Fix for default marker icons
const defaultIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const hospitalIcon = L.divIcon({
  html: `<div style="background-color: white; border-radius: 50%; padding: 4px; border: 2px solid #ff4757; box-shadow: 0 0 10px rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ff4757" width="18" height="18"><path d="M19 10h-5V5h-4v5H5v4h5v5h4v-5h5v-4z"/></svg></div>`,
  className: 'custom-div-icon',
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

const DISTRICT_COORDS = {
  'Bagalkot': [16.1817, 75.6958],
  'Bangalore Rural': [13.2500, 77.3333],
  'Bangalore Urban': [12.9716, 77.5946],
  'Belgaum': [15.8497, 74.4977],
  'Bellary': [15.1394, 76.9214],
  'Bidar': [17.9104, 77.5276],
  'Bijapur': [16.8302, 75.7100],
  'Chamarajanagar': [11.9261, 76.9437],
  'Chikkaballapura': [13.4355, 77.7290],
  'Chikkamagaluru': [13.3161, 75.7720],
  'Chitradurga': [14.2251, 76.4005],
  'Dakshina Kannada': [12.8700, 74.8800],
  'Davanagere': [14.4644, 75.9218],
  'Dharwad': [15.4589, 75.0078],
  'Gadag': [15.4261, 75.6310],
  'Gulbarga': [17.3297, 76.8343],
  'Hassan': [13.0070, 76.1029],
  'Haveri': [14.7937, 75.4025],
  'Kodagu': [12.3375, 75.8069],
  'Kolar': [13.1363, 78.1291],
  'Koppal': [15.3524, 76.1558],
  'Mandya': [12.5218, 76.8951],
  'Mysuru': [12.2958, 76.6394],
  'Raichur': [16.2120, 77.3559],
  'Ramanagara': [12.7150, 77.2813],
  'Shimoga': [13.9299, 75.5681],
  'Tumkur': [13.3392, 77.1140],
  'Udupi': [13.3313, 74.7473],
  'Uttara Kannada': [14.7820, 74.6300],
  'Yadgir': [16.7643, 77.1307]
};

// Simulation Data Generators
const generateSimData = (center) => {
  if (!center) return { hospitals: [], closures: [], routes: [], busRoutes: [], traffic: [] };
  const [lat, lng] = center;
  return {
    hospitals: [
      { name: 'District General Hospital', coords: [lat + 0.005, lng + 0.005], desc: 'Regional Hub' },
      { name: 'City Emergency Care', coords: [lat - 0.01, lng - 0.008], desc: 'Trauma Unit' }
    ],
    closures: [
      { coords: [lat + 0.008, lng - 0.002], reason: 'Road Maintenance - District Hub' },
      { coords: [lat - 0.005, lng + 0.012], reason: 'Public Event - Main Square' }
    ],
    routes: [
      [[lat + 0.02, lng + 0.02], [lat, lng]] // Emergency Path
    ],
    busRoutes: [
      [[lat - 0.02, lng - 0.02], [lat - 0.01, lng - 0.01], [lat, lng], [lat + 0.01, lng + 0.02]]
    ],
    traffic: [
      { coords: [[lat + 0.01, lng - 0.02], [lat + 0.01, lng + 0.02]], color: '#ff4757', weight: 6 } // Heavy
    ]
  };
};

function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 13, { duration: 1.5 });
    }
  }, [center, map]);
  return null;
}

const CitizenMap = ({ selectedDistrict }) => {
  const { t } = useLanguage();
  const [mapCenter, setMapCenter] = useState([12.9716, 77.5946]);
  const [simData, setSimData] = useState(generateSimData([12.9716, 77.5946]));
  
  const [showAmbulance, setShowAmbulance] = useState(true);
  const [showProcession, setShowProcession] = useState(true);
  const [showClosures, setShowClosures] = useState(true);
  const [showBus, setShowBus] = useState(true);
  const [showTraffic, setShowTraffic] = useState(true);

  useEffect(() => {
    const districtName = selectedDistrict?.['District Name'];
    const coords = DISTRICT_COORDS[districtName] || [12.9716, 77.5946];
    setMapCenter(coords);
    setSimData(generateSimData(coords));
  }, [selectedDistrict]);

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <MapContainer 
        center={mapCenter} 
        zoom={13} 
        scrollWheelZoom={true} 
        className="leaflet-container"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        
        <ZoomControl position="bottomright" />
        <MapUpdater center={mapCenter} />

        {/* Traffic Congestion Layer */}
        {showTraffic && simData.traffic.map((t, i) => (
          <Polyline key={`traf-${i}`} positions={t.coords} color={t.color} weight={t.weight} opacity={0.7} />
        ))}

        {/* Bus Routes */}
        {showBus && simData.busRoutes.map((r, i) => (
          <Polyline key={`bus-${i}`} positions={r} color="#3498db" weight={3} dashArray="5, 10" />
        ))}

        {/* Hospital Landmarks */}
        {simData.hospitals.map((h, i) => (
          <Marker key={i} position={h.coords} icon={hospitalIcon}>
            <Popup><strong>{h.name}</strong><br/>{h.desc}</Popup>
          </Marker>
        ))}

        {/* Ambulance Simulation */}
        {showAmbulance && simData.routes.map((route, i) => (
          <Polyline 
            key={`amb-${i}`} 
            positions={route} 
            color="#ff4757" 
            weight={4} 
            dashArray="10, 10"
            className="pulsingRoute"
          />
        ))}

        {/* Road Closures */}
        {showClosures && simData.closures.map((c, i) => (
          <Circle 
            key={`close-${i}`} 
            center={c.coords} 
            radius={250} 
            pathOptions={{ color: '#e67e22', fillColor: '#e67e22', fillOpacity: 0.6 }}
          >
            <Popup><strong>Alert</strong>: {c.reason}</Popup>
          </Circle>
        ))}
      </MapContainer>

      {/* Simulation Toggles */}
      <div className={styles.simControls}>
        <h4>Live Twin Simulations</h4>
        <button className={`${styles.toggleBtn} ${showTraffic ? styles.active : ''}`} onClick={() => setShowTraffic(!showTraffic)}>
          <span className={`${styles.dot}`} style={{backgroundColor: '#ff4757'}}></span>
          Traffic Congestion
        </button>
        <button className={`${styles.toggleBtn} ${showBus ? styles.active : ''}`} onClick={() => setShowBus(!showBus)}>
          <span className={`${styles.dot}`} style={{backgroundColor: '#3498db'}}></span>
          Bus Routes
        </button>
        <button className={`${styles.toggleBtn} ${showAmbulance ? styles.active : ''}`} onClick={() => setShowAmbulance(!showAmbulance)}>
          <span className={`${styles.dot}`} style={{backgroundColor: '#ff4757'}}></span>
          Ambulance Corridors
        </button>
        <button className={`${styles.toggleBtn} ${showClosures ? styles.active : ''}`} onClick={() => setShowClosures(!showClosures)}>
          <span className={`${styles.dot}`} style={{backgroundColor: '#e67e22'}}></span>
          Road Closures
        </button>
      </div>
    </div>
  );
};

export default CitizenMap;
