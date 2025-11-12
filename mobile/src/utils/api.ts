// Mock API Layer for Web Application

// Placeholder API URL used by some screens; replace with real endpoint if needed.
export const API_URL = ''

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
  return new Promise((resolve) => {
    setTimeout(() => {
      const token = 'mock-jwt-' + Date.now();
      setToken(token);
      resolve({
        success: true,
        message: 'Zalogowano',
        data: { token, userId: 1 },
      });
    }, 500);
  });
}

export async function registerProfile(data: {
  imie: string;
  nazwisko: string;
  mail: string;
  haslo: string;
}): Promise<ApiResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: 'Rejestracja OK' });
    }, 500);
  });
}

export async function resetPassword(data: {
  mail: string;
  imie: string;
  nowe_haslo: string;
}): Promise<ApiResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: 'Haso zmienione' });
    }, 500);
  });
}

export async function getMyProfile(): Promise<ProfileType> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: 1,
        imie: 'Jan',
        nazwisko: 'Kowalski',
        mail: 'jan@example.com',
        telefon: '123456789',
        rola: 'klient',
      });
    }, 300);
  });
}

export async function getOrders(): Promise<ApiResponse<OrderType[]>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'OK',
        data: [
          {
            id: 1,
            nazwa: 'Zlecenie 1',
            status: 'nowe',
            data_utworzenia: new Date().toISOString(),
            opis: 'Test',
            uzytkownik_id: 1,
          },
        ],
      });
    }, 300);
  });
}

export async function getNotifications(): Promise<ApiResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'OK',
        data: [],
      });
    }, 300);
  });
}

export async function logout(): Promise<ApiResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      removeToken();
      resolve({ success: true, message: 'Wylogowano' });
    }, 300);
  });
}
