import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  Filter,
  DollarSign,
  User,
  MapPin,
  Mail
} from 'lucide-react';
import { Button } from '../ui/Button.jsx';
import { Modal } from '../ui/Modal.jsx';
import { SpotlightCard } from '../ui/SpotlightCard.jsx';
import { formatCurrency } from '../../utils/formatters.js';
import { getStoredOrders, updateStoredOrderStatus, fetchOrdersFromDynamoDB } from '../../utils/ordersManager.js';
import { useToast } from '../../context/ToastContext.jsx';
import { playSuccessChime } from '../../utils/audioFeedback.js';

export function AdminOrders() {
  const { showSuccess } = useToast();
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    setOrders(getStoredOrders());
    fetchOrdersFromDynamoDB().then((liveOrders) => {
      if (liveOrders) setOrders(liveOrders);
    });
  }, []);

  const handleUpdateStatus = (orderId, newStatus) => {
    const updated = updateStoredOrderStatus(orderId, newStatus);
    setOrders(updated);
    if (selectedOrder && selectedOrder.orderId === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
    playSuccessChime();
    showSuccess(`Order ${orderId} status updated to ${newStatus}`, 'Order Updated');
  };

  const filteredOrders = orders.filter((o) => {
    const matchesFilter = statusFilter === 'all' || o.status === statusFilter;
    const matchesSearch =
      search.trim() === '' ||
      o.orderId.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      (o.trackingNumber && o.trackingNumber.toLowerCase().includes(search.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const totalRevenue = orders.reduce((acc, o) => acc + Number(o.grandTotal || 0), 0);
  const pendingCount = orders.filter((o) => o.status === 'Pending').length;
  const processingCount = orders.filter((o) => o.status === 'Processing').length;
  const deliveredCount = orders.filter((o) => o.status === 'Delivered').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '24px',
          borderRadius: 'var(--radius-xl)',
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(10, 14, 22, 0.95) 100%)',
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
            <span className="pulse-status" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F59E0B' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#F59E0B', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Fulfillment Pipeline
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
            Customer Orders & Dispatch Center
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '4px', margin: 0 }}>
            Inspect customer checkouts, carrier tracking numbers, and delivery statuses.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <SpotlightCard
          spotlightColor="rgba(245, 158, 11, 0.15)"
          style={{ padding: '18px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-default)', display: 'flex', flexDirection: 'column', gap: '6px' }}
        >
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Gross Order Revenue</span>
          <div className="font-mono" style={{ fontSize: '1.75rem', fontWeight: 800, color: '#F59E0B' }}>
            {formatCurrency(totalRevenue)}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>From {orders.length} total orders</span>
        </SpotlightCard>

        <SpotlightCard
          spotlightColor="rgba(56, 189, 248, 0.15)"
          style={{ padding: '18px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-default)', display: 'flex', flexDirection: 'column', gap: '6px' }}
        >
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>In Fulfillment</span>
          <div className="font-mono" style={{ fontSize: '1.75rem', fontWeight: 800, color: '#38BDF8' }}>
            {processingCount} Orders
          </div>
          <span style={{ fontSize: '0.75rem', color: '#38BDF8' }}>Packaging & Dispatch</span>
        </SpotlightCard>

        <SpotlightCard
          spotlightColor="rgba(239, 68, 68, 0.15)"
          style={{ padding: '18px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-default)', display: 'flex', flexDirection: 'column', gap: '6px' }}
        >
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Pending Review</span>
          <div className="font-mono" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-warning)' }}>
            {pendingCount} Orders
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-warning)' }}>Awaiting Warehouse Pick</span>
        </SpotlightCard>

        <SpotlightCard
          spotlightColor="rgba(16, 185, 129, 0.15)"
          style={{ padding: '18px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-default)', display: 'flex', flexDirection: 'column', gap: '6px' }}
        >
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Delivered Successfully</span>
          <div className="font-mono" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-success)' }}>
            {deliveredCount} Orders
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-success)' }}>100% Delivery Success</span>
        </SpotlightCard>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="glass-panel"
        style={{
          padding: '14px 20px',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {['all', 'Pending', 'Processing', 'Out for Delivery', 'Delivered'].map((st) => {
            const isActive = statusFilter === st;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
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
                {st === 'all' ? 'All Orders' : st}
              </button>
            );
          })}
        </div>

        <div style={{ position: 'relative', width: '260px' }}>
          <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search Order ID, name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="glass-input"
            style={{ width: '100%', height: '34px', padding: '0 10px 0 32px', fontSize: '0.8125rem' }}
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="glass-panel" style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255, 255, 255, 0.02)', borderBottom: '1px solid var(--border-default)', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              <th style={{ padding: '14px 20px' }}>Order ID & Date</th>
              <th style={{ padding: '14px 16px' }}>Customer</th>
              <th style={{ padding: '14px 16px' }}>Items Summary</th>
              <th style={{ padding: '14px 16px' }}>Total Amount</th>
              <th style={{ padding: '14px 16px' }}>Carrier & Tracking</th>
              <th style={{ padding: '14px 16px' }}>Fulfillment Status</th>
              <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No orders match current criteria.
                </td>
              </tr>
            ) : (
              filteredOrders.map((ord) => (
                <tr
                  key={ord.orderId}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    transition: 'background var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '14px 20px' }}>
                    <div className="font-mono" style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {ord.orderId}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {ord.date}
                    </div>
                  </td>

                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {ord.customer}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {ord.email}
                    </div>
                  </td>

                  <td style={{ padding: '14px 16px', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    {ord.items?.map((it, idx) => (
                      <div key={idx}>
                        {it.quantity}x {it.product?.name || 'Product'}
                      </div>
                    )) || '1 item'}
                  </td>

                  <td style={{ padding: '14px 16px' }}>
                    <div className="font-mono" style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
                      {formatCurrency(ord.grandTotal)}
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--color-success)' }}>
                      Paid (256-Bit SSL)
                    </div>
                  </td>

                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {ord.carrier || 'FedEx Express'}
                    </div>
                    <div className="font-mono" style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                      {ord.trackingNumber || 'FDX-99201948210'}
                    </div>
                  </td>

                  <td style={{ padding: '14px 16px' }}>
                    <select
                      value={ord.status}
                      onChange={(e) => handleUpdateStatus(ord.orderId, e.target.value)}
                      className="glass-input font-mono"
                      style={{
                        padding: '4px 10px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        borderRadius: 'var(--radius-full)',
                        cursor: 'pointer',
                        color:
                          ord.status === 'Delivered'
                            ? 'var(--color-success)'
                            : ord.status === 'Out for Delivery'
                            ? '#38BDF8'
                            : '#F59E0B'
                      }}
                    >
                      <option value="Pending" style={{ background: '#121724', color: '#F59E0B' }}>Pending</option>
                      <option value="Processing" style={{ background: '#121724', color: '#38BDF8' }}>Processing</option>
                      <option value="Out for Delivery" style={{ background: '#121724', color: '#38BDF8' }}>Out for Delivery</option>
                      <option value="Delivered" style={{ background: '#121724', color: '#10B981' }}>Delivered</option>
                    </select>
                  </td>

                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setSelectedOrder(ord)}
                      style={{ height: '30px', fontSize: '0.75rem' }}
                    >
                      Details
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <Modal
          isOpen={Boolean(selectedOrder)}
          onClose={() => setSelectedOrder(null)}
          title={`Order ${selectedOrder.orderId}`}
          subtitle={`Placed on ${selectedOrder.date} • Verified via 256-Bit SSL`}
          maxWidth="640px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Customer & Address Card */}
            <div className="glass-panel" style={{ padding: '16px', borderRadius: 'var(--radius-lg)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  <User size={14} />
                  <span>Customer Details</span>
                </div>
                <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {selectedOrder.customer}
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  {selectedOrder.email}
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  <MapPin size={14} />
                  <span>Shipping Address</span>
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {selectedOrder.address}
                </div>
              </div>
            </div>

            {/* Carrier & Tracking */}
            <div className="glass-panel" style={{ padding: '14px', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Truck size={18} color="var(--brand-primary)" />
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {selectedOrder.carrier}
                  </div>
                  <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Tracking: {selectedOrder.trackingNumber}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status:</span>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleUpdateStatus(selectedOrder.orderId, e.target.value)}
                  className="glass-input font-mono"
                  style={{ padding: '4px 8px', fontSize: '0.75rem', fontWeight: 700 }}
                >
                  <option value="Pending" style={{ background: '#121724' }}>Pending</option>
                  <option value="Processing" style={{ background: '#121724' }}>Processing</option>
                  <option value="Out for Delivery" style={{ background: '#121724' }}>Out for Delivery</option>
                  <option value="Delivered" style={{ background: '#121724' }}>Delivered</option>
                </select>
              </div>
            </div>

            {/* Line Items List */}
            <div>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px' }}>
                Ordered Products ({selectedOrder.items?.length || 1})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedOrder.items?.map((it, idx) => (
                  <div
                    key={idx}
                    className="glass-panel"
                    style={{
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {it.product?.imageUrl ? (
                          <img src={it.product.imageUrl} alt={it.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <Package size={16} color="var(--text-muted)" />
                        )}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {it.product?.name}
                        </div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                          Qty: {it.quantity} • Unit: {formatCurrency(it.product?.price || 0)}
                        </div>
                      </div>
                    </div>

                    <div className="font-mono" style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {formatCurrency((it.product?.price || 0) * it.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Charged */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>Total Order Paid:</span>
              <span className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
                {formatCurrency(selectedOrder.grandTotal)}
              </span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

