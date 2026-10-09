import React from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Eye, 
  Edit3, 
  ChevronLeft, 
  ChevronRight, 
  UserCheck, 
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

export default function EmployeeTable({
  employees,
  totalElements,
  totalPages,
  currentPage,
  pageSize,
  sortBy,
  sortDir,
  filters,
  departments,
  countries,
  loading,
  onPageChange,
  onPageSizeChange,
  onSortChange,
  onFilterChange,
  onResetFilters,
  onViewEmployee,
  onAdjustSalary
}) {

  const formatUsd = (val) => {
    if (!val) return '$0';
    return '$' + Number(val).toLocaleString(undefined, { maximumFractionDigits: 0 });
  };

  const getBadgeClass = (status) => {
    if (status === 'BELOW_BAND') return 'badge badge-below-band';
    if (status === 'ABOVE_BAND') return 'badge badge-above-band';
    return 'badge badge-in-band';
  };

  const getStatusLabel = (status) => {
    if (status === 'BELOW_BAND') return 'Below Band';
    if (status === 'ABOVE_BAND') return 'Above Band';
    return 'In Band';
  };

  return (
    <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
      
      {/* Table Header & Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
            Employee Compensation Directory
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Viewing page {currentPage + 1} of {totalPages || 1} ({totalElements.toLocaleString()} total employees)
          </p>
        </div>

        {/* Quick action buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={onResetFilters}
            className="btn btn-secondary btn-sm"
            title="Reset all filters"
          >
            <RotateCcw size={14} />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '0.75rem',
        marginBottom: '1.25rem',
        background: 'rgba(21, 29, 48, 0.4)',
        padding: '1rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)'
      }}>
        {/* Search Input */}
        <div style={{ position: 'relative', gridColumn: 'span 2' }}>
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          <input
            type="text"
            placeholder="Search by name, ID, job title..."
            value={filters.query || ''}
            onChange={(e) => onFilterChange('query', e.target.value)}
            className="input-field"
            style={{ paddingLeft: '36px' }}
          />
        </div>

        {/* Department Filter */}
        <select
          value={filters.department || ''}
          onChange={(e) => onFilterChange('department', e.target.value)}
          className="select-field"
        >
          <option value="">All Departments</option>
          {departments.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        {/* Country Filter */}
        <select
          value={filters.countryCode || ''}
          onChange={(e) => onFilterChange('countryCode', e.target.value)}
          className="select-field"
        >
          <option value="">All Countries</option>
          <option value="USA">United States (USA)</option>
          <option value="GBR">United Kingdom (GBR)</option>
          <option value="DEU">Germany (DEU)</option>
          <option value="IND">India (IND)</option>
          <option value="SGP">Singapore (SGP)</option>
          <option value="CAN">Canada (CAN)</option>
          <option value="AUS">Australia (AUS)</option>
          <option value="JPN">Japan (JPN)</option>
          <option value="BRA">Brazil (BRA)</option>
          <option value="FRA">France (FRA)</option>
        </select>

        {/* Job Level Filter */}
        <select
          value={filters.jobLevel || ''}
          onChange={(e) => onFilterChange('jobLevel', e.target.value)}
          className="select-field"
        >
          <option value="">All Seniority Levels</option>
          <option value="L1 - Associate">L1 - Associate</option>
          <option value="L2 - Mid-Level">L2 - Mid-Level</option>
          <option value="L3 - Senior">L3 - Senior</option>
          <option value="L4 - Staff">L4 - Staff</option>
          <option value="L5 - Principal">L5 - Principal</option>
          <option value="L6 - Director">L6 - Director</option>
          <option value="L7 - VP">L7 - VP</option>
        </select>

        {/* Gender Filter */}
        <select
          value={filters.gender || ''}
          onChange={(e) => onFilterChange('gender', e.target.value)}
          className="select-field"
        >
          <option value="">All Genders</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="NON_BINARY">Non-Binary</option>
        </select>
      </div>

      {/* Data Table */}
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th className="sortable" onClick={() => onSortChange('employeeId')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>Employee ID</span>
                  <ArrowUpDown size={12} />
                </div>
              </th>
              <th className="sortable" onClick={() => onSortChange('firstName')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>Name</span>
                  <ArrowUpDown size={12} />
                </div>
              </th>
              <th className="sortable" onClick={() => onSortChange('department')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>Department</span>
                  <ArrowUpDown size={12} />
                </div>
              </th>
              <th>Role &amp; Level</th>
              <th>Location</th>
              <th className="sortable" onClick={() => onSortChange('baseSalaryUsd')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>Base Salary (USD)</span>
                  <ArrowUpDown size={12} />
                </div>
              </th>
              <th className="sortable" onClick={() => onSortChange('compaRatio')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>Compa-Ratio</span>
                  <ArrowUpDown size={12} />
                </div>
              </th>
              <th>Band Health</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
                  Loading employee records...
                </td>
              </tr>
            ) : employees.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
                  No employees found matching the specified filters.
                </td>
              </tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp.employeeId}>
                  <td>
                    <span className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {emp.employeeId}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#fff' }}>{emp.fullName}</div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)' }}>{emp.email}</div>
                  </td>
                  <td>
                    <span className="badge badge-pill">{emp.department}</span>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.825rem' }}>{emp.jobTitle}</div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)' }}>{emp.jobLevel}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.825rem' }}>{emp.city}</div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)' }}>{emp.countryCode} • {emp.currency}</div>
                  </td>
                  <td>
                    <div className="font-mono" style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                      {formatUsd(emp.baseSalaryUsd)}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                      Local: {Number(emp.baseSalaryLocal).toLocaleString()} {emp.currency}
                    </div>
                  </td>
                  <td>
                    <div className="font-mono" style={{ fontWeight: 600 }}>
                      {emp.compaRatio?.toFixed(2)}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                      Target: 1.00
                    </div>
                  </td>
                  <td>
                    <span className={getBadgeClass(emp.compaRatioStatus)}>
                      {getStatusLabel(emp.compaRatioStatus)}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <button
                        onClick={() => onViewEmployee(emp)}
                        className="btn btn-secondary btn-sm"
                        title="View employee compensation profile"
                      >
                        <Eye size={13} />
                        <span>Profile</span>
                      </button>
                      <button
                        onClick={() => onAdjustSalary(emp)}
                        className="btn btn-primary btn-sm"
                        title="Adjust salary &amp; record audit entry"
                      >
                        <Edit3 size={13} />
                        <span>Adjust</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginTop: '1.25rem',
        paddingTop: '1rem',
        borderTop: '1px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
          <span>Page size:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="select-field"
            style={{ width: '80px', padding: '4px 8px' }}
          >
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span>Showing {employees.length} of {totalElements.toLocaleString()} results</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="btn btn-secondary btn-sm"
            style={{ opacity: currentPage === 0 ? 0.4 : 1 }}
          >
            <ChevronLeft size={16} />
            <span>Prev</span>
          </button>
          
          <div style={{ fontSize: '0.825rem', padding: '0 8px', color: 'var(--text-main)', fontWeight: 600 }}>
            {currentPage + 1} / {totalPages || 1}
          </div>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
            className="btn btn-secondary btn-sm"
            style={{ opacity: currentPage >= totalPages - 1 ? 0.4 : 1 }}
          >
            <span>Next</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

    </div>
  );
}
