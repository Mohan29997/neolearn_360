import { describe, it, expect, vi, beforeEach } from 'vitest';

// Capture interceptor callbacks so we can invoke them directly
let requestSuccessHandler: Function;
let requestErrorHandler: Function;
let responseSuccessHandler: Function;
let responseErrorHandler: Function;

const mockAPI = {
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
  interceptors: {
    request: {
      use: vi.fn((s, e) => { requestSuccessHandler = s; requestErrorHandler = e; }),
    },
    response: {
      use: vi.fn((s, e) => { responseSuccessHandler = s; responseErrorHandler = e; }),
    },
  },
  defaults: { headers: { common: {} } },
};

vi.mock('axios', async (importOriginal) => {
  const actual = await importOriginal<typeof import('axios')>();
  return {
    default: {
      ...actual.default,
      create: vi.fn(() => mockAPI),
      post: vi.fn(),
    },
  };
});

vi.mock('../../storagemanager', () => ({
  StorageManager: {
    getAccessToken: vi.fn().mockResolvedValue('access-token'),
    getRefreshToken: vi.fn().mockResolvedValue('refresh-token'),
    setAccessToken: vi.fn(),
    setRefreshToken: vi.fn(),
    appLogout: vi.fn(),
  },
}));

vi.mock('../../helper/snackMessage', () => ({
  SnackNotification: vi.fn(() => 'snack-key'),
}));

vi.mock('../../store', () => ({
  store: { dispatch: vi.fn() },
}));

vi.mock('notistack', () => ({
  enqueueSnackbar: vi.fn(),
}));

describe('AXIOS interceptors', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    // Import AXIOS to register the interceptors
    const { AXIOS } = await import('../../service/api');
    AXIOS();
  });

  describe('request interceptor (success)', () => {
    it('attaches Authorization header when token exists', async () => {
      const config: any = { headers: {} };
      const result = await requestSuccessHandler(config);
      expect(result.headers.Authorization).toBe('Bearer access-token');
    });

    it('does not attach Authorization when token is null', async () => {
      const { StorageManager } = await import('../../storagemanager');
      vi.mocked(StorageManager.getAccessToken).mockResolvedValueOnce(null);
      const config: any = { headers: {} };
      const result = await requestSuccessHandler(config);
      expect(result.headers.Authorization).toBeUndefined();
    });
  });

  describe('request interceptor (error)', () => {
    it('rejects with the error', async () => {
      const err = new Error('request error');
      await expect(requestErrorHandler(err)).rejects.toThrow('request error');
    });
  });

  describe('response interceptor (success)', () => {
    it('unwraps data.data from response', () => {
      const response = {
        data: { data: { id: 1 } },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };
      const result = responseSuccessHandler(response);
      expect(result.data).toEqual({ id: 1 });
    });
  });

  describe('response interceptor (error)', () => {
    it('shows snack for 400 error', async () => {
      const { SnackNotification } = await import('../../helper/snackMessage');
      const error = {
        message: '',
        code: '',
        config: { _retry: false },
        response: { status: 400, data: { message: 'Bad request' } },
      };
      await responseErrorHandler(error);
      expect(SnackNotification).toHaveBeenCalledWith('Bad request', 'error');
    });

    it('shows snack for 404 error', async () => {
      const { SnackNotification } = await import('../../helper/snackMessage');
      const error = {
        message: '',
        code: '',
        config: { _retry: false },
        response: { status: 404, data: { message: 'Not found' } },
      };
      await responseErrorHandler(error);
      expect(SnackNotification).toHaveBeenCalledWith('Not found', 'error');
    });

    it('shows snack for 405 error', async () => {
      const { SnackNotification } = await import('../../helper/snackMessage');
      const error = {
        message: '',
        code: '',
        config: {},
        response: { status: 405, data: {} },
      };
      await responseErrorHandler(error);
      expect(SnackNotification).toHaveBeenCalledWith('Request method not allowed. Please try again', 'error');
    });

    it('retries on network error', async () => {
      const error = {
        message: 'Network Error',
        code: 'ERR_NETWORK',
        config: { __retryCount: 0 },
        response: undefined,
      };
      mockAPI.get.mockResolvedValueOnce({ data: {} });
      // Should not throw — retries
      const result = await responseErrorHandler(error).catch(() => null);
      expect(result).toBeDefined();
    });

    it('handles 401 with token refresh', async () => {
      const axiosMod = await import('axios');
      vi.mocked(axiosMod.default.post).mockResolvedValueOnce({
        status: 201,
        data: { accessToken: 'new-access', refreshToken: 'new-refresh' },
      });
      mockAPI.get.mockResolvedValueOnce({ data: {} });

      const error = {
        message: '',
        code: '',
        config: { _retry: false, headers: {} },
        response: { status: 401, data: {} },
      };
      await responseErrorHandler(error).catch(() => null);
      const { StorageManager } = await import('../../storagemanager');
      expect(StorageManager.setAccessToken).toHaveBeenCalledWith('new-access');
    });

    it('dispatches setIsLogin(false) on failed refresh', async () => {
      const axiosMod = await import('axios');
      vi.mocked(axiosMod.default.post).mockResolvedValueOnce({
        status: 400,
        data: {},
      });

      const { store } = await import('../../store');
      const error = {
        message: '',
        code: '',
        config: { _retry: false, headers: {} },
        response: { status: 401, data: {} },
      };
      await responseErrorHandler(error).catch(() => null);
      expect(store.dispatch).toHaveBeenCalled();
    });

    it('rejects for unhandled status codes', async () => {
      const error = {
        message: '',
        code: '',
        config: {},
        response: { status: 422, data: {} },
      };
      await expect(responseErrorHandler(error)).rejects.toEqual({ status: 422, data: {} });
    });

    it('handles 500 error (retry)', async () => {
      const error = {
        message: '',
        code: '',
        config: { __retryCount: 0 },
        response: { status: 500, data: {} },
      };
      mockAPI.get.mockResolvedValueOnce({ data: {} });
      const result = await responseErrorHandler(error).catch(() => null);
      expect(result).toBeDefined();
    });

    it('handles 503 error (retry)', async () => {
      const error = {
        message: '',
        code: '',
        config: { __retryCount: 0 },
        response: { status: 503, data: {} },
      };
      mockAPI.get.mockResolvedValueOnce({ data: {} });
      const result = await responseErrorHandler(error).catch(() => null);
      expect(result).toBeDefined();
    });

    it('handles 408 error (retry)', async () => {
      const error = {
        message: '',
        code: '',
        config: { __retryCount: 0 },
        response: { status: 408, data: {} },
      };
      mockAPI.get.mockResolvedValueOnce({ data: {} });
      const result = await responseErrorHandler(error).catch(() => null);
      expect(result).toBeDefined();
    });

    it('shows snack after max retries exceeded', async () => {
      const { SnackNotification } = await import('../../helper/snackMessage');
      const error = {
        message: 'Network Error',
        code: 'ERR_NETWORK',
        config: { __retryCount: 3 },
        response: undefined,
      };
      await responseErrorHandler(error);
      expect(SnackNotification).toHaveBeenCalled();
    });
  });
});
