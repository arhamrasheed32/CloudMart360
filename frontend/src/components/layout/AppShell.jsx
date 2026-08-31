import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar.jsx';
import { TopBar } from './TopBar.jsx';

export function AppShell({
  children,
  onRefresh,
  isRefreshing = false,
  onAddProduct,
  onOpenRestock,
  onSwitchToStore,
  products = [],
  databaseEngine = 'Amazon DynamoDB'
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Auto-collapse sidebar on medium screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1100 && window.innerWidth >= 768) {
        setIsCollapsed(true);
      } else if (window.innerWidth >= 1100) {
        setIsCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="ambient-glow-bg app-layout">
      {/* Sidebar navigation */}
      <Sidebar
        activeNav="products"
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
        onSwitchToStore={onSwitchToStore}
      />

      {/* Main Content Area */}
      <div className="main-content-wrapper">
        <TopBar
          onOpenMobileSidebar={() => setIsMobileOpen(true)}
          onRefresh={onRefresh}
          isRefreshing={isRefreshing}
          onAddProduct={onAddProduct}
          onOpenRestock={onOpenRestock}
          products={products}
          databaseEngine={databaseEngine}
        />

        <main className="page-container">
          {children}
        </main>
      </div>
    </div>
  );
}
