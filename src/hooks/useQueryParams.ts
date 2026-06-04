import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

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
