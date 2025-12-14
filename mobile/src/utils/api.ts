
export const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api'

export interface ProfileType {
  id: number;
  imie: string;
  nazwisko: string;
  mail: string;
  telefon: string;
  rola: string;
}

export interface OrderType {
  id: number;
  nazwa: string;
  status: string;
  data_utworzenia: string;
  opis: string;
  uzytkownik_id: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export function getToken(): string | null {
  return localStorage.getItem('token');
}

export function setToken(token: string): void {
  localStorage.setItem('token', token);
}

export function removeToken(): void {
  localStorage.removeItem('token');
}

export async function login(email: string, password: string): Promise<ApiResponse> {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mail: email, haslo: password }),
    })
    const json = await res.json()
    if (res.ok && json?.success) {
      const token = json.data?.token
      if (token) setToken(token)
      return json as ApiResponse
    }
    return { success: false, message: json?.message || 'Login failed' }
  } catch (err: any) {
    return { success: false, message: err?.message || 'Network error' }
  }
}

export async function registerProfile(data: {
  imie: string;
  nazwisko: string;
  mail: string;
  haslo: string;
}): Promise<ApiResponse> {
  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const json = await res.json()
    if (res.ok) return json as ApiResponse
    return { success: false, message: json?.message || 'Registration failed' }
  } catch (err: any) {
    return { success: false, message: err?.message || 'Network error' }
  }
}

export async function resetPassword(data: {
  mail: string;
  imie: string;
  nowe_haslo: string;
}): Promise<ApiResponse> {
  try {
    const res = await fetch(`${API_URL}/auth/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mail: data.mail, imie: data.imie, nowe_haslo: data.nowe_haslo }),
    })
    const json = await res.json()
    if (res.ok) return json as ApiResponse
    return { success: false, message: json?.message || 'Reset failed' }
  } catch (err: any) {
    return { success: false, message: err?.message || 'Network error' }
  }
}

export async function getMyProfile(): Promise<ProfileType> {
  const token = getToken()
  try {
    const res = await fetch(`${API_URL}/profile`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    })
    const json = await res.json()
    // backend may return direct user object or wrapped response
    if (res.ok) {
      if (json?.success && json?.data) return json.data as ProfileType
      return json as ProfileType
    }
    throw new Error(json?.message || 'Could not fetch profile')
  } catch (err: any) {
    // fallback to a minimal empty profile to avoid breaking UI
    return {
      id: 0,
      imie: '',
      nazwisko: '',
      mail: '',
      telefon: '',
      rola: '',
    }
  }
}

export async function getOrders(): Promise<ApiResponse<OrderType[]>> {
  const token = getToken()
  try {
    const res = await fetch(`${API_URL}/orders`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    })
    const json = await res.json()
    if (res.ok) return json as ApiResponse<OrderType[]>
    return { success: false, message: json?.message || 'Could not fetch orders' }
  } catch (err: any) {
    return { success: false, message: err?.message || 'Network error' }
  }
}

export async function getNotifications(): Promise<ApiResponse> {
  const token = getToken()
  try {
    const res = await fetch(`${API_URL}/notifications`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    })
    const json = await res.json()
    if (res.ok) return json as ApiResponse
    return { success: false, message: json?.message || 'Could not fetch notifications' }
  } catch (err: any) {
    return { success: false, message: err?.message || 'Network error' }
  }
}

export async function logout(): Promise<ApiResponse> {
  removeToken()
  return { success: true, message: 'Wylogowano' }
}
