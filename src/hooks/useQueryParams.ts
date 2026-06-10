import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * Parses the current URL search params into a plain `Record<string, string>`.
 * Re-computes only when `searchParams` changes.
 *
 * @returns Key-value map of all current query parameters.
 *
 * @example
 * // URL: /admin/users?role=ADMIN&dept=Engineering
 * const { role, dept } = useQueryParams(); // { role: 'ADMIN', dept: 'Engineering' }
 */
export function useQueryParams(): Record<string, string> {
  const [searchParams] = useSearchParams();

  const paramsObject = useMemo(() => {
    const obj: Record<string, string> = {};

    searchParams.forEach((value, key) => {
      obj[key] = value;
    });

    return obj;
  }, [searchParams]);

  return paramsObject;
}
