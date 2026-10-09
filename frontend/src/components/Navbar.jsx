import React from 'react';
import { 
  Building2, 
  Users, 
  BarChart3, 
  HelpCircle, 
  Calculator, 
  RefreshCw, 
  Sparkles,
  Database
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  totalHeadcount, 
  onRefresh, 
  onTriggerSeed,
  isSeeding 
}) {
  return (
    <header style={{
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(9, 13, 22, 0.85)',
      backdropFilter: 'blur(16px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '0.75rem 2rem'
    }}>
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <Building2 size={24} color="#fff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #fff 0%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                ACME <span style={{ color: 'var(--accent-primary)', WebkitTextFillColor: '#818cf8' }}>COMP</span>
              </span>
              <span className="badge badge-pill" style={{ fontSize: '0.65rem' }}>
                HR ENTERPRISE
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              10,000 Global Workforce Compensation Platform
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          background: 'var(--bg-card-solid)',
          padding: '4px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)'
        }}>
          {[
            { id: 'overview', label: 'Executive Overview', icon: BarChart3 },
            { id: 'directory', label: 'Employee Grid (10k)', icon: Users },
            { id: 'qna', label: 'Pay Intelligence Q&A', icon: HelpCircle },
            { id: 'simulator', label: 'What-If Simulator', icon: Calculator },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: isActive ? 'var(--accent-gradient)' : 'transparent',
                  color: isActive ? '#fff' : 'var(--text-muted)',
                  boxShadow: isActive ? '0 2px 10px rgba(99, 102, 241, 0.4)' : 'none'
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Global Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            borderRadius: '9999px',
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            fontSize: '0.75rem',
            color: '#a5b4fc',
            fontWeight: 600
          }}>
            <Database size={13} />
            <span>{(totalHeadcount || 10000).toLocaleString()} Employees</span>
          </div>

          <button
            onClick={onTriggerSeed}
            disabled={isSeeding}
            className="btn btn-secondary btn-sm"
            title="Re-seed 10,000 employee dataset"
          >
            <Sparkles size={14} color="#a855f7" />
            <span>{isSeeding ? 'Seeding 10k...' : 'Seed Data'}</span>
          </button>

          <button
            onClick={onRefresh}
            className="btn btn-secondary btn-sm"
            title="Refresh analytics data"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>
    </header>
  );
}
