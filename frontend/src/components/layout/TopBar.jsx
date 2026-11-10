import React, { useState, useEffect } from 'react';
import {
  Menu,
  RotateCw,
  Plus,
  Search,
  Database,
  User,
  ExternalLink,
  ChevronRight,
  Bell,
  Sparkles,
  Command,
  Settings,
  Boxes,
  Palette
} from 'lucide-react';
import { Button } from '../ui/Button.jsx';
import { Tooltip } from '../ui/Tooltip.jsx';
import { ArchitectureModal } from '../products/ArchitectureModal.jsx';
import { NotificationDropdown } from '../products/NotificationDropdown.jsx';
import { ThemeSettingsModal } from './ThemeSettingsModal.jsx';
import { getSavedThemeAccent, applyThemeAccent } from '../../utils/themeManager.js';
import { playClickTone, playSuccessChime } from '../../utils/audioFeedback.js';

export function TopBar({
  onOpenMobileSidebar,
  onRefresh,
  isRefreshing = false,
  onAddProduct,
  onOpenRestock,
  onOpenCommandPalette,
  products = [],
  databaseEngine = 'Amazon DynamoDB'
}) {
  const [archModalOpen, setArchModalOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  // Initialize theme accent on mount
  useEffect(() => {
    const saved = getSavedThemeAccent();
    applyThemeAccent(saved.id);
  }, []);

  // Compute low/out-of-stock alert count
  const alertCount = products.filter(
    (p) => Number(p.stock) <= (p.minStockThreshold || 10)
  ).length;

  return (
    <header
      className="glass-panel"
      style={{
        height: '70px',
        borderLeft: 'none',
        borderRight: 'none',
        borderTop: 'none',
        borderRadius: 0,
        background: 'rgba(10, 14, 22, 0.88)',
        backdropFilter: 'var(--blur-md)',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 'var(--z-topbar)',
        borderBottom: '1px solid var(--border-default)'
      }}
    >
      {/* Left Area: Mobile Trigger & Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={onOpenMobileSidebar}
          aria-label="Open mobile navigation"
          className="mobile-nav-toggle"
          style={{
            display: 'none',
            color: 'var(--text-secondary)',
            padding: '8px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <Menu size={20} />
        </button>

        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>CloudMart 360</span>
          <ChevronRight size={14} color="var(--text-faint)" />
          <span style={{ color: 'var(--text-secondary)' }}>Module 1</span>
          <ChevronRight size={14} color="var(--text-faint)" />
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Product Catalog</span>
        </nav>
      </div>

      {/* Right Area: System Status, Notifications, Refresh, Add Action & Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }}>
        {/* Live DynamoDB Status Badge -> Opens Architecture Inspector */}
        <Tooltip text="Click to view AWS Serverless Infrastructure & Latency" position="bottom">
          <div
            onClick={() => {
              playClickTone();
              setArchModalOpen(true);
            }}
            className="glass-panel"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-highlight)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.07)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
            }}
          >
            <span
              className="pulse-status"
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-success)',
                boxShadow: '0 0 8px rgba(16, 185, 129, 0.6)'
              }}
            />
            <Database size={13} color="var(--text-muted)" />
            <span style={{ fontWeight: 600 }} className="desktop-status-text">
              {databaseEngine}
            </span>
          </div>
        </Tooltip>

        {/* Sync / Refresh Button */}
        <Tooltip text="Synchronize Catalog with DynamoDB" position="bottom">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              playClickTone();
              onRefresh();
            }}
            isLoading={isRefreshing}
            aria-label="Refresh catalog data"
            style={{ height: '36px', padding: '0 12px' }}
          >
            <RotateCw size={14} style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
            <span className="desktop-btn-text">Sync</span>
          </Button>
        </Tooltip>

        {/* Low Stock Replenish CTA if any items are low */}
        {alertCount > 0 && onOpenRestock && (
          <Tooltip text={`${alertCount} items below safety stock. Click to replenish.`} position="bottom">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                playClickTone();
                onOpenRestock();
              }}
              icon={Boxes}
              style={{
                height: '36px',
                padding: '0 10px',
                borderColor: 'rgba(245, 158, 11, 0.4)',
                color: 'var(--color-warning)',
                background: 'rgba(245, 158, 11, 0.08)'
              }}
            >
              <span className="desktop-btn-text">Replenish ({alertCount})</span>
            </Button>
          </Tooltip>
        )}

        {/* Notification Bell with Dropdown */}
        <div style={{ position: 'relative' }}>
          <Tooltip text="Catalog Alerts & Notifications" position="bottom">
            <button
              onClick={() => {
                playClickTone();
                setNotifDropdownOpen(!notifDropdownOpen);
              }}
              aria-label="Open notifications"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                background: notifDropdownOpen ? 'rgba(255, 87, 34, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                border: notifDropdownOpen ? '1px solid rgba(255, 87, 34, 0.35)' : '1px solid var(--border-medium)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: notifDropdownOpen ? 'var(--brand-primary)' : 'var(--text-secondary)',
                position: 'relative',
                transition: 'all var(--transition-fast)'
              }}
            >
              <Bell size={16} />
              {alertCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-3px',
                    right: '-3px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: 'var(--color-danger)',
                    color: '#FFFFFF',
                    fontSize: '0.625rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 6px rgba(239, 68, 68, 0.6)'
                  }}
                >
                  {alertCount}
                </span>
              )}
            </button>
          </Tooltip>

          <NotificationDropdown
            products={products}
            isOpen={notifDropdownOpen}
            onClose={() => setNotifDropdownOpen(false)}
          />
        </div>

        {/* Primary CTA: Add Product */}
        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            playClickTone();
            onAddProduct();
          }}
          icon={Plus}
          style={{ height: '36px', padding: '0 16px' }}
        >
          <span>Add Product</span>
        </Button>

        {/* Theme Settings & Profile Avatar */}
        <Tooltip text="Theme Accent & Profile Settings" position="bottom">
          <div
            onClick={() => {
              playClickTone();
              setSettingsModalOpen(true);
            }}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
              border: '1px solid var(--border-medium)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-primary)',
              fontSize: '0.8125rem',
              fontWeight: 700,
              boxShadow: 'var(--shadow-sm)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--brand-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-medium)')}
          >
            <span>AD</span>
          </div>
        </Tooltip>
      </div>

      {/* Architecture Inspector Modal */}
      <ArchitectureModal
        isOpen={archModalOpen}
        onClose={() => setArchModalOpen(false)}
      />

      {/* Theme Settings Modal */}
      <ThemeSettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
      />
    </header>
  );
}
