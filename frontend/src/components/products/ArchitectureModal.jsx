import React, { useState, useEffect } from 'react';
import {
  Cloud,
  Database,
  Cpu,
  Globe,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Activity,
  Server
} from 'lucide-react';
import { Modal } from '../ui/Modal.jsx';
import { Button } from '../ui/Button.jsx';
import { apiService } from '../../services/api.js';

export function ArchitectureModal({ isOpen, onClose }) {
  const [statusData, setStatusData] = useState(null);
  const [latency, setLatency] = useState(null);
  const [isPinging, setIsPinging] = useState(false);

  useEffect(() => {
    if (isOpen) {
      pingStatus();
    }
  }, [isOpen]);

  const pingStatus = async () => {
    setIsPinging(true);
    const start = performance.now();
    try {
      const res = await apiService.getStatus();
      const end = performance.now();
      setStatusData(res);
      setLatency(Math.round(end - start));
    } catch (e) {
      console.error(e);
    } finally {
      setIsPinging(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AWS Serverless Architecture Specification"
      subtitle="Module 1: CloudMart 360 Product Management Infrastructure"
      maxWidth="680px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {/* Live Architecture Bridge Flow */}
        <div
          className="glass-panel"
          style={{
            padding: '20px',
            borderRadius: 'var(--radius-lg)',
            background: 'rgba(255, 255, 255, 0.02)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', minWidth: '90px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38BDF8' }}>
              <Globe size={20} />
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>React 19 UI</span>
            <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>Vite Port 3000</span>
          </div>

          <div style={{ color: 'var(--brand-primary)', fontWeight: 700, fontSize: '0.875rem' }}>→</div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', minWidth: '90px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'rgba(255, 87, 34, 0.15)', border: '1px solid rgba(255, 87, 34, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-primary)' }}>
              <Cloud size={20} />
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>API Gateway</span>
            <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>REST Proxy API</span>
          </div>

          <div style={{ color: 'var(--brand-primary)', fontWeight: 700, fontSize: '0.875rem' }}>→</div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', minWidth: '90px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-warning)' }}>
              <Cpu size={20} />
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>AWS Lambda</span>
            <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>Node.js Handlers</span>
          </div>

          <div style={{ color: 'var(--brand-primary)', fontWeight: 700, fontSize: '0.875rem' }}>→</div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', minWidth: '90px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-success)' }}>
              <Database size={20} />
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>Amazon DynamoDB</span>
            <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>NoSQL Key-Value</span>
          </div>
        </div>

        {/* Live Latency & Specs Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="glass-panel" style={{ padding: '14px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              REST API Roundtrip Latency
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <Activity size={18} color="var(--color-success)" />
              <span className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-success)' }}>
                {latency !== null ? `${latency} ms` : 'Pinging...'}
              </span>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '14px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              DynamoDB Table Target
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <Database size={18} color="var(--brand-primary)" />
              <span className="font-mono" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                CloudMart360-Products
              </span>
            </div>
          </div>
        </div>

        {/* Technical Attributes Breakdown */}
        <div className="glass-panel" style={{ padding: '16px', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Partition Key (PK)</span>
            <span className="font-mono" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>id (String, UUIDv4)</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Global Secondary Indexes (GSI)</span>
            <span className="font-mono" style={{ color: 'var(--text-secondary)' }}>CategoryIndex, StatusIndex</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Lambda Runtime</span>
            <span className="font-mono" style={{ color: 'var(--text-secondary)' }}>Node.js 20.x (ESM Modules)</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Billing Mode</span>
            <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>PAY_PER_REQUEST (On-Demand)</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Point-in-Time Recovery (PITR)</span>
            <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>Enabled</span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <Button variant="secondary" onClick={pingStatus} isLoading={isPinging}>
            Re-test Latency
          </Button>
          <Button variant="primary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
