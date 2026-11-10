import React, { useState } from 'react';
import {
  Package,
  LayoutDashboard,
  Boxes,
  ShoppingCart,
  ShoppingBag,
  Bell,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Cloud,
  Layers
} from 'lucide-react';
import { Tooltip } from '../ui/Tooltip.jsx';

export function Sidebar({
  activeNav = 'products',
  onNavigate,
  isCollapsed = false,
  onToggleCollapse,
  isMobileOpen = false,
  onCloseMobile,
  onSwitchToStore
}) {
  const navItems = [
    {
      id: 'products',
      label: 'Products',
      icon: Package,
      status: 'active',
      badge: 'Live',
      badgeVariant: 'brand'
    },
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
      status: 'active',
      badge: 'Live',
      badgeVariant: 'brand'
    },
    {
      id: 'inventory',
      label: 'Inventory',
      icon: Boxes,
      status: 'active',
      badge: 'Live',
      badgeVariant: 'brand'
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: ShoppingCart,
      status: 'active',
      badge: 'Live',
      badgeVariant: 'brand'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      status: 'active',
      badge: 'Live',
      badgeVariant: 'brand'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      status: 'active',
      badge: 'Live',
      badgeVariant: 'brand'
    }
  ];

  const sidebarContent = (
    <aside
      className="glass-panel"
      style={{
        width: isCollapsed ? '72px' : '240px',
        minHeight: '100vh',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid var(--border-default)',
        borderTop: 'none',
        borderBottom: 'none',
        borderLeft: 'none',
        borderRadius: 0,
        background: 'rgba(10, 13, 20, 0.88)',
        backdropFilter: 'var(--blur-lg)',
        transition: 'width var(--transition-smooth)',
        position: 'relative',
        zIndex: 'var(--z-sidebar)'
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: isCollapsed ? '20px 0' : '20px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          borderBottom: '1px solid var(--border-subtle)',
          minHeight: '70px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #FF5722 0%, #E64A19 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(255, 87, 34, 0.4)',
              flexShrink: 0
            }}
          >
            <Cloud size={20} color="#FFFFFF" strokeWidth={2.5} />
          </div>

          {!isCollapsed && (
            <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <span
                style={{
                  fontSize: '1rem',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                  whiteSpace: 'nowrap'
                }}
              >
                CloudMart <span style={{ color: 'var(--brand-primary)' }}>360</span>
              </span>
              <span
                style={{
                  fontSize: '0.6875rem',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  fontWeight: 600
                }}
              >
                Retail Platform
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation List */}
      <nav
        aria-label="Main Navigation"
        style={{
          flex: 1,
          padding: isCollapsed ? '16px 8px' : '16px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}
      >
        <div
          style={{
            fontSize: '0.6875rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: 'var(--text-faint)',
            padding: isCollapsed ? '4px 0' : '6px 10px',
            textAlign: isCollapsed ? 'center' : 'left',
            marginBottom: '4px'
          }}
        >
          {isCollapsed ? '•••' : 'Catalog Core'}
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isItemActive = activeNav === item.id;
          const isPlanned = item.status === 'planned';

          const btnContent = (
            <button
              key={item.id}
              onClick={() => {
                if (!isPlanned && onNavigate) {
                  onNavigate(item.id);
                  if (onCloseMobile) onCloseMobile();
                }
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: isCollapsed ? 'center' : 'space-between',
                padding: isCollapsed ? '10px' : '10px 12px',
                borderRadius: 'var(--radius-md)',
                color: isItemActive
                  ? 'var(--text-primary)'
                  : isPlanned
                  ? 'var(--text-faint)'
                  : 'var(--text-secondary)',
                background: isItemActive
                  ? 'rgba(255, 87, 34, 0.12)'
                  : 'transparent',
                border: isItemActive
                  ? '1px solid rgba(255, 87, 34, 0.3)'
                  : '1px solid transparent',
                boxShadow: isItemActive ? '0 0 16px rgba(255, 87, 34, 0.15)' : 'none',
                cursor: isPlanned ? 'default' : 'pointer',
                transition: 'all var(--transition-fast)',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                if (!isItemActive && !isPlanned) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isItemActive && !isPlanned) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
              aria-current={isItemActive ? 'page' : undefined}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Icon
                  size={18}
                  style={{
                    color: isItemActive ? 'var(--brand-primary)' : 'inherit',
                    flexShrink: 0
                  }}
                />
                {!isCollapsed && (
                  <span style={{ fontSize: '0.875rem', fontWeight: isItemActive ? 600 : 500 }}>
                    {item.label}
                  </span>
                )}
              </div>

              {!isCollapsed && item.badge && (
                <span
                  className="badge"
                  style={{
                    fontSize: '0.625rem',
                    padding: '1px 6px',
                    background: isItemActive
                      ? 'rgba(255, 87, 34, 0.25)'
                      : 'rgba(255, 87, 34, 0.1)',
                    color: isItemActive
                      ? 'var(--brand-primary)'
                      : 'rgba(255, 110, 64, 0.85)',
                    border: isItemActive
                      ? '1px solid rgba(255, 87, 34, 0.4)'
                      : '1px solid rgba(255, 87, 34, 0.25)'
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );

          if (isCollapsed) {
            return (
              <Tooltip key={item.id} text={`${item.label} (${item.badge})`} position="right">
                {btnContent}
              </Tooltip>
            );
          }

          return <div key={item.id}>{btnContent}</div>;
        })}
      </nav>

      {/* Cloud Serverless Badge & Collapse Footer */}
      <div
        style={{
          padding: isCollapsed ? '16px 8px' : '16px 14px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}
      >
        {/* Switch to Customer Storefront Link */}
        {onSwitchToStore && (
          <button
            onClick={onSwitchToStore}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              gap: '10px',
              padding: isCollapsed ? '8px' : '9px 12px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 87, 34, 0.1)',
              border: '1px solid rgba(255, 87, 34, 0.35)',
              color: 'var(--brand-primary)',
              fontSize: '0.8125rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
            title="Switch to Public Customer Storefront"
          >
            <ShoppingBag size={16} />
            {!isCollapsed && <span>Online Storefront</span>}
          </button>
        )}

        {!isCollapsed && (
          <div
            className="glass-panel"
            style={{
              padding: '10px 12px',
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="pulse-status" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-success)' }} />
              <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                AWS Serverless
              </span>
            </div>
            <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>
              API Gateway + Lambda + DynamoDB
            </div>
          </div>
        )}

        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-muted)',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)',
              transition: 'all var(--transition-fast)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--text-primary)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-muted)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
            }}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        )}
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="desktop-sidebar-wrapper" style={{ display: 'block' }}>
        {sidebarContent}
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div
          className="drawer-backdrop"
          onClick={onCloseMobile}
          style={{ zIndex: 'var(--z-drawer)' }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '280px',
              height: '100%',
              position: 'fixed',
              left: 0,
              top: 0,
              animation: 'scaleUp 150ms ease-out'
            }}
          >
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
