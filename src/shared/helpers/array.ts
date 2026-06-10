// export function getFilledArray(range, mapfn) {
//     return range <= 0 ? [] : (Array.from({ length: range }, mapfn))
// }

// export function updateIndex(array, indexItem, item) {
//     return array.map((chipItem, index) => {
//         return indexItem === index ? item : chipItem
//     })
// }

// export function joinArrayStrings(array) {
//     return array.join('')
// }

// export function append(array, item) {
//     return [...array, item]
// }

// export function mergeArrayStringFromIndex(array, arrayToMerge, fromIndex) {
//     return array.reduce(
//         (accumulator, currentValue, index) => {
//             const { characters, restArrayMerged } = accumulator

//             if (index < fromIndex) {
//                 return {
//                     restArrayMerged,
//                     characters: append(characters, currentValue)
//                 }
//             }

//             const [firstCharacter, ...restArrayWithoutFirstCharacter] =
//                 restArrayMerged

//             return {
//                 restArrayMerged: restArrayWithoutFirstCharacter,
//                 characters: append(characters, firstCharacter || '')
//             }
//         },
//         {
//             restArrayMerged: arrayToMerge,
//             characters: []
//         }
//     ).characters
// }



/**
 * Creates an array of `range` elements produced by `mapfn`.
 * Returns an empty array for non-positive range values.
 *
 * @example
 * getFilledArray(3, (_, i) => i + 1) // [1, 2, 3]
 */
export function getFilledArray<T>(range: number, mapfn: (value: undefined, index: number) => T): T[] {
  return range <= 0 ? [] : Array.from({ length: range }, mapfn)
}

/** Returns a new array with the element at `indexItem` replaced by `item`. */
export function updateIndex<T>(array: T[], indexItem: number, item: T): T[] {
  return array.map((el, index) => (indexItem === index ? item : el))
}

/** Concatenates all strings in an array into a single string (no separator). */
export function joinArrayStrings(array: string[]): string {
  return array.join('')
}

/** Returns a new array with `item` appended at the end. Pure — does not mutate the original. */
export function append<T>(array: T[], item: T): T[] {
  return [...array, item]
}

export function mergeArrayStringFromIndex(array: string[], arrayToMerge: string[], fromIndex: number): string[] {
  return array.reduce(
    (acc, curr, index) => {
      const { characters, restArrayMerged } = acc
      if (index < fromIndex) {
        return { restArrayMerged, characters: append(characters, curr) }
      }

      const [first, ...rest] = restArrayMerged
      return { restArrayMerged: rest, characters: append(characters, first || '') }
    },
    { restArrayMerged: arrayToMerge, characters: [] as string[] }
  ).characters
}