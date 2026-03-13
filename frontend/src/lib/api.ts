const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
}

export async function api<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    const refreshed = await refreshToken();
    if (refreshed) return api(path, options);
    if (typeof window !== 'undefined') window.location.href = '/auth/login';
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || res.statusText || 'Request failed');
  }

  return res.json();
}

async function refreshToken(): Promise<boolean> {
  const refresh = localStorage.getItem('refreshToken');
  if (!refresh) return false;
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: refresh }),
    });
    if (!res.ok) return false;
    const { accessToken } = await res.json();
    localStorage.setItem('accessToken', accessToken);
    return true;
  } catch {
    return false;
  }
}

export const auth = {
  login: (email: string, password: string) =>
    api<{ user: any; accessToken: string; refreshToken: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: (email: string, password: string) =>
    api<{ user: any; accessToken: string; refreshToken: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  me: () => api<any>('/auth/me'),
};

export const profiles = {
  getMe: () => api<any>('/profiles/me'),
  update: (data: any) => api<any>('/profiles/me', { method: 'PATCH', body: JSON.stringify(data) }),
  updateMood: (mood: string) =>
    api<any>('/profiles/me/mood', { method: 'PATCH', body: JSON.stringify({ mood }) }),
};

export const matching = {
  swipe: (userId: string, direction: boolean) =>
    api<{ match?: any }>('/matching/swipe', {
      method: 'POST',
      body: JSON.stringify({ userId, direction }),
    }),
  getCandidates: (limit?: number) =>
    api<any[]>('/matching/candidates' + (limit ? `?limit=${limit}` : '')),
  getMatches: () => api<any[]>('/matching/matches'),
  computeChemistry: (matchId: string) =>
    api<any>(`/matching/matches/${matchId}/chemistry`, { method: 'POST' }),
};

export const chat = {
  getConversation: (matchId: string) => api<any>(`/chat/conversations/${matchId}`),
  getMessages: (matchId: string) => api<any[]>(`/chat/conversations/${matchId}/messages`),
  sendMessage: (matchId: string, content: string) =>
    api<any>(`/chat/conversations/${matchId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),
};
