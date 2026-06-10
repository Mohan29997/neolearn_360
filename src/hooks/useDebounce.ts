import { useRef, useEffect } from 'react';

type DebounceFunction<T extends (...args: any[]) => void> = (
    func: T,
    wait: number
) => (...args: Parameters<T>) => void;

/**
 * Returns a stable `debounce` wrapper that automatically clears
 * its pending timer when the component unmounts.
 *
 * @example
 * const { debounce } = useDebounce();
 * const debouncedSearch = debounce((q: string) => fetchResults(q), 400);
 */
export const useDebounce = () => {
    const timeout = useRef<NodeJS.Timeout | null>(null);

    const debounce: DebounceFunction<(...args: any[]) => void> = (func, wait) => {
        return (...args: any[]) => {
            if (timeout.current) {
                clearTimeout(timeout.current);
            }
            timeout.current = setTimeout(() => func(...args), wait);
        };
    };

    useEffect(() => {
        return () => {
            if (timeout.current) {
                clearTimeout(timeout.current);
            }
        };
    }, []);

    return { debounce };
};
