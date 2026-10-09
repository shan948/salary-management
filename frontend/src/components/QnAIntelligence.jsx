import React, { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  Sparkles, 
  CheckCircle, 
  TrendingUp, 
  Scale, 
  Globe2, 
  Award, 
  Lightbulb, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';

export default function QnAIntelligence({ qnaData, loading }) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const questions = qnaData?.questions || [];

  const categories = [
    { id: 'ALL', label: 'All Questions' },
    { id: 'SPEND', label: 'Payroll & Spend' },
    { id: 'PARITY', label: 'Pay Parity & Equity' },
    { id: 'BANDS', label: 'Bands & Compa-Ratio' },
    { id: 'GEOGRAPHY', label: 'Geographic Variance' }
  ];

  const filteredQuestions = questions.filter(q => {
    const matchesCat = selectedCategory === 'ALL' || q.category === selectedCategory;
    const matchesQuery = !searchQuery || 
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.shortAnswer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Sparkles size={18} color="#fff" />
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff' }}>
              Compensation Intelligence &amp; Executive Q&amp;A
            </h2>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Instant data-backed answers to leadership questions on how ACME pays its 10,000 employees.
          </p>
        </div>

        {/* Filter categories */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`btn btn-sm ${selectedCategory === c.id ? 'btn-primary' : 'btn-secondary'}`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
        <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
        <input
          type="text"
          placeholder="Filter questions (e.g. 'gender gap', 'highest department', 'salary bands')..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-field"
          style={{ paddingLeft: '40px' }}
        />
      </div>

      {/* Questions list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredQuestions.map((q, idx) => {
          const isExpanded = expandedId === q.id || idx === 0; // Default first open
          return (
            <div
              key={q.id}
              style={{
                background: 'rgba(21, 29, 48, 0.6)',
                border: '1px solid ' + (isExpanded ? 'rgba(99, 102, 241, 0.4)' : 'var(--border-subtle)'),
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                transition: 'all 0.2s ease'
              }}
            >
              <div
                onClick={() => toggleExpand(q.id)}
                style={{
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, paddingRight: '1rem' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'rgba(99, 102, 241, 0.15)',
                    color: '#818cf8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.8rem'
                  }}>
                    Q{idx + 1}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '2px' }}>
                      {q.question}
                    </h3>
                    <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                      {q.shortAnswer}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="badge badge-pill" style={{ fontSize: '0.65rem' }}>
                    {q.category}
                  </span>
                  {isExpanded ? <ChevronUp size={18} color="var(--text-dim)" /> : <ChevronDown size={18} color="var(--text-dim)" />}
                </div>
              </div>

              {isExpanded && (
                <div style={{
                  padding: '0 1.5rem 1.25rem 1.5rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                  paddingTop: '1rem',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '1rem'
                }}>
                  {/* Detailed explanation */}
                  <div>
                    <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '6px' }}>
                      Analytical Context
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
                      {q.detailedExplanation}
                    </p>
                  </div>

                  {/* Recommendation Card */}
                  <div style={{
                    background: 'rgba(99, 102, 241, 0.08)',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#a5b4fc', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                      <Lightbulb size={14} />
                      <span>HR Strategic Action</span>
                    </div>
                    <p style={{ fontSize: '0.825rem', color: '#e0e7ff', lineHeight: 1.5 }}>
                      {q.recommendation}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
