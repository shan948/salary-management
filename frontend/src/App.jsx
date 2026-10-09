import React, { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from './components/Navbar';
import KPICards from './components/KPICards';
import AnalyticsCharts from './components/AnalyticsCharts';
import EmployeeTable from './components/EmployeeTable';
import QnAIntelligence from './components/QnAIntelligence';
import WhatIfSimulator from './components/WhatIfSimulator';
import EmployeeDetailModal from './components/EmployeeDetailModal';
import SalaryAdjustmentModal from './components/SalaryAdjustmentModal';
import { api } from './services/api';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Analytics State
  const [summaryData, setSummaryData] = useState(null);
  const [parityData, setParityData] = useState(null);
  const [qnaData, setQnaData] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  // Employee Directory State
  const [employees, setEmployees] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sortBy, setSortBy] = useState('baseSalaryUsd');
  const [sortDir, setSortDir] = useState('desc');
  const [filters, setFilters] = useState({
    query: '',
    department: '',
    countryCode: '',
    jobLevel: '',
    gender: ''
  });
  const [departments, setDepartments] = useState([]);
  const [countries, setCountries] = useState([]);
  const [employeesLoading, setEmployeesLoading] = useState(true);

  // Modals & Drawers
  const [detailEmployee, setDetailEmployee] = useState(null);
  const [adjustEmployee, setAdjustEmployee] = useState(null);

  // Toast Notification
  const [toast, setToast] = useState(null);
  const [isSeeding, setIsSeeding] = useState(false);

  // Show Toast
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Load Analytics
  const loadAnalytics = async () => {
    try {
      setAnalyticsLoading(true);
      const [sum, par, qna] = await Promise.all([
        api.getDashboardSummary(),
        api.getPayParity(),
        api.getQuestionsAndAnswers()
      ]);
      setSummaryData(sum);
      setParityData(par);
      setQnaData(qna);
    } catch (err) {
      console.warn('Backend loading, using mock / fallback if needed:', err);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  // Load Filter Options
  const loadFilterOptions = async () => {
    try {
      const [depts, counts] = await Promise.all([
        api.getDepartments(),
        api.getCountries()
      ]);
      if (depts) setDepartments(depts);
      if (counts) setCountries(counts);
    } catch {
      // Ignored
    }
  };

  // Load Employees (Paginated)
  const loadEmployees = useCallback(async () => {
    try {
      setEmployeesLoading(true);
      const data = await api.getEmployees({
        page: currentPage,
        size: pageSize,
        sortBy,
        sortDir,
        ...filters
      });
      if (data && data.content) {
        setEmployees(data.content);
        setTotalElements(data.totalElements);
        setTotalPages(data.totalPages);
      }
    } catch (err) {
      console.warn('Error loading employees:', err);
    } finally {
      setEmployeesLoading(false);
    }
  }, [currentPage, pageSize, sortBy, sortDir, filters]);

  // Initial load
  useEffect(() => {
    loadAnalytics();
    loadFilterOptions();
  }, []);

  // Debounced search for employee directory
  const searchTimeoutRef = useRef(null);
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      loadEmployees();
    }, 250);

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [loadEmployees]);

  // Handle Sort Change
  const handleSortChange = (column) => {
    if (sortBy === column) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDir('desc');
    }
    setCurrentPage(0);
  };

  // Handle Filter Change
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setCurrentPage(0);
  };

  const handleResetFilters = () => {
    setFilters({
      query: '',
      department: '',
      countryCode: '',
      jobLevel: '',
      gender: ''
    });
    setCurrentPage(0);
  };

  // Handle Salary Adjustment Save
  const handleSaveSalaryAdjustment = async (empId, req) => {
    const updated = await api.adjustSalary(empId, req);
    showToast(`Salary for ${updated.fullName} adjusted to $${Number(updated.baseSalaryUsd).toLocaleString()}`, 'success');
    loadEmployees();
    loadAnalytics();
  };

  // Handle Trigger Seed
  const handleTriggerSeed = async () => {
    try {
      setIsSeeding(true);
      showToast('Seeding 10,000 employees into database...', 'info');
      await api.triggerSeed(10000);
      showToast('Successfully seeded 10,000 employee profiles!', 'success');
      loadAnalytics();
      loadFilterOptions();
      loadEmployees();
    } catch (err) {
      showToast('Seeding failed: ' + err.message, 'error');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Toast popup */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 2000,
          background: toast.type === 'error' ? 'var(--danger-bg)' : toast.type === 'info' ? 'var(--info-bg)' : 'var(--success-bg)',
          border: '1px solid ' + (toast.type === 'error' ? 'var(--danger)' : toast.type === 'info' ? 'var(--info)' : 'var(--success)'),
          color: '#fff',
          padding: '12px 20px',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.875rem',
          fontWeight: 600,
          backdropFilter: 'blur(12px)',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          {toast.type === 'error' ? <AlertCircle size={18} color="var(--danger)" /> :
           toast.type === 'info' ? <Info size={18} color="var(--info)" /> :
           <CheckCircle2 size={18} color="var(--success)" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalHeadcount={summaryData?.totalHeadcount || totalElements}
        onRefresh={() => { loadAnalytics(); loadEmployees(); }}
        onTriggerSeed={handleTriggerSeed}
        isSeeding={isSeeding}
      />

      {/* Main Content Area */}
      <main style={{ maxWidth: '1440px', margin: '0 auto', padding: '2rem', width: '100%', flex: 1 }}>
        
        {/* Always visible Top KPI Row */}
        <KPICards data={summaryData} loading={analyticsLoading} />

        {/* Tab 1: Executive Overview */}
        {activeTab === 'overview' && (
          <>
            <AnalyticsCharts summaryData={summaryData} parityData={parityData} />
            <QnAIntelligence qnaData={qnaData} loading={analyticsLoading} />
            <EmployeeTable
              employees={employees}
              totalElements={totalElements}
              totalPages={totalPages}
              currentPage={currentPage}
              pageSize={pageSize}
              sortBy={sortBy}
              sortDir={sortDir}
              filters={filters}
              departments={departments}
              countries={countries}
              loading={employeesLoading}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
              onSortChange={handleSortChange}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
              onViewEmployee={setDetailEmployee}
              onAdjustSalary={setAdjustEmployee}
            />
          </>
        )}

        {/* Tab 2: Employee Grid (10,000 records) */}
        {activeTab === 'directory' && (
          <EmployeeTable
            employees={employees}
            totalElements={totalElements}
            totalPages={totalPages}
            currentPage={currentPage}
            pageSize={pageSize}
            sortBy={sortBy}
            sortDir={sortDir}
            filters={filters}
            departments={departments}
            countries={countries}
            loading={employeesLoading}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            onSortChange={handleSortChange}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            onViewEmployee={setDetailEmployee}
            onAdjustSalary={setAdjustEmployee}
          />
        )}

        {/* Tab 3: Executive Q&A Intelligence */}
        {activeTab === 'qna' && (
          <>
            <QnAIntelligence qnaData={qnaData} loading={analyticsLoading} />
            <AnalyticsCharts summaryData={summaryData} parityData={parityData} />
          </>
        )}

        {/* Tab 4: What-If Compensation Adjustment Simulator */}
        {activeTab === 'simulator' && (
          <WhatIfSimulator departments={departments} summaryData={summaryData} />
        )}

      </main>

      {/* Modals */}
      {detailEmployee && (
        <EmployeeDetailModal
          employee={detailEmployee}
          onClose={() => setDetailEmployee(null)}
          onOpenAdjust={setAdjustEmployee}
        />
      )}

      {adjustEmployee && (
        <SalaryAdjustmentModal
          employee={adjustEmployee}
          onClose={() => setAdjustEmployee(null)}
          onSave={handleSaveSalaryAdjustment}
        />
      )}

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '1.5rem 2rem',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-dim)',
        background: 'rgba(9, 13, 22, 0.7)'
      }}>
        ACME Organization Compensation &amp; Salary Intelligence Platform • Managing 10,000 Employees across 10 Countries • Powered by Java Spring Boot 3 &amp; React
      </footer>

    </div>
  );
}
