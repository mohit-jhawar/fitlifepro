import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, X } from 'lucide-react';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

const OfflineNotification = () => {
  const { isOnline } = useNetworkStatus();
  const [bannerVisible, setBannerVisible] = useState(false);
  const [showReconnected, setShowReconnected] = useState(false);
  const [wasPreviouslyOffline, setWasPreviouslyOffline] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setBannerVisible(true);
      setWasPreviouslyOffline(true);
      setShowReconnected(false);
    } else if (wasPreviouslyOffline) {
      setBannerVisible(false);
      setShowReconnected(true);
      const timer = setTimeout(() => {
        setShowReconnected(false);
        setWasPreviouslyOffline(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasPreviouslyOffline]);

  if (!bannerVisible && !showReconnected) return null;

  if (showReconnected) {
    return (
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: '#16a34a',
          color: '#fff',
          padding: '10px 20px',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          fontSize: '14px',
          fontWeight: 600,
          whiteSpace: 'nowrap',
        }}
      >
        <Wifi style={{ width: 16, height: 16 }} />
        Back online
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: '#111827',
        borderTop: '1px solid #374151',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <WifiOff style={{ width: 20, height: 20, color: '#facc15', flexShrink: 0 }} />
        <div>
          <p style={{ color: '#fff', fontSize: '14px', fontWeight: 600, margin: 0 }}>
            You're offline
          </p>
          <p style={{ color: '#9ca3af', fontSize: '12px', margin: 0 }}>
            Showing cached data where available
          </p>
        </div>
      </div>
      <button
        onClick={() => setBannerVisible(false)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#9ca3af',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0,
        }}
        aria-label="Dismiss offline notification"
      >
        <X style={{ width: 18, height: 18 }} />
      </button>
    </div>
  );
};

export default OfflineNotification;
