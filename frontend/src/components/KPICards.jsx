import React from 'react';
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Scale, 
  AlertCircle, 
  CheckCircle2,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';

export default function KPICards({ data, loading }) {
  if (loading) {
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        {[1, 2, 3, 4].map(n => (
          <div key={n} className="glass-panel" style={{ height: '140px', padding: '1.5rem', opacity: 0.5 }}>
            <div style={{ height: '20px', width: '50%', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', marginBottom: '12px' }} />
            <div style={{ height: '36px', width: '70%', background: 'rgba(255,255,255,0.1)', borderRadius: '6px' }} />
          </div>
        ))}
      </div>
    );
  }

  const formatUsd = (val) => {
    if (!val) return '$0';
    return '$' + Number(val).toLocaleString(undefined, { maximumFractionDigits: 0 });
  };

  const totalPayroll = data?.totalAnnualPayrollUsd || 0;
  const basePayroll = data?.totalBasePayrollUsd || 0;
  const avgSalary = data?.averageBaseSalaryUsd || 0;
  const medianSalary = data?.medianBaseSalaryUsd || 0;
  const compaRatio = data?.averageCompaRatio || 1.0;
  const belowBand = data?.employeesBelowBand || 0;
  const inBand = data?.employeesInBand || 0;
  const aboveBand = data?.employeesAboveBand || 0;
  const total = (data?.totalHeadcount || 10000);
  const inBandPct = total > 0 ? Math.round((inBand / total) * 100) : 90;
  const genderGap = data?.genderPayGapPercentage || 0.0;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
      gap: '1.25rem',
      marginBottom: '2rem'
    }}>
      {/* Card 1: Total Payroll */}
      <div className="glass-panel" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          top: '-15px',
          right: '-15px',
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          background: 'rgba(99, 102, 241, 0.1)',
          filter: 'blur(20px)'
        }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Total Annual Payroll
          </span>
          <div style={{ padding: '6px', borderRadius: 'var(--radius-sm)', background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
            <DollarSign size={18} />
          </div>
        </div>
        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: '4px' }}>
          {formatUsd(totalPayroll)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.775rem', color: 'var(--text-dim)' }}>
          <span>Base: {formatUsd(basePayroll)}</span>
          <span>•</span>
          <span style={{ color: 'var(--success)' }}>+ Variable / Equity</span>
        </div>
      </div>

      {/* Card 2: Average & Median Salary */}
      <div className="glass-panel" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          top: '-15px',
          right: '-15px',
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          background: 'rgba(16, 185, 129, 0.1)',
          filter: 'blur(20px)'
        }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Average Base Pay
          </span>
          <div style={{ padding: '6px', borderRadius: 'var(--radius-sm)', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)' }}>
            <TrendingUp size={18} />
          </div>
        </div>
        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: '4px' }}>
          {formatUsd(avgSalary)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.775rem', color: 'var(--text-dim)' }}>
          <span>Median: <strong style={{ color: 'var(--text-main)' }}>{formatUsd(medianSalary)}</strong></span>
          <span>•</span>
          <span>Normalized to USD</span>
        </div>
      </div>

      {/* Card 3: Compa-Ratio Health */}
      <div className="glass-panel" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          top: '-15px',
          right: '-15px',
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          background: 'rgba(245, 158, 11, 0.1)',
          filter: 'blur(20px)'
        }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Avg Compa-Ratio
          </span>
          <div style={{ padding: '6px', borderRadius: 'var(--radius-sm)', background: 'rgba(245, 158, 11, 0.15)', color: 'var(--warning)' }}>
            <Scale size={18} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
            {compaRatio.toFixed(2)}
          </div>
          <span className="badge badge-in-band" style={{ fontSize: '0.7rem' }}>
            {inBandPct}% In Band
          </span>
        </div>
        {/* Visual band bar */}
        <div style={{ marginTop: '6px' }}>
          <div style={{ height: '6px', width: '100%', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', display: 'flex', overflow: 'hidden' }}>
            <div style={{ width: `${(belowBand/total)*100}%`, background: 'var(--warning)' }} title={`Below band: ${belowBand}`} />
            <div style={{ width: `${(inBand/total)*100}%`, background: 'var(--success)' }} title={`In band: ${inBand}`} />
            <div style={{ width: `${(aboveBand/total)*100}%`, background: 'var(--info)' }} title={`Above band: ${aboveBand}`} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            <span>{belowBand} Below</span>
            <span>{inBand} In Band</span>
            <span>{aboveBand} Above</span>
          </div>
        </div>
      </div>

      {/* Card 4: Gender Pay Parity */}
      <div className="glass-panel" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          top: '-15px',
          right: '-15px',
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          background: 'rgba(139, 92, 246, 0.1)',
          filter: 'blur(20px)'
        }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Pay Parity Health
          </span>
          <div style={{ padding: '6px', borderRadius: 'var(--radius-sm)', background: 'rgba(139, 92, 246, 0.15)', color: '#c084fc' }}>
            <ShieldCheck size={18} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
            {genderGap.toFixed(1)}%
          </div>
          <span className="badge badge-in-band" style={{ fontSize: '0.7rem' }}>
            Optimal Equity
          </span>
        </div>
        <div style={{ fontSize: '0.775rem', color: 'var(--text-dim)' }}>
          Standard benchmark: &lt; 3.0% divergence across equivalent roles.
        </div>
      </div>
    </div>
  );
}
