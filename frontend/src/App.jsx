import React, { useState } from 'react';
import { AppShell } from './components/layout/AppShell.jsx';
import { ProductDashboard } from './components/products/ProductDashboard.jsx';
import { AdminOverview } from './components/admin/AdminOverview.jsx';
import { AdminInventory } from './components/admin/AdminInventory.jsx';
import { AdminOrders } from './components/admin/AdminOrders.jsx';
import { AdminNotifications } from './components/admin/AdminNotifications.jsx';
import { AdminAnalytics } from './components/admin/AdminAnalytics.jsx';
import { StoreView } from './components/storefront/StoreView.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { CurrencyProvider, useCurrency } from './context/CurrencyContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { useProducts } from './hooks/useProducts.js';

function MainApp() {
  const productState = useProducts();
  const { user, isAdmin, closeAuthModal } = useAuth();
  const { currency } = useCurrency(); // Subscribes MainApp to re-render tree when currency changes
  const [appMode, setAppMode] = useState('storefront'); // 'storefront' | 'admin'
  const [adminNav, setAdminNav] = useState('overview'); // 'overview' | 'products' | 'inventory' | 'orders' | 'notifications' | 'analytics'
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [isRestockOpen, setIsRestockOpen] = useState(false);

  const activeCatalogProducts = productState.allProductsRaw.length > 0
    ? productState.allProductsRaw
    : productState.products;

  const handleSwitchToAdmin = (adminUser) => {
    if (closeAuthModal) closeAuthModal();
    setAppMode('admin');
  };

  const handleOpenAdd = () => {
    setAdminNav('products');
    setIsAddDrawerOpen(true);
  };

  const handleOpenRestock = () => {
    setAdminNav('products');
    setIsRestockOpen(true);
  };

  return (
    <>
      {appMode === 'storefront' ? (
        <StoreView
          products={activeCatalogProducts}
          onSwitchToAdmin={handleSwitchToAdmin}
          onAdjustStock={productState.adjustStock}
        />
      ) : (
        <AppShell
          activeNav={adminNav}
          onNavigate={(navId) => setAdminNav(navId)}
          onRefresh={() => productState.fetchProducts(true)}
          isRefreshing={productState.isRefreshing}
          onAddProduct={handleOpenAdd}
          onOpenRestock={handleOpenRestock}
          onSwitchToStore={() => setAppMode('storefront')}
          products={activeCatalogProducts}
          databaseEngine={productState.databaseEngine}
        >
          {adminNav === 'overview' && (
            <AdminOverview
              products={activeCatalogProducts}
              onNavigate={(navId) => setAdminNav(navId)}
              onAddProduct={handleOpenAdd}
              onOpenRestock={handleOpenRestock}
              onAdjustStock={productState.adjustStock}
              onSwitchToStore={() => setAppMode('storefront')}
            />
          )}

          {adminNav === 'products' && (
            <ProductDashboard
              productState={productState}
              externalAddOpen={isAddDrawerOpen}
              onCloseExternalAdd={() => setIsAddDrawerOpen(false)}
              externalRestockOpen={isRestockOpen}
              onCloseExternalRestock={() => setIsRestockOpen(false)}
            />
          )}

          {adminNav === 'inventory' && (
            <AdminInventory
              products={activeCatalogProducts}
              onAdjustStock={productState.adjustStock}
              onOpenRestock={handleOpenRestock}
              onAddProduct={handleOpenAdd}
            />
          )}

          {adminNav === 'orders' && (
            <AdminOrders />
          )}

          {adminNav === 'notifications' && (
            <AdminNotifications />
          )}

          {adminNav === 'analytics' && (
            <AdminAnalytics
              products={activeCatalogProducts}
              onNavigate={(navId) => setAdminNav(navId)}
            />
          )}
        </AppShell>
      )}
    </>
  );
}

export function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CurrencyProvider>
          <CartProvider>
            <MainApp />
          </CartProvider>
        </CurrencyProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
