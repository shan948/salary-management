const API_BASE = '/api';

export async function fetchJson(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    let errorMsg = `HTTP ${response.status}: ${response.statusText}`;
    try {
      const errObj = await response.json();
      if (errObj && (errObj.message || errObj.error)) {
        errorMsg = errObj.message || errObj.error;
      }
    } catch {
      // Fallback
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

export const api = {
  getDashboardSummary: () => fetchJson('/analytics/dashboard'),
  getPayParity: () => fetchJson('/analytics/parity'),
  getQuestionsAndAnswers: () => fetchJson('/analytics/qna'),
  
  simulateWhatIf: (payload) =>
    fetchJson('/analytics/what-if', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getEmployees: (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        searchParams.append(key, val);
      }
    });
    return fetchJson(`/employees?${searchParams.toString()}`);
  },

  getEmployee: (employeeId) => fetchJson(`/employees/${employeeId}`),

  adjustSalary: (employeeId, payload) =>
    fetchJson(`/employees/${employeeId}/adjust`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getEmployeeAudit: (employeeId) => fetchJson(`/employees/${employeeId}/audit`),
  getRecentAudit: () => fetchJson('/employees/audit'),
  getDepartments: () => fetchJson('/employees/departments'),
  getCountries: () => fetchJson('/employees/countries'),

  triggerSeed: (count = 10000) =>
    fetchJson(`/seed?count=${count}`, {
      method: 'POST',
    }),
};
