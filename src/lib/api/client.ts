import { API_TIMEOUT_MS } from '@/constants';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiRequestConfig {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
  timeoutMs?: number;
  signal?: AbortSignal;
}

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly details?: unknown;

  constructor(message: string, status: number, code?: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'https://api.nutrascan.app/v1';

/**
 * Minimal fetch client. Auth token is injected from an
 * `getToken` provider registered at startup so the core stays
 * decoupled from the auth implementation.
 */
let tokenProvider: (() => string | null | Promise<string | null>) | null = null;

export function setTokenProvider(provider: typeof tokenProvider) {
  tokenProvider = provider;
}

function buildQueryString(params?: ApiRequestConfig['params']): string {
  if (!params) return '';
  const search = new URLSearchParams();
  (Object.entries(params) as [string, unknown][]).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      search.append(key, String(value));
    }
  });
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

export async function apiRequest<T>(
  path: string,
  config: ApiRequestConfig = {},
): Promise<T> {
  const {
    method = 'GET',
    headers = {},
    body,
    params,
    timeoutMs = API_TIMEOUT_MS,
    signal,
  } = config;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const externalSignal = signal;

  const abortHandler = () => controller.abort();
  if (externalSignal) {
    if (externalSignal.aborted) controller.abort();
    else externalSignal.addEventListener('abort', abortHandler);
  }

  try {
    let authHeader: string | undefined;
    if (tokenProvider) {
      const token = await tokenProvider();
      if (token) authHeader = `Bearer ${token}`;
    }

    const finalHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(authHeader ? { Authorization: authHeader } : {}),
      ...headers,
    };

    const response = await fetch(`${API_BASE_URL}${path}${buildQueryString(params)}`, {
      method,
      headers: finalHeaders,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    if (!response.ok) {
      let message = `Request failed (${response.status})`;
      let code: string | undefined;
      let details: unknown;
      try {
        const data = await response.json();
        if (typeof data?.message === 'string') message = data.message;
        code = data?.code;
        details = data?.details;
      } catch {
        // non-JSON error body
      }
      throw new ApiError(message, response.status, code, details);
    }

    if (response.status === 204) return undefined as T;
    return (await response.json()) as T;
  } finally {
    clearTimeout(timeout);
    if (externalSignal) externalSignal.removeEventListener('abort', abortHandler);
  }
}

export const http = {
  get: <T>(path: string, config?: ApiRequestConfig) =>
    apiRequest<T>(path, { ...config, method: 'GET' }),
  post: <T>(path: string, body?: unknown, config?: ApiRequestConfig) =>
    apiRequest<T>(path, { ...config, method: 'POST', body }),
  put: <T>(path: string, body?: unknown, config?: ApiRequestConfig) =>
    apiRequest<T>(path, { ...config, method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown, config?: ApiRequestConfig) =>
    apiRequest<T>(path, { ...config, method: 'PATCH', body }),
  delete: <T>(path: string, config?: ApiRequestConfig) =>
    apiRequest<T>(path, { ...config, method: 'DELETE' }),
};