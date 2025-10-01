export type AuthToken = {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'moderator' | 'user';
  };
};

const STORAGE_KEY = 'xrt_auth_token_v1';

export function getStoredAuth(): AuthToken | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) as AuthToken : null;
  } catch {
    return null;
  }
}

export function setStoredAuth(data: AuthToken) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearStoredAuth() {
  localStorage.removeItem(STORAGE_KEY);
}

export async function signInMock(email: string, password: string): Promise<AuthToken> {
  await new Promise(r => setTimeout(r, 800));
  if (!email || !password) {
    throw new Error('Email and password are required');
  }
  // Whitelisted mock accounts with passwords
  const ACCOUNTS: Record<string, { password: string; role: 'admin' | 'moderator'; name: string }> = {
    'boss@xrt-tech.com': { password: 'Boss@123', role: 'admin', name: 'Boss' },
    'moderator@xrt-tech.dev': { password: 'Mod@123', role: 'moderator', name: 'Moderator' },
  };

  const account = ACCOUNTS[email.toLowerCase()];
  if (!account) {
    throw new Error('Account not found or not permitted');
  }
  if (password !== account.password) {
    throw new Error('Invalid credentials');
  }

  const token = btoa(`${email}:${Date.now()}`);
  return {
    token,
    user: {
      id: 'mock-' + Math.random().toString(36).slice(2, 8),
      email,
      name: account.name,
      role: account.role,
    }
  };
}

