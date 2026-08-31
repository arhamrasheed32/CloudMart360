import React, { useState, useMemo, useEffect } from 'react';
import {
  Plus,
  Package,
  Layers,
  Sparkles,
  RefreshCw,
  Download,
  Upload,
  BarChart3,
  HelpCircle,
  AlertCircle,
  Boxes,
  Camera,
  Barcode
} from 'lucide-react';
import { Button } from '../ui/Button.jsx';
import { ProductKpiCards } from './ProductKpiCards.jsx';
import { ProductToolbar } from './ProductToolbar.jsx';
import { ProductTable } from './ProductTable.jsx';
import { ProductCards } from './ProductCards.jsx';
import { ProductFormDrawer } from './ProductFormDrawer.jsx';
import { ProductDetailsModal } from './ProductDetailsModal.jsx';
import { DeleteProductDialog } from './DeleteProductDialog.jsx';
import { ProductEmptyState } from './ProductEmptyState.jsx';
import { ProductErrorState } from './ProductErrorState.jsx';
import { ProductKpiSkeleton, ProductTableSkeleton } from './ProductSkeleton.jsx';
import { ProductAnalyticsPanel } from './ProductAnalyticsPanel.jsx';
import { CatalogImportModal } from './CatalogImportModal.jsx';
import { BulkRestockModal } from './BulkRestockModal.jsx';
import { ProductComparisonModal } from './ProductComparisonModal.jsx';
import { LiveBarcodeScannerModal } from './LiveBarcodeScannerModal.jsx';
import { KeyboardShortcutsModal } from '../ui/KeyboardShortcutsModal.jsx';
import { Pagination } from '../ui/Pagination.jsx';
import { CommandPalette } from '../ui/CommandPalette.jsx';
import { BatchActionBar } from './BatchActionBar.jsx';
import { exportProductsToCSV } from '../../utils/csvExporter.js';
import { useToast } from '../../context/ToastContext.jsx';
import { playClickTone, playSuccessChime, playDeleteTone } from '../../utils/audioFeedback.js';

