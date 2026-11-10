import React, { useState, useEffect } from 'react';
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  Shield,
  Database,
  ShoppingCart,
  Trash2,
  Check,
  Clock,
  Filter,
  Info
} from 'lucide-react';
import { Button } from '../ui/Button.jsx';
import { getStoredNotifications, saveStoredNotifications } from '../../utils/ordersManager.js';
import { useToast } from '../../context/ToastContext.jsx';
import { playSuccessChime } from '../../utils/audioFeedback.js';

export function AdminNotifications() {
  const { showSuccess } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setNotifications(getStoredNotifications());
  }, []);

  const handleMarkAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    saveStoredNotifications(updated);
    playSuccessChime();
    showSuccess('All notifications marked as read', 'Notifications');
  };

  const handleClearAll = () => {
    setNotifications([]);
    saveStoredNotifications([]);
    playSuccessChime();
    showSuccess('All notification logs cleared', 'Cleared');
  };

  const handleDeleteNotif = (id) => {
    const updated = notifications.filter((n) => n.id !== id);
    setNotifications(updated);
    saveStoredNotifications(updated);
  };

  const filteredNotifs = notifications.filter((n) => {
    if (filter === 'all') return true;
    return n.category?.toLowerCase() === filter.toLowerCase();
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type) => {
    if (type === 'danger') return <AlertTriangle size={18} color="var(--color-danger)" />;
    if (type === 'warning') return <AlertTriangle size={18} color="#F59E0B" />;
    if (type === 'success') return <CheckCircle2 size={18} color="var(--color-success)" />;
    if (type === 'security') return <Shield size={18} color="#8B5CF6" />;
    return <Info size={18} color="#38BDF8" />;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '24px',
          borderRadius: 'var(--radius-xl)',
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(10, 14, 22, 0.95) 100%)',
          border: '1px solid var(--border-medium)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="pulse-status" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8B5CF6' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8B5CF6', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              System Audit & Alerts
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
            Notifications & Event Stream
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '4px', margin: 0 }}>
            Real-time catalog threshold alerts, customer order events, and Cognito admin logins.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {unreadCount > 0 && (
            <Button variant="secondary" size="sm" onClick={handleMarkAllRead} icon={Check}>
              Mark All Read
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={handleClearAll} icon={Trash2}>
            Clear Stream
          </Button>
        </div>
      </div>

      {/* Filter Selector */}
      <div
        className="glass-panel"
        style={{
          padding: '12px 20px',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap'
        }}
      >
        {[
          { id: 'all', label: `All Alerts (${notifications.length})` },
          { id: 'inventory', label: 'Inventory Warnings' },
          { id: 'order', label: 'Customer Orders' },
          { id: 'security', label: 'Security & Auth' },
          { id: 'database', label: 'DynamoDB Events' }
        ].map((f) => {
          const isActive = filter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                background: isActive ? 'var(--brand-primary)' : 'rgba(255, 255, 255, 0.04)',
                border: isActive ? '1px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Notifications List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredNotifs.length === 0 ? (
          <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center', borderRadius: 'var(--radius-xl)', color: 'var(--text-muted)' }}>
            <Bell size={40} color="var(--text-faint)" style={{ margin: '0 auto 12px auto' }} />
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              No notifications in this stream
            </div>
            <p style={{ fontSize: '0.8125rem', marginTop: '4px' }}>
              Your catalog inventory and system operations are running optimally.
            </p>
          </div>
        ) : (
          filteredNotifs.map((n) => (
            <div
              key={n.id}
              className="glass-panel"
              style={{
                padding: '16px 20px',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '16px',
                background: n.read ? 'rgba(255, 255, 255, 0.015)' : 'rgba(255, 87, 34, 0.04)',
                border: n.read ? '1px solid var(--border-subtle)' : '1px solid rgba(255, 87, 34, 0.3)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div style={{ marginTop: '2px' }}>
                  {getIcon(n.type)}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {n.title}
                    </span>
                    <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.06)', color: 'var(--text-muted)', fontSize: '0.6875rem' }}>
                      {n.category}
                    </span>
                    {!n.read && (
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--brand-primary)' }} />
                    )}
                  </div>

                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '4px 0 0 0', lineHeight: 1.4 }}>
                    {n.message}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                    <Clock size={11} />
                    <span>{n.time}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleDeleteNotif(n.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex'
                }}
                title="Dismiss"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

