import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  MapPin, 
  Calendar, 
  Award, 
  DollarSign, 
  History, 
  Edit3, 
  TrendingUp, 
  ShieldCheck 
} from 'lucide-react';
import { api } from '../services/api';

export default function EmployeeDetailModal({ employee, onClose, onOpenAdjust }) {
  const [auditLogs, setAuditLogs] = useState([]);
  const [loadingAudit, setLoadingAudit] = useState(false);

  useEffect(() => {
    if (employee?.employeeId) {
      loadAudit(employee.employeeId);
    }
  }, [employee]);

  const loadAudit = async (empId) => {
    try {
      setLoadingAudit(true);
      const data = await api.getEmployeeAudit(empId);
      setAuditLogs(data || []);
    } catch {
      // Ignored
    } finally {
      setLoadingAudit(false);
    }
  };

  if (!employee) return null;

  const formatUsd = (val) => {
    if (!val) return '$0';
    return '$' + Number(val).toLocaleString(undefined, { maximumFractionDigits: 0 });
  };

  const getCompaRatioColor = (cr) => {
    if (cr < 0.8) return 'var(--warning)';
    if (cr > 1.2) return 'var(--info)';
    return 'var(--success)';
  };

  // Percentage along the band bar
  const min = Number(employee.bandMinUsd || 0);
  const max = Number(employee.bandMaxUsd || 1);
  const cur = Number(employee.baseSalaryUsd || 0);
  let posPct = max > min ? ((cur - min) / (max - min)) * 100 : 50;
  posPct = Math.max(0, Math.min(100, posPct));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '720px', padding: '2rem' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 800,
              fontSize: '1.25rem',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
            }}>
              {employee.firstName?.[0]}{employee.lastName?.[0]}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff' }}>
                  {employee.fullName}
                </h2>
                <span className="badge badge-pill">{employee.employeeId}</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {employee.jobTitle} • {employee.jobLevel}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => { onClose(); onOpenAdjust(employee); }}
              className="btn btn-primary btn-sm"
            >
              <Edit3 size={14} />
              <span>Adjust Salary</span>
            </button>
            <button
              onClick={onClose}
              className="btn btn-secondary btn-sm"
              style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0 }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Quick Metadata Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '0.75rem',
          background: 'rgba(21, 29, 48, 0.5)',
          padding: '0.85rem 1rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '1.5rem',
          fontSize: '0.8rem'
        }}>
          <div>
            <div style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>DEPARTMENT</div>
            <strong style={{ color: '#fff' }}>{employee.department}</strong>
          </div>
          <div>
            <div style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>LOCATION</div>
            <strong style={{ color: '#fff' }}>{employee.city}, {employee.countryCode}</strong>
          </div>
          <div>
            <div style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>PERFORMANCE</div>
            <strong style={{ color: 'var(--warning)' }}>Rating {employee.performanceRating} / 5</strong>
          </div>
          <div>
            <div style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>HIRE DATE</div>
            <strong style={{ color: '#fff' }}>{employee.hireDate}</strong>
          </div>
        </div>

        {/* Compensation Breakdown Cards */}
        <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
          Annualized Compensation Package
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'rgba(21, 29, 48, 0.6)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Base Salary (USD)</div>
            <div className="font-mono" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
              {formatUsd(employee.baseSalaryUsd)}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '2px' }}>
              Local: {Number(employee.baseSalaryLocal).toLocaleString()} {employee.currency}
            </div>
          </div>

          <div style={{ background: 'rgba(21, 29, 48, 0.6)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Target Bonus</div>
            <div className="font-mono" style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--success)', marginTop: '4px' }}>
              {employee.bonusPercentage}%
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '2px' }}>
              ~{formatUsd(Number(employee.baseSalaryUsd) * (Number(employee.bonusPercentage) / 100))} USD
            </div>
          </div>

          <div style={{ background: 'rgba(21, 29, 48, 0.6)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Equity / RSU</div>
            <div className="font-mono" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#818cf8', marginTop: '4px' }}>
              {formatUsd(employee.equityUsd)}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '2px' }}>
              Annual Grant
            </div>
          </div>

          <div style={{ background: 'rgba(21, 29, 48, 0.6)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Total Comp (USD)</div>
            <div className="font-mono" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#a5b4fc', marginTop: '4px' }}>
              {formatUsd(employee.totalCompUsd)}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '2px' }}>
              Total Target Cash
            </div>
          </div>
        </div>

        {/* Compa-Ratio Band Visualization */}
        <div style={{
          background: 'rgba(21, 29, 48, 0.5)',
          padding: '1.25rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#fff' }}>
              Salary Band Positioning &amp; Compa-Ratio
            </span>
            <span className="badge" style={{
              background: `rgba(${employee.compaRatio < 0.8 ? '245,158,11' : employee.compaRatio > 1.2 ? '59,130,246' : '16,185,129'}, 0.15)`,
              color: getCompaRatioColor(employee.compaRatio)
            }}>
              Compa-Ratio: {employee.compaRatio?.toFixed(2)} ({employee.compaRatioStatus?.replace('_', ' ')})
            </span>
          </div>

          {/* Visual Band Range Bar */}
          <div style={{ position: 'relative', height: '10px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '5px', margin: '20px 0 10px 0' }}>
            <div style={{
              position: 'absolute',
              left: '20%',
              right: '20%',
              height: '100%',
              background: 'rgba(16, 185, 129, 0.25)',
              borderLeft: '1px dashed var(--success)',
              borderRight: '1px dashed var(--success)'
            }} title="Standard Band Target Range (80% - 120%)" />
            
            {/* Midpoint marker */}
            <div style={{
              position: 'absolute',
              left: '50%',
              top: '-4px',
              bottom: '-4px',
              width: '2px',
              background: '#fff'
            }} title="Band Midpoint (1.00)" />

            {/* Current Position Marker */}
            <div style={{
              position: 'absolute',
              left: `${posPct}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              background: getCompaRatioColor(employee.compaRatio),
              border: '2px solid #fff',
              boxShadow: '0 0 10px rgba(0,0,0,0.5)'
            }} title={`Current: ${formatUsd(employee.baseSalaryUsd)}`} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.725rem', color: 'var(--text-dim)' }}>
            <span>Min: {formatUsd(employee.bandMinUsd)} (0.80)</span>
            <span>Midpoint: {formatUsd(employee.bandMidUsd)} (1.00)</span>
            <span>Max: {formatUsd(employee.bandMaxUsd)} (1.25)</span>
          </div>
        </div>

        {/* Audit Log Trail */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            <History size={14} />
            <span>Compensation Revision History &amp; Audit Trail</span>
          </div>

          {loadingAudit ? (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Loading audit history...</div>
          ) : auditLogs.length === 0 ? (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontStyle: 'italic', padding: '0.75rem', background: 'rgba(21, 29, 48, 0.3)', borderRadius: 'var(--radius-md)' }}>
              No revisions recorded yet. Base salary was established upon hire.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto' }}>
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(21, 29, 48, 0.5)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.8rem'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, color: '#fff' }}>
                      {formatUsd(log.previousSalaryUsd)} &rarr; {formatUsd(log.newSalaryUsd)} ({log.percentageChange > 0 ? '+' : ''}{log.percentageChange}%)
                    </div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)' }}>
                      Reason: <strong style={{ color: 'var(--text-muted)' }}>{log.reason}</strong> • By {log.adjustedBy} • {new Date(log.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                  {log.note && (
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)', maxWidth: '200px', fontStyle: 'italic' }}>
                      "{log.note}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
