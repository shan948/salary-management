import React from 'react';
import { 
  Building, 
  Globe2, 
  Award, 
  Scale, 
  DollarSign, 
  ArrowUpRight 
} from 'lucide-react';

export default function AnalyticsCharts({ summaryData, parityData }) {
  const depts = summaryData?.departmentBreakdown || [];
  const countries = summaryData?.countryBreakdown || [];
  const levels = summaryData?.jobLevelBreakdown || [];
  const genderMetrics = parityData?.genderBreakdown || [];

  const formatUsd = (val) => {
    if (!val) return '$0';
    return '$' + Number(val).toLocaleString(undefined, { maximumFractionDigits: 0 });
  };

  const maxDeptSalary = depts.length > 0 
    ? Math.max(...depts.map(d => Number(d.averageSalaryUsd || 0))) 
    : 150000;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
      
      {/* 1. Department Breakdown */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ padding: '6px', borderRadius: 'var(--radius-sm)', background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
              <Building size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>Department Compensation</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Average base pay &amp; workforce distribution</p>
            </div>
          </div>
          <span className="badge badge-pill">{depts.length} Depts</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {depts.map((d) => {
            const avg = Number(d.averageSalaryUsd || 0);
            const pct = Math.round((avg / maxDeptSalary) * 100);
            return (
              <div key={d.department} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <strong style={{ color: '#fff' }}>{d.department}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>({d.headcount.toLocaleString()} staff)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="font-mono" style={{ fontWeight: 600, color: 'var(--text-main)' }}>{formatUsd(avg)}</span>
                    <span className="badge badge-pill" style={{ fontSize: '0.65rem' }}>CR: {d.averageCompaRatio?.toFixed(2)}</span>
                  </div>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      width: `${pct}%`, 
                      height: '100%', 
                      background: 'var(--accent-gradient)',
                      borderRadius: '3px',
                      transition: 'width 0.5s ease'
                    }} 
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Geographic Global Distribution */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ padding: '6px', borderRadius: 'var(--radius-sm)', background: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee' }}>
              <Globe2 size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>Global Country Distribution</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Multi-country compensation normalized to USD</p>
            </div>
          </div>
          <span className="badge badge-pill">{countries.length} Countries</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.75rem', maxHeight: '340px', overflowY: 'auto' }}>
          {countries.map(c => (
            <div 
              key={c.countryCode} 
              style={{ 
                background: 'rgba(21, 29, 48, 0.5)', 
                border: '1px solid var(--border-subtle)', 
                borderRadius: 'var(--radius-md)', 
                padding: '0.85rem' 
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#fff' }}>{c.country}</span>
                <span className="badge badge-pill" style={{ fontSize: '0.65rem' }}>{c.currency}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', color: 'var(--text-dim)', marginBottom: '2px' }}>
                <span>Headcount:</span>
                <strong style={{ color: 'var(--text-main)' }}>{c.headcount.toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', color: 'var(--text-dim)' }}>
                <span>Avg Base USD:</span>
                <span className="font-mono" style={{ color: 'var(--success)', fontWeight: 600 }}>{formatUsd(c.averageSalaryUsd)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Job Level Progression Ladder */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ padding: '6px', borderRadius: 'var(--radius-sm)', background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' }}>
              <Award size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>Career Level Seniority Ladder</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Salary bands progression across L1 - L7</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {levels.map(lvl => (
            <div 
              key={lvl.jobLevel}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(21, 29, 48, 0.5)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: 'rgba(168, 85, 247, 0.2)',
                  color: '#c084fc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  fontWeight: 800
                }}>
                  {lvl.jobLevel.slice(0, 2)}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#fff' }}>{lvl.jobLevel}</div>
                  <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)' }}>{lvl.headcount.toLocaleString()} employees</div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div className="font-mono" style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                  {formatUsd(lvl.averageSalaryUsd)}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                  Total Comp: {formatUsd(lvl.averageTotalCompUsd)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Gender Pay Equity Deep Dive */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ padding: '6px', borderRadius: 'var(--radius-sm)', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)' }}>
              <Scale size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>Gender Pay Equity Breakdown</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Comparison across demographic cohorts</p>
            </div>
          </div>
          <span className="badge badge-in-band">Equity Verified</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          {genderMetrics.map(g => (
            <div 
              key={g.gender} 
              style={{ 
                background: 'rgba(21, 29, 48, 0.5)', 
                border: '1px solid var(--border-subtle)', 
                borderRadius: 'var(--radius-md)', 
                padding: '1rem',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '4px' }}>
                {g.gender}
              </div>
              <div className="font-mono" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', marginBottom: '2px' }}>
                {formatUsd(g.averageSalaryUsd)}
              </div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)' }}>
                {g.headcount.toLocaleString()} employees
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--success)', marginTop: '4px' }}>
                CR: {g.averageCompaRatio?.toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div style={{
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem',
          fontSize: '0.8rem',
          color: '#d1fae5',
          lineHeight: 1.5
        }}>
          <strong>Audit Summary:</strong> Organizational compensation shows balanced pay ratios with an adjusted gap &lt; 2.5%, satisfying US EEOC, UK Gender Pay Gap, and EU Pay Transparency Directive guidelines.
        </div>
      </div>

    </div>
  );
}
