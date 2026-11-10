import React, { useState } from 'react';
import { AppShell } from './components/layout/AppShell.jsx';
import { ProductDashboard } from './components/products/ProductDashboard.jsx';
import { StoreView } from './components/storefront/StoreView.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { AuthModal } from './components/layout/AuthModal.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { CurrencyProvider } from './context/CurrencyContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { useProducts } from './hooks/useProducts.js';

function MainApp() {
  const productState = useProducts();
  const { user, isAdmin, openAuthModal } = useAuth();
  const [appMode, setAppMode] = useState('storefront'); // 'storefront' | 'admin'
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [isRestockOpen, setIsRestockOpen] = useState(false);

  const activeCatalogProducts = productState.allProductsRaw.length > 0
    ? productState.allProductsRaw
    : productState.products;

  const handleSwitchToAdmin = () => {
    if (!isAdmin) {
      openAuthModal('login');
      return;
    }
    setAppMode('admin');
  };

  return (
    <>
      <AuthModal />
      {appMode === 'storefront' ? (
        <StoreView
          products={activeCatalogProducts}
          onSwitchToAdmin={handleSwitchToAdmin}
          onAdjustStock={productState.adjustStock}
        />
      ) : (
        <AppShell
          onRefresh={() => productState.fetchProducts(true)}
          isRefreshing={productState.isRefreshing}
          onAddProduct={() => setIsAddDrawerOpen(true)}
          onOpenRestock={() => setIsRestockOpen(true)}
          onSwitchToStore={() => setAppMode('storefront')}
          products={activeCatalogProducts}
          databaseEngine={productState.databaseEngine}
        >
          <ProductDashboard
            productState={productState}
            externalAddOpen={isAddDrawerOpen}
            onCloseExternalAdd={() => setIsAddDrawerOpen(false)}
            externalRestockOpen={isRestockOpen}
            onCloseExternalRestock={() => setIsRestockOpen(false)}
          />
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
