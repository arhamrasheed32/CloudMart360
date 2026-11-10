import React, { useState, useRef, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  SlidersHorizontal,
  ArrowRight,
  ShieldCheck,
  Zap,
  LayoutDashboard,
  Layers,
  Sparkles,
  Package,
  X,
  Compass,
  HelpCircle,
  Cpu
} from 'lucide-react';
import { Button } from '../ui/Button.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { useCurrency } from '../../context/CurrencyContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { CurrencySelector } from './CurrencySelector.jsx';
import { formatCurrency } from '../../utils/formatters.js';
import { playClickTone } from '../../utils/audioFeedback.js';

export function StoreNavbar({
  activePage = 'home',
  onNavigatePage,
  search = '',
  onSearchChange,
  onSwitchToAdmin,
  products = [],
  onSelectProduct
}) {
  const { totalItemsCount, setIsCartOpen } = useCart();
  const { currency, setCurrency, rates } = useCurrency();
  const { user, isAdmin, logout, openAuthModal } = useAuth();
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchContainerRef = useRef(null);

  // Filter live autocomplete matches
  const autocompleteMatches = search.trim()
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            (p.sku && p.sku.toLowerCase().includes(search.toLowerCase())) ||
            (p.category && p.category.toLowerCase().includes(search.toLowerCase()))
        )
        .slice(0, 5)
    : [];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Shop Catalog' },
    { id: 'collections', label: 'Collections' },
    { id: 'about', label: 'Technology & Cloud' },
    { id: 'support', label: 'Track Order / Help' }
  ];

  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 'var(--z-topbar)', display: 'flex', flexDirection: 'column' }}>
      {/* Top Promotional Ribbon Ticker */}
      <div
        style={{
          background: 'linear-gradient(90deg, #1E1B4B 0%, #172554 50%, #1E1B4B 100%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '6px 20px',
          textAlign: 'center',
          fontSize: '0.75rem',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px'
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--brand-primary)', fontWeight: 700 }}>
          <Sparkles size={12} />
          <span>CLOUDMART 360 RETAIL</span>
        </span>
        <span>•</span>
        <span>Free Express Delivery on orders over $150</span>
        <span>•</span>
        <span style={{ color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Zap size={11} /> 100% Real-Time AWS DynamoDB Sync
        </span>
      </div>

      {/* Main Glass Navbar */}
      <header
        className="glass-panel"
        style={{
          borderRadius: 0,
          borderLeft: 'none',
          borderRight: 'none',
          borderTop: 'none',
          background: 'rgba(10, 14, 22, 0.92)',
          backdropFilter: 'var(--blur-md)',
          padding: '0 28px',
          height: '70px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-default)'
        }}
      >
        {/* Brand Logo & Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div
            onClick={() => onNavigatePage('home')}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, var(--brand-primary) 0%, #D84315 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                boxShadow: 'var(--brand-glow)',
                flexShrink: 0
              }}
            >
              <ShoppingBag size={20} strokeWidth={2.4} />
            </div>
            <div>
              <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>CloudMart</span>
                <span style={{ color: 'var(--brand-primary)' }}>360</span>
              </div>
              <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                Online Storefront
              </div>
            </div>
          </div>

          {/* Navigation Page Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="desktop-categories-nav">
            {navLinks.map((link) => {
              const isActive = activePage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    playClickTone();
                    onNavigatePage(link.id);
                  }}
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    padding: '7px 14px',
                    borderRadius: 'var(--radius-full)',
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    background: isActive ? 'rgba(255, 87, 34, 0.15)' : 'transparent',
                    border: isActive ? '1px solid rgba(255, 87, 34, 0.35)' : '1px solid transparent',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Center Search Bar with Instant Autocomplete Popover */}
        <div ref={searchContainerRef} style={{ position: 'relative', width: '100%', maxWidth: '280px' }} className="desktop-search-bar">
          <Search
            size={15}
            color="var(--text-muted)"
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
          />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setShowSearchDropdown(true);
            }}
            onFocus={() => setShowSearchDropdown(true)}
            className="glass-input"
            style={{
              width: '100%',
              height: '36px',
              padding: '0 28px 0 34px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8125rem'
            }}
          />

          {search && (
            <button
              onClick={() => {
                onSearchChange('');
                setShowSearchDropdown(false);
              }}
              style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex' }}
            >
              <X size={13} />
            </button>
          )}

          {/* Autocomplete Dropdown Popover */}
          {showSearchDropdown && search.trim() && (
            <div
              className="glass-modal"
              style={{
                position: 'absolute',
                top: '44px',
                left: 0,
                right: 0,
                borderRadius: 'var(--radius-xl)',
                background: 'rgba(14, 18, 28, 0.98)',
                boxShadow: 'var(--shadow-lg)',
                padding: '8px',
                zIndex: 'var(--z-dropdown)',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                maxHeight: '320px',
                overflowY: 'auto'
              }}
            >
              {autocompleteMatches.length === 0 ? (
                <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                  No matching products for "{search}"
                </div>
              ) : (
                autocompleteMatches.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setShowSearchDropdown(false);
                      if (onSelectProduct) onSelectProduct(p);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      transition: 'background var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: 'var(--radius-sm)',
                        overflow: 'hidden',
                        background: 'rgba(255, 255, 255, 0.04)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <Package size={14} color="var(--text-muted)" />
                      )}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {p.name}
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                        {p.category}
                      </div>
                    </div>

                    <div className="font-mono" style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--brand-primary)' }}>
                      {formatCurrency(p.price)}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Right Controls: Currency Selector + Cart Button + Admin Mode Switch */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Professional 6-Currency Selector Dropdown */}
          <CurrencySelector />

          {/* Shopping Cart Button */}
          <button
            onClick={() => {
              playClickTone();
              setIsCartOpen(true);
            }}
            aria-label="View Shopping Cart"
            className="glass-panel"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '7px 16px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-medium)',
              color: 'var(--text-primary)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
              position: 'relative',
              transition: 'all var(--transition-fast)'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--brand-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-medium)')}
          >
            <ShoppingBag size={17} color="var(--brand-primary)" />
            <span>Cart</span>
            {totalItemsCount > 0 && (
              <span
                style={{
                  background: 'var(--brand-primary)',
                  color: '#FFFFFF',
                  fontSize: '0.6875rem',
                  fontWeight: 800,
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 8px rgba(255, 87, 34, 0.6)'
                }}
              >
                {totalItemsCount}
              </span>
            )}
          </button>

          {/* User Sign In / Register / Profile Button (Amazon Cognito) */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontSize: '0.75rem',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  background: isAdmin ? 'rgba(255, 87, 34, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                  border: `1px solid ${isAdmin ? 'rgba(255, 87, 34, 0.4)' : 'rgba(59, 130, 246, 0.4)'}`,
                  color: isAdmin ? 'var(--brand-primary)' : '#60a5fa',
                  fontWeight: 600
                }}
              >
                {isAdmin ? '🛡️ Admin' : '👤 Customer'}: {user.email.split('@')[0]}
              </span>
              <button
                onClick={logout}
                style={{
                  fontSize: '0.7rem',
                  padding: '5px 8px',
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'var(--text-muted)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer'
                }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => {
                  playClickTone();
                  onNavigatePage('auth_signin');
                }}
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                Sign In
              </button>

              <button
                onClick={() => {
                  playClickTone();
                  onNavigatePage('auth_signup');
                }}
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  background: 'linear-gradient(135deg, #FF5722 0%, #D84315 100%)',
                  border: 'none',
                  borderRadius: 'var(--radius-full)',
                  padding: '7px 14px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(255, 87, 34, 0.4)'
                }}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Switch to Admin Mode Switcher */}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              playClickTone();
              onNavigatePage('admin_login');
            }}
            icon={LayoutDashboard}
            style={{
              height: '38px',
              padding: '0 14px',
              borderColor: 'rgba(255, 87, 34, 0.4)',
              background: 'rgba(255, 87, 34, 0.1)',
              color: 'var(--brand-primary)'
            }}
          >
            <span style={{ fontWeight: 700 }}>Admin Login</span>
          </Button>
        </div>
      </header>
    </div>
  );
}
