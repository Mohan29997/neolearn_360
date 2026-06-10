import { describe, it, expect, vi, afterEach } from 'vitest';
import { scrollToTop } from '../../utils/scrollToTop';

describe('scrollToTop', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('calls window.scrollTo with top: 0 and smooth behavior', () => {
    const scrollSpy = vi.fn();
    vi.stubGlobal('scrollTo', scrollSpy);

    scrollToTop();

    expect(scrollSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });
});
