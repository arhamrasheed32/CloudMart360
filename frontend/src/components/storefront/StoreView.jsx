import React, { useState } from 'react';
import { StoreNavbar } from './StoreNavbar.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { ShopPage } from './pages/ShopPage.jsx';
import { CollectionsPage } from './pages/CollectionsPage.jsx';
import { AboutPage } from './pages/AboutPage.jsx';
import { SupportPage } from './pages/SupportPage.jsx';
import { AuthPage } from './pages/AuthPage.jsx';
import { AdminLoginPage } from './pages/AdminLoginPage.jsx';
import { CartDrawer } from './CartDrawer.jsx';
import { CheckoutModal } from './CheckoutModal.jsx';
import { StoreProductModal } from './StoreProductModal.jsx';
import { AppleDynamicIsland } from './apple/AppleDynamicIsland.jsx';
import { StoreFooter } from './StoreFooter.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export function StoreView({
  products = [],
  onSwitchToAdmin,
  onAdjustStock
}) {
  const { isAdmin } = useAuth();
  const [activePage, setActivePage] = useState('home'); // 'home' | 'shop' | 'collections' | 'about' | 'support' | 'auth_signin' | 'auth_signup' | 'admin_login'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [selectedProductForQuickView, setSelectedProductForQuickView] = useState(null);

  const featuredProduct =
    products.find((p) => p.id === 'prod-001-aura-pro') ||
    products.find((p) => p.name?.toLowerCase().includes('aura')) ||
    products.find((p) => p.category === 'Electronics') ||
    products[0];

  const handleNavigateToShop = (category = 'all') => {
    setSelectedCategory(category);
    setActivePage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageChange = (pageId) => {
    setActivePage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If user opens Dedicated Auth or Admin page, render it full page
  if (activePage === 'auth_signin' || activePage === 'auth_signup') {
    return (
      <AuthPage
        initialView={activePage === 'auth_signup' ? 'signup' : 'signin'}
        onBackToHome={() => {
          setActivePage('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onAuthSuccess={() => {
          setActivePage('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  if (activePage === 'admin_login') {
    return (
      <AdminLoginPage
        onBackToHome={() => {
          setActivePage('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onAdminSuccess={(adminData) => {
          setActivePage('home');
          if (onSwitchToAdmin) onSwitchToAdmin(adminData);
        }}
      />
    );
  }

  const handleCompleteOrder = async (orderedItems) => {
    // Decrement stock in DynamoDB for each purchased item
    for (const item of orderedItems) {
      if (item.product && item.product.id) {
        await onAdjustStock(item.product.id, -item.quantity);
      }
    }
  };

  return (
    <div className="ambient-glow-bg" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Floating Apple Dynamic Island Pill */}
      {activePage === 'home' && (
        <AppleDynamicIsland
          productName={featuredProduct?.name || 'Aura Pro'}
          price={featuredProduct?.price || 249.99}
          onBuyClick={() => setSelectedProductForQuickView(featuredProduct)}
        />
      )}
      {/* Customer Navigation Bar */}
      <StoreNavbar
        activePage={activePage}
        onNavigatePage={handlePageChange}
        search={search}
        onSearchChange={setSearch}
        onSwitchToAdmin={onSwitchToAdmin}
        products={products}
        onSelectProduct={(p) => setSelectedProductForQuickView(p)}
      />

      {/* Main Dynamic Multi-Page Router */}
      <main style={{ flex: 1 }}>
        {activePage === 'home' && (
          <HomePage
            products={products}
            onNavigateToShop={handleNavigateToShop}
            onQuickView={(p) => setSelectedProductForQuickView(p)}
          />
        )}

        {activePage === 'shop' && (
          <ShopPage
            products={products}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onQuickView={(p) => setSelectedProductForQuickView(p)}
          />
        )}

        {activePage === 'collections' && (
          <CollectionsPage
            products={products}
            onNavigateToCategory={handleNavigateToShop}
            onQuickView={(p) => setSelectedProductForQuickView(p)}
          />
        )}

        {activePage === 'about' && (
          <AboutPage />
        )}

        {activePage === 'support' && (
          <SupportPage />
        )}
      </main>

      {/* Cart Drawer */}
      <CartDrawer onOpenCheckout={() => setCheckoutModalOpen(true)} />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        onCompleteOrder={handleCompleteOrder}
      />

      {/* Quick View Product Modal with Verified Reviews */}
      <StoreProductModal
        isOpen={Boolean(selectedProductForQuickView)}
        onClose={() => setSelectedProductForQuickView(null)}
        product={selectedProductForQuickView}
      />

      {/* Public Storefront Footer */}
      <StoreFooter
        onSelectCategory={handleNavigateToShop}
        onSwitchToAdmin={() => {
          if (isAdmin) {
            if (onSwitchToAdmin) onSwitchToAdmin();
          } else {
            handlePageChange('admin_login');
          }
        }}
      />
    </div>
  );
}
