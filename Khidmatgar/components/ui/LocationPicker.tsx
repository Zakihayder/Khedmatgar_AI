'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ChevronDown, Map, X, Search } from 'lucide-react';

export const ISLAMABAD_AREAS = [
  { label: 'G-13', lat: 33.6508, lng: 72.9691 },
  { label: 'G-11', lat: 33.6701, lng: 72.9972 },
  { label: 'G-9',  lat: 33.6890, lng: 73.0100 },
  { label: 'F-10', lat: 33.6934, lng: 73.0135 },
  { label: 'F-7',  lat: 33.7188, lng: 73.0538 },
  { label: 'F-8',  lat: 33.7050, lng: 73.0300 },
  { label: 'I-8',  lat: 33.6681, lng: 73.0769 },
  { label: 'I-10', lat: 33.6600, lng: 73.0400 },
  { label: 'E-7',  lat: 33.7310, lng: 73.0620 },
  { label: 'H-13', lat: 33.6350, lng: 72.9850 },
  { label: 'Bahria Town', lat: 33.5290, lng: 72.9000 },
  { label: 'DHA Phase 2',  lat: 33.5450, lng: 72.9200 },
  { label: 'Blue Area',    lat: 33.7215, lng: 73.0489 },
  { label: 'Rawalpindi Saddar', lat: 33.5979, lng: 73.0441 },
  { label: 'Gulberg',      lat: 33.6847, lng: 73.0479 },
];

interface LocationPickerProps {
  value?: string;
  onChange?: (area: string, lat: number, lng: number) => void;
  placeholder?: string;
}