export function ProductDashboard({
  productState,
  externalAddOpen,
  onCloseExternalAdd,
  externalRestockOpen,
  onCloseExternalRestock
}) {
  const {
    products,
    allProductsRaw,
    kpis,
    isLoading,
    isRefreshing,
    error,
    databaseEngine,
    // Filters & Sorting
    search,
    setSearch,
    category,
    setCategory,
    status,
    setStatus,
    stockCondition,
    setStockCondition,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    resetFilters,
    // Multi-Selection
    selectedIds,
    toggleSelectId,
    toggleSelectAll,
    clearSelection,
    // Mutations
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    batchUpdateStatus,
    batchDelete,
    adjustStock
  } = productState;

  const { showSuccess, showError, showInfo } = useToast();

  // Local UI State
  const [viewMode, setViewMode] = useState('table');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAnalyticsPanel, setShowAnalyticsPanel] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [restockModalOpen, setRestockModalOpen] = useState(false);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [scannerModalOpen, setScannerModalOpen] = useState(false);
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false);
  const [isProcessingBatch, setIsProcessingBatch] = useState(false);
  const pageSize = 8;

  // Modals & Drawers state
  const [formDrawerOpen, setFormDrawerOpen] = useState(false);
  const [selectedProductForEdit, setSelectedProductForEdit] = useState(null);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  // Sync external triggers
  useEffect(() => {
    if (externalAddOpen) {
      setSelectedProductForEdit(null);
      setFormDrawerOpen(true);
    }
  }, [externalAddOpen]);

  useEffect(() => {
    if (externalRestockOpen) {
      setRestockModalOpen(true);
    }
  }, [externalRestockOpen]);

  // Global hotkeys (N, E, I, A, ?, V, R)
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (
        document.activeElement.tagName === 'INPUT' ||
        document.activeElement.tagName === 'TEXTAREA' ||
        document.activeElement.tagName === 'SELECT'
      ) {
        return;
      }

      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setShortcutsModalOpen(true);
      } else if (e.key.toLowerCase() === 'n' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        handleOpenAdd();
      } else if (e.key.toLowerCase() === 'e' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        handleExportFullCatalog();
      } else if (e.key.toLowerCase() === 'i' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setImportModalOpen(true);
      } else if (e.key.toLowerCase() === 'r' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setRestockModalOpen(true);
      } else if (e.key.toLowerCase() === 'a' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setShowAnalyticsPanel((prev) => !prev);
      } else if (e.key.toLowerCase() === 'v' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setViewMode((prev) => (prev === 'table' ? 'grid' : 'table'));
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [products]);

  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedProductForDetails, setSelectedProductForDetails] = useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProductForDelete, setSelectedProductForDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Pagination Slice
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return products.slice(start, start + pageSize);
  }, [products, currentPage, pageSize]);

  // Adjust page when products count changes
  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(products.length / pageSize));
    if (currentPage > maxPage) {
      setCurrentPage(maxPage);
    }
  }, [products.length, pageSize, currentPage]);

  // Handlers
  const handleOpenAdd = () => {
    playClickTone();
    setSelectedProductForEdit(null);
    setFormDrawerOpen(true);
  };

  const handleOpenEdit = (product) => {
    playClickTone();
    setSelectedProductForEdit(product);
    setFormDrawerOpen(true);
  };

  const handleOpenDetails = (product) => {
    playClickTone();
    setSelectedProductForDetails(product);
    setDetailsModalOpen(true);
  };

  const handleOpenDelete = (product) => {
    playClickTone();
    setSelectedProductForDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleDuplicateProduct = (product) => {
    playClickTone();
    const duplicated = {
      ...product,
      id: undefined,
      name: `${product.name} (Copy)`,
      sku: '',
      stock: 0,
      status: 'draft'
    };
    setSelectedProductForEdit(duplicated);
    setFormDrawerOpen(true);
    showInfo(`Cloned '${product.name}'. Adjust attributes and save to catalog.`, 'Product Cloned');
  };

  const handleFormSubmit = async (formData, productId) => {
    setIsSubmittingForm(true);
    try {
      if (productId) {
        // Edit Mode
        const updated = await updateProduct(productId, formData);
        playSuccessChime();
        showSuccess(`Product "${updated.name}" updated successfully in DynamoDB`, 'Product Updated');
      } else {
        // Create Mode
        const created = await createProduct(formData);
        playSuccessChime();
        showSuccess(`Product "${created.name}" added to retail catalog`, 'Product Created');
      }
      setFormDrawerOpen(false);
      setSelectedProductForEdit(null);
      if (onCloseExternalAdd) onCloseExternalAdd();
    } catch (err) {
      console.error('[Dashboard] Form submit error:', err);
      showError(err.message || 'Failed to save product', 'Save Error');
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const handleConfirmDelete = async (productId) => {
    setIsDeleting(true);
    try {
      await deleteProduct(productId);
      playDeleteTone();
      showSuccess(`Product permanently removed from DynamoDB catalog`, 'Product Deleted');
      setDeleteDialogOpen(false);
      setSelectedProductForDelete(null);
    } catch (err) {
      console.error('[Dashboard] Delete error:', err);
      showError(err.message || 'Failed to delete product', 'Delete Error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Bulk Import
  const handleImportProducts = async (importedItems) => {
    let successCount = 0;
    for (const item of importedItems) {
      try {
        await createProduct(item);
        successCount++;
      } catch (e) {
        console.error('Import item error:', e);
      }
    }
    playSuccessChime();
    showSuccess(`Successfully imported ${successCount} products into DynamoDB`, 'Import Complete');
  };

  // Bulk Restock
  const handleApplyBulkRestock = async (updates) => {
    for (const item of updates) {
      try {
        await adjustStock(item.id, item.delta);
      } catch (e) {
        console.error('Bulk restock item error:', e);
      }
    }
    playSuccessChime();
    showSuccess(`Replenished inventory across ${updates.length} products`, 'Restock Complete');
    if (onCloseExternalRestock) onCloseExternalRestock();
  };

  // Batch Operations
  const handleBatchStatusChange = async (newStatus) => {
    if (selectedIds.length === 0) return;
    setIsProcessingBatch(true);
    try {
      await batchUpdateStatus(selectedIds, newStatus);
      playSuccessChime();
      showSuccess(`Updated ${selectedIds.length} products to status '${newStatus}'`, 'Batch Update');
    } catch (e) {
      showError(e.message || 'Failed batch update', 'Batch Error');
    } finally {
      setIsProcessingBatch(false);
    }
  };

  const handleBatchDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} products from DynamoDB?`)) return;
    setIsProcessingBatch(true);
    try {
      await batchDelete(selectedIds);
      playDeleteTone();
      showSuccess(`Deleted ${selectedIds.length} products from DynamoDB`, 'Batch Delete');
    } catch (e) {
      showError(e.message || 'Failed batch delete', 'Batch Error');
    } finally {
      setIsProcessingBatch(false);
    }
  };

  const handleExportSelected = () => {
    playClickTone();
    const subset = products.filter((p) => selectedIds.includes(p.id));
    exportProductsToCSV(subset, 'cloudmart360-selected-products.csv');
    showSuccess(`Exported ${subset.length} products to CSV`, 'Export Completed');
  };

  const handleExportFullCatalog = () => {
    playClickTone();
    exportProductsToCSV(products, 'cloudmart360-full-catalog.csv');
    showSuccess(`Exported ${products.length} products to CSV`, 'Export Completed');
  };

  const handleInlineStockAdjust = async (id, delta) => {
    try {
      const updated = await adjustStock(id, delta);
      playSuccessChime();
      showSuccess(`Stock adjusted: ${updated.name} now at ${updated.stock} units`, 'Stock Updated');
    } catch (e) {
      showError(e.message || 'Failed to adjust stock', 'Stock Error');
    }
  };

  const handleKpiDrillDown = (filterType) => {
    playClickTone();
    if (filterType === 'all') {
      resetFilters();
    } else if (filterType === 'active') {
      setStatus('active');
    } else if (filterType === 'low_stock') {
      setStockCondition('low_stock');
    } else if (filterType === 'out_of_stock') {
      setStockCondition('out_of_stock');
    }
  };

  const handleSortChange = (field, order) => {
    playClickTone();
    setSortBy(field);
    setSortOrder(order);
  };

  const isFilterActive =
    search.trim() !== '' ||
    category !== 'all' ||
    status !== 'all' ||
    stockCondition !== 'all' ||
    minPrice !== '' ||
    maxPrice !== '';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Dashboard Page Header */}
      <section
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          paddingBottom: '6px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.025em' }}>
              Products
            </h1>
            <span
              className="badge"
              style={{
                background: 'var(--brand-subtle)',
                color: 'var(--brand-primary)',
                border: '1px solid rgba(255, 87, 34, 0.3)',
                fontSize: '0.6875rem'
              }}
            >
              Module 1: Live
            </span>
          </div>

          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px', maxWidth: '600px' }}>
            Manage your cloud retail catalog, live inventory thresholds, item pricing, and Amazon DynamoDB records.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Button
            variant={showAnalyticsPanel ? 'primary' : 'secondary'}
            size="md"
            onClick={() => {
              playClickTone();
              setShowAnalyticsPanel(!showAnalyticsPanel);
            }}
            icon={BarChart3}
            title="Toggle Visual Analytics Insights (A)"
          >
            <span className="desktop-btn-text">Insights</span>
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={() => {
              playClickTone();
              setImportModalOpen(true);
            }}
            icon={Upload}
            title="Import Catalog from CSV / JSON (I)"
          >
            <span className="desktop-btn-text">Import</span>
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={handleExportFullCatalog}
            icon={Download}
            title="Export full catalog to CSV (E)"
          >
            <span className="desktop-btn-text">Export</span>
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={() => {
              playClickTone();
              setScannerModalOpen(true);
            }}
            icon={Camera}
            title="Scan Barcode / QR with Camera or Scanner"
          >
            <span className="desktop-btn-text">Scan Barcode</span>
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={handleOpenAdd}
            icon={Plus}
            title="Add new product (N)"
          >
            Add Product
          </Button>

          <button
            onClick={() => {
              playClickTone();
              setShortcutsModalOpen(true);
            }}
            aria-label="Keyboard Shortcuts"
            style={{
              padding: '8px',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-muted)',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Keyboard Shortcuts (?)"
          >
            <HelpCircle size={18} />
          </button>
        </div>
      </section>

      {/* Expandable Visual Analytics & Insights Panel */}
      {showAnalyticsPanel && (
        <ProductAnalyticsPanel
          products={allProductsRaw.length > 0 ? allProductsRaw : products}
          onFilterCategory={(cat) => setCategory(cat)}
          onClose={() => setShowAnalyticsPanel(false)}
        />
      )}

      {/* KPI Metrics Summary Section with Click-to-filter drill down */}
      {isLoading ? (
        <ProductKpiSkeleton />
      ) : (
        <ProductKpiCards
          kpis={kpis}
          activeFilter={stockCondition !== 'all' ? stockCondition : status !== 'all' ? status : 'all'}
          onDrillDown={handleKpiDrillDown}
        />
      )}

      {/* Error State */}
      {error && (
        <ProductErrorState
          errorMessage={error}
          onRetry={() => fetchProducts(true)}
          isRetrying={isRefreshing}
        />
      )}

      {/* Main Content Area: Toolbar + Table/Cards */}
      {!error && (
        <>
          <ProductToolbar
            search={search}
            onSearchChange={setSearch}
            category={category}
            onCategoryChange={setCategory}
            status={status}
            onStatusChange={setStatus}
            stockCondition={stockCondition}
            onStockConditionChange={setStockCondition}
            minPrice={minPrice}
            onMinPriceChange={setMinPrice}
            maxPrice={maxPrice}
            onMaxPriceChange={setMaxPrice}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
            onResetFilters={resetFilters}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onOpenCommandPalette={() => setCommandPaletteOpen(true)}
            onExportCSV={handleExportFullCatalog}
            totalResults={products.length}
          />

          {isLoading ? (
            <ProductTableSkeleton rows={6} />
          ) : products.length === 0 ? (
            <ProductEmptyState
              isFiltered={isFilterActive}
              searchTerm={search}
              onResetFilters={resetFilters}
              onAddProduct={handleOpenAdd}
            />
          ) : (
            <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
              {viewMode === 'table' ? (
                <ProductTable
                  products={paginatedProducts}
                  selectedIds={selectedIds}
                  onToggleSelectId={toggleSelectId}
                  onToggleSelectAll={toggleSelectAll}
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSortChange}
                  onViewProduct={handleOpenDetails}
                  onEditProduct={handleOpenEdit}
                  onDeleteProduct={handleOpenDelete}
                  onDuplicateProduct={handleDuplicateProduct}
                  onAdjustStock={handleInlineStockAdjust}
                />
              ) : (
                <div style={{ padding: '20px' }}>
                  <ProductCards
                    products={paginatedProducts}
                    onViewProduct={handleOpenDetails}
                    onEditProduct={handleOpenEdit}
                    onDeleteProduct={handleOpenDelete}
                  />
                </div>
              )}

              {/* Pagination Controls */}
              <Pagination
                currentPage={currentPage}
                totalItems={products.length}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      )}

      {/* Floating Batch Action Bar */}
      <BatchActionBar
        selectedCount={selectedIds.length}
        onClearSelection={clearSelection}
        onBatchStatusChange={handleBatchStatusChange}
        onBatchDelete={handleBatchDelete}
        onExportSelected={handleExportSelected}
        onCompareSelected={() => setCompareModalOpen(true)}
        isProcessing={isProcessingBatch}
      />

      {/* Product Side-by-Side Comparison Modal */}
      <ProductComparisonModal
        isOpen={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
        products={products.filter((p) => selectedIds.includes(p.id))}
      />

      {/* Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        products={allProductsRaw.length > 0 ? allProductsRaw : products}
        onSelectProduct={handleOpenDetails}
        onAddProduct={handleOpenAdd}
        onFilterLowStock={() => setStockCondition('low_stock')}
        onFilterOutOfStock={() => setStockCondition('out_of_stock')}
        onExportCSV={handleExportFullCatalog}
        onRefresh={() => fetchProducts(true)}
        onToggleViewMode={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}
      />

      {/* Live Barcode & QR Scanner Modal */}
      <LiveBarcodeScannerModal
        isOpen={scannerModalOpen}
        onClose={() => setScannerModalOpen(false)}
        products={allProductsRaw.length > 0 ? allProductsRaw : products}
        onAdjustStock={adjustStock}
        onViewProduct={handleOpenDetails}
      />

      {/* CSV / JSON Bulk Catalog Importer Modal */}
      <CatalogImportModal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onImportProducts={handleImportProducts}
      />

      {/* Bulk Inventory Replenishment Modal */}
      <BulkRestockModal
        isOpen={restockModalOpen}
        onClose={() => {
          setRestockModalOpen(false);
          if (onCloseExternalRestock) onCloseExternalRestock();
        }}
        products={allProductsRaw.length > 0 ? allProductsRaw : products}
        onApplyRestock={handleApplyBulkRestock}
      />

      {/* Keyboard Shortcuts Cheat Sheet Modal (?) */}
      <KeyboardShortcutsModal
        isOpen={shortcutsModalOpen}
        onClose={() => setShortcutsModalOpen(false)}
      />

      {/* Add / Edit Slide-over Form Drawer */}
      <ProductFormDrawer
        isOpen={formDrawerOpen}
        onClose={() => {
          setFormDrawerOpen(false);
          setSelectedProductForEdit(null);
          if (onCloseExternalAdd) onCloseExternalAdd();
        }}
        onSubmit={handleFormSubmit}
        product={selectedProductForEdit}
        isSubmitting={isSubmittingForm}
      />

      {/* Product Details Specification Modal */}
      <ProductDetailsModal
        isOpen={detailsModalOpen}
        onClose={() => {
          setDetailsModalOpen(false);
          setSelectedProductForDetails(null);
        }}
        product={selectedProductForDetails}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
        onDuplicate={handleDuplicateProduct}
      />

      {/* Destructive Delete Confirmation Dialog */}
      <DeleteProductDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSelectedProductForDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        product={selectedProductForDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
