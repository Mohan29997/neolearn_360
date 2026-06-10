import { describe, it, expect, vi } from 'vitest';

vi.mock('notistack', () => ({
  enqueueSnackbar: vi.fn(() => 'key-123'),
}));

vi.mock('../../components/snackbar', () => ({
  default: vi.fn(() => null),
}));

describe('SnackNotification', () => {
  it('calls enqueueSnackbar with message and variant', async () => {
    const { enqueueSnackbar } = await import('notistack');
    const { SnackNotification } = await import('../../helper/snackMessage');

    SnackNotification('Test message', 'success');
    expect(enqueueSnackbar).toHaveBeenCalledWith(
      'Test message',
      expect.objectContaining({ variant: 'success' })
    );
  });

  it('defaults variant to "default"', async () => {
    const { enqueueSnackbar } = await import('notistack');
    const { SnackNotification } = await import('../../helper/snackMessage');

    SnackNotification('Hello');
    expect(enqueueSnackbar).toHaveBeenCalledWith(
      'Hello',
      expect.objectContaining({ variant: 'default' })
    );
  });
});
