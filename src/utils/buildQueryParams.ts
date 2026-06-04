// export type QueryParamValue = string | number | boolean | null | undefined;
export type QueryParamValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Array<string | number | boolean>;

export type QueryParams = Record<string, QueryParamValue>;

// export function buildQueryParams(paramsObject: QueryParams): string {
//   console.log("paramsObject", paramsObject)
//   const searchParams = new URLSearchParams();

//   Object.entries(paramsObject).forEach(([key, value]) => {
//     if (value !== undefined && value !== null && value !== "") {
//       // searchParams.append(key, String(value));
//       searchParams.append(key, value as string);
//     }
//   });

//   return searchParams.toString();
// }


export const buildQueryParams = (string: QueryParams): string => {
    return new URLSearchParams(
      Object.entries(string).reduce((acc, [key, value]) => {
        acc[key] = Array.isArray(value) ? JSON.stringify(value) : String(value);
        return acc;
      }, {} as Record<string, string>)
    ).toString();
};