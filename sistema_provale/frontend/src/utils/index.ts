const API_BASE = '/api';

async function fetchJson<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCsrfToken(),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export function getCsrfToken(): string {
  const meta = document.querySelector('meta[name="csrf-token"]');
  return meta?.getAttribute('content') || '';
}

export function getPropsFromElement<T>(elementId: string): T | null {
  const element = document.getElementById(elementId);
  if (!element || !element.dataset.props) return null;
  
  try {
    return JSON.parse(element.dataset.props);
  } catch {
    console.error('Error parsing props from element:', elementId);
    return null;
  }
}

export const api = {
  get: <T>(url: string) => fetchJson<T>(API_BASE + url),
  post: <T>(url: string, data: unknown) =>
    fetchJson<T>(API_BASE + url, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  put: <T>(url: string, data: unknown) =>
    fetchJson<T>(API_BASE + url, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: <T>(url: string) =>
    fetchJson<T>(API_BASE + url, {
      method: 'DELETE',
    }),
};

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export function formatNumber(num: number): string {
  return num.toLocaleString('es-PE');
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
