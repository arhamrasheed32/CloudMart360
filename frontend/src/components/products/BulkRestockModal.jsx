import React, { useState, useEffect } from 'react';
import {
  Boxes,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Plus,
  Coins,
  Truck
} from 'lucide-react';
import { Modal } from '../ui/Modal.jsx';
import { Button } from '../ui/Button.jsx';
import { formatCurrency } from '../../utils/formatters.js';

export function BulkRestockModal({
  isOpen,
  onClose,
  products = [],
  onApplyRestock
}) {
  const [restockMap, setRestockMap] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get low-stock and out-of-stock items
  const lowStockItems = products.filter(
    (p) => Number(p.stock) <= (p.minStockThreshold || 10)
  );

  useEffect(() => {
    const initialMap = {};
    lowStockItems.forEach((p) => {
      // Default recommended restock quantity (e.g. 25 units)
      initialMap[p.id] = 25;
    });
    setRestockMap(initialMap);
  }, [isOpen, products]);

  const handleQtyChange = (id, val) => {
    const qty = Math.max(0, parseInt(val, 10) || 0);
    setRestockMap((prev) => ({ ...prev, [id]: qty }));
  };

  // Calculate estimated replenishment investment
  const totalInvestment = lowStockItems.reduce((sum, p) => {
    const qty = restockMap[p.id] || 0;
    const cost = Number(p.costPrice || (p.price * 0.4) || 0);
    return sum + (qty * cost);
  }, 0);

  const totalUnits = Object.values(restockMap).reduce((sum, q) => sum + (Number(q) || 0), 0);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const updates = Object.entries(restockMap)
        .filter(([_, qty]) => qty > 0)
        .map(([id, qty]) => ({ id, delta: qty }));

      await onApplyRestock(updates);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Inventory Replenishment Wizard"
      subtitle="Restock all depleted and low-inventory items across your retail catalog."
      maxWidth="700px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Summary Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          <div className="glass-panel" style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.03)' }}>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Items Requiring Restock</div>
            <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-warning)', marginTop: '2px' }}>
              {lowStockItems.length} Products
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.03)' }}>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Units to Add</div>
            <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
              +{totalUnits} Units
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.03)' }}>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Est. Cost Investment</div>
            <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-success)', marginTop: '2px' }}>
              {formatCurrency(totalInvestment)}
            </div>
          </div>
        </div>

        {/* Low Stock Items List */}
        {lowStockItems.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <CheckCircle2 size={32} color="var(--color-success)" style={{ margin: '0 auto 8px auto' }} />
            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>All Inventory Healthy</div>
            <div style={{ fontSize: '0.8125rem', marginTop: '2px' }}>No catalog items are currently below their minimum threshold.</div>
          </div>
        ) : (
          <div className="table-container" style={{ maxHeight: '280px', overflowY: 'auto' }}>
            <table className="glass-table" style={{ fontSize: '0.8125rem' }}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Current Stock</th>
                  <th>Threshold</th>
                  <th>Replenish Qty</th>
                </tr>
              </thead>
              <tbody>
                {lowStockItems.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</div>
                      <div className="font-mono" style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{p.sku}</div>
                    </td>
                    <td>
                      <span className="font-mono" style={{ color: p.stock === 0 ? 'var(--color-danger)' : 'var(--color-warning)', fontWeight: 700 }}>
                        {p.stock} units
                      </span>
                    </td>
                    <td>
                      <span className="font-mono" style={{ color: 'var(--text-muted)' }}>
                        {p.minStockThreshold || 10} units
                      </span>
                    </td>
                    <td style={{ width: '130px' }}>
                      <input
                        type="number"
                        min="0"
                        value={restockMap[p.id] !== undefined ? restockMap[p.id] : 25}
                        onChange={(e) => handleQtyChange(p.id, e.target.value)}
                        className="glass-input font-mono"
                        style={{ width: '90px', height: '32px', padding: '0 8px', fontSize: '0.8125rem' }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={lowStockItems.length === 0 || totalUnits === 0 || isSubmitting}
            isLoading={isSubmitting}
            icon={Truck}
          >
            Apply Restock (+{totalUnits} units)
          </Button>
        </div>
      </div>
    </Modal>
  );
}
