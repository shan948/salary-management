import React, { useState, useEffect } from 'react';
import { 
  X, 
  DollarSign, 
  TrendingUp, 
  Scale, 
  FileText, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

export default function SalaryAdjustmentModal({ employee, onClose, onSave }) {
  const [newSalary, setNewSalary] = useState(employee?.baseSalaryUsd || 0);
  const [newBonus, setNewBonus] = useState(employee?.bonusPercentage || 0);
  const [newEquity, setNewEquity] = useState(employee?.equityUsd || 0);
  const [reason, setReason] = useState('MERIT');
  const [note, setNote] = useState('');
  const [adjustedBy, setAdjustedBy] = useState('HR Manager');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!employee) return null;

  const prevSalary = Number(employee.baseSalaryUsd || 0);
  const curSalary = Number(newSalary || 0);
  const diff = curSalary - prevSalary;
  const pctChange = prevSalary > 0 ? ((diff / prevSalary) * 100).toFixed(2) : '0.00';

  // Real-time compa-ratio calculation
  const midUsd = Number(employee.bandMidUsd || 1);
  const liveCompaRatio = midUsd > 0 ? (curSalary / midUsd).toFixed(2) : '1.00';

  const formatUsd = (val) => {
    return '$' + Number(val).toLocaleString(undefined, { maximumFractionDigits: 0 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (curSalary <= 0) {
      setError('Salary must be greater than 0.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave(employee.employeeId, {
        newBaseSalaryUsd: curSalary,
        newBonusPercentage: Number(newBonus),
        newEquityUsd: Number(newEquity),
        reason,
        note,
        adjustedBy
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to adjust salary');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '2rem' }}>
        
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
              Adjust Compensation
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {employee.fullName} ({employee.employeeId}) • {employee.jobTitle}
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="btn btn-secondary btn-sm"
            style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0 }}
          >
            <X size={16} />
          </button>
        </div>

        {error && (
          <div style={{
            background: 'var(--danger-bg)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem',
            color: 'var(--danger)',
            fontSize: '0.85rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertTriangle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Comparison summary card */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.75rem',
            background: 'rgba(21, 29, 48, 0.6)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Current Base</div>
              <div className="font-mono" style={{ fontWeight: 700, fontSize: '1.05rem', color: '#fff' }}>
                {formatUsd(prevSalary)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Adjustment Delta</div>
              <div className="font-mono" style={{
                fontWeight: 700,
                fontSize: '1.05rem',
                color: diff > 0 ? 'var(--success)' : diff < 0 ? 'var(--danger)' : 'var(--text-muted)'
              }}>
                {diff > 0 ? '+' : ''}{pctChange}% ({formatUsd(diff)})
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Projected CR</div>
              <div className="font-mono" style={{ fontWeight: 700, fontSize: '1.05rem', color: '#818cf8' }}>
                {liveCompaRatio}
              </div>
            </div>
          </div>

          {/* New Base Salary USD Input */}
          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
              New Annual Base Salary (USD)
            </label>
            <div style={{ position: 'relative' }}>
              <DollarSign size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input
                type="number"
                step="500"
                value={newSalary}
                onChange={(e) => setNewSalary(Number(e.target.value))}
                className="input-field"
                style={{ paddingLeft: '36px' }}
                required
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.725rem', color: 'var(--text-dim)', marginTop: '4px' }}>
              <span>Band Min: {formatUsd(employee.bandMinUsd)}</span>
              <span>Midpoint: {formatUsd(employee.bandMidUsd)}</span>
              <span>Max: {formatUsd(employee.bandMaxUsd)}</span>
            </div>
          </div>

          {/* Bonus % and Equity */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                Target Variable Bonus (%)
              </label>
              <input
                type="number"
                step="0.5"
                value={newBonus}
                onChange={(e) => setNewBonus(Number(e.target.value))}
                className="input-field"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                Annual Equity Grant (USD)
              </label>
              <input
                type="number"
                step="1000"
                value={newEquity}
                onChange={(e) => setNewEquity(Number(e.target.value))}
                className="input-field"
              />
            </div>
          </div>

          {/* Reason & Approver */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                Adjustment Reason
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="select-field"
              >
                <option value="MERIT">Merit Increase (Performance)</option>
                <option value="PROMOTION">Promotion / Grade Advancement</option>
                <option value="MARKET_ADJUSTMENT">Market Cost-of-Living Adjustment</option>
                <option value="EQUITY_CORRECTION">Pay Parity / Equity Correction</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                Authorized By
              </label>
              <input
                type="text"
                value={adjustedBy}
                onChange={(e) => setAdjustedBy(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          {/* Justification Note */}
          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
              Audit Justification / Internal Notes
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="input-field"
              rows={2}
              placeholder="e.g., Annual compensation review, achieved top tier performance ranking..."
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
              <CheckCircle2 size={16} />
              <span>{isSubmitting ? 'Saving...' : 'Confirm & Log Adjustment'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