export function LocationPicker({ value, onChange, placeholder = 'Select Area' }: LocationPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [mapOpen, setMapOpen] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapPin, setMapPin] = useState<{ lat: number; lng: number } | null>(null);
  const [selected, setSelected] = useState(value ?? '');
  const mapRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  const filtered = ISLAMABAD_AREAS.filter(a =>
    a.label.toLowerCase().includes(search.toLowerCase())
  );

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Load Google Maps in modal
  useEffect(() => {
    if (!mapOpen || mapLoaded) return;
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!key || typeof window === 'undefined') return;

    const existing = document.getElementById('gmap-script');
    const init = () => {
      if (!mapRef.current || !window.google) return;
      const center = { lat: 33.6844, lng: 73.0479 };
      const map = new window.google.maps.Map(mapRef.current, {
        center, zoom: 12,
        styles: [
          { elementType: 'geometry', stylers: [{ color: '#0a0f1e' }] },
          { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
          { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0d1a2d' }] },
          { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1a2744' }] },
          { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#7B2FFF' }] },
          { featureType: 'poi', stylers: [{ visibility: 'off' }] },
        ],
      });
      googleMapRef.current = map;
      map.addListener('click', (e: any) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setMapPin({ lat, lng });
        if (markerRef.current) markerRef.current.setMap(null);
        markerRef.current = new window.google.maps.Marker({
          position: { lat, lng }, map,
          icon: { path: window.google.maps.SymbolPath.CIRCLE, scale: 10, fillColor: '#7B2FFF', fillOpacity: 1, strokeColor: '#00D4FF', strokeWeight: 2 },
        });
      });
      setMapLoaded(true);
    };

    if (existing) { if (window.google) init(); return; }
    const script = document.createElement('script');
    script.id = 'gmap-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}`;
    script.async = true;
    script.onload = init;
    document.head.appendChild(script);
  }, [mapOpen, mapLoaded]);

  const selectArea = (area: typeof ISLAMABAD_AREAS[0]) => {
    setSelected(area.label);
    onChange?.(area.label, area.lat, area.lng);
    setOpen(false);
    setSearch('');
  };

  const confirmMapPin = () => {
    if (!mapPin) return;
    const label = `Custom (${mapPin.lat.toFixed(4)}, ${mapPin.lng.toFixed(4)})`;
    setSelected(label);
    onChange?.(label, mapPin.lat, mapPin.lng);
    setMapOpen(false);
    setMapPin(null);
  };

  return (
    <>
      <div ref={dropdownRef} className="relative">
        {/* Trigger */}
        <motion.button type="button" id="location-picker-btn"
          onClick={() => setOpen(v => !v)}
          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
          className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm transition-all text-left"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: selected ? '1px solid rgba(123,47,255,0.5)' : '1px solid rgba(255,255,255,0.1)',
            boxShadow: selected ? '0 0 0 3px rgba(123,47,255,0.1)' : 'none',
          }}>
          <MapPin className={`w-4 h-4 shrink-0 ${selected ? 'text-accent' : 'text-white/30'}`} />
          <span className={`flex-1 truncate ${selected ? 'text-white' : 'text-white/30'}`}>
            {selected || placeholder}
          </span>
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="w-4 h-4 text-white/30" />
          </motion.div>
        </motion.button>

        {/* Dropdown */}
        <AnimatePresence>
          {open && (
            <motion.div initial={{ opacity: 0, y: -8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }} transition={{ duration: 0.15 }}
              className="absolute top-full left-0 right-0 mt-2 rounded-2xl overflow-hidden z-50"
              style={{ background: '#0d1326', border: '1px solid rgba(123,47,255,0.3)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
              {/* Search */}
              <div className="p-2 border-b border-white/5">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                  <input value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Area search karein..." autoFocus
                    className="w-full pl-8 pr-3 py-2 rounded-xl text-xs text-white placeholder-white/20 outline-none bg-white/5" />
                </div>
              </div>
              {/* Areas list */}
              <div className="max-h-44 overflow-y-auto py-1">
                {filtered.map((area, i) => (
                  <motion.button key={i} type="button" onClick={() => selectArea(area)}
                    whileHover={{ x: 4 }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all text-left">
                    <MapPin className="w-3.5 h-3.5 text-accent/60 shrink-0" />
                    {area.label}
                  </motion.button>
                ))}
                {filtered.length === 0 && (
                  <p className="text-center text-white/30 text-xs py-4">Koi area nahi mila</p>
                )}
              </div>
              {/* Map option */}
              <div className="p-2 border-t border-white/5">
                <motion.button type="button" onClick={() => { setOpen(false); setMapOpen(true); }}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold text-primary"
                  style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)' }}>
                  <Map className="w-3.5 h-3.5" /> Map pe pin karein
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Map Modal */}
      <AnimatePresence>
        {mapOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100]"
              onClick={() => setMapOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[600px] rounded-3xl overflow-hidden z-[101]"
              style={{ border: '1px solid rgba(123,47,255,0.4)', boxShadow: '0 0 80px rgba(123,47,255,0.3)' }}>
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4"
                style={{ background: 'rgba(10,15,30,0.98)' }}>
                <div>
                  <h3 className="font-bold text-white text-sm">Map pe Location Select Karein</h3>
                  <p className="text-xs text-white/40 mt-0.5">Map pe click karein apni location pin karne ke liye</p>
                </div>
                <button onClick={() => setMapOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                  <X className="w-4 h-4 text-white/60" />
                </button>
              </div>
              {/* Map */}
              <div ref={mapRef} className="w-full h-72"
                style={{ background: '#0a0f1e' }}>
                {!mapLoaded && (
                  <div className="w-full h-full flex items-center justify-center">
                    <motion.div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full"
                      animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
                  </div>
                )}
              </div>
              {/* Footer */}
              <div className="flex items-center justify-between px-5 py-4 gap-3"
                style={{ background: 'rgba(10,15,30,0.98)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-accent" />
                  <span className="text-xs text-white/60">
                    {mapPin ? `${mapPin.lat.toFixed(4)}, ${mapPin.lng.toFixed(4)}` : 'Map pe click karein'}
                  </span>
                </div>
                <motion.button type="button" onClick={confirmMapPin} disabled={!mapPin}
                  whileHover={{ scale: mapPin ? 1.04 : 1 }} whileTap={{ scale: 0.97 }}
                  className="px-5 py-2 rounded-xl text-sm font-bold text-white disabled:opacity-40"
                  style={{ background: 'linear-gradient(135deg,#7B2FFF,#00D4FF)' }}>
                  Confirm Location
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
